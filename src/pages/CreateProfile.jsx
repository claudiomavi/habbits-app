import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore, useUsersStore } from '../autoBarrell'

export function CreateProfile() {
	const { control, handleSubmit } = useForm()
	const { createProfile } = useUsersStore()
	const { user } = useAuthStore()
	const navigation = useNavigation()

	const [selectedAvatar, setSelectedAvatar] = useState(null)
	const [loading, setLoading] = useState(false)

	// Avatares
	const avatars = [
		{ id: 'male', uri: 'https://imgur.com/dYYo70A.png', label: 'Hombre' },
		{ id: 'female', uri: 'https://imgur.com/0MyPvoE.png', label: 'Mujer' },
	]

	const onSubmit = async (data) => {
		if (!selectedAvatar) {
			Alert.alert('Avatar requerido', 'Selecciona un avatar para continuar')
			return
		}

		try {
			setLoading(true)
			await createProfile({
				id_auth: user?.id,
				email: user?.email,
				display_name: data.display_name,
				avatar: selectedAvatar,
				xp: 0,
				level: 1,
			})
			navigation.navigate('AppStack')
		} catch (err) {
			console.error('Error creando el perfil:', err)
			Alert.alert('Error', err.message || 'Error al crear el perfil')
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
						{/* Barra de progreso decorativa - más llena que login */}
						<View className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gray-300">
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
								¡Bienvenido!
							</Text>
							<Text className="mt-1 text-gray-500">
								Crea tu perfil para empezar tu viaje
							</Text>
						</View>

						{/* Formulario */}
						<View className="gap-5">
							{/* Nombre Input */}
							<View className="gap-3">
								<Text className="font-semibold text-gray-500">
									Nombre de usuario
								</Text>
								<Controller
									control={control}
									name="display_name"
									rules={{
										required: 'El nombre es obligatorio',
										minLength: {
											value: 3,
											message: 'Mínimo 3 caracteres',
										},
									}}
									defaultValue=""
									render={({
										field: { onChange, value },
										fieldState: { error },
									}) => (
										<>
											<TextInput
												value={value}
												onChangeText={onChange}
												placeholder="Tu nombre"
												placeholderTextColor="#9CA3AF"
												className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-4 text-gray-500"
											/>
											{error && (
												<Text className="text-xs text-red-500 mt-1">
													{error.message}
												</Text>
											)}
										</>
									)}
								/>
							</View>

							{/* Selector de avatar */}
							<View className="gap-3">
								<Text className="font-semibold text-gray-500">
									Elige tu personaje
								</Text>
								<View className="flex-row justify-center gap-5">
									{avatars.map((avatar) => (
										<TouchableOpacity
											key={avatar.id}
											onPress={() => setSelectedAvatar(avatar.uri)}
											className={`items-center p-3 rounded-3xl border-2 ${selectedAvatar === avatar.uri ? 'border-blue-400 bg-blue-100' : 'bg-gray-100 border-transparent'}`}
											activeOpacity={0.7}
										>
											<Image
												source={{ uri: avatar.uri }}
												className="w-20 h-20 rounded-3xl mb-2"
											/>
											<Text
												className={`font-semibold  ${selectedAvatar === avatar.uri ? 'text-blue-500' : 'text-gray-500'}`}
											>
												{avatar.label}
											</Text>
										</TouchableOpacity>
									))}
								</View>
								{!selectedAvatar && (
									<Text className="text-xs text-center  text-gray-400">
										Selecciona un avatar para continuar
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
											Comenzar aventura
										</Text>
									}
								</LinearGradient>
							</TouchableOpacity>

							{/* Info adicional */}
							<View className="flex-row items-center p-4 rounded-2xl gap-3 border-blue-400 bg-blue-100">
								<Text className="text-2xl">💡</Text>
								<Text className="flex-1 text-[13px] leading-5 text-blue-800">
									Ganarás XP completando hábitos y subirás de nivel. ¡Empieza en
									nivel 1!
								</Text>
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
		width: '80%',
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
