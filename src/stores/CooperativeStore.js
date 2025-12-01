import { create } from 'zustand'
import { listMyInvitations, acceptInvitation as acceptInv, rejectInvitation as rejectInv, subscribeInvitations } from '../supabase/crudCoopInvitations'
import { createGroup, listGroupsForUser, inviteToGroup } from '../supabase/crudGroups'
import { listInvitationsByGroups, markOwnerNotificationSeen, subscribeInvitationsByGroup } from '../supabase/crudCoopInvitations'

export const useCooperativeStore = create((set, get) => ({
  invitations: [],
  loadingInvites: false,
  invitesUnsubscribe: null,
  ownerNotifUnsubs: [],

  groups: [],
  loadingGroups: false,

  notificationsOwner: [],
  loadingNotifications: false,
  dismissedNotificationIds: new Set(),

  // Load invitations for current user's email
  fetchInvitations: async (email, { status = 'pending' } = {}) => {
    if (!email) return []
    set({ loadingInvites: true })
    try {
      const list = await listMyInvitations({ email, status })
      set({ invitations: list })
      return list
    } finally {
      set({ loadingInvites: false })
    }
  },

  // Accept one invitation and refresh
  acceptInvitation: async (invitation_id, user_id, email) => {
    await acceptInv({ invitation_id, user_id })
    await get().fetchInvitations(email, { status: 'pending' })
    // Refresh groups since membership may have changed
    if (user_id) await get().fetchGroups(user_id)
  },

  // Reject one invitation and refresh
  rejectInvitation: async (invitation_id, email) => {
    await rejectInv({ invitation_id })
    await get().fetchInvitations(email, { status: 'pending' })
  },

  // Start realtime subscription for invitations by email
  startInvitationsRealtime: (email) => {
    const prev = get().invitesUnsubscribe
    if (prev) {
      try { prev() } catch {}
      set({ invitesUnsubscribe: null })
    }
    if (!email) return null
    const unsub = subscribeInvitations(email, async () => {
      // On any change, refresh pending
      await get().fetchInvitations(email, { status: 'pending' })
    })
    set({ invitesUnsubscribe: unsub })
    return unsub
  },

  stopInvitationsRealtime: () => {
    const prev = get().invitesUnsubscribe
    if (prev) {
      try { prev() } catch {}
      set({ invitesUnsubscribe: null })
    }
  },

  // Owner notifications realtime
  startOwnerNotificationsRealtime: async (user_id) => {
    // Unsubscribe previous
    const prev = get().ownerNotifUnsubs || []
    prev.forEach((u) => { try { u() } catch {} })
    set({ ownerNotifUnsubs: [] })
    if (!user_id) return []
    const owned = (await listGroupsForUser(user_id)).filter((g) => g.owner_id === user_id)
    const groupIds = owned.map((g) => g.id)
    const unsubs = groupIds.map((gid) => subscribeInvitationsByGroup(gid, async () => {
      // On any change, refresh unseen notifications
      await get().fetchOwnerNotifications(user_id)
    }))
    set({ ownerNotifUnsubs: unsubs })
    return unsubs
  },
  stopOwnerNotificationsRealtime: () => {
    const prev = get().ownerNotifUnsubs || []
    prev.forEach((u) => { try { u() } catch {} })
    set({ ownerNotifUnsubs: [] })
  },

  // Groups
  fetchGroups: async (user_id) => {
    if (!user_id) return []
    set({ loadingGroups: true })
    try {
      const groups = await listGroupsForUser(user_id)
      set({ groups })
      return groups
    } finally {
      set({ loadingGroups: false })
    }
  },

  // Owner notifications (status changes for invitations of owned groups)
  fetchOwnerNotifications: async (user_id) => {
    if (!user_id) return []
    set({ loadingNotifications: true })
    try {
      const owned = (await listGroupsForUser(user_id)).filter((g) => g.owner_id === user_id)
      const groupIds = owned.map((g) => g.id)
      if (!groupIds.length) { set({ notificationsOwner: [] }); return [] }
      // We only want acted ones (accepted/rejected), not pending, and only unseen
      const filtered = await listInvitationsByGroups({ group_ids: groupIds, onlyUnseenByOwner: true })
      set({ notificationsOwner: (filtered || []).filter((i) => i.status && i.status !== 'pending') })
      return filtered
    } finally {
      set({ loadingNotifications: false })
    }
  },

  dismissOwnerNotification: async (id) => {
    if (!id) return
    try {
      await markOwnerNotificationSeen(id, true)
    } catch (e) {
      console.warn('markOwnerNotificationSeen failed, falling back to local dismiss', e)
      const setDismissed = new Set(get().dismissedNotificationIds)
      setDismissed.add(id)
      set({ dismissedNotificationIds: setDismissed })
      return
    }
    // Refresh notifications list after marking seen
    const uid = get().profile?.id || get().userId
    // We don't have userId in this store; caller should ensure refresh; do a local filter
    set({ notificationsOwner: get().notificationsOwner.filter((n) => n.id !== id) })
  },

  createGroup: async ({ name, owner_id }) => {
    const g = await createGroup({ name, owner_id })
    const list = [g, ...get().groups]
    set({ groups: list })
    return g
  },

  inviteToGroup: async ({ group_id, email }) => {
    const inv = await inviteToGroup({ group_id, email })
    return inv
  },
}))
