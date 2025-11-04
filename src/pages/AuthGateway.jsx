import { useState } from 'react'
import { Button, Text, View } from 'react-native'
import { LoginForm, RegisterForm } from '../autoBarrell'

export function AuthGateway() {
	const [mode, setMode] = useState(null) // null | 'login' | 'register'

	if (!mode) {
		return (
			<View className="flex-1 justify-center items-center bg-white p-4">
				<Text className="text-2xl font-bold mb-6">Bienvenido</Text>
				<Button
					title="Iniciar Sesión"
					onPress={() => setMode('login')}
				/>
				<Button
					title="Registrarse"
					onPress={() => setMode('register')}
				/>
			</View>
		)
	}

	return (
		<View className="flex-1 bg-white p-4">
			{mode === 'login' ?
				<LoginForm />
			:	<RegisterForm onRegistered={() => setMode('login')} />}
			<Button
				title="Volver"
				onPress={() => setMode(null)}
			/>
		</View>
	)
}
