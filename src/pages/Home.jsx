import { useNavigation } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
	getHabitsByUser,
	getProgressForDate,
	getProgressHistoryForHabit,
	HabitCard,
	HomeTemplate,
	updateProfileXpAndLevel,
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
		onMutate: async (habit) => {
			// Este hook se ejecuta antes de la mutación => update optimista
			const existing = progressMap.get(habit.id)
			const newCompleted = !(existing?.completed ?? false)
			const baseXP = 10
			// streak rápida mínima (no conocemos historia aún), no sumar streak aquí para evitar sobreestimar
			const earned = baseXP * (habit.difficulty || 1)
			const deltaXp = newCompleted
				? Math.round(earned)
				: -(existing?.xp_awarded || 0)
			try {
				useUsersStore.getState().optimisticUpdateXp(deltaXp)
			} catch {}
			return { deltaXp }
		},
		mutationFn: async (habit) => {
			const existing = progressMap.get(habit.id)
			const newCompleted = !(existing?.completed ?? false)
			const baseXP = 10
			// calcular streakDays: consecutivos en días programados
			let streakDays = 0
			try {
				const history = await getProgressHistoryForHabit(
					user.id,
					habit.id,
					todayISO,
					60
				)
				// construir set de fechas completadas
				const completedSet = new Set(
					history.filter((h) => h.completed).map((h) => h.date)
				)
				const d0 = new Date(todayISO)
				const isScheduled = (date) => {
					const wd = date.getDay()
					if (habit.frequency === 'weekly') {
						if (
							!Array.isArray(habit.days_of_week) ||
							habit.days_of_week.length === 0
						)
							return true
						return habit.days_of_week.includes(wd)
					}
					if (habit.frequency === 'monthly') {
						return date.getDate() === 1
					}
					return true // daily
				}
				// contar hacia atrás incluyendo hoy si está marcado al final de la operación
				// partimos de ayer si vamos a desmarcar; de hoy si vamos a marcar
				const start = new Date(d0)
				if (!newCompleted) {
					// si vamos a desmarcar hoy, no cuentes hoy
					start.setDate(start.getDate() - 1)
				}
				// recorre hasta 60 días o hasta romper racha en un día programado
				for (let i = 0; i < 60; i++) {
					const date = new Date(start)
					date.setDate(start.getDate() - i)
					if (!isScheduled(date)) continue
					const iso = date.toISOString().slice(0, 10)
					if (completedSet.has(iso)) {
						streakDays += 1
					} else {
						break
					}
				}
			} catch (e) {
				console.warn('streak calc error', e)
			}
			const streakMultiplier = Math.min(2.0, 1 + streakDays * 0.05)
			const earned = baseXP * (habit.difficulty || 1) * streakMultiplier
			const deltaXp = newCompleted
				? Math.round(earned)
				: -(existing?.xp_awarded || 0)
			const res = await upsertProgress({
				habit_id: habit.id,
				user_id: user.id,
				dateISO: todayISO,
				completed: newCompleted,
				xp_awarded: newCompleted ? Math.round(earned) : 0,
			})
			return { res, deltaXp }
		},
		onSuccess: async ({ res, deltaXp }, habit) => {
			await qc.invalidateQueries({ queryKey: ['progress', user?.id, todayISO] })
			if (deltaXp) {
				try {
					await updateProfileXpAndLevel(user.id, deltaXp)
				} catch (e) {
					console.warn('xp update', e)
				}
			}
		},
	})

	const todaysHabits = useMemo(() => {
		const d = new Date()
		const weekday = d.getDay() // 0-6
		const dayOfMonth = d.getDate()
		return habits.filter((h) => {
			if (h.frequency === 'daily') return true
			if (h.frequency === 'weekly') {
				if (!Array.isArray(h.days_of_week)) return true
				return h.days_of_week.includes(weekday)
			}
			if (h.frequency === 'monthly') return dayOfMonth === 1
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
			<HabitCard
				habit={item}
				done={!!done}
				onToggle={() => toggleMutation.mutate(item)}
			/>
		)
	}

	const xp = profile?.xp ?? 0
	// Progreso dentro del nivel actual según función de nivel sqrt(totalXP/100)+1
	// Encontramos el XP necesario para el nivel actual y el siguiente
	const levelFromXp = (total) =>
		Math.floor(Math.sqrt(Math.max(0, total) / 100)) + 1
	const xpForLevel = (lvl) => 100 * Math.pow(lvl - 1, 2)
	const currentLevel = levelFromXp(xp)
	const currentBase = xpForLevel(currentLevel)
	const nextBase = xpForLevel(currentLevel + 1)
	const xpPercent =
		nextBase > currentBase ? (xp - currentBase) / (nextBase - currentBase) : 0

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
