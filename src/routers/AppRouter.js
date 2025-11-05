import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import {
	CreateProfile,
	Home,
	Login,
	Register,
	useAuthStore,
	useUsersStore,
} from '../autoBarrell'

const Stack = createNativeStackNavigator()

export function AppRouter() {
	const { user, loading } = useAuthStore()
	const { profileByMail } = useUsersStore()
	const [hasProfile, setHasProfile] = useState(null)

	useEffect(() => {
		const checkProfile = async () => {
			if (!user) {
				setHasProfile(null)
				return
			}
			try {
				await profileByMail(user.email)
				setHasProfile(true)
			} catch {
				setHasProfile(false)
			}
		}

		checkProfile()
	}, [user])

	if (loading || (user && hasProfile === null)) {
		return null // Puedes poner aquí un spinner de carga
	}

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{!user ?
				<>
					<Stack.Screen
						name="Login"
						component={Login}
					/>
					<Stack.Screen
						name="Register"
						component={Register}
					/>
				</>
			: !hasProfile ?
				<Stack.Screen
					name="CreateProfile"
					component={CreateProfile}
				/>
			:	<Stack.Screen
					name="Home"
					component={Home}
				/>
			}
		</Stack.Navigator>
	)
}
