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
			useNativeDriver: true,
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
		outputRange: ['#D1D5DB', '#10b981'],
	})
	const boxBg = checkedAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ['#FFFFFF', '#10b981'],
	})

	return (
		<View style={styles.habitCard}>
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => onToggle?.(habit)}
				style={styles.checkboxLabel}
			>
				<View style={{ flex: 1 }}>
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
										backgroundColor: '#6b7280',
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
									Racha: {streak} {streakUnit || 'día'}
									{streak === 1 ? '' : 's'}
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

const styles = StyleSheet.create({
	habitCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F9FAFB',
		borderWidth: 2,
		borderColor: '#E5E7EB',
		borderRadius: 16,
		padding: 12,
		gap: 12,
	},
	checkboxLabel: {
		flex: 1,
		flexDirection: 'column',
		padding: 8,
		borderRadius: 8,
	},
	checkboxBoxWrapper: { marginRight: 12 },
	checkboxBox: {
		position: 'relative',
		width: 22,
		height: 22,
		borderWidth: 2,
		borderRadius: 6,
		backgroundColor: '#ffffff',
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
		backgroundColor: '#10b981',
		borderRadius: 4,
	},
	checkmark: {
		zIndex: 2,
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '900',
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
		borderRadius: 30,
		backgroundColor: 'rgba(16, 185, 129, 0.4)',
		transform: [{ translateX: -30 }, { translateY: -30 }, { scale: 0.01 }],
	},
	habitTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
	habitTitleDone: { color: '#6B7280' },
	secondLine: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	streakPill: {
		marginTop: 4,
		alignSelf: 'flex-start',
		backgroundColor: '#EEF2FF',
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	streakText: { color: '#4F46E5', fontWeight: '800', fontSize: 12 },
	habitMeta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
})
