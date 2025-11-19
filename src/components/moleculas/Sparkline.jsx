import { StyleSheet, View } from 'react-native'

export function Sparkline({ data = [], height = 40, color = '#10B981' }) {
	const max = Math.max(1, ...data)
	const barWidth = Math.max(1, Math.floor(120 / Math.max(1, data.length)))
	return (
		<View style={[styles.container, { height }]}>
			{data.map((v, i) => {
				const h = Math.round((v / max) * height) || 1
				return (
					<View
						key={i}
						style={[
							styles.bar,
							{ height: h, backgroundColor: color, width: barWidth },
						]}
					/>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		gap: 2,
		backgroundColor: '#F3F4F6',
		borderRadius: 12,
		padding: 6,
		borderWidth: 2,
		borderColor: '#E5E7EB',
	},
	bar: {
		borderRadius: 4,
	},
})
