import { Controller, useForm } from 'react-hook-form'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { supabase, useAuthStore } from '../autoBarrell'

export function Register({ navigation }) {
	const { signUp } = useAuthStore()
	const { control, handleSubmit, watch } = useForm()
	const password = watch('password')
	const confirmPassword = watch('confirmPassword')

	const onSubmit = async (data) => {
		const { email, password, confirmPassword } = data

		if (password !== confirmPassword) {
			alert('Las contraseñas no coinciden')
			return
		}

		try {
			// 1️⃣ Intentar login para ver si el usuario ya existe
			const { error: loginError } = await supabase.auth.signInWithPassword({
				email,
				password: 'dummyPassword', // cualquier valor, no importa
			})

			if (
				loginError &&
				loginError.message.includes('Invalid login credentials')
			) {
				Alert.alert(
					'Cuenta existente',
					'Correo ya registrado. Si olvidaste tu contraseña, puedes restablecerla.',
					[
						{
							text: 'Ir al login',
							onPress: () => navigation.replace('Login'),
						},
						{
							text: 'Restablecer contraseña',
							onPress: () => navigation.replace('ForgotPassword'),
						},
					]
				)
				return
			}

			// 2️⃣ Si no existe, registramos
			const result = await signUp(email, password)
			if (result.error) throw result.error

			alert(
				'Cuenta creada correctamente. Revisa tu correo para confirmar la cuenta.'
			)
			navigation.goBack() // vuelve al login
		} catch (err) {
			console.error(err)
			alert('Error al registrar: ' + err.message)
		}
	}

	return (
		<View className="p-6 flex-1 justify-center">
			<Text className="text-2xl font-bold mb-6">Crear cuenta</Text>

			<Text>Email</Text>
			<Controller
				control={control}
				name="email"
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<TextInput
						placeholder="Correo electrónico"
						keyboardType="email-address"
						autoCapitalize="none"
						value={value}
						onChangeText={onChange}
						className="border border-black p-3 mb-4 rounded-lg"
					/>
				)}
			/>

			<Text>Contraseña</Text>
			<Controller
				control={control}
				name="password"
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<TextInput
						placeholder="Contraseña"
						secureTextEntry
						value={value}
						onChangeText={onChange}
						className="border border-black p-3 mb-4 rounded-lg"
					/>
				)}
			/>

			<Text>Confirmar contraseña</Text>
			<Controller
				control={control}
				name="confirmPassword"
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<TextInput
						placeholder="Repite la contraseña"
						secureTextEntry
						value={value}
						onChangeText={onChange}
						className="border border-black p-3 mb-4 rounded-lg"
					/>
				)}
			/>

			{confirmPassword && confirmPassword !== password && (
				<Text className="text-red-500 mb-4">Las contraseñas no coinciden</Text>
			)}

			<TouchableOpacity
				onPress={handleSubmit(onSubmit)}
				className="bg-blue-600 p-4 rounded-lg items-center mt-3 mb-4"
			>
				<Text className="text-white font-bold">Registrarse</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => navigation.goBack()}
				className="items-center"
			>
				<Text className="text-blue-600">
					¿Ya tienes una cuenta? Inicia sesión
				</Text>
			</TouchableOpacity>
		</View>
	)
}
