import { create } from 'zustand'
import {
	addProfile,
	computeLevel,
	getProfileByMail,
	getProfileByUserId,
	updateIdAuth,
} from '../autoBarrell'

export const useUsersStore = create((set, get) => ({
	users: [],
	profile: null,
	loading: false,

	createProfile: async (data) => {
		const newProfile = await addProfile(data)
		set({ profile: newProfile })
		return newProfile
	},

	fetchProfile: async (userId) => {
		const profile = await getProfileByUserId(userId)
		set({ profile })
		return profile
	},

	profileByMail: async (email) => {
		const profile = await getProfileByMail(email)
		set({ profile })
		return profile
	},

	optimisticUpdateXp: (delta) => {
		if (!delta) return
		const current = get().profile
		if (!current) return
		const newXp = Math.max(0, (current.xp || 0) + delta)
		const newLevel = computeLevel(newXp)
		set({ profile: { ...current, xp: newXp, level: newLevel } })
	},

	updateIdAuth,
}))
