import { LinearGradient } from 'expo-linear-gradient'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

export function AuthTemplate({
	title,
	subtitle,
	progressWidth = '40%',
	children,
	footer,
	emojis = ['🏆', '⚡', '🎯', '🔥'],
}) {
	return (
		<LinearGradient
			colors={require('../../styles/theme').gradients.backgroundSoft}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
			locations={[0, 0.85, 1]}
		>
			<View
				style={styles.decorativeContainer}
				pointerEvents="none"
			>
				<Text style={[styles.floatingEmoji, { top: 60, left: 30 }]}>
					{emojis[0]}
				</Text>
				<Text style={[styles.floatingEmoji, { top: 120, right: 40 }]}>
					{emojis[1]}
				</Text>
				<Text style={[styles.floatingEmoji, { bottom: 180, left: 50 }]}>
					{emojis[2]}
				</Text>
				<Text style={[styles.floatingEmoji, { bottom: 100, right: 30 }]}>
					{emojis[3]}
				</Text>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				bounces={false}
			>
				<View style={styles.card}>
					<View style={styles.progressBarContainer}>
						<LinearGradient
							colors={require('../../styles/theme').gradients.accent}
							style={[styles.progressFill, { width: progressWidth }]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
					</View>

					<View style={styles.logoContainer}>
						<LinearGradient
							colors={require('../../styles/theme').gradients.cta}
							style={styles.logo}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
						>
							<View style={styles.logoInner}>
								<View style={styles.bar1} />
								<View style={styles.bar2} />
								<View style={styles.bar3} />
							</View>
						</LinearGradient>
						<Text style={styles.title}>{title}</Text>
						{subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
					</View>

					<View style={styles.form}>{children}</View>
					{footer}
				</View>
			</ScrollView>
		</LinearGradient>
	)
}

const { colors, radii, shadows, typography } = require('../../styles/theme')
const styles = StyleSheet.create({
	container: { flex: 1 },
	decorativeContainer: { position: 'absolute', width: '100%', height: '100%' },
	floatingEmoji: {
		position: 'absolute',
		fontSize: typography.size.xxxl,
		opacity: 0.2,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingVertical: 40,
	},
	card: {
		backgroundColor: colors.white,
		borderRadius: radii.xxl,
		padding: 32,
		...shadows.soft,
		overflow: 'hidden',
	},
	progressBarContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 4,
		backgroundColor: colors.gray200,
		borderTopLeftRadius: radii.xxl,
		borderTopRightRadius: radii.xxl,
	},
	progressFill: { height: '100%' },
	logoContainer: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
	logo: {
		width: 72,
		height: 72,
		borderRadius: radii.xl,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		shadowColor: colors.orange,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	logoInner: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
	bar1: {
		width: 6,
		height: 24,
		backgroundColor: colors.white,
		borderRadius: radii.xxs,
	},
	bar2: {
		width: 6,
		height: 18,
		backgroundColor: colors.white,
		borderRadius: radii.xxs,
		marginTop: 6,
	},
	bar3: {
		width: 6,
		height: 30,
		backgroundColor: colors.white,
		borderRadius: radii.xxs,
	},
	title: {
		fontSize: typography.size.xxl,
		fontFamily: typography.family.bold,
		color: colors.black,
	},
	subtitle: {
		fontSize: typography.size.sm,
		color: colors.gray500,
		marginTop: 4,
	},
	form: { gap: 16 },
})
