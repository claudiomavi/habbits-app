import { useNavigation } from '@react-navigation/native'
import { Button, StyleSheet, Text, View } from 'react-native'

export function ForgotPassword() {
	const navigation = useNavigation()

	return (
		<View style={styles.container}>
			<Text style={styles.title}>ForgotPassword</Text>
			<Button title="Volver" onPress={() => navigation.replace('Login')} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
	title: { fontSize: 32, color: '#2563eb', fontWeight: 'bold', marginBottom: 12 },
})
