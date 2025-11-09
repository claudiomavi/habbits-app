import { useNavigation } from '@react-navigation/native'
import { Button, StyleSheet, Text, View } from 'react-native'
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
		<View style={styles.container}>
			<Button
				title="Cerrar sesión"
				onPress={handleLogout}
			/>
			<Text style={styles.title}>Home</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#93c5fd',
	},
	title: {
		fontSize: 48,
		color: '#ca8a04',
		fontWeight: 'bold',
		marginTop: 12,
	},
})
