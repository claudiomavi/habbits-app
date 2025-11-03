import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '../supabase/supabaseClient' // default import

const AuthContext = createContext()

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function loadSession() {
			// Supabase v2
			const {
				data: { session },
			} = await supabase.auth.getSession()
			setUser(session?.user ?? null)
			setLoading(false)

			// Escucha cambios de sesión en tiempo real
			supabase.auth.onAuthStateChange((_event, session) => {
				setUser(session?.user ?? null)
			})
		}

		loadSession()
	}, [])

	return (
		<AuthContext.Provider value={{ user, loading }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
