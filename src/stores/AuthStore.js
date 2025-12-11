import { create } from 'zustand'
import { supabase } from '../autoBarrell'

export const useAuthStore = create((set, get) => ({
	user: null,
	session: null,
	loading: true,

	initAuth: async () => {
		const { data } = await supabase?.auth.getSession()
		set({
			session: data.session,
			user: data.session?.user ?? null,
			loading: false,
		})

		supabase?.auth.onAuthStateChange((_event, session) => {
			set({ session, user: session?.user ?? null })
		})
	},

	signIn: async (email, password) => {
		const { data, error } = await supabase?.auth.signInWithPassword({
			email,
			password,
		})
		if (error) throw error

		const user = data?.user

		if (user) {
			await supabase
				.from('profiles')
				.update({ id_auth: user.id })
				.eq('email', user.email)
				.is('id_auth', null)
		}

		set({ session: data.session, user })
		return data
	},

	signUp: async (email, password) => {
		const { data, error } = await supabase?.auth.signUp({ email, password })
		if (error) throw error
		return data
	},

	signOut: async () => {
		await supabase?.auth.signOut()
		set({ session: null, user: null })
	},
	// Forgot password: send reset link
	resetPasswordForEmail: async (email) => {
		const LinkingExpo = require('expo-linking')
		const Constants = require('expo-constants').default
		// In Expo Go use exp://..., in production builds use the custom scheme
		const redirectTo = Constants?.appOwnership === 'expo'
			? LinkingExpo.createURL('reset-password')
			: 'habbitsapp://reset-password'
		const { data, error } = await supabase?.auth.resetPasswordForEmail(email, { redirectTo })
		if (error) throw error
		return data
	},

	// Handle deep link code -> session
	exchangeCodeForSession: async (code) => {
		const { data, error } = await supabase?.auth.exchangeCodeForSession({ code })
		if (error) throw error
		set({ session: data?.session ?? null, user: data?.user ?? null })
		return data
	},

	// Alternative tokens flow
	setSessionFromTokens: async (access_token, refresh_token) => {
		const { data, error } = await supabase?.auth.setSession({ access_token, refresh_token })
		if (error) throw error
		set({ session: data?.session ?? null, user: data?.user ?? null })
		return data
	},

	// Update password after recovery
	updatePassword: async (newPassword) => {
		const { data, error } = await supabase?.auth.updateUser({ password: newPassword })
		if (error) throw error
		return data
	},
}))
