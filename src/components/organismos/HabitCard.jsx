import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { DifficultyBadge } from '../moleculas/DifficultyBadge'

export function HabitCard({ habit, done, onToggle, streak, streakUnit }) {
	console.log('[HabitCard] props', {
		id: habit?.id,
		title: habit?.title,
		streak,
	})
	return (
		<View style={styles.habitCard}>
			<View style={{ flex: 1 }}>
				<Text style={styles.habitTitle}>{habit.title}</Text>
				{typeof streak === 'number' && (
					<View style={styles.streakPill}>
						<Text style={styles.streakText}>
							Racha: {streak} {streakUnit || 'día'}
							{streak === 1 ? '' : 's'}
						</Text>
					</View>
				)}
				{habit.reminder_time && (
					<Text style={styles.habitMeta}>⏰ {habit.reminder_time}</Text>
				)}
			</View>
			<DifficultyBadge value={habit.difficulty || 1} />
			<TouchableOpacity
				onPress={() => onToggle?.(habit)}
				style={[styles.completeBtn, done && styles.completeBtnDone]}
				activeOpacity={0.8}
			>
				<Text style={styles.completeBtnText}>{done ? 'Hecho' : 'Marcar'}</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
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
	completeBtn: {
		marginLeft: 'auto',
		backgroundColor: '#4facfe',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 10,
	},
	completeBtnDone: { backgroundColor: '#22c55e' },
	completeBtnText: { color: '#fff', fontWeight: '700' },
	streakPill: {
		marginTop: 4,
		alignSelf: 'flex-start',
		backgroundColor: '#EEF2FF',
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	streakText: { color: '#4F46E5', fontWeight: '800', fontSize: 12 },
})
