import { supabase } from './supabaseClient'
import { createInvitation } from './crudCoopInvitations'

// Create a group
export async function createGroup({ name, owner_id }) {
  if (!name?.trim() || !owner_id) throw new Error('name and owner_id are required')
  const payload = { name: name.trim(), owner_id }
  const { data, error } = await supabase
    .from('groups')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  // Also add owner as member (owner role)
  try {
    await supabase
      .from('group_members')
      .insert({ group_id: data.id, user_id: owner_id, role: 'owner' })
  } catch (e) {
    // ignore if RLS prevents or already inserted by trigger
  }
  return data
}

// List groups for a user: owner or member
export async function listGroupsForUser(user_id) {
  if (!user_id) return []
  // Query groups where owner_id = user or user is in group_members
  const { data, error } = await supabase
    .rpc('get_groups_for_user', { user_id_param: user_id })
  if (error) {
    // Fallback if RPC not available: do two queries and merge
    const { data: owned, error: e1 } = await supabase
      .from('groups')
      .select('*')
      .eq('owner_id', user_id)
    if (e1) throw e1
    const { data: memberships, error: e2 } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', user_id)
    if (e2) throw e2
    const ids = Array.from(new Set((memberships || []).map((m) => m.group_id)))
    let joined = []
    if (ids.length) {
      const { data: byIds, error: e3 } = await supabase
        .from('groups')
        .select('*')
        .in('id', ids)
      if (e3) throw e3
      joined = byIds || []
    }
    const map = new Map()
    for (const g of [...(owned || []), ...joined]) map.set(g.id, g)
    return Array.from(map.values())
  }
  return data || []
}

export async function listGroupMembers(group_id) {
  if (!group_id) return []
  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', group_id)
  if (error) throw error
  return data || []
}

export async function inviteToGroup({ group_id, email, token = null }) {
  return createInvitation({ group_id, email, token })
}
