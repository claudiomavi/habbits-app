import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { LoginTemplate, useAuthStore, useUsersStore } from '../autoBarrell'

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
		<LoginTemplate
			control={control}
			handleSubmit={handleSubmit}
			onSubmit={onSubmit}
			loading={loading}
			navigation={navigation}
		/>
	)
}
