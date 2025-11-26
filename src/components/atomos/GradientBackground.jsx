import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'

export function GradientBackground({
	children,
	style,
	edges = ['top', 'bottom'],
}) {
	return (
		<LinearGradient
			colors={require('../../styles/theme').gradients.backgroundSoft}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
			locations={[0, 0.85, 1]}
			style={[
				{
					flex: 1,
					backgroundColor: require('../../styles/theme').colors.bgBase,
				},
				style,
			]}
		>
			<SafeAreaView
				style={{ flex: 1 }}
				edges={edges}
			>
				{children}
			</SafeAreaView>
		</LinearGradient>
	)
}
