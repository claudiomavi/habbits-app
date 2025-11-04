import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, Text, TextInput, View } from 'react-native'
import { useAuthStore } from '../autoBarrell'

export function LoginForm() {
	const { signIn } = useAuthStore()
	const { control, handleSubmit } = useForm()
	const [error, setError] = useState(null)

	const onSubmit = async (data) => {
		try {
			await signIn(data.email, data.password)
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<View className="flex-1 justify-center">
			{error && <Text className="text-red-500 mb-2">{error}</Text>}
			<Controller
				control={control}
				name="email"
				defaultValue=""
				render={({ field: { onChange, value } }) => (
					<TextInput
						placeholder="Correo"
						value={value}
						onChangeText={onChange}
						className="border p-2 mb-4 rounded"
					/>
				)}
			/>
			<Controller
				control={control}
				name="password"
				defaultValue=""
				render={({ field: { onChange, value } }) => (
					<TextInput
						placeholder="Contraseña"
						secureTextEntry
						value={value}
						onChangeText={onChange}
						className="border p-2 mb-4 rounded placeholder:text-black"
					/>
				)}
			/>
			<Button
				title="Iniciar Sesión"
				onPress={handleSubmit(onSubmit)}
			/>
			<Button
				title="Iniciar con Apple"
				onPress={() => {}}
			/>
			<Button
				title="Iniciar con Google"
				onPress={() => {}}
			/>
		</View>
	)
}
