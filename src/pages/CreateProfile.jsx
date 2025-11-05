import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	Alert,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { useAuthStore, useUsersStore } from '../autoBarrell'

export function CreateProfile() {
	const { control, handleSubmit } = useForm()
	const { createProfile } = useUsersStore()
	const { user } = useAuthStore()
	const navigation = useNavigation()

	const [selectedAvatar, setSelectedAvatar] = useState(null)

	const avatars = [
		{ id: 'avatar1', uri: 'https://imgur.com/dYYo70A.png' },
		{ id: 'avatar2', uri: 'https://imgur.com/0MyPvoE.png' },
	]

	const onSubmit = async (data) => {
		if (!selectedAvatar) {
			Alert.alert('Selecciona un avatar antes de continuar')
			return
		}

		try {
			await createProfile({
				id_auth: user?.id,
				email: user?.email,
				display_name: data.display_name,
				avatar: selectedAvatar,
				xp: 0,
				level: 1,
			})
			navigation.navigate('Home')
		} catch (err) {
			console.error('Error creando el perfil:', err)
			Alert.alert('Error', err.message || 'Error al crear el perfil')
		}
	}

	return (
		<View className="flex-1 bg-gray-100 justify-center items-center p-6">
			<View className="bg-white p-6 rounded-2xl w-full max-w-md shadow">
				<Text className="text-2xl font-bold text-center text-gray-800 mb-6">
					Crea tu perfil
				</Text>

				{/* Nombre */}
				<Controller
					control={control}
					name="display_name"
					rules={{ required: 'El nombre es obligatorio' }}
					render={({ field: { onChange, value }, fieldState: { error } }) => (
						<>
							<TextInput
								placeholder="Tu nombre"
								value={value}
								onChangeText={onChange}
								className="border border-gray-300 rounded-lg px-4 py-2 mb-2 text-gray-800"
							/>
							{error && (
								<Text className="text-red-500 text-sm">{error.message}</Text>
							)}
						</>
					)}
				/>

				{/* Selector de avatar */}
				<Text className="text-gray-700 font-medium mb-2">Elige tu avatar:</Text>
				<View className="flex-row justify-center mb-4">
					{avatars.map((a) => (
						<TouchableOpacity
							key={a.id}
							onPress={() => setSelectedAvatar(a.uri)}
							className={`mx-2 p-1 rounded-full border-2 ${
								selectedAvatar === a.uri ?
									'border-blue-500'
								:	'border-transparent'
							}`}
						>
							<Image
								source={{ uri: a.uri }}
								className="w-16 h-16 rounded-full"
							/>
						</TouchableOpacity>
					))}
				</View>

				{/* Botón de enviar */}
				<TouchableOpacity
					onPress={handleSubmit(onSubmit)}
					className="bg-blue-500 py-3 rounded-lg"
				>
					<Text className="text-white text-center font-semibold">
						Guardar perfil
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
