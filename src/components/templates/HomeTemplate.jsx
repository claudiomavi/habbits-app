import React from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'
import {
	CardContainer,
	CharacterHero,
	GradientBackground,
	HabitsTodayModal,
	HeaderBar,
	LevelUpBanner,
	PrimaryButton,
} from '../../autoBarrell'

export function HomeTemplate({
	profile,
	handleLogout,
	habitsLoading,
	progressLoading,
	todaysHabits,
	renderHabit,
	todayProgress,
	xpPercent = 0,
	onAction,
	showLevelUpBanner = false,
	onAcceptLevelUp,
	levelUpImageUri = null,
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

				{/* Aviso de subida de nivel - muestra condicional via prop showLevelUpBanner */}
				{showLevelUpBanner ? (
					<LevelUpBanner
						level={profile?.level ?? 1}
						onAccept={onAcceptLevelUp}
					/>
				) : (
					<>
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
					</>
				)}
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

const { colors, typography, radii } = require('../../styles/theme')

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: {
		fontFamily: typography.family.bold,
		fontSize: typography.size.xl,
		color: colors.black,
		marginBottom: 8,
		marginTop: 6,
	},

	habitCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.gray50,
		borderWidth: 2,
		borderColor: colors.gray200,
		borderRadius: radii.lg,
		padding: 12,
		gap: 12,
	},
	habitTitle: {
		fontSize: typography.size.md,
		color: colors.black,
		fontFamily: typography.family.semibold,
	},
	habitMeta: {
		fontSize: typography.size.xs,
		color: colors.gray500,
		marginTop: 4,
	},
	badge: {
		backgroundColor: 'rgba(255, 106, 0, 0.12)',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: radii.sm,
	},
	badgeText: {
		color: colors.orange,
		fontFamily: typography.family.bold,
		fontSize: typography.size.xs,
	},
	completeBtn: {
		marginLeft: 'auto',
		backgroundColor: colors.orange,
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: radii.md,
	},
	completeBtnDone: { backgroundColor: colors.green },
	completeBtnText: { color: colors.white, fontFamily: typography.family.bold },
})
