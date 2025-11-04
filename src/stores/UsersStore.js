import { create } from 'zustand'
import {
	createUserProfile,
	getUserProfile,
	updateUserProfile,
} from '../autoBarrell'

export const useUsersStore = create((set) => ({
	userProfile: null,

	fetchUserProfile: async (userId) => {
		const profile = await getUserProfile(userId)
		set({ userProfile: profile })
	},

	createProfile: async (profileData) => {
		const profile = await createUserProfile(profileData)
		set({ userProfile: profile })
	},

	updateProfile: async (profileData) => {
		const profile = await updateUserProfile(profileData)
		set({ userProfile: profile })
	},
}))
