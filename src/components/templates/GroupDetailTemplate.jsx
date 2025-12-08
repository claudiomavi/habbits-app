import Ionicons from '@expo/vector-icons/Ionicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
	getAvatarUriForProfile,
	getXpPercentForProfile,
	GroupHabitsTab,
	GroupLeaderboardTab,
	GroupSettingsTab,
	HeaderBar,
	useCooperativeStore,
	useUsersStore,
} from '../../autoBarrell'

const Tab = createBottomTabNavigator()

export function GroupDetailTemplate({ groupId }) {
	const { profile } = useUsersStore()
	const { groups } = useCooperativeStore()
	const groupName =
		(groups || []).find?.((g) => g.id === groupId)?.name || 'Grupo'

	const [avatarUri, setAvatarUri] = useState(
		profile?.avatar?.uri || profile?.avatar || null
	)
	const xpPercent = useMemo(
		() => getXpPercentForProfile(profile),
		[profile?.xp, profile?.level]
	)
	useEffect(() => {
		let mounted = true
		;(async () => {
			const uri = await getAvatarUriForProfile(profile)
			if (mounted) setAvatarUri(uri)
		})()
		return () => {
			mounted = false
		}
	}, [profile?.character_id, profile?.level, profile?.avatar])

	const Title = useMemo(
		() => (
			<View style={{ padding: 16, backgroundColor: '#FFD3A1', gap: 32 }}>
				<HeaderBar
					name={profile?.display_name}
					initial={profile?.display_name}
					xpPercent={xpPercent}
					level={profile?.level ?? 1}
					avatarUri={avatarUri}
				/>
				<Text style={styles.title}>Grupo: {groupName}</Text>
			</View>
		),
		[groupId]
	)

	return (
		<View style={{ flex: 1 }}>
			{Title}
			<View style={{ flex: 1 }}>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						headerShown: false,
						tabBarShowLabel: true,
						tabBarActiveTintColor: '#4F46E5',
						tabBarInactiveTintColor: '#6B7280',
						tabBarStyle: {
							backgroundColor: '#fff',
							borderTopColor: '#E5E7EB',
							height: 60,
							paddingBottom: 6,
						},
						tabBarIcon: ({ color, size }) => {
							let iconName = 'list-outline'
							if (route.name === 'Hábitos') iconName = 'list-outline'
							if (route.name === 'Clasificatorio')
								iconName = 'stats-chart-outline'
							if (route.name === 'Ajustes') iconName = 'settings-outline'
							return (
								<Ionicons
									name={iconName}
									size={size}
									color={color}
								/>
							)
						},
					})}
					initialRouteName="Ajustes"
				>
					<Tab.Screen
						name="Hábitos"
						component={GroupHabitsTab}
						initialParams={{ groupId }}
					/>
					<Tab.Screen
						name="Clasificatorio"
						component={GroupLeaderboardTab}
						initialParams={{ groupId }}
					/>
					<Tab.Screen
						name="Ajustes"
						component={GroupSettingsTab}
						initialParams={{ groupId }}
					/>
				</Tab.Navigator>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
	subtitle: { fontSize: 12, color: '#6B7280' },
	sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
	helper: { color: '#6B7280' },
	row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	input: {
		borderWidth: 1,
		borderColor: '#E5E7EB',
		backgroundColor: '#F9FAFB',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	actionBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
	primary: { backgroundColor: '#4F46E5' },
	actionText: { color: '#fff', fontWeight: '700' },
	memberRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 12,
		backgroundColor: '#F3F4F6',
		borderRadius: 8,
	},
	memberName: { color: '#111827', fontWeight: '600' },
	memberRole: { color: '#6B7280', fontWeight: '600' },
})
