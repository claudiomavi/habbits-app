import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
	AppStack,
	CreateProfile,
	Login,
	Redirector,
	Register,
} from '../autoBarrell'

const Stack = createNativeStackNavigator()

export function AppRouter() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{/* Pantalla inicial que decide a dónde mandar */}
			<Stack.Screen
				name="Redirector"
				component={Redirector}
			/>

			{/* Pantallas de auth */}
			<Stack.Screen
				name="Login"
				component={Login}
			/>
			<Stack.Screen
				name="Register"
				component={Register}
			/>

			{/* Pantalla para crear perfil */}
			<Stack.Screen
				name="CreateProfile"
				component={CreateProfile}
			/>

			{/* Pantalla principal */}
			<Stack.Screen
				name="AppStack"
				component={AppStack}
			/>
		</Stack.Navigator>
	)
}
