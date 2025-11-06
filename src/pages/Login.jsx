import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
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

			let profile = null
			try {
				profile = await profileByMail(user.email)
			} catch (err) {
				profile = null
				return err
			}

			if (!profile) {
				navigation.navigate('CreateProfile', { email: user.email })
			} else {
				navigation.navigate('AppStack')
			}
		} catch (err) {
			console.error('Login error:', err)
			Alert.alert('Error', err.message ?? 'Error al iniciar sesión')
		} finally {
			setLoading(false)
		}
	}

	return (
		<LinearGradient
			colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<View className="bg-white w-full max-w-sm p-8 overflow-hidden rounded-3xl shadow-xl shadow-blue-500">
				{/* Barra de progreso decorativa */}
				<View className="absolute top-0 left-0 right-0 h-1 bg-gray-300">
					<LinearGradient
						colors={['#4facfe', '#00f2fe', '#43e97b']}
						style={styles.progressFill}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
					/>
				</View>

				{/* Logo */}
				<View className="items-center mb-8 mt-2">
					<LinearGradient
						colors={['#4facfe', '#43e97b']}
						style={styles.logo}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
					>
						<View className="flex-row items-end gap-1">
							<View className="w-2 bg-white rounded-md h-7" />
							<View className="w-2 bg-white rounded-md h-5 mt-2" />
							<View className="w-2 bg-white rounded-md h-9" />
						</View>
					</LinearGradient>
					<Text className="text-4xl font-bold text-[#1F2937]">Habits</Text>
					<Text className="mt-1 text-gray-600">
						Convierte rutinas en victorias
					</Text>
				</View>

				{/* Formulario */}
				<View className="gap-5">
					<View className="gap-3">
						<Text className="font-semibold text-gray-500">Email</Text>
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
									placeholderTextColor="#9CA3AF"
									className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-4 text-gray-500"
								/>
							)}
						/>
					</View>

					<View className="gap-2">
						<Text className="font-semibold text-gray-500">Contraseña</Text>
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
									placeholder="••••••••"
									placeholderTextColor="#9CA3AF"
									className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-4 text-gray-500"
								/>
							)}
						/>
					</View>

					{/* Botón principal */}
					<TouchableOpacity
						onPress={handleSubmit(onSubmit)}
						disabled={loading}
						className="mt-2 rounded-2xl overflow-hidden elevation-md"
					>
						<LinearGradient
							colors={['#4facfe', '#43e97b']}
							style={styles.gradientButton}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						>
							{loading ?
								<ActivityIndicator color="#fff" />
							:	<Text className="text-white text-lg font-bold">Entrar</Text>}
						</LinearGradient>
					</TouchableOpacity>

					{/* Olvidaste tu contraseña */}
					<TouchableOpacity
						onPress={() => navigation.navigate('ForgotPassword')}
						className="items-center mt-1"
					>
						<Text className="text-blue-400 font-medium">
							¿Olvidaste tu contraseña?
						</Text>
					</TouchableOpacity>

					{/* Divider */}
					<View className="flex-row items-center my-2">
						<View className="flex-1 h-1 bg-gray-200" />
						<Text className="mx-4 text-sm text-gray-500">o continúa con</Text>
						<View className="flex-1 h-1 bg-gray-200" />
					</View>

					{/* Botones sociales */}
					<View className="flex-row gap-3">
						<TouchableOpacity
							onPress={() => Alert.alert('Google', 'Próximamente')}
							disabled={loading}
							className="flex-1 flex-row items-center justify-center py-3 rounded-xl gap-2 bg-white border-2 border-gray-300"
						>
							<Text className="text-lg font-bold text-blue-400">G</Text>
							<Text className="font-semibold text-gray-900">Google</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => Alert.alert('Apple', 'Próximamente')}
							disabled={loading}
							className="flex-1 flex-row items-center justify-center py-3 rounded-xl gap-2 bg-black"
						>
							<Text className="text-lg text-white">A</Text>
							<Text className="font-semibold text-white">Apple</Text>
						</TouchableOpacity>
					</View>

					{/* Registro */}
					<View className="flex-row items-center justify-center mt-2">
						<Text className="text-gray-500">¿No tienes cuenta? </Text>
						<TouchableOpacity onPress={() => navigation.navigate('Register')}>
							<Text className="font-semibold text-blue-400">Regístrate</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	progressFill: {
		width: '40%',
		height: '100%',
	},
	logo: {
		width: 72,
		height: 72,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		shadowColor: '#4facfe',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	gradientButton: {
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
})
