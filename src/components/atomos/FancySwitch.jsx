import * as Haptics from 'expo-haptics'
import { useEffect, useMemo, useRef } from 'react'
import { Animated, Easing, Pressable, StyleSheet } from 'react-native'
import Svg, { Path } from 'react-native-svg'

/**
 * Props:
 * - value: boolean
 * - onValueChange: (val:boolean)=>void
 * - width?: number (default 46)
 * - height?: number (default 24)
 * - circleDiameter?: number (default 18)
 * - enableHaptics?: boolean (default true)
 * - colors?: { offBg, onBg, circleBg, effectBg }
 */
export function FancySwitch({
	value,
	onValueChange,
	width = 46,
	height = 24,
	circleDiameter = 18,
	enableHaptics = true,
	colors: colorsProp,
	disabled = false,
	style,
}) {
	const colors = useMemo(
		() => ({
			offBg: 'rgb(131,131,131)',
			onBg: 'rgb(0,218,80)',
			circleBg: '#fff',
			effectBg: '#fff',
			...colorsProp,
		}),
		[colorsProp]
	)

	const offset = (height - circleDiameter) / 2
	const maxTranslate = width - circleDiameter - offset

	const anim = useRef(new Animated.Value(value ? 1 : 0)).current

	useEffect(() => {
		Animated.timing(anim, {
			toValue: value ? 1 : 0,
			duration: 200,
			easing: Easing.bezier(0.27, 0.2, 0.25, 1.51),
			useNativeDriver: false,
		}).start()
	}, [value])

	const bgColor = anim.interpolate({
		inputRange: [0, 1],
		outputRange: [colors.offBg, colors.onBg],
	})

	const translateX = anim.interpolate({
		inputRange: [0, 1],
		outputRange: [offset, maxTranslate],
	})

	const shadow = anim.interpolate({
		inputRange: [0, 1],
		outputRange: [
			'1px 1px 2px rgba(146,146,146,0.45)',
			'-1px 1px 2px rgba(163,163,163,0.45)',
		],
	})

	const checkScale = anim
	const crossScale = Animated.subtract(1, anim)

	const handlePress = () => {
		if (disabled) return
		const next = !value
		onValueChange?.(next)
		if (enableHaptics) {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
		}
	}

	return (
		<Pressable
			onPress={handlePress}
			disabled={disabled}
			style={[style, { opacity: disabled ? 0.6 : 1 }]}
		>
			<Animated.View
				style={{
					width,
					height,
					borderRadius: 999,
					backgroundColor: bgColor,
					alignItems: 'flex-start',
					justifyContent: 'center',
				}}
			>
				{/* effect line */}
				<Animated.View
					style={{
						position: 'absolute',
						width: circleDiameter / 2,
						height: circleDiameter / 4 - 1,
						borderRadius: 1,
						left: Animated.add(
							offset,
							new Animated.Value(circleDiameter / 2 / 2)
						),
						backgroundColor: colors.effectBg,
					}}
				/>

				{/* circle */}
				<Animated.View
					style={{
						width: circleDiameter,
						height: circleDiameter,
						backgroundColor: colors.circleBg,
						borderRadius: circleDiameter / 2,
						transform: [{ translateX }],
						alignItems: 'center',
						justifyContent: 'center',
						shadowColor: '#000',
						shadowOpacity: 0.25,
						shadowRadius: 2,
						shadowOffset: { width: 0, height: 1 },
						elevation: 2,
					}}
				>
					{/* cross icon */}
					<Animated.View
						style={{ position: 'absolute', transform: [{ scale: crossScale }] }}
					>
						<Svg
							width={6}
							height={6}
							viewBox="0 0 365.696 365.696"
						>
							<Path
								fill={colors.offBg}
								d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"
							/>
						</Svg>
					</Animated.View>
					{/* check icon */}
					<Animated.View
						style={{ position: 'absolute', transform: [{ scale: checkScale }] }}
					>
						<Svg
							width={10}
							height={10}
							viewBox="0 0 24 24"
						>
							<Path
								fill={colors.onBg}
								d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
							/>
						</Svg>
					</Animated.View>
				</Animated.View>
			</Animated.View>
		</Pressable>
	)
}

const styles = StyleSheet.create({})
export default FancySwitch
