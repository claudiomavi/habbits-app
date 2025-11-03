import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase/supabaseClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const session = supabase.auth.session()
		setUser(session?.user ?? null)
		setLoading(false)

		const { data: listener } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				setUser(session?.user ?? null)
			}
		)

		return () => listener?.unsubscribe()
	}, [])

	const signInWithGoogle = async () => {
		const { error } = await supabase.auth.signIn({ provider: 'google' })
		if (error) console.log(error.message)
	}

	const signInWithApple = async () => {
		const { error } = await supabase.auth.signIn({ provider: 'apple' })
		if (error) console.log(error.message)
	}

	const signOut = async () => {
		await supabase.auth.signOut()
	}

	return (
		<AuthContext.Provider
			value={{ user, loading, signInWithGoogle, signInWithApple, signOut }}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
