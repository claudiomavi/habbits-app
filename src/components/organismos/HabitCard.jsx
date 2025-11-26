import React from 'react'
import {
	Animated,
	Easing,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { DifficultyBadge } from '../moleculas/DifficultyBadge'

export function HabitCard({ habit, done, onToggle, streak, streakUnit }) {
	const [titleLayout, setTitleLayout] = React.useState({ w: 0, h: 0 })
	const checkedAnim = React.useRef(new Animated.Value(done ? 1 : 0)).current
	const lineWidthAnim = React.useRef(new Animated.Value(done ? 0 : 0)).current
	const rippleScale = React.useRef(new Animated.Value(0)).current
	const rippleOpacity = React.useRef(new Animated.Value(0)).current

	React.useEffect(() => {
		Animated.timing(checkedAnim, {
			toValue: done ? 1 : 0,
			duration: done ? 900 : 700,
			easing: done
				? Easing.bezier(0.68, -0.55, 0.265, 1.55)
				: Easing.out(Easing.cubic),
			useNativeDriver: false,
		}).start(() => {
			if (done) {
				// trigger ripple when transitioning to checked
				rippleScale.setValue(0)
				rippleOpacity.setValue(0.6)
				Animated.parallel([
					Animated.timing(rippleScale, {
						toValue: 1,
						duration: 1400,
						easing: Easing.out(Easing.quad),
						useNativeDriver: true,
					}),
					Animated.timing(rippleOpacity, {
						toValue: 0,
						duration: 1400,
						easing: Easing.out(Easing.quad),
						useNativeDriver: true,
					}),
				]).start()
			}
		})
	}, [done])

	// Animación de tachado: ancho de 0 -> título (izquierda a derecha)
	React.useEffect(() => {
		if (titleLayout.w <= 0) return
		Animated.timing(lineWidthAnim, {
			toValue: done ? titleLayout.w : 0,
			duration: 800,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: false, // width no soporta native driver
		}).start()
	}, [done, titleLayout.w])

	const fillScale = checkedAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0.3, 1],
	})
	const fillOpacity = checkedAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
	})
	const checkOpacity = checkedAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
	})
	const checkScale = checkedAnim.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0.3, 1.2, 1],
	})
	const checkRotate = checkedAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['20deg', '0deg'],
	})

	const borderColor = checkedAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [
			require('../../styles/theme').colors.gray300,
			require('../../styles/theme').colors.green,
		],
	})
	const boxBg = checkedAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [
			require('../../styles/theme').colors.white,
			require('../../styles/theme').colors.green,
		],
	})

	return (
		<View style={styles.habitCard}>
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => onToggle?.(habit)}
				style={styles.checkboxLabel}
			>
				<View style={{ flex: 1, gap: 4 }}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<View style={styles.checkboxBoxWrapper}>
							<Animated.View
								style={[
									styles.checkboxBox,
									{ borderColor, backgroundColor: boxBg },
								]}
							>
								<Animated.View
									style={[
										styles.checkboxFill,
										{ transform: [{ scale: fillScale }], opacity: fillOpacity },
									]}
								/>
								<Animated.Text
									style={[
										styles.checkmark,
										{
											opacity: checkOpacity,
											transform: [
												{ scale: checkScale },
												{ rotate: checkRotate },
											],
										},
									]}
								>
									✓
								</Animated.Text>
								<Animated.View
									pointerEvents="none"
									style={[
										styles.successRipple,
										{
											opacity: rippleOpacity,
											transform: [
												{
													scale: rippleScale.interpolate({
														inputRange: [0, 1],
														outputRange: [0.01, 1],
													}),
												},
											],
										},
									]}
								/>
							</Animated.View>
						</View>
						<View
							style={{ flex: 1, position: 'relative' }}
							onLayout={(e) =>
								setTitleLayout({
									w: e.nativeEvent.layout.width,
									h: e.nativeEvent.layout.height,
								})
							}
						>
							<Text
								style={[styles.habitTitle, done ? styles.habitTitleDone : null]}
							>
								{habit.title}
							</Text>
							<View style={{ position: 'relative', height: 0, marginTop: 0 }}>
								<Animated.View
									style={{
										position: 'absolute',
										left: 0,
										top: -10,
										height: 2,
										backgroundColor:
											require('../../styles/theme').colors.gray500,
										width: lineWidthAnim,
										transform: [],
										opacity: 1,
									}}
								/>
							</View>
						</View>
					</View>

					<View style={styles.secondLine}>
						{typeof streak === 'number' && (
							<View style={styles.streakPill}>
								<Text style={styles.streakText}>
									Racha: {streak ? streak : '-'} {streakUnit || 'día'}
									{streak === 1 ? '' : streakUnit === 'mes' ? 'es' : 's'}
								</Text>
							</View>
						)}

						{habit.reminder_time && (
							<Text style={styles.habitMeta}>⏰ {habit.reminder_time}</Text>
						)}

						<DifficultyBadge value={habit.difficulty || 1} />
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
}

const { colors, typography, radii } = require('../../styles/theme')

const styles = StyleSheet.create({
	habitCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.gray50,
		borderWidth: 2,
		borderColor: colors.gray200,
		borderRadius: radii.lg,
		padding: 12,
		gap: 12,
	},
	checkboxLabel: {
		flex: 1,
		flexDirection: 'column',
		padding: 8,
		borderRadius: radii.sm,
	},
	checkboxBoxWrapper: { marginRight: 12 },
	checkboxBox: {
		position: 'relative',
		width: 22,
		height: 22,
		borderWidth: 2,
		borderRadius: 6,
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'visible',
	},
	checkboxFill: {
		position: 'absolute',
		top: 2,
		left: 2,
		right: 2,
		bottom: 2,
		backgroundColor: colors.green,
		borderRadius: radii.xxs,
	},
	checkmark: {
		zIndex: 2,
		color: colors.white,
		fontSize: typography.size.sm,
		fontWeight: typography.weight.extrabold,
		textShadowColor: 'rgba(0,0,0,0.2)',
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 2,
	},
	successRipple: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		width: 60,
		height: 60,
		borderRadius: radii.xxl,
		backgroundColor: 'rgba(16, 185, 129, 0.4)',
		transform: [{ translateX: -30 }, { translateY: -30 }, { scale: 0.01 }],
	},
	habitTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: colors.black,
		fontFamily: typography.family.semibold,
	},
	habitTitleDone: { color: colors.gray500 },
	secondLine: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	streakPill: {
		backgroundColor: colors.yellowBg,
		marginTop: 4,
		alignSelf: 'flex-start',
		borderRadius: radii.full,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderWidth: 1,
		borderColor: colors.yellow,
	},
	streakText: {
		color: colors.yellow,
		fontSize: typography.size.xs,
		fontFamily: typography.family.extrabold,
	},
	habitMeta: {
		fontSize: typography.size.xs,
		color: colors.gray500,
		marginTop: 4,
		fontFamily: typography.family.regular,
	},
})
