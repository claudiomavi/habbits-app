import { StyleSheet, Text, View } from 'react-native'

export function DifficultyBadge({ value = 1 }) {
	return (
		<View style={styles.badge}>
			<Text style={styles.badgeText}>D{value}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	badge: {
		backgroundColor: '#EEF2FF',
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	badgeText: { color: '#4F46E5', fontWeight: '700', fontSize: 12 },
})
