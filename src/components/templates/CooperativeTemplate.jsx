import { ScrollView, StyleSheet, Text } from 'react-native'
import { CardContainer, GradientBackground, PrimaryButton } from '../../autoBarrell'
import { useNavigation } from '@react-navigation/native'

export function CooperativeTemplate() {
	const navigation = useNavigation()
	return (
		<GradientBackground style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<CardContainer>
					<Text style={styles.title}>Modo cooperativo</Text>
					<Text style={styles.subtitle}>
						Proximamente: configuración de equipos, invitaciones y progreso
						compartido.
					</Text>
					<PrimaryButton title="Volver" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
				</CardContainer>
			</ScrollView>
		</GradientBackground>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	scrollContent: { paddingBottom: 32 },
	title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
	subtitle: { fontSize: 14, color: '#6B7280' },
})
