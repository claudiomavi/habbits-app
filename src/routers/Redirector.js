import { useEffect } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { useAuthStore, useUsersStore } from '../autoBarrell'

export function Redirector({ navigation }) {
	const { user, loading } = useAuthStore()
	const { fetchProfile } = useUsersStore()

	useEffect(() => {
		const checkProfile = async () => {
			if (loading) return

			// Si no hay usuario → ir al login
			if (!user) {
				navigation.replace('Login')
				return
			}

			// Si hay usuario → comprobar si tiene perfil por id_auth
			const profile = await fetchProfile(user.id)
			if (!profile) {
				navigation.replace('CreateProfile', { email: user.email })
				return
			}
			navigation.replace('AppStack')
		}

		checkProfile()
	}, [user, loading])

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<ActivityIndicator size="large" />
		</View>
	)
}
