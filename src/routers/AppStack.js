import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Home } from '../autoBarrell'

const Stack = createNativeStackNavigator()

export function AppStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="Home"
				component={Home}
			/>
		</Stack.Navigator>
	)
}
