// src/pages/Login.jsx
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	ActivityIndicator,
	Alert,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { useAuthStore, useUsersStore } from '../autoBarrell'

export function Login() {
	const navigation = useNavigation()
	const { control, handleSubmit } = useForm()
	const [loading, setLoading] = useState(false)

	const { signIn } = useAuthStore()
	const { profileByMail } = useUsersStore()

	const onSubmit = async ({ email, password }) => {
		try {
			setLoading(true)
			const data = await signIn(email, password)
			const user = data?.user || data?.session?.user

			if (!user) {
				Alert.alert(
					'No autorizado',
					'Aún no has verificado tu correo o las credenciales son incorrectas.'
				)
				setLoading(false)
				return
			}

			// Intentamos obtener el perfil por id_auth (si signIn ya vinculó id_auth) o por mail
			let profile = null
			try {
				profile = await profileByMail(user.email)
			} catch (err) {
				profile = null
				return err
			}

			// Si no existe perfil → enviar a CreateProfile para completar datos
			if (!profile) {
				navigation.navigate('CreateProfile', { email: user.email })
			} else {
				// perfil existe → ir a Home
				navigation.navigate('Home')
			}
		} catch (err) {
			console.error('Login error:', err)
			Alert.alert('Error', err.message ?? 'Error al iniciar sesión')
		} finally {
			setLoading(false)
		}
	}

	return (
		<View className="flex-1 p-8 justify-center">
			<Text className="text-3xl font-bold mb-8">Iniciar sesión</Text>

			<Text>Email</Text>
			<Controller
				control={control}
				name="email"
				rules={{ required: true }}
				defaultValue=""
				render={({ field: { onChange, value } }) => (
					<TextInput
						value={value}
						onChangeText={onChange}
						keyboardType="email-address"
						autoCapitalize="none"
						placeholder="tu@email.com"
						className="border border-gray-300 p-3 mb-4 rounded-lg"
					/>
				)}
			/>

			<Text>Contraseña</Text>
			<Controller
				control={control}
				name="password"
				rules={{ required: true }}
				defaultValue=""
				render={({ field: { onChange, value } }) => (
					<TextInput
						value={value}
						onChangeText={onChange}
						secureTextEntry
						placeholder="********"
						className="border border-gray-300 p-3 mb-5 rounded-lg"
					/>
				)}
			/>

			<TouchableOpacity
				onPress={handleSubmit(onSubmit)}
				disabled={loading}
				className="bg-blue-600 p-4 rounded-lg items-center mb-6"
			>
				{loading ?
					<ActivityIndicator color="#fff" />
				:	<Text className="text-white font-semibold">Entrar</Text>}
			</TouchableOpacity>

			<View className="gap-2">
				<View className="flex-row justify-center">
					<Text className="mr-2">¿No tienes cuenta?</Text>
					<TouchableOpacity onPress={() => navigation.navigate('Register')}>
						<Text className="text-blue-600 font-semibold">Registrarse</Text>
					</TouchableOpacity>
				</View>
				<View className="flex-row justify-center">
					<Text className="mr-2">¿Has olvidado la contraseña?</Text>
					<TouchableOpacity
						onPress={() => navigation.navigate('ForgotPassword')}
					>
						<Text className="text-blue-600 font-semibold">Recuperar</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}
