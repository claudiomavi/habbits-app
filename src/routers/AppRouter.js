import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthGateway, Home, useAuthStore } from '../autoBarrell'

const Stack = createNativeStackNavigator()

export function AppRouter() {
	const { user } = useAuthStore()

	return user ?
			<Stack.Navigator>
				<Stack.Screen
					name="Home"
					component={Home}
				/>
			</Stack.Navigator>
		:	<Stack.Navigator>
				<Stack.Screen
					name="AuthGateway"
					component={AuthGateway}
				/>
			</Stack.Navigator>
}
