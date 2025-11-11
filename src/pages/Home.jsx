import { useNavigation } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import {
	getHabitsByUser,
	getProgressForDate,
	HomeTemplate,
	HabitCard,
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
    <HabitCard habit={item} done={!!done} onToggle={() => toggleMutation.mutate(item)} />
  )
}

	const level = profile?.level ?? 1
const xp = profile?.xp ?? 0
// Regla simple: cada nivel requiere 100 xp. El percent es el progreso dentro del nivel actual
const xpPercent = (xp % 100) / 100

return (
  <HomeTemplate
    profile={profile}
    handleLogout={handleLogout}
    habitsLoading={habitsLoading}
    progressLoading={progressLoading}
    todaysHabits={todaysHabits}
    renderHabit={renderHabit}
    xpPercent={xpPercent}
  />
)
}
