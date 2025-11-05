import { create } from 'zustand'
import {
	addProfile,
	getProfileByMail,
	getProfileByUserId,
	updateIdAuth,
} from '../autoBarrell'

export const useUsersStore = create((set) => ({
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

	updateIdAuth,
}))
