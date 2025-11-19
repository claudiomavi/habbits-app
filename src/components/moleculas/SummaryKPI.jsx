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
				colors={['#4facfe', '#43e97b']}
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

const styles = StyleSheet.create({
	card: { flex: 1, gap: 6 },
	gradient: {
		borderRadius: 16,
		paddingVertical: 14,
		paddingHorizontal: 12,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 90,
	},
	value: {
		color: '#fff',
		fontSize: 20,
		fontWeight: '800',
	},
	sublabel: {
		color: '#E5E7EB',
		fontSize: 12,
		marginTop: 2,
	},
	suffix: {
		color: '#fff',
		fontSize: 14,
		fontWeight: '600',
		opacity: 0.9,
	},
	delta: {
		fontSize: 11,
		fontWeight: '700',
		marginTop: 4,
	},
	deltaPositive: {
		color: '#D1FAE5',
	},
	deltaNegative: {
		color: '#FEE2E2',
	},
	label: {
		fontSize: 12,
		color: '#6B7280',
		marginLeft: 4,
	},
})
