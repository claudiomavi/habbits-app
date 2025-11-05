import { useNavigation } from '@react-navigation/native'
import { Button, Text, View } from 'react-native'

export function ForgotPassword() {
	const navigation = useNavigation()

	return (
		<View className="flex-1 justify-center items-center">
			<Text className="text-4xl text-blue-600 font-bold">ForgotPassword</Text>
			<Button
				title="Volver"
				onPress={() => navigation.replace('Login')}
			/>
		</View>
	)
}
