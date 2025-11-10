import { useNavigation } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LinearGradient } from 'expo-linear-gradient'
import { useMemo } from 'react'
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import {
	getHabitsByUser,
	getProgressForDate,
	upsertProgress,
	useAuthStore,
	useUsersStore,
} from '../autoBarrell'

export function Home() {
	const navigation = useNavigation()
	const { user, signOut } = useAuthStore()
	const { profile } = useUsersStore()
	const qc = useQueryClient()

	const todayISO = new Date().toISOString().slice(0, 10)

	const { data: habits = [], isLoading: habitsLoading } = useQuery({
		queryKey: ['habits', user?.id],
		queryFn: () => getHabitsByUser(user.id),
		enabled: !!user?.id,
	})

	const { data: progress = [], isLoading: progressLoading } = useQuery({
		queryKey: ['progress', user?.id, todayISO],
		queryFn: () => getProgressForDate(user.id, todayISO),
		enabled: !!user?.id,
	})

	const progressMap = useMemo(() => {
		const map = new Map()
		for (const p of progress) map.set(p.habit_id, p)
		return map
	}, [progress])

	const toggleMutation = useMutation({
		mutationFn: async (habit) => {
			const existing = progressMap.get(habit.id)
			const newCompleted = !(existing?.completed ?? false)
			const baseXP = 10
			const deltaXp = newCompleted
				? baseXP * (habit.difficulty || 1)
				: -(existing?.xp_awarded || 0)
			const res = await upsertProgress({
				habit_id: habit.id,
				user_id: user.id,
				dateISO: todayISO,
				completed: newCompleted,
				xp_awarded: newCompleted ? baseXP * (habit.difficulty || 1) : 0,
			})
			return { res, deltaXp }
		},
		onSuccess: async (_data, habit, context) => {
			await qc.invalidateQueries({ queryKey: ['progress', user?.id, todayISO] })
		},
	})

	const todaysHabits = useMemo(() => {
		const d = new Date()
		const weekday = d.getDay() // 0-6
		return habits.filter((h) => {
			if (h.frequency === 'daily') return true
			if (h.frequency === 'weekly') {
				if (!Array.isArray(h.days_of_week)) return true
				return h.days_of_week.includes(weekday)
			}
			if (h.frequency === 'monthly') return true // TODO: definir regla exacta
			return true
		})
	}, [habits])

	const handleLogout = async () => {
		try {
			await signOut()
			navigation.replace('Login')
		} catch (e) {
			console.error('logout error', e)
		}
	}

	const renderHabit = ({ item }) => {
		const done = progressMap.get(item.id)?.completed
		return (
			<View style={styles.habitCard}>
				<View style={{ flex: 1 }}>
					<Text style={styles.habitTitle}>{item.title}</Text>
					{item.reminder_time && (
						<Text style={styles.habitMeta}>⏰ {item.reminder_time}</Text>
					)}
				</View>
				<View style={styles.badge}>
					<Text style={styles.badgeText}>D{item.difficulty || 1}</Text>
				</View>
				<TouchableOpacity
					onPress={() => toggleMutation.mutate(item)}
					style={[styles.completeBtn, done && styles.completeBtnDone]}
					activeOpacity={0.8}
				>
					<Text style={styles.completeBtnText}>
						{done ? 'Hecho' : 'Marcar'}
					</Text>
				</TouchableOpacity>
			</View>
		)
	}

	return (
		<LinearGradient
			colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<View style={styles.header}>
				<View style={styles.avatar}>
					<Text style={styles.avatarText}>
						{profile?.display_name?.[0]?.toUpperCase() || 'U'}
					</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Text style={styles.welcome}>
						Hola, {profile?.display_name || user?.email}
					</Text>
					<View style={styles.xpBarWrapper}>
						<View style={styles.xpBarBg} />
						<View style={[styles.xpBarFill, { width: '45%' }]} />
					</View>
				</View>
				<TouchableOpacity
					onPress={handleLogout}
					style={styles.logoutBtn}
				>
					<Text style={styles.logoutText}>Salir</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.card}>
				<View style={styles.progressBarContainer}>
					<LinearGradient
						colors={['#4facfe', '#00f2fe', '#43e97b']}
						style={styles.progressFill}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
					/>
				</View>
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
			</View>
		</LinearGradient>
	)
}

/* styles moved to atomic components */
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
