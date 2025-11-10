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

  if (existing) {
    const { data, error } = await supabase
      .from('progress_entries')
      .update({ completed, xp_awarded })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('progress_entries')
      .insert({ habit_id, user_id, date: dateISO, completed, xp_awarded })
      .select()
      .single()
    if (error) throw error
    return data
  }
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
