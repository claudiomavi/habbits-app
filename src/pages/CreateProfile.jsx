import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
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
	const [avatars, setAvatars] = useState([])

	useEffect(() => {
		let mounted = true
		import('../autoBarrell').then(async ({ getCharacters, getImageForLevel }) => {
			try {
				const chars = await getCharacters()
				if (!mounted) return
				const mapped = chars.map((c) => ({
					id: c.id,
					uri: getImageForLevel(c, 1),
					label: c.name || c.key || 'Personaje',
					_character: c,
				}))
				setAvatars(mapped)
				// preselect first if none
				if (!selectedAvatar && mapped[0]?.uri) setSelectedAvatar(mapped[0])
			} catch (e) {
				console.warn('characters load', e)
			}
		})
		return () => {
			mounted = false
		}
	}, [])

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
				avatar: selectedAvatar?.uri,
				character_id: selectedAvatar?.id || null,
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
