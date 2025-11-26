import { StyleSheet, View } from 'react-native'

export function XPBar({ percent = 0.45 }) {
	return (
		<View style={styles.wrapper}>
			<View style={styles.bg} />
			<View
				style={[
					styles.fill,
					{ width: `${Math.max(0, Math.min(1, percent)) * 100}%` },
				]}
			/>
		</View>
	)
}

const { colors } = require('../../styles/theme')
const styles = StyleSheet.create({
	wrapper: { height: 8, marginTop: 6, borderRadius: 6, overflow: 'hidden' },
	bg: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: colors.gray200,
	},
	fill: { height: '100%', backgroundColor: colors.green },
})
