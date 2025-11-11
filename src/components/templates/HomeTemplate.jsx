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
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 40,
		marginBottom: 16,
		gap: 12,
	},
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 12,
		backgroundColor: 'rgba(255,255,255,0.9)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: { fontWeight: '700', color: '#1F2937' },
	welcome: { color: '#fff', fontSize: 16, fontWeight: '600' },
	xpBarWrapper: {
		height: 8,
		marginTop: 6,
		borderRadius: 6,
		overflow: 'hidden',
	},
	xpBarBg: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'rgba(255,255,255,0.3)',
	},
	xpBarFill: { height: '100%', backgroundColor: '#43e97b' },
	logoutBtn: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: 'rgba(0,0,0,0.2)',
		borderRadius: 10,
	},
	logoutText: { color: '#fff', fontWeight: '700' },

	card: {
		backgroundColor: '#fff',
		borderRadius: 24,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 6,
	},
	progressBarContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 4,
		backgroundColor: '#E5E7EB',
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
	progressFill: { width: '65%', height: '100%' },
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
