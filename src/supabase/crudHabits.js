import { supabase } from '../autoBarrell'

// Habits CRUD (actor = id_auth = user.id)
export async function getHabitsByUser(user_id) {
	if (!user_id) return []
	const { data, error } = await supabase
		.from('habits')
		.select('*')
		.eq('created_by', user_id)
		.order('created_at', { ascending: true })
	if (error) throw error
	return data || []
}

export async function createHabit(payload) {
	const { data, error } = await supabase
		.from('habits')
		.insert(payload)
		.select()
		.single()
	if (error) throw error
	return data
}

export async function updateHabit(id, changes) {
	const { data, error } = await supabase
		.from('habits')
		.update(changes)
		.eq('id', id)
		.select()
		.single()
	if (error) throw error
	return data
}

export async function deleteHabit(id) {
	const { error } = await supabase.from('habits').delete().eq('id', id)
	if (error) throw error
}

// Group habits
export async function getHabitsByGroup(group_id) {
	if (!group_id) return []
	const { data, error } = await supabase
		.from('habits')
		.select('*')
		.eq('group_id', group_id)
		.order('created_at', { ascending: true })
	if (error) throw error
	return data || []
}

// Progress (actor = id_auth)
export async function getProgressForDate(user_id, dateISO) {
	if (!user_id || !dateISO) return []
	const { data, error } = await supabase
		.from('progress_entries')
		.select('*')
		.eq('user_id', user_id)
		.eq('date', dateISO)
		.order('created_at', { ascending: true })
		.order('id', { ascending: true })
	if (error) throw error
	return data || []
}

export async function getProgressHistoryForHabit(
	user_id,
	habit_id,
	untilISO,
	limit = 730 // cubrir hasta dos años por defecto
) {
	if (!user_id || !habit_id || !untilISO) return []
	const { data, error } = await supabase
		.from('progress_entries')
		.select('*')
		.eq('user_id', user_id)
		.eq('habit_id', habit_id)
		.lte('date', untilISO)
		.order('date', { ascending: false })
		.limit(limit)
	if (error) throw error
	return data || []
}

export async function getGroupProgressForDate(group_id, user_id, dateISO) {
	if (!group_id || !user_id || !dateISO) return []
	const { data, error } = await supabase
		.from('progress_entries')
		.select('*')
		.eq('group_id', group_id)
		.eq('user_id', user_id)
		.eq('date', dateISO)
		.order('created_at', { ascending: true })
		.order('id', { ascending: true })
	if (error) throw error
	return data || []
}

export async function getProgressRange(user_id, fromISO, toISO) {
	if (!user_id || !fromISO || !toISO) return []
	const { data, error } = await supabase
		.from('progress_entries')
		.select('*')
		.eq('user_id', user_id)
		.gte('date', fromISO)
		.lte('date', toISO)
		.order('date', { ascending: true })
		.order('id', { ascending: true })
	if (error) throw error
	return data || []
}

export async function upsertProgress({
	habit_id,
	user_id,
	dateISO,
	completed,
	xp_awarded = 0,
	client_awarded = null,
}) {
	if (!habit_id || !user_id || !dateISO) throw new Error('Missing fields for upsertProgress')

	// 1) Look for existing entry for (user, habit, date)
	const { data: existing, error: findErr } = await supabase
		.from('progress_entries')
		.select('*')
		.eq('habit_id', habit_id)
		.eq('user_id', user_id)
		.eq('date', dateISO)
		.maybeSingle()
	if (findErr) throw findErr

	let updated = null
	if (existing) {
		// update toggle
		const { data, error } = await supabase
			.from('progress_entries')
			.update({ completed, xp_awarded })
			.eq('id', existing.id)
			.select()
			.single()
		if (error) throw error
		updated = { ...data, xp_delta: Math.round((completed ? 1 : -1) * xp_awarded) }
	} else {
		// insert new completed entry
		const { data, error } = await supabase
			.from('progress_entries')
			.insert({ habit_id, user_id, date: dateISO, completed: true, xp_awarded })
			.select()
			.single()
		if (error) throw error
		updated = { ...data, xp_delta: Math.round(xp_awarded) }
	}

	// 2) Cleanup accidental duplicates
	try {
		const { data: dupes } = await supabase
			.from('progress_entries')
			.select('id')
			.eq('habit_id', habit_id)
			.eq('user_id', user_id)
			.eq('date', dateISO)
		const ids = (dupes || []).map((d) => d.id).filter((id) => id !== updated.id)
		if (ids.length) {
			await supabase.from('progress_entries').delete().in('id', ids)
		}
	} catch (e) {
		console.warn('dupe clean failed', e)
	}
	return updated
}

export async function upsertGroupProgress({
	habit_id,
	group_id,
	user_id,
	dateISO,
	completed,
	xp_awarded = 0,
	client_awarded = null,
}) {
	if (!habit_id || !group_id || !user_id || !dateISO)
		throw new Error('Missing fields for upsertGroupProgress')
	// 1) Look for existing entry for (group, user, habit, date)
	const { data: existing, error: findErr } = await supabase
		.from('progress_entries')
		.select('*')
		.eq('group_id', group_id)
		.eq('habit_id', habit_id)
		.eq('user_id', user_id)
		.eq('date', dateISO)
		.maybeSingle()
	if (findErr) throw findErr
	let updated = null
	if (existing) {
		const { data, error } = await supabase
			.from('progress_entries')
			.update({ completed, xp_awarded })
			.eq('id', existing.id)
			.select()
			.single()
		if (error) throw error
		updated = { ...data, xp_delta: Math.round((completed ? 1 : -1) * xp_awarded) }
	} else {
		const { data, error } = await supabase
			.from('progress_entries')
			.insert({ habit_id, group_id, user_id, date: dateISO, completed: true, xp_awarded })
			.select()
			.single()
		if (error) throw error
		updated = { ...data, xp_delta: Math.round(xp_awarded) }
	}
	try {
		const { data: dupes } = await supabase
			.from('progress_entries')
			.select('id')
			.eq('group_id', group_id)
			.eq('habit_id', habit_id)
			.eq('user_id', user_id)
			.eq('date', dateISO)
		const ids = (dupes || []).map((d) => d.id).filter((id) => id !== updated.id)
		if (ids.length) await supabase.from('progress_entries').delete().in('id', ids)
	} catch (e) {
		console.warn('dupe clean failed', e)
	}
	return updated
}

// XP helper (se mantiene como estaba)
export async function addXpToProfile(email, delta) {
	if (!delta) return
	const { error } = await supabase.rpc('increment_profile_xp', {
		email_param: email,
		delta_param: delta,
	})
	if (error) {
		// fallback: noop marker (ajustar si hace falta)
		await supabase.from('profiles').update({ xp: supabase.rpc('noop') })
	}
}
