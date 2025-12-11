import { Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PREFS_KEY = 'notifications_prefs_v1'

// Default handler: show alerts but no sound/badge changes by default
export async function initNotifications() {
	try {
		Notifications.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: false,
				shouldSetBadge: false,
			}),
		})
		// Android notification channel (required for scheduling on Android 8+)
		if (Platform.OS === 'android') {
			await Notifications.setNotificationChannelAsync('default', {
				name: 'Default',
				importance: Notifications.AndroidImportance.DEFAULT,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: '#FF231F7C',
			})
		}
		// Load prefs and, if permission already granted and enabled, ensure schedule without prompting
		const prefs = await loadNotificationPrefs()
		const perms = await Notifications.getPermissionsAsync().catch(() => null)
		if (prefs.enabled && perms?.status === 'granted' && Platform.OS !== 'web') {
			await scheduleDailyReminder(prefs.hour, prefs.minute, { requestIfNeeded: false })
		}
	} catch {}
}

export async function getNotificationPermissions() {
	try {
		return await Notifications.getPermissionsAsync()
	} catch (e) {
		return { status: 'undetermined', canAskAgain: true }
	}
}

export async function requestNotificationPermissionsIfNeeded() {
	const current = await getNotificationPermissions()
	if (current?.status !== 'granted' && current?.canAskAgain) {
		const req = await Notifications.requestPermissionsAsync()
		return req?.status === 'granted'
	}
	return current?.status === 'granted'
}

export async function loadNotificationPrefs() {
	try {
		const raw = await AsyncStorage.getItem(PREFS_KEY)
		if (!raw) return { enabled: false, hour: 9, minute: 0 }
		const parsed = JSON.parse(raw)
		return {
			enabled: !!parsed.enabled,
			hour: Number.isFinite(parsed.hour) ? parsed.hour : 9,
			minute: Number.isFinite(parsed.minute) ? parsed.minute : 0,
		}
	} catch {
		return { enabled: false, hour: 9, minute: 0 }
	}
}

export async function saveNotificationPrefs(prefs) {
	const normalized = {
		enabled: !!prefs.enabled,
		hour: Math.max(0, Math.min(23, Number(prefs.hour) || 0)),
		minute: Math.max(0, Math.min(59, Number(prefs.minute) || 0)),
	}
	await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(normalized))
	return normalized
}

export async function cancelScheduledReminders() {
	try {
		await Notifications.cancelAllScheduledNotificationsAsync()
	} catch {}
}

export async function scheduleDailyReminder(hour, minute, { requestIfNeeded = true } = {}) {
	// iOS simulators/web may not support scheduling; guard by platform
	if (Platform.OS === 'web') return null
	const granted = requestIfNeeded
		? await requestNotificationPermissionsIfNeeded()
		: (await Notifications.getPermissionsAsync().catch(() => null))?.status === 'granted'
	if (!granted) return null
	// Clear existing to avoid duplicates
	await cancelScheduledReminders()
	const id = await Notifications.scheduleNotificationAsync({
		content: {
			title: 'Tus hábitos te esperan ✨',
			body: 'Es un buen momento para avanzar en tus objetivos diarios.',
			priority: Notifications.AndroidNotificationPriority.DEFAULT,
		},
		trigger: { hour, minute, repeats: true },
	})
	return id
}

export async function applyNotificationPrefs(prefs) {
	const normalized = await saveNotificationPrefs(prefs)
	if (normalized.enabled) {
		await scheduleDailyReminder(normalized.hour, normalized.minute)
	} else {
		await cancelScheduledReminders()
	}
	return normalized
}
