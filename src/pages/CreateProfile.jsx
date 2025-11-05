import { Button, Text, View } from 'react-native'
import { useAuthStore } from '../autoBarrell'

export function CreateProfile() {
	const { signOut } = useAuthStore()
	return (
		<View>
			<Button
				title="Cerrar sesión"
				onPress={signOut}
			/>
			<Text>Create</Text>
		</View>
	)
}
