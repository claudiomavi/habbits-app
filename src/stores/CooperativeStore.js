import { create } from 'zustand'
import {
	acceptInvitation as acceptInv,
	listMyInvitations,
	rejectInvitation as rejectInv,
} from '../supabase/crudCoopInvitations'
import {
	createGroup,
	inviteToGroup,
	listGroupsForUser,
} from '../supabase/crudGroups'

export const useCooperativeStore = create((set, get) => ({
	lastUpdatedAt: null,
	lastRefreshAt: 0,
	refreshInFlight: false,
	invitations: [],
	loadingInvites: false,
	invitesUnsubscribe: null,

	groups: [],
	loadingGroups: false,

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

	acceptInvitation: async (invitation_id, user_id, email) => {
		await acceptInv({ invitation_id })
		await get().fetchInvitations(email, { status: 'pending' })
		// Refresh groups since membership may have changed
		if (user_id) await get().fetchGroups(user_id)
	},

	rejectInvitation: async (invitation_id, email) => {
		await rejectInv({ invitation_id })
		await get().fetchInvitations(email, { status: 'pending' })
	},

	refreshAllCoopFast: async (email, user_id) => {
		const now = Date.now()
		const last = get().lastRefreshAt || 0
		if (now - last < 1200) return
		set({ lastRefreshAt: now })
		if (get().refreshInFlight) return
		set({ refreshInFlight: true })
		try {
			const tasks = []
			if (email)
				tasks.push(get().fetchInvitations(email, { status: 'pending' }))
			if (user_id) tasks.push(get().fetchGroups(user_id))
			await Promise.allSettled(tasks)
			set({ lastUpdatedAt: new Date().toISOString() })
		} finally {
			set({ refreshInFlight: false })
		}
	},

	// One-shot full refresh (kept for manual update)
	refreshAllCoop: async (email, user_id) => {
		const tasks = []
		if (email) tasks.push(get().fetchInvitations(email, { status: 'pending' }))
		if (user_id) {
			tasks.push(get().fetchGroups(user_id))
			tasks.push(get().fetchOwnerNotifications(user_id))
		}
		await Promise.allSettled(tasks)
		set({ lastUpdatedAt: new Date().toISOString() })
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
