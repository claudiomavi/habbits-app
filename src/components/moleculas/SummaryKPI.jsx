import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, View } from 'react-native'

export function SummaryKPI({
	label,
	value,
	sublabel,
	suffix = '',
	delta = null,
}) {
	return (
		<View style={styles.card}>
			<LinearGradient
				colors={require('../../styles/theme').gradients.accent}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
				style={styles.gradient}
			>
				<View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
					<Text style={styles.value}>{value}</Text>
					{suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
				</View>
				{sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
				{delta !== null && delta !== undefined ? (
					<Text
						style={[
							styles.delta,
							delta >= 0 ? styles.deltaPositive : styles.deltaNegative,
						]}
					>
						{delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
					</Text>
				) : null}
			</LinearGradient>
			<Text style={styles.label}>{label}</Text>
		</View>
	)
}

const { typography, colors, radii } = require('../../styles/theme')

const styles = StyleSheet.create({
	card: { flex: 1, gap: 6 },
	gradient: {
		borderRadius: radii.lg,
		paddingVertical: 14,
		paddingHorizontal: 12,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 90,
	},
	value: {
		fontFamily: typography.family.extrabold,
		color: colors.white,
		fontSize: typography.size.xl,
	},
	sublabel: {
		color: colors.gray200,
		fontFamily: typography.family.light,
		fontSize: typography.size.xs,
		marginTop: 2,
	},
	suffix: {
		fontFamily: typography.family.semibold,
		color: colors.white,
		fontSize: typography.size.sm,
		opacity: 0.9,
	},
	delta: {
		fontFamily: typography.family.bold,
		fontSize: typography.size.xs,
		marginTop: 4,
	},
	deltaPositive: {
		color: colors.lightGreen,
	},
	deltaNegative: {
		color: colors.lightRed,
	},
	label: {
		fontSize: typography.size.xs,
		color: colors.gray500,
		marginLeft: 4,
	},
})
