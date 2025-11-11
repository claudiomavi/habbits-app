import { StyleSheet, Text, View } from 'react-native'

export function HabitsTemplate() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Gestión de Hábitos (próximamente)</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	text: { fontSize: 16 },
})
