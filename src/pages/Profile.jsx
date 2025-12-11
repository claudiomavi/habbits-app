import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { ProfileTemplate, useAuthStore, useUsersStore } from '../autoBarrell'
import { loadNotificationPrefs, applyNotificationPrefs } from '../utils/notifications'

export function Profile() {
	const { user } = useAuthStore()
	const { profile, updateProfile, fetchProfile } = useUsersStore()

	useEffect(() => {
		if (user?.id && !profile) {
			fetchProfile(user.id).catch(() => {})
		}
	}, [user?.id])

	const [saving, setSaving] = useState(false)

	// Notifications state
	const [notifEnabled, setNotifEnabled] = useState(false)
	const [notifHour, setNotifHour] = useState(9)
	const [notifMinute, setNotifMinute] = useState(0)
	const [savingNotif, setSavingNotif] = useState(false)

	useEffect(() => {
		let mounted = true
		;(async () => {
			const prefs = await loadNotificationPrefs()
			if (!mounted) return
			setNotifEnabled(!!prefs.enabled)
			setNotifHour(prefs.hour)
			setNotifMinute(prefs.minute)
		})()
		return () => {
			mounted = false
		}
	}, [])

	const xp = profile?.xp ?? 0
	const levelFromXp = (total) =>
		Math.floor(Math.sqrt(Math.max(0, total) / 100)) + 1
	const xpForLevel = (lvl) => 100 * Math.pow(lvl - 1, 2)
	const currentLevel = levelFromXp(xp)
	const currentBase = xpForLevel(currentLevel)
	const nextBase = xpForLevel(currentLevel + 1)
	const xpPercent =
		nextBase > currentBase ? (xp - currentBase) / (nextBase - currentBase) : 0

	const handleSave = async (patch) => {
		try {
			setSaving(true)
			await updateProfile(user?.id, patch)
			Alert.alert('Perfil actualizado')
		} catch (e) {
			Alert.alert('Error', e?.message || 'No se pudo actualizar el perfil')
		} finally {
			setSaving(false)
		}
	}

	const [avatarOptions, setAvatarOptions] = useState([])
	useEffect(() => {
		let mounted = true
		;(async () => {
			try {
				const { getCharacters, getImageForLevel } = await import('../autoBarrell')
				const chars = await getCharacters()
				if (!mounted) return
				const mapped = chars.map((c) => ({ id: c.id, uri: getImageForLevel(c, profile?.level ?? 1), label: c.name || c.key }))
				setAvatarOptions(mapped)
			} catch (e) { console.warn('profile characters load', e) }
		})()
		return () => { mounted = false }
	}, [profile?.level])

	const saveNotifications = async () => {
		try {
			setSavingNotif(true)
			await applyNotificationPrefs({ enabled: notifEnabled, hour: notifHour, minute: notifMinute })
			Alert.alert('Notificaciones actualizadas')
		} catch (e) {
			Alert.alert('Error', e?.message || 'No se pudieron actualizar las notificaciones')
		} finally { setSavingNotif(false) }
	}

	return (
		<ProfileTemplate
			profile={profile}
			xpPercent={xpPercent}
			saving={saving}
			onSave={handleSave}
			avatarOptions={avatarOptions}
notificationProps={{
enabled: notifEnabled,
hour: notifHour,
minute: notifMinute,
saving: savingNotif,
onToggle: setNotifEnabled,
onChangeTime: (h, m) => { setNotifHour(h); setNotifMinute(m) },
onSave: saveNotifications,
}}
/>
)
}
