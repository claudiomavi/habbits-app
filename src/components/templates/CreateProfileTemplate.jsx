import { LinearGradient } from 'expo-linear-gradient'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export function CreateProfileTemplate({
	title = 'Crear perfil',
	subtitle = 'Completa tu información',
	children,
	progressWidth = '60%',
}) {
	return (
		<LinearGradient
			colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				bounces={false}
			>
				<View style={styles.card}>
					<View style={styles.progressBarContainer}>
						<LinearGradient
							colors={['#4facfe', '#00f2fe', '#43e97b']}
							style={[styles.progressFill, { width: progressWidth }]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
					</View>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.subtitle}>{subtitle}</Text>
					<View style={styles.form}>{children}</View>
				</View>
			</ScrollView>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingVertical: 40,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 32,
		padding: 32,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 10,
		overflow: 'hidden',
	},
	progressBarContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 4,
		backgroundColor: '#E5E7EB',
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
	},
	progressFill: { height: '100%' },
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#1F2937',
		marginBottom: 4,
	},
	subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
	form: { gap: 16 },
})
