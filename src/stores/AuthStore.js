import { create } from 'zustand'
import { supabase } from '../autoBarrell'

export const useAuthStore = create((set) => ({
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
				.eq('mail', user.email)
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
}))
