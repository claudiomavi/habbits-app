import { supabase } from './supabaseClient'

// Create invitation (owner/admin only via RLS)
export async function createInvitation({ group_id, email, token = null }) {
  if (!group_id || !email) throw new Error('group_id and email are required')
  // Try to enrich with group_name if column exists and RLS allows
  let group_name = null
  try {
    const { data: g } = await supabase.from('groups').select('name').eq('id', group_id).maybeSingle()
    group_name = g?.name || null
  } catch {}
  const payload = { group_id, email, status: 'pending', token, ...(group_name ? { group_name } : {}) }
  const { data, error } = await supabase
    .from('group_invitations')
    .insert(payload)
    .select()
    .single()
  if (error) throw error
  return data
}

// List invitations for a given email (incoming)
export async function listMyInvitations({ email, status = null }) {
  if (!email) throw new Error('email is required')
  let query = supabase.from('group_invitations').select('*').eq('email', email)
  if (status) query = query.eq('status', status)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// List invitations by a set of groups (e.g., for owner notifications)
export async function listInvitationsByGroups({ group_ids = [], status = null, onlyUnseenByOwner = false }) {
  if (!group_ids?.length) return []
  let query = supabase.from('group_invitations').select('*').in('group_id', group_ids)
  if (status) query = query.eq('status', status)
  if (onlyUnseenByOwner) query = query.eq('owner_seen', false)
  const { data, error } = await query.order('acted_at', { ascending: false }).order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// Accept invitation: mark accepted and add to group_members
export async function acceptInvitation({ invitation_id, user_id }) {
  if (!invitation_id || !user_id) throw new Error('invitation_id and user_id are required')
  // Fetch invitation to get group_id
  const { data: inv, error: invErr } = await supabase
    .from('group_invitations')
    .select('*')
    .eq('id', invitation_id)
    .maybeSingle()
  if (invErr) throw invErr
  if (!inv) throw new Error('Invitation not found')
  if (inv.status !== 'pending') return inv

  // First, update invitation status (invitee should be allowed by RLS)
  const { data: updated, error: updErr } = await supabase
    .from('group_invitations')
    .update({ status: 'accepted', acted_at: new Date().toISOString() })
    .eq('id', invitation_id)
    .select()
    .single()
  if (updErr) throw updErr

  // Then, try to ensure membership exists (may be restricted by RLS)
  let exists = null
  try {
    const res = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', inv.group_id)
      .eq('user_id', user_id)
      .maybeSingle()
    exists = res.data || null
  } catch (_) {
    // If SELECT is not permitted by RLS, try to insert anyway
  }
  if (!exists) {
    const { error: addErr } = await supabase
      .from('group_members')
      .insert({ group_id: inv.group_id, user_id, role: 'member' })
    if (addErr) throw addErr
  }

  return updated
}

export async function rejectInvitation({ invitation_id }) {
  if (!invitation_id) throw new Error('invitation_id is required')
  const { data, error } = await supabase
    .from('group_invitations')
    .update({ status: 'rejected', acted_at: new Date().toISOString() })
    .eq('id', invitation_id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Realtime subscription for invitations by email
// Returns an unsubscribe function
export async function markOwnerNotificationSeen(invitation_id, seen = true) {
  if (!invitation_id) throw new Error('invitation_id is required')
  const { data, error } = await supabase
    .from('group_invitations')
    .update({ owner_seen: !!seen })
    .eq('id', invitation_id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Realtime subscription for invitations by group_id (for owners)
export function subscribeInvitationsByGroup(group_id, onChange) {
  if (!group_id) throw new Error('group_id is required')
  const channel = supabase
    .channel(`inv-group-${group_id}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'group_invitations', filter: `group_id=eq.${group_id}` },
      (payload) => {
        try {
          onChange?.(payload)
        } catch (e) {
          console.warn('subscribeInvitationsByGroup callback error', e)
        }
      }
    )
    .subscribe()

  return () => {
    try { supabase.removeChannel(channel) } catch {}
  }
}

export function subscribeInvitations(email, onChange) {
  if (!email) throw new Error('email is required')
  const channel = supabase
    .channel(`inv-${email}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'group_invitations', filter: `email=eq.${email}` },
      (payload) => {
        try {
          onChange?.(payload)
        } catch (e) {
          console.warn('subscribeInvitations callback error', e)
        }
      }
    )
    .subscribe()

  return () => {
    try {
      supabase.removeChannel(channel)
    } catch {}
  }
}
