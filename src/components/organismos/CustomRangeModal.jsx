import React from 'react'
import {
	Animated,
	Easing,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native'
import { PrimaryButton } from '../../autoBarrell'

export function CustomRangeModal({
	visible,
	onClose,
	onApply,
	initialDays = 30,
}) {
	const [days, setDays] = React.useState(initialDays)
	const [text, setText] = React.useState(String(initialDays))
	const scale = React.useRef(new Animated.Value(0.95)).current
	const opacity = React.useRef(new Animated.Value(0)).current
	React.useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(scale, {
					toValue: 1,
					duration: 220,
					easing: Easing.out(Easing.cubic),
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 1,
					duration: 220,
					easing: Easing.out(Easing.cubic),
					useNativeDriver: true,
				}),
			]).start()
		} else {
			scale.setValue(0.95)
			opacity.setValue(0)
		}
	}, [visible])
	React.useEffect(() => {
		if (visible) {
			setDays(initialDays)
			setText(String(initialDays))
		}
	}, [visible, initialDays])

	const clamp = (n) => Math.max(1, Math.min(180, n))
	const applyText = (raw) => {
		const n = clamp(Number.parseInt(raw || '0', 10) || 0)
		setDays(n)
		setText(String(n))
	}
	const bounce = React.useRef(new Animated.Value(1)).current
	const triggerBounce = () => {
		Animated.sequence([
			Animated.timing(bounce, {
				toValue: 1.08,
				duration: 90,
				easing: Easing.out(Easing.quad),
				useNativeDriver: true,
			}),
			Animated.spring(bounce, {
				toValue: 1,
				friction: 4,
				tension: 120,
				useNativeDriver: true,
			}),
		]).start()
	}
	const dec = () => {
		const n = clamp(days - 1)
		setDays(n)
		setText(String(n))
		triggerBounce()
	}
	const inc = () => {
		const n = clamp(days + 1)
		setDays(n)
		setText(String(n))
		triggerBounce()
	}

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.backdrop}>
				<View style={styles.sheet}>
					<Text style={styles.title}>Rango personalizado</Text>
					<Text style={styles.subtitle}>
						Selecciona cantidad de días (1 - 180)
					</Text>

					<View style={styles.stepperRow}>
						<Pressable
							style={[styles.stepBtn, styles.stepMinus]}
							onPress={dec}
						>
							<Text style={styles.stepText}>−</Text>
						</Pressable>
						<View style={styles.daysBox}>
							<Animated.View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									gap: 8,
									transform: [{ scale: bounce }],
								}}
							>
								<TextInput
									style={styles.input}
									keyboardType="number-pad"
									value={text}
									onChangeText={(v) => setText(v.replace(/[^0-9]/g, ''))}
									onBlur={() => applyText(text)}
									returnKeyType="done"
									maxLength={3}
								/>
								<Text style={styles.daysSuffix}>días</Text>
							</Animated.View>
						</View>
						<Pressable
							style={[styles.stepBtn, styles.stepPlus]}
							onPress={inc}
						>
							<Text style={styles.stepText}>＋</Text>
						</Pressable>
					</View>
					<View style={{ height: 12 }} />
					<View style={{ flexDirection: 'row', gap: 10 }}>
						<View style={{ flex: 1 }}>
							<PrimaryButton
								title="Cancelar"
								onPress={onClose}
							/>
						</View>
						<View style={{ flex: 1 }}>
							<PrimaryButton
								title="Aplicar"
								onPress={() => {
									const n = Math.max(
										1,
										Math.min(180, parseInt(text || '0', 10) || 0)
									)
									setDays(n)
									setText(String(n))
									onApply?.(n)
								}}
							/>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
	sheet: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		width: '100%',
		maxWidth: 400,
	},
	title: { fontSize: 18, fontWeight: '700', color: '#111827' },
	subtitle: { fontSize: 12, color: '#6B7280', marginTop: 4 },
	stepperRow: {
		gap: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 16,
	},
	stepBtn: {
		width: 56,
		height: 56,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 2,
		borderColor: '#E5E7EB',
		backgroundColor: '#F9FAFB',
	},
	stepMinus: {},
	stepPlus: {},
	stepText: { fontSize: 28, color: '#111827', fontWeight: '700' },
	daysBox: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#E5E7EB',
		backgroundColor: '#F3F4F6',
	},
	input: {
		minWidth: 64,
		textAlign: 'center',
		fontSize: 18,
		fontWeight: '700',
		color: '#111827',
		paddingVertical: 6,
		paddingHorizontal: 10,
		backgroundColor: '#fff',
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#E5E7EB',
	},
	daysSuffix: { fontSize: 16, color: '#6B7280', marginLeft: 4 },
})
