import { Button, Text, View } from 'react-native'
import { useAuthStore } from '../autoBarrell'

export function Home() {
	const { signOut } = useAuthStore()

	return (
		<View className="flex-1 justify-center items-center bg-blue-300">
			<Button
				title="Cerrar sesión"
				onPress={signOut}
			/>
			<Text className="text-7xl text-yellow-600 font-bold">Home</Text>
		</View>
	)
}
