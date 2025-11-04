import { Controller, useForm } from 'react-hook-form'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Boy from '../assets/boy.png'
import Girl from '../assets/girl.png'
import { useAuthStore, useUsersStore } from '../autoBarrell'

const avatarOptions = ['boy', 'girl']
const avatars = { boy: Boy, girl: Girl }

export function RegisterForm({ onRegistered }) {
	const { signUp } = useAuthStore()
	const { createProfile } = useUsersStore()
	const { control, handleSubmit, watch, setValue } = useForm()
	const password = watch('password')
	const confirmPassword = watch('confirmPassword')
	const avatar = watch('avatar')

	const onSubmit = async (data) => {
		try {
			const { email, password, avatar, name } = data

			if (!avatar) {
				alert('Selecciona un avatar')
				return
			}

			if (password !== confirmPassword) {
				alert('Las contraseñas no coinciden')
				return
			}

			alert(
				'Usuario creado correctamente. Revisa tu correo para confirmar la cuenta antes de iniciar sesión.'
			)

			const result = await signUp(email, password)
			if (result.error) throw result.error

			await createProfile({
				id: result.data.user.id,
				display_name: name,
				avatar: avatar,
			})

			onRegistered()
		} catch (err) {
			console.error(err)
			alert('Error: ' + err.message)
		}
	}

	return (
		<View style={{ padding: 20 }}>
			<Text>Nombre</Text>
			<Controller
				control={control}
				name="name"
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<TextInput
						placeholder="Tu nombre"
						value={value}
						onChangeText={onChange}
						style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
					/>
				)}
			/>

			<Text>Email</Text>
			<Controller
				control={control}
				name="email"
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<TextInput
						placeholder="Correo"
						keyboardType="email-address"
						value={value}
						onChangeText={onChange}
						style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
					/>
				)}
			/>

			<Text>Contraseña</Text>
			<Controller
				control={control}
				name="password"
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<TextInput
						placeholder="Contraseña"
						secureTextEntry
						value={value}
						onChangeText={onChange}
						style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
					/>
				)}
			/>

			<Text>Confirmar contraseña</Text>
			<Controller
				control={control}
				name="confirmPassword"
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<TextInput
						placeholder="Repite la contraseña"
						secureTextEntry
						value={value}
						onChangeText={onChange}
						style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
					/>
				)}
			/>
			{confirmPassword && confirmPassword !== password && (
				<Text style={{ color: 'red', marginBottom: 10 }}>
					Las contraseñas no coinciden
				</Text>
			)}

			<Text>Elige un avatar</Text>
			<View style={{ flexDirection: 'row', marginBottom: 20 }}>
				{avatarOptions.map((key) => (
					<TouchableOpacity
						key={key}
						onPress={() => setValue('avatar', key)}
						style={{
							borderWidth: avatar === key ? 2 : 0,
							borderColor: 'blue',
							borderRadius: 50,
							padding: 2,
							marginRight: 10,
						}}
					>
						<Image
							source={avatars[key]}
							style={{ width: 50, height: 50 }}
						/>
					</TouchableOpacity>
				))}
			</View>

			<TouchableOpacity
				onPress={handleSubmit(onSubmit)}
				style={{
					backgroundColor: 'blue',
					padding: 12,
					borderRadius: 8,
					alignItems: 'center',
				}}
			>
				<Text style={{ color: 'white', fontWeight: 'bold' }}>Registrarse</Text>
			</TouchableOpacity>
		</View>
	)
}
