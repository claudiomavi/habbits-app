import { useState } from 'react'
import { Alert } from 'react-native'
import { useForm } from 'react-hook-form'
import { ForgotPasswordTemplate, useAuthStore } from '../autoBarrell'

export function ForgotPassword({ navigation }) {
	const { control, handleSubmit } = useForm()
	const [loading, setLoading] = useState(false)
	const { resetPasswordForEmail } = useAuthStore()

	const onSubmit = async ({ email }) => {
		try {
			setLoading(true)
			await resetPasswordForEmail(email)
			Alert.alert(
				'Correo enviado',
				'Revisa tu correo y abre el enlace para restablecer tu contraseña.'
			)
			navigation.goBack()
		} catch (err) {
			Alert.alert('Error', err?.message || 'No se pudo enviar el correo')
		} finally {
			setLoading(false)
		}
	}

	return (
		<ForgotPasswordTemplate
			control={control}
			handleSubmit={handleSubmit}
			onSubmit={onSubmit}
			loading={loading}
			navigation={navigation}
		/>
	)
}
