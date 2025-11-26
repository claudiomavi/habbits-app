import { Pressable, StyleSheet, Text, View } from 'react-native'

export function FrequencySelector({ value = 'daily', onChange }) {
	const options = [
		{ key: 'daily', label: 'Diario' },
		{ key: 'weekly', label: 'Semanal' },
		{ key: 'monthly', label: 'Mensual' },
	]
	return (
		<View>
			<Text style={styles.label}>Frecuencia</Text>
			<View style={styles.row}>
				{options.map((opt) => (
					<Pressable
						key={opt.key}
						onPress={() => onChange?.(opt.key)}
						style={[styles.chip, value === opt.key && styles.active]}
					>
						<Text style={[styles.text, value === opt.key && styles.textActive]}>
							{opt.label}
						</Text>
					</Pressable>
				))}
			</View>
		</View>
	)
}

const { colors, radii, typography } = require('../../styles/theme')
const styles = StyleSheet.create({
	label: {
		marginTop: 8,
		fontFamily: typography.family.semibold,
		color: colors.black,
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
	textActive: { color: colors.white, fontFamily: typography.family.bold },
})
