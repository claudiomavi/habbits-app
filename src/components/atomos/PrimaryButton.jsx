import { LinearGradient } from 'expo-linear-gradient'
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native'

export function PrimaryButton({ title, onPress, loading, style }) {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={loading}
			style={[styles.mainButton, style]}
			activeOpacity={0.8}
		>
			<LinearGradient
				colors={require('../../styles/theme').gradients.cta}
				style={styles.gradientButton}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 0 }}
			>
				{loading ? (
					<ActivityIndicator color="#fff" />
				) : (
					<Text style={styles.mainButtonText}>{title}</Text>
				)}
			</LinearGradient>
		</TouchableOpacity>
	)
}

const { colors, radii, shadows, typography } = require('../../styles/theme')
const styles = StyleSheet.create({
	mainButton: { borderRadius: radii.lg, overflow: 'hidden', ...shadows.soft },
	gradientButton: {
		paddingVertical: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	mainButtonText: {
		color: colors.white,
		fontSize: typography.size.md,
		fontFamily: typography.family.bold,
	},
})
