import { StyleSheet, Text, View } from 'react-native'

export function ProfileTemplate() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Perfil (próximamente)</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	text: { fontSize: 16 },
})
