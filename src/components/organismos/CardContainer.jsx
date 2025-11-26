import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'

export function CardContainer({
	children,
	progressWidth = '65%',
	marginTop = 0,
}) {
	return (
		<View style={[styles.card, { marginTop: marginTop }]}>
			<View style={styles.progressBarContainer}>
				<LinearGradient
					colors={require('../../styles/theme').gradients.accent}
					style={[styles.progressFill, { width: progressWidth }]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				/>
			</View>
			{children}
		</View>
	)
}

const { colors, radii, shadows } = require('../../styles/theme')
const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.white,
		borderRadius: radii.xl,
		padding: 16,
		...shadows.soft,
	},
	progressBarContainer: {
		position: 'absolute',
		top: 0,
		left: 15,
		right: 0,
		height: 4,
		backgroundColor: colors.gray200,
		borderTopLeftRadius: radii.xxl,
		borderTopRightRadius: radii.xxl,
		width: '100%',
	},
	progressFill: { height: '100%' },
})
