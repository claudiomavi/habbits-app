import { supabase } from '../autoBarrell'

// Habits CRUD
export async function getHabitsByUser(user_id) {
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
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Progress
export async function getProgressForDate(user_id, dateISO) {
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

export async function getProgressHistoryForHabit(user_id, habit_id, untilISO, limit = 60) {
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

export async function upsertProgress({ habit_id, user_id, dateISO, completed, xp_awarded = 0 }) {
  // try existing
  const { data: existing, error: findErr } = await supabase
    .from('progress_entries')
    .select('*')
    .eq('habit_id', habit_id)
    .eq('user_id', user_id)
    .eq('date', dateISO)
    .maybeSingle()
  if (findErr) throw findErr

  // If unchecking, delete entry instead of storing completed=false
  if (!completed) {
    if (existing) {
      const { error: delErr } = await supabase
        .from('progress_entries')
        .delete()
        .eq('id', existing.id)
      if (delErr) throw delErr
    }
    // Return a synthetic response to update cache/UI coherently
    return { id: existing?.id || `tmp_${habit_id}_${dateISO}`, habit_id, user_id, date: dateISO, completed: false, xp_awarded: 0 }
  }

  // When checking as completed, upsert/insert
  let updated
  if (existing) {
    const { data, error } = await supabase
      .from('progress_entries')
      .update({ completed: true, xp_awarded })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw error
    updated = data
  } else {
    const { data, error } = await supabase
      .from('progress_entries')
      .insert({ habit_id, user_id, date: dateISO, completed: true, xp_awarded })
      .select()
      .single()
    if (error) throw error
    updated = data
  }

  // Cleanup duplicates for same (user, habit, date)
  try {
    const { data: dupes } = await supabase
      .from('progress_entries')
      .select('id')
      .eq('habit_id', habit_id)
      .eq('user_id', user_id)
      .eq('date', dateISO)
    const ids = (dupes || []).map((d) => d.id).filter((id) => id !== updated.id)
    if (ids.length) {
      await supabase
        .from('progress_entries')
        .delete()
        .in('id', ids)
    }
  } catch (e) {
    console.warn('dupe clean failed', e)
  }
  return updated
}

// XP helper: increment profile XP
export async function addXpToProfile(email, delta) {
  if (!delta) return
  const { error } = await supabase
    .rpc('increment_profile_xp', { email_param: email, delta_param: delta })
  if (error) {
    // fallback: direct update by email
    await supabase
      .from('profiles')
      .update({ xp: supabase.rpc('noop') })
    // If you want, replace with a select-update sequence
  }
}
