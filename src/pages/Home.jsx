import { useNavigation } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
	computeLevel,
	getCharacterById,
	getHabitsByUser,
	getImageForLevel,
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
	const { profile, showLevelUpBanner, acceptLevelUpBanner, levelUpBanner } =
		useUsersStore()
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
		onMutate: async (payload) => {
			const habit = payload?.habit || payload
			const desired = payload?.desired
			await qc.cancelQueries({ queryKey: ['progress', user?.id, todayISO] })
			const previous = qc.getQueryData(['progress', user?.id, todayISO]) || []
			const cached = Array.isArray(previous) ? previous : []
			const existing = cached.find((p) => p.habit_id === habit.id)
			const newCompleted =
				typeof desired === 'boolean' ? desired : !(existing?.completed ?? false)
			const baseXP = 10
			const earned = baseXP * (habit.difficulty || 1)
			const deltaXp = newCompleted
				? Math.round(earned)
				: -(existing?.xp_awarded || 0)
			// capture pre-optimistic xp/level to decide banner on success
			let prevXp = 0
			let prevLevel = 1
			try {
				prevXp = useUsersStore.getState().profile?.xp ?? 0
				prevLevel = computeLevel(prevXp)
			} catch {}
			// optimistic cache update
			const next = (() => {
				const copy = [...cached]
				const idx = copy.findIndex((p) => p.habit_id === habit.id)
				if (idx >= 0) {
					copy[idx] = {
						...copy[idx],
						completed: newCompleted,
						xp_awarded: newCompleted ? Math.round(earned) : 0,
					}
				} else {
					copy.push({
						id: `tmp_${habit.id}_${todayISO}`,
						habit_id: habit.id,
						user_id: user.id,
						date: todayISO,
						completed: newCompleted,
						xp_awarded: newCompleted ? Math.round(earned) : 0,
					})
				}
				return copy
			})()
			qc.setQueryData(['progress', user?.id, todayISO], next)
			try {
				useUsersStore.getState().optimisticUpdateXp(deltaXp)
			} catch {}
			return { previous, deltaXp, desired: newCompleted, habitId: habit.id, prevXp, prevLevel }
		},
		mutationFn: async (payload) => {
			const habit = payload?.habit || payload
			const desired = payload?.desired
			// IMPORTANT: read latest cache, not render-time progressMap, to avoid stale flips on rapid toggles
			const cached = qc.getQueryData(['progress', user?.id, todayISO]) || []
			const existing = Array.isArray(cached)
				? cached.find((p) => p.habit_id === habit.id)
				: undefined
			const newCompleted =
				typeof desired === 'boolean' ? desired : !(existing?.completed ?? false)
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
				client_awarded: existing?.xp_awarded || 0,
			})
			return { res, deltaXp }
		},
onSuccess: async ({ res, deltaXp }, _vars, context) => {
			await qc.invalidateQueries({ queryKey: ['progress', user?.id, todayISO] })
			const serverDelta =
				typeof res?.xp_delta === 'number' ? res.xp_delta : deltaXp
			if (serverDelta) {
				try {
					console.log('[XP] applying serverDelta to Supabase', { serverDelta })
					// compute before/after level and trigger in-app banner
					const beforeXP = context?.prevXp ?? (useUsersStore.getState().profile?.xp ?? 0)
					const beforeLevel = computeLevel(beforeXP)
					const updated = await updateProfileXpAndLevel(user.id, serverDelta)
					console.log('[XP] updated profile', updated)
					console.log(
						'[XP] store profile after update',
						useUsersStore.getState().profile
					)
					const afterXP = updated?.xp ?? beforeXP + serverDelta
					const afterLevel = updated?.level ?? computeLevel(afterXP)
					if (afterLevel > beforeLevel) {
						let evolved = null
						try {
							if (useUsersStore.getState().profile?.character_id) {
								const ch = await getCharacterById(
									useUsersStore.getState().profile.character_id
								)
								evolved = getImageForLevel(ch, afterLevel)
							}
						} catch {}
						const fallback =
							useUsersStore.getState().profile?.avatar?.uri ||
							useUsersStore.getState().profile?.avatar ||
							null
						console.log('[Banner] show called', {
							level: afterLevel,
							image: evolved || fallback,
						})
						showLevelUpBanner({
							level: afterLevel,
							imageUri: evolved || fallback,
						})
					}
				} catch (e) {
					console.warn('xp update', e)
				}
			}
		},
		onError: (err, habit, context) => {
			if (context?.previous) {
				qc.setQueryData(['progress', user?.id, todayISO], context.previous)
			}
			// rollback xp
			if (context?.deltaXp) {
				try {
					useUsersStore.getState().optimisticUpdateXp(-context.deltaXp)
				} catch {}
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
		const done = !!progressMap.get(item.id)?.completed
		return (
			<HabitCard
				habit={item}
				done={done}
				onToggle={() => toggleMutation.mutate({ habit: item, desired: !done })}
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
			showLevelUpBanner={!!levelUpBanner?.visible}
			onAcceptLevelUp={acceptLevelUpBanner}
			levelUpImageUri={levelUpBanner?.imageUri || null}
			onAction={(action) => {
				if (action === 'coop') navigation.navigate('Cooperative')
			}}
		/>
	)
}
