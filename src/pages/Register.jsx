import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase, useAuthStore } from '../autoBarrell'

export function Register() {
	const navigation = useNavigation()
	const { signUp } = useAuthStore()
	const { control, handleSubmit, watch } = useForm()
	const [loading, setLoading] = useState(false)

	const password = watch('password')
	const confirmPassword = watch('confirmPassword')

	const onSubmit = async (data) => {
		const { email, password, confirmPassword } = data

		if (password !== confirmPassword) {
			Alert.alert('Error', 'Las contraseñas no coinciden')
			return
		}

		try {
			setLoading(true)

			// 1️⃣ Intentar login para ver si el usuario ya existe
			const { error: loginError } = await supabase.auth.signInWithPassword({
				email,
				password: 'dummyPassword',
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
				setLoading(false)
				return
			}

			// 2️⃣ Si no existe, registramos
			const result = await signUp(email, password)
			if (result.error) throw result.error

			Alert.alert(
				'¡Cuenta creada!',
				'Revisa tu correo para confirmar la cuenta.',
				[{ text: 'OK', onPress: () => navigation.goBack() }]
			)
		} catch (err) {
			console.error(err)
			Alert.alert('Error', err.message || 'Error al registrar')
		} finally {
			setLoading(false)
		}
	}

	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: '#667eea' }}
			edges={['top', 'bottom']}
		>
			<LinearGradient
				colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
				style={styles.container}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					showsVerticalScrollIndicator={false}
					bounces={false}
				>
					{/* Tarjeta principal */}
					<View className="bg-white w-screen max-w-sm p-8 overflow-hidden rounded-3xl">
						{/* Barra de progreso decorativa */}
						<View className="absolute top-0 left-0 right-0 h-1 bg-gray-300 rounded-t-3xl">
							<LinearGradient
								colors={['#4facfe', '#00f2fe', '#43e97b']}
								style={styles.progressFill}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
							/>
						</View>

						{/* Logo y título */}
						<View className="items-center mb-6 mt-2">
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
							<Text className="text-4xl font-bold text-[#1F2937]">
								Crear cuenta
							</Text>
							<Text className="mt-1 text-gray-500">
								Únete a la comunidad de Habits
							</Text>
						</View>

						{/* Formulario */}
						<View className="gap-4">
							{/* Email Input */}
							<View className="gap-2">
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

							{/* Password Input */}
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

							{/* Confirm Password Input */}
							<View className="gap-2">
								<Text className="font-semibold text-gray-500">
									Confirmar contraseña
								</Text>
								<Controller
									control={control}
									name="confirmPassword"
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
								{confirmPassword && confirmPassword !== password && (
									<Text className="text-xs text-red-500 mt-1">
										Las contraseñas no coinciden
									</Text>
								)}
							</View>

							{/* Botón principal */}
							<TouchableOpacity
								onPress={handleSubmit(onSubmit)}
								disabled={loading}
								activeOpacity={0.8}
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
									:	<Text className="text-white text-base font-bold">
											Crear cuenta
										</Text>
									}
								</LinearGradient>
							</TouchableOpacity>

							{/* Divider */}
							<View className="flex-row items-center my-2">
								<View className="flex-1 h-1 bg-gray-200" />
								<Text className="mx-4 text-sm text-gray-500">
									o regístrate con
								</Text>
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

							{/* Login link */}
							<View className="flex-row items-center justify-center mt-2">
								<Text className="text-gray-500">¿Ya tienes cuenta? </Text>
								<TouchableOpacity onPress={() => navigation.goBack()}>
									<Text className="font-semibold text-blue-400">
										Inicia sesión
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</ScrollView>
			</LinearGradient>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 0,
		paddingBottom: 0,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingVertical: 40,
	},
	progressFill: {
		width: '60%',
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
