import { Button, Text, View } from 'react-native'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
	const { user, signOut } = useAuth()

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Bienvenido, {user?.email || 'Invitado'}</Text>
			<Button
				title="Salir"
				onPress={signOut}
			/>
		</View>
	)
}
