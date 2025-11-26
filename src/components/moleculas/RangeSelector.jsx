import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import {
	Animated,
	Easing,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native'

export function RangeSelector({ value = '30', onChange, onOpenCustom }) {
	// value can be '7' | '30' | 'custom'
	const anim = React.useRef(new Animated.Value(0)).current
	React.useEffect(() => {
		Animated.timing(anim, {
			toValue: 1,
			duration: 220,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: true,
		}).start(() => anim.setValue(0))
	}, [value])

	const items = [
		{ key: '7', label: '7 días' },
		{ key: '30', label: '30 días' },
		{ key: 'custom', label: 'Custom' },
	]
	return (
		<View style={styles.wrapper}>
			{items.map((it) => {
				const selected = value === it.key
				const scale = anim.interpolate({
					inputRange: [0, 1],
					outputRange: [1, selected ? 1.06 : 1],
				})
				const content = (
					<View style={[styles.pill, selected && styles.pillSelected]}>
						{selected ? (
							<LinearGradient
								colors={require('../../styles/theme').gradients.cta}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={styles.gradientBg}
							>
								<Text style={[styles.label, styles.labelSelected]}>
									{it.label}
								</Text>
							</LinearGradient>
						) : (
							<Text style={styles.label}>{it.label}</Text>
						)}
					</View>
				)
				const onPress = () => {
					if (it.key === 'custom') onOpenCustom?.()
					else onChange?.(it.key)
				}
				return (
					<Pressable
						key={it.key}
						onPress={onPress}
						style={{ flex: 1 }}
					>
						<Animated.View style={{ transform: [{ scale }] }}>
							{content}
						</Animated.View>
					</Pressable>
				)
			})}
		</View>
	)
}

const { typography, radii, colors } = require('../../styles/theme')

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		gap: 8,
		backgroundColor: colors.gray100,
		padding: 6,
		borderRadius: radii.lg,
		borderWidth: 2,
		borderColor: colors.gray200,
		alignItems: 'center',
	},
	pill: {
		borderRadius: radii.md,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
	gradientBg: { padding: 10, borderRadius: radii.md },
	label: {
		fontFamily: typography.family.semibold,
		textAlign: 'center',
		paddingVertical: 10,
		color: colors.gray700,
	},
	labelSelected: { color: colors.white },
})
