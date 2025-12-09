import { createInvitation } from './crudCoopInvitations'
import { supabase } from './supabaseClient'

// Create a group
export async function createGroup({ name, owner_id }) {
	if (!name?.trim() || !owner_id)
		throw new Error('name and owner_id are required')
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
	const { data, error } = await supabase.rpc('get_groups_for_user', {
		user_id_param: user_id,
	})
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

	// First try RPC for minimal load and to bypass RLS safely if function exists
	try {
		const { data: rpcData, error: rpcError } = await supabase.rpc(
			'get_group_members_with_profiles',
			{ group_id_param: group_id }
		)
		if (!rpcError && Array.isArray(rpcData)) {
			const mapped = (rpcData || []).map((row) => ({
				group_id,
				user_id: row.user_id,
				role: row.role,
				profiles: {
					display_name: row.display_name ?? null,
					email: row.email ?? null,
					avatar: row.avatar ?? null,
				},
			}))
			const keyFor = (m) =>
				m?.profiles?.display_name || m?.profiles?.email || m?.user_id || ''
			mapped.sort((a, b) => {
				if (a.role === 'owner' && b.role !== 'owner') return -1
				if (b.role === 'owner' && a.role !== 'owner') return 1
				return keyFor(a).localeCompare(keyFor(b))
			})
			return mapped
		}
	} catch (e) {
		// ignore and fall back
	}

	// Fetch group info (to get owner_id)
	let ownerId = null
	try {
		const { data: group } = await supabase
			.from('groups')
			.select('id, owner_id')
			.eq('id', group_id)
			.maybeSingle()
		ownerId = group?.owner_id || null
	} catch {}

	// Fetch group members (no joins, to avoid depending on FK naming)
	const { data: gm, error: eMembers } = await supabase
		.from('group_members')
		.select('*')
		.eq('group_id', group_id)
	if (eMembers) throw eMembers
	let members = gm || []

	// Ensure owner appears if absent in group_members
	const hasOwner = ownerId && members.some((m) => m.user_id === ownerId)
	if (ownerId && !hasOwner) {
		members.push({ group_id, user_id: ownerId, role: 'owner' })
	}

	// Fetch profiles in bulk and map (match by id_auth, not id)
	const userIds = Array.from(
		new Set(members.map((m) => m.user_id).filter(Boolean))
	)
	let profilesByAuth = new Map()
	if (userIds.length) {
		const { data: profs, error: eProfiles } = await supabase
			.from('profiles')
			.select('id, id_auth, display_name, email, avatar')
			.in('id_auth', userIds)
		if (eProfiles) throw eProfiles
		profilesByAuth = new Map((profs || []).map((p) => [p.id_auth, p]))
	}

	const enriched = members.map((m) => ({
		...m,
		profiles: profilesByAuth.get(m.user_id) || null,
	}))

	// Sort: owner first, then others alphabetically by display_name/email/id
	const keyFor = (m) =>
		m?.profiles?.display_name || m?.profiles?.email || m?.user_id || ''
	enriched.sort((a, b) => {
		if (a.role === 'owner' && b.role !== 'owner') return -1
		if (b.role === 'owner' && a.role !== 'owner') return 1
		return keyFor(a).localeCompare(keyFor(b))
	})

	return enriched
}

export async function inviteToGroup({ group_id, email, token = null }) {
	return createInvitation({ group_id, email, token })
}

// Leave group (RPC)
export async function leaveGroup(group_id) {
	if (!group_id) throw new Error('group_id is required')
	const { data, error } = await supabase.rpc('leave_group', { group_id_param: group_id })
	if (error) throw error
	return data
}

// Remove member (owner/admin)
export async function removeMember(group_id, user_id) {
	if (!group_id || !user_id) throw new Error('group_id and user_id are required')
	const { data, error } = await supabase.rpc('remove_member', { group_id_param: group_id, user_id_param: user_id })
	if (error) throw error
	return data
}

// Delete group (owner)
export async function deleteGroup(group_id) {
	if (!group_id) throw new Error('group_id is required')
	const { data, error } = await supabase.rpc('delete_group', { group_id_param: group_id })
	if (error) throw error
	return data
}

// Transfer ownership (owner)
export async function transferOwnership(group_id, new_owner) {
	if (!group_id || !new_owner) throw new Error('group_id and new_owner are required')
	const { data, error } = await supabase.rpc('transfer_ownership', { group_id_param: group_id, new_owner_param: new_owner })
	if (error) throw error
	return data
}

// Promote/Demote admin (owner/admin)
export async function setMemberRole(group_id, user_id, role) {
	if (!group_id || !user_id || !role) throw new Error('group_id, user_id and role are required')
	const { data, error } = await supabase.rpc('set_member_role', { group_id_param: group_id, user_id_param: user_id, role_param: role })
	if (error) throw error
	return data
}

// Update group name (owner/admin via RLS)
export async function updateGroupName(group_id, new_name) {
	if (!group_id || !new_name?.trim()) throw new Error('group_id and new_name are required')
	// Try RPC first if exists
	try {
		const { data, error } = await supabase.rpc('rename_group', {
			group_id_param: group_id,
			new_name_param: new_name.trim(),
		})
		if (!error && data) return data
	} catch {}
	const { data, error } = await supabase
		.from('groups')
		.update({ name: new_name.trim() })
		.eq('id', group_id)
		.select()
		.single()
	if (error) throw error
	return data
}
