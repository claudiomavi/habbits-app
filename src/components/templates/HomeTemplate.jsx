import React from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'
import {
	CardContainer,
	CharacterHero,
	GradientBackground,
	HabitsTodayModal,
	HeaderBar,
	PrimaryButton,
} from '../../autoBarrell'

export function HomeTemplate({
	profile,
	handleLogout,
	habitsLoading,
	progressLoading,
	todaysHabits,
	renderHabit,
	xpPercent = 0,
	onAction,
}) {
	const [showToday, setShowToday] = React.useState(false)

	const [avatarUri, setAvatarUri] = React.useState(
		profile?.avatar?.uri || profile?.avatar || null
	)
	React.useEffect(() => {
		let mounted = true
		const load = async () => {
			try {
				const level = profile?.level ?? 1
				const fallback = profile?.avatar?.uri || profile?.avatar || null
				if (!profile?.character_id) {
					if (mounted) setAvatarUri(fallback)
					return
				}
				const { getCharacterById, getImageForLevel } = await import(
					'../../autoBarrell'
				)
				const character = await getCharacterById(profile.character_id)
				const evolved = getImageForLevel(character, level) || fallback
				if (mounted) setAvatarUri(evolved)
			} catch (e) {
				console.warn('header character load', e)
			}
		}
		load()
		return () => {
			mounted = false
		}
	}, [profile?.character_id, profile?.level, profile?.avatar])

	return (
		<GradientBackground style={styles.container}>
			<HeaderBar
				name={profile?.display_name}
				initial={profile?.display_name}
				xpPercent={xpPercent}
				level={profile?.level ?? 1}
				avatarUri={avatarUri}
				onLogout={handleLogout}
			/>

			<CardContainer>
				{/* Personaje al centro */}
				<CharacterHero
					characterId={profile?.character_id}
					level={profile?.level ?? 1}
					fallbackUri={avatarUri}
					initial={profile?.display_name}
					size={260}
				/>

				{/* Acciones rápidas */}
				<Text style={styles.title}>Acciones</Text>
				<FlatList
					data={[
						{ id: 'today', label: 'Hábitos de hoy', action: 'today' },
						{ id: 'coop', label: 'Cooperativo', action: 'coop' },
					]}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<PrimaryButton
							title={item.label}
							onPress={() => {
								if (item.action === 'today') setShowToday(true)
								else if (item.action === 'coop') onAction?.('coop')
							}}
							style={{ marginVertical: 6 }}
						/>
					)}
					contentContainerStyle={{ gap: 6, paddingVertical: 8 }}
				/>
			</CardContainer>

			{/* Modal de Hábitos de hoy */}
			<HabitsTodayModal
				visible={showToday}
				onClose={() => setShowToday(false)}
				todaysHabits={todaysHabits}
				renderHabit={renderHabit}
				loading={habitsLoading || progressLoading}
			/>
		</GradientBackground>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1F2937',
		marginBottom: 8,
		marginTop: 6,
	},

	habitCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F9FAFB',
		borderWidth: 2,
		borderColor: '#E5E7EB',
		borderRadius: 16,
		padding: 12,
		gap: 12,
	},
	habitTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
	habitMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
	badge: {
		backgroundColor: '#EEF2FF',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	badgeText: { color: '#4F46E5', fontWeight: '700', fontSize: 12 },
	completeBtn: {
		marginLeft: 'auto',
		backgroundColor: '#4facfe',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
	},
	completeBtnDone: { backgroundColor: '#22c55e' },
	completeBtnText: { color: '#fff', fontWeight: '700' },
})
