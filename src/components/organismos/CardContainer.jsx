import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'

export function CardContainer({ children, progressWidth = '65%' }) {
	return (
		<View style={styles.card}>
			<View style={styles.progressBarContainer}>
				<LinearGradient
					colors={['#4facfe', '#00f2fe', '#43e97b']}
					style={[styles.progressFill, { width: progressWidth }]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				/>
			</View>
			{children}
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#fff',
		borderRadius: 24,
		padding: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.2,
		shadowRadius: 16,
		elevation: 6,
	},
	progressBarContainer: {
		position: 'absolute',
		top: 0,
		left: 15,
		right: 0,
		height: 4,
		backgroundColor: '#E5E7EB',
		borderTopLeftRadius: 48,
		borderTopRightRadius: 48,
		width: '100%',
	},
	progressFill: { height: '100%' },
})
