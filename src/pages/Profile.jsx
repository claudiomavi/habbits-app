import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { ProfileTemplate, useAuthStore, useUsersStore } from '../autoBarrell'

export function Profile() {
  const { user } = useAuthStore()
  const { profile, updateProfile, fetchProfile } = useUsersStore()

  useEffect(() => {
    if (user?.id && !profile) {
      fetchProfile(user.id).catch(() => {})
    }
  }, [user?.id])

  const [saving, setSaving] = useState(false)

  const xp = profile?.xp ?? 0
  const levelFromXp = (total) => Math.floor(Math.sqrt(Math.max(0, total) / 100)) + 1
  const xpForLevel = (lvl) => 100 * Math.pow(lvl - 1, 2)
  const currentLevel = levelFromXp(xp)
  const currentBase = xpForLevel(currentLevel)
  const nextBase = xpForLevel(currentLevel + 1)
  const xpPercent = nextBase > currentBase ? (xp - currentBase) / (nextBase - currentBase) : 0

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

  return (
    <ProfileTemplate
      profile={profile}
      xpPercent={xpPercent}
      saving={saving}
      onSave={handleSave}
    />
  )
}
