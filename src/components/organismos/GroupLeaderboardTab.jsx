import { StyleSheet, Text } from 'react-native'
import { CardContainer, GradientBackground } from '../../autoBarrell'

export function GroupLeaderboardTab({ route }) {
	const { groupId } = route.params || {}

	return (
		<GradientBackground style={{ flex: 1, padding: 16 }}>
			<CardContainer>
				<Text style={styles.title}>Clasificatorio</Text>
				<Text style={styles.helper}>Pendiente de implementar</Text>
			</CardContainer>
		</GradientBackground>
	)
}

const { colors, typography } = require('../../styles/theme')
const styles = StyleSheet.create({
	title: { fontFamily: typography.family.bold, fontSize: typography.size.md },
	helper: { color: colors.gray500 },
})