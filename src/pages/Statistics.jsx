import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
	CustomRangeModal,
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
	getDailyCounts,
	getActiveDaysCount,
} from '../utils/stats'

export function Statistics() {
	const { user } = useAuthStore()

	// Range selection state: '7' | '30' | 'custom'
	const [range, setRange] = useState('30')
	const [customDays, setCustomDays] = useState(30)
	const [showCustom, setShowCustom] = useState(false)

	// Compute from/to based on selection
	const today = new Date()
	const toISO = makeLocalISO(today)
	const days = range === '7' ? 7 : customDays
	const from = new Date(today)
	from.setDate(today.getDate() - (days - 1))
	const fromISO = makeLocalISO(from)

	const { data: habits = [], isLoading: habitsLoading } = useQuery({
		queryKey: ['habits', user?.id],
		queryFn: () => getHabitsByUser(user.id),
		enabled: !!user?.id,
	})

	const { data: progress = [], isLoading: progressLoading } =
		useProgressRangeQuery(user?.id, fromISO, toISO)

	const { scheduleMap, perHabitStats, global, dailyCounts, activeDays } = useMemo(() => {
		const scheduleMap = buildScheduleMap(habits, fromISO, toISO)
		// Build per habit aggregates
		const perHabitStats = {}
		for (const h of habits) {
			const streak = computeStreakCurrentAndMax(h, progress, fromISO, toISO)
			const compliance = computeCompliance(h, progress, fromISO, toISO)
			perHabitStats[h.id] = { ...streak, ...compliance }
		}
		const global = computeGlobalAggregates(habits, progress, fromISO, toISO)
		const dailyCounts = getDailyCounts(habits, progress, fromISO, toISO)
		const activeDays = getActiveDaysCount(dailyCounts)
		return { scheduleMap, perHabitStats, global, dailyCounts, activeDays }
	}, [habits, progress, fromISO, toISO])

	return (
		<>
			<StatisticsTemplate
				loading={habitsLoading || progressLoading}
				fromISO={fromISO}
				toISO={toISO}
				habits={habits}
				progress={progress}
				perHabitStats={perHabitStats}
				global={global}
				dailyCounts={dailyCounts}
				activeDays={activeDays}
				rangeValue={range}
				onChangeRange={(v) => {
					if (v === '7' || v === '30') {
						setRange(v)
						if (v === '30') setCustomDays(30)
					}
				}}
				onOpenCustom={() => {
					setRange('custom')
					setShowCustom(true)
				}}
			/>
			<CustomRangeModal
				visible={showCustom}
				onClose={() => setShowCustom(false)}
				onApply={(days) => {
					setCustomDays(days)
					setShowCustom(false)
				}}
				initialDays={customDays}
			/>
		</>
	)
}
