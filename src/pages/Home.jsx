import { useNavigation } from '@react-navigation/native'
import { Button, Text, View } from 'react-native'
import { useAuthStore } from '../autoBarrell'

export function Home() {
	const { signOut } = useAuthStore()
	const navigation = useNavigation()

	const handleLogout = async () => {
		try {
			await signOut()
			navigation.replace('Login')
		} catch (error) {
			console.error('Error al cerrar sesión:', error.message)
		}
	}

	return (
		<View className="flex-1 justify-center items-center bg-blue-300">
			<Button
				title="Cerrar sesión"
				onPress={handleLogout}
			/>
			<Text className="text-7xl text-yellow-600 font-bold">Home</Text>
		</View>
	)
}
