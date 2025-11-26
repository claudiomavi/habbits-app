import { useNavigation } from '@react-navigation/native'
import { ScrollView, StyleSheet, Text } from 'react-native'
import {
	CardContainer,
	GradientBackground,
	PrimaryButton,
} from '../../autoBarrell'

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
					<PrimaryButton
						title="Volver"
						onPress={() => navigation.goBack()}
						style={{ marginTop: 16 }}
					/>
				</CardContainer>
			</ScrollView>
		</GradientBackground>
	)
}

const { colors, typography } = require('../../styles/theme')

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	scrollContent: { paddingBottom: 32 },
	title: {
		fontSize: typography.size.xl,
		fontFamily: typography.family.bold,
		color: colors.black,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: typography.size.sm,
		color: colors.gray500,
	},
})
