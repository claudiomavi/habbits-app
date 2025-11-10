import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert } from 'react-native'
import { RegisterTemplate, useAuthStore } from '../autoBarrell'

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

			// Intenta registrar; si el correo ya existe, Supabase puede devolver error o bien user.identities vacío
			const result = await signUp(email, password)
			if (result?.error) throw result.error

			const identities = result?.user?.identities
			if (Array.isArray(identities) && identities.length === 0) {
				// Usuario ya existe (patrón de Supabase: identities vacío)
				Alert.alert('Cuenta existente', 'Correo ya registrado.', [
					{ text: 'Ir al login', onPress: () => navigation.replace('Login') },
				])
				return
			}

			Alert.alert(
				'¡Cuenta creada!',
				'Revisa tu correo para confirmar la cuenta.',
				[{ text: 'OK', onPress: () => navigation.goBack() }]
			)
		} catch (err) {
			console.error(err)

			const msg = (err?.message || '').toLowerCase()
			const desc = (err?.error_description || '').toLowerCase()
			const status = err?.status || err?.statusCode

			if (
				msg.includes('user already registered') ||
				desc.includes('already registered') ||
				msg.includes('email already registered') ||
				status === 422
			) {
				Alert.alert('Cuenta existente', 'Correo ya registrado.', [
					{ text: 'Ir al login', onPress: () => navigation.replace('Login') },
				])
			} else {
				Alert.alert('Error', err?.message || 'Error al registrar')
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<RegisterTemplate
			control={control}
			confirmPassword={confirmPassword}
			password={password}
			handleSubmit={handleSubmit}
			onSubmit={onSubmit}
			loading={loading}
			navigation={navigation}
		/>
	)
}
