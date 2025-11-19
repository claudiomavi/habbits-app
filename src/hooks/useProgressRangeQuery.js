import { useQuery } from '@tanstack/react-query'
import { getProgressRange } from '../supabase/crudHabits'

export function useProgressRangeQuery(userId, fromISO, toISO, enabled = true) {
	const enabledFlag = !!userId && !!fromISO && !!toISO && enabled
	return useQuery({
		queryKey: ['progress-range', userId, fromISO, toISO],
		queryFn: () => getProgressRange(userId, fromISO, toISO),
		enabled: enabledFlag,
	})
}
