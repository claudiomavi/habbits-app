// Date helpers
export function makeLocalISO(d) {
	const y = d.getFullYear()
	const m = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${y}-${m}-${day}`
}

export function* iterDateRange(fromISO, toISO) {
	const start = new Date(fromISO)
	const end = new Date(toISO)
	const d = new Date(start)
	while (d <= end) {
		yield new Date(d)
		d.setDate(d.getDate() - 0 + 1)
	}
}

function isScheduledForHabit(habit, date) {
	// monday-based (0=Mon..6=Sun)
	const wdSun0 = date.getDay() // 0..6 (Sun..Sat)
	const wdMon0 = (wdSun0 + 6) % 7 // 0..6 (Mon..Sun)
	if (habit?.frequency === 'weekly') {
		const days = Array.isArray(habit.days_of_week)
			? habit.days_of_week.map((d) => Number(d))
			: []
		if (days.length === 0) return true
		return days.includes(wdMon0)
	}
	if (habit?.frequency === 'monthly') {
		const wanted = habit.day_of_month || 1
		return date.getDate() === wanted
	}
	// daily by default
	return true
}

export function buildScheduleMap(habits, fromISO, toISO) {
	// Map habitId -> Set(dateISO)
	const result = new Map()
	const byId = new Map(
		(Array.isArray(habits) ? habits : []).map((h) => [h.id, h])
	)
	for (const h of habits || []) {
		result.set(h.id, new Set())
	}
	for (const date of iterDateRange(fromISO, toISO)) {
		const iso = makeLocalISO(date)
		for (const [id, habit] of byId) {
			if (isScheduledForHabit(habit, date)) {
				result.get(id)?.add(iso)
			}
		}
	}
	return result
}

export function computeStreakCurrentAndMax(habit, progress, fromISO, toISO) {
	const completedSet = new Set(
		(progress || [])
			.filter(
				(p) =>
					p.habit_id === habit.id &&
					p.completed &&
					p.date >= fromISO &&
					p.date <= toISO
			)
			.map((p) => p.date)
	)
	let current = 0
	let max = 0
	for (const date of iterDateRange(fromISO, toISO)) {
		if (!isScheduledForHabit(habit, date)) continue
		const iso = makeLocalISO(date)
		if (completedSet.has(iso)) {
			current += 1
			if (current > max) max = current
		} else {
			current = 0
		}
	}
	// current is the streak up to the last day in range (toISO)
	return { currentStreak: current, maxStreak: max }
}

export function computeCompliance(habit, progress, fromISO, toISO) {
	const scheduledDates = []
	const completedSet = new Set(
		(progress || [])
			.filter(
				(p) =>
					p.habit_id === habit.id &&
					p.completed &&
					p.date >= fromISO &&
					p.date <= toISO
			)
			.map((p) => p.date)
	)
	for (const date of iterDateRange(fromISO, toISO)) {
		if (isScheduledForHabit(habit, date)) {
			scheduledDates.push(makeLocalISO(date))
		}
	}
	const programados = scheduledDates.length
	let completados = 0
	for (const iso of scheduledDates) if (completedSet.has(iso)) completados += 1
	const pct = programados > 0 ? (completados / programados) * 100 : 0
	return { programados, completados, pct }
}

export function computeGlobalAggregates(habits, progress, fromISO, toISO) {
	let totalScheduled = 0
	let totalCompleted = 0
	const perHabit = {}
	for (const h of habits || []) {
		const comp = computeCompliance(h, progress, fromISO, toISO)
		const streak = computeStreakCurrentAndMax(h, progress, fromISO, toISO)
		perHabit[h.id] = { ...comp, ...streak }
		totalScheduled += comp.programados
		totalCompleted += comp.completados
	}
	const overallPct =
		totalScheduled > 0 ? (totalCompleted / totalScheduled) * 100 : 0
	return { totalScheduled, totalCompleted, overallPct, perHabit }
}

// New helpers for summary
export function getDailyCounts(habits, progress, fromISO, toISO) {
	const days = []
	const completedByDate = new Map()
	for (const p of progress || []) {
		if (p.completed && p.date >= fromISO && p.date <= toISO) {
			completedByDate.set(p.date, (completedByDate.get(p.date) || 0) + 1)
		}
	}
	// compute scheduled per day using schedule map
	const scheduleMap = buildScheduleMap(habits || [], fromISO, toISO)
	const scheduledByDate = new Map()
	for (const [, dates] of scheduleMap.entries()) {
		for (const dateISO of dates) {
			scheduledByDate.set(
				dateISO,
				(scheduledByDate.get(dateISO) || 0) + 1
			)
		}
	}
	for (const d of iterDateRange(fromISO, toISO)) {
		const iso = makeLocalISO(d)
		days.push({
			dateISO: iso,
			completedCount: completedByDate.get(iso) || 0,
			scheduledCount: scheduledByDate.get(iso) || 0,
		})
	}
	return days
}

export function getActiveDaysCount(dailyCounts) {
	return (dailyCounts || []).reduce(
		(acc, d) => acc + (d.completedCount > 0 ? 1 : 0),
		0
	)
}

export function getTopHabits(perHabitStats, habits, topN = 3) {
	const list = (habits || []).map((h) => ({
		id: h.id,
		title: h.title,
		pct: perHabitStats?.[h.id]?.pct ?? 0,
		programados: perHabitStats?.[h.id]?.programados ?? 0,
		completados: perHabitStats?.[h.id]?.completados ?? 0,
	}))
	list.sort((a, b) => (b.pct || 0) - (a.pct || 0))
	return list.slice(0, topN)
}

export function getBottomHabit(perHabitStats, habits) {
	const list = (habits || []).map((h) => ({
		id: h.id,
		title: h.title,
		pct: perHabitStats?.[h.id]?.pct ?? 0,
		programados: perHabitStats?.[h.id]?.programados ?? 0,
		completados: perHabitStats?.[h.id]?.completados ?? 0,
	}))
	// filter only those that had scheduled>0 to be meaningful
	const filtered = list.filter((x) => (x.programados || 0) > 0)
	if (filtered.length === 0) return null
	filtered.sort((a, b) => (a.pct || 0) - (b.pct || 0))
	return filtered[0]
}
