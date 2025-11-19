import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {
	getHabitsByUser,
	StatisticsTemplate,
	useAuthStore,
} from '../autoBarrell'
import { useProgressRangeQuery } from '../hooks/useProgressRangeQuery'
import {
	buildScheduleMap,
	computeCompliance,
	computeGlobalAggregates,
	computeStreakCurrentAndMax,
	makeLocalISO,
} from '../utils/stats'

export function Statistics() {
	const { user } = useAuthStore()

	// Default range: last 30 days including today
	const today = new Date()
	const toISO = makeLocalISO(today)
	const from = new Date(today)
	from.setDate(today.getDate() - 29)
	const fromISO = makeLocalISO(from)

	const { data: habits = [], isLoading: habitsLoading } = useQuery({
		queryKey: ['habits', user?.id],
		queryFn: () => getHabitsByUser(user.id),
		enabled: !!user?.id,
	})

	const { data: progress = [], isLoading: progressLoading } =
		useProgressRangeQuery(user?.id, fromISO, toISO)

	const { scheduleMap, perHabitStats, global } = useMemo(() => {
		const scheduleMap = buildScheduleMap(habits, fromISO, toISO)
		// Build per habit aggregates
		const perHabitStats = {}
		for (const h of habits) {
			const streak = computeStreakCurrentAndMax(h, progress, fromISO, toISO)
			const compliance = computeCompliance(h, progress, fromISO, toISO)
			perHabitStats[h.id] = { ...streak, ...compliance }
		}
		const global = computeGlobalAggregates(habits, progress, fromISO, toISO)
		return { scheduleMap, perHabitStats, global }
	}, [habits, progress, fromISO, toISO])

	return (
		<StatisticsTemplate
			loading={habitsLoading || progressLoading}
			fromISO={fromISO}
			toISO={toISO}
			habits={habits}
			progress={progress}
			perHabitStats={perHabitStats}
			global={global}
		/>
	)
}
