import { StyleSheet, Text, View } from 'react-native'

export function DifficultyBadge({ value = 1 }) {
	return (
		<View style={styles.badge}>
			<Text style={styles.badgeText}>D{value}</Text>
		</View>
	)
}

const { colors, radii, typography } = require('../../styles/theme')
const styles = StyleSheet.create({
	badge: {
		backgroundColor: colors.orangeBg,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: radii.full,
		borderWidth: 1,
		borderColor: colors.orange,
	},
	badgeText: {
		color: colors.orange,
		fontFamily: typography.family.semibold,
		fontSize: 12,
	},
})
