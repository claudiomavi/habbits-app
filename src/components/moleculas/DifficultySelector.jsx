import { Pressable, StyleSheet, Text, View } from 'react-native'

export function DifficultySelector({ value = 1, onChange }) {
	const options = [1, 2, 3]
	return (
		<View>
			<Text style={styles.label}>Dificultad</Text>
			<View style={styles.row}>
				{options.map((opt) => (
					<Pressable
						key={opt}
						onPress={() => onChange?.(opt)}
						style={[styles.chip, value === opt && styles.active]}
					>
						<Text style={[styles.text, value === opt && styles.textActive]}>
							{opt}
						</Text>
					</Pressable>
				))}
			</View>
		</View>
	)
}

const { colors, typography, radii } = require('../../styles/theme')
const styles = StyleSheet.create({
	label: {
		marginTop: 8,
		color: colors.black,
		fontFamily: typography.family.semibold,
	},
	row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
	chip: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: radii.full,
		backgroundColor: colors.gray200,
	},
	active: { backgroundColor: colors.orange },
	text: { color: colors.black, fontFamily: typography.family.regular },
	textActive: {
		color: colors.white,
		fontFamily: typography.family.bold,
	},
})
