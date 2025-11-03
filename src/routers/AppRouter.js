import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../pages/Home'

const Stack = createNativeStackNavigator()

export default function AppRouter() {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen
				name="Home"
				component={Home}
			/>
		</Stack.Navigator>
	)
}
