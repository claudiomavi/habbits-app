import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { useForm } from 'react-hook-form'
import { ResetPasswordTemplate, useAuthStore } from '../autoBarrell'

export function ResetPassword({ navigation, route }) {
	const { control, handleSubmit, watch } = useForm()
	const newPassword = watch('password')
	const confirmPassword = watch('confirmPassword')
	const [loading, setLoading] = useState(false)
	const { exchangeCodeForSession, setSessionFromTokens, updatePassword } = useAuthStore()

	useEffect(() => {
		// route.params may include code or tokens from deep link
		const params = route?.params || {}
		const code = params?.code
		const access_token = params?.access_token
		const refresh_token = params?.refresh_token

		const establishSession = async () => {
			try {
				if (code) {
					await exchangeCodeForSession(code)
				} else if (access_token && refresh_token) {
					await setSessionFromTokens(access_token, refresh_token)
				}
			} catch (err) {
				Alert.alert('Error', err?.message || 'No se pudo establecer la sesión de recuperación')
			}
		}
		establishSession()
	}, [route?.params])

	const onSubmit = async ({ password, confirmPassword }) => {
		if (password !== confirmPassword) {
			Alert.alert('Error', 'Las contraseñas no coinciden')
			return
		}
		try {
			setLoading(true)
			await updatePassword(password)
			Alert.alert('Contraseña actualizada', 'Ya puedes iniciar sesión con tu nueva contraseña', [
				{ text: 'Ir al Login', onPress: () => navigation.replace('Login') },
			])
		} catch (err) {
			Alert.alert('Error', err?.message || 'No se pudo actualizar la contraseña')
		} finally {
			setLoading(false)
		}
	}

	return (
		<ResetPasswordTemplate
			control={control}
			handleSubmit={handleSubmit}
			onSubmit={onSubmit}
			loading={loading}
			newPassword={newPassword}
			confirmPassword={confirmPassword}
			navigation={navigation}
		/>
	)
}
