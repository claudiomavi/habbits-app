import { StyleSheet, Text, View } from 'react-native'

export function FrequencyBadge({ value = 'daily' }) {
	const label = value === 'weekly' ? 'Sem' : value === 'monthly' ? 'Mes' : 'Dia'
	return (
		<View style={styles.badge}>
			<Text style={styles.badgeText}>{label}</Text>
		</View>
	)
}

const { colors, radii, typography } = require('../../styles/theme')
const styles = StyleSheet.create({
	badge: {
		backgroundColor: colors.lightBlue + '33',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: radii.full,
		borderWidth: 1,
		borderColor: colors.blue,
	},
	badgeText: {
		color: colors.blue,
		fontFamily: typography.family.semibold,
		fontSize: 12,
	},
})
