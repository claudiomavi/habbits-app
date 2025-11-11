import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native'
import { CardContainer, GradientBackground, HeaderBar } from '../../autoBarrell'

export function HomeTemplate({
	profile,
	handleLogout,
	habitsLoading,
	progressLoading,
	todaysHabits,
	renderHabit,
	xpPercent = 0,
}) {
	return (
		<GradientBackground style={styles.container}>
			<HeaderBar
				name={profile?.display_name}
				initial={profile?.display_name}
				xpPercent={xpPercent}
				level={profile?.level ?? 1}
				avatarUri={profile?.avatar?.uri || profile?.avatar}
				onLogout={handleLogout}
			/>

			<CardContainer>
				<Text style={styles.title}>Hábitos de hoy</Text>
				{habitsLoading || progressLoading ? (
					<ActivityIndicator />
				) : (
					<FlatList
						data={todaysHabits}
						keyExtractor={(item) => item.id}
						renderItem={renderHabit}
						contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
					/>
				)}
			</CardContainer>
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
