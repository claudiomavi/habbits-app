import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import {
	CreateProfileTemplate,
	useAuthStore,
	useUsersStore,
} from '../autoBarrell'

export function CreateProfile() {
	const { control, handleSubmit } = useForm()
	const { createProfile } = useUsersStore()
	const { user } = useAuthStore()
	const navigation = useNavigation()

	const [selectedAvatar, setSelectedAvatar] = useState(null)
	const [loading, setLoading] = useState(false)

	// Avatares (puedes cambiar las URLs)
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
		<CreateProfileTemplate
			control={control}
			avatars={avatars}
			selectedAvatar={selectedAvatar}
			setSelectedAvatar={setSelectedAvatar}
			handleSubmit={handleSubmit}
			onSubmit={onSubmit}
			loading={loading}
		/>
	)
}
