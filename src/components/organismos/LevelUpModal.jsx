import React from 'react'
import {
	ActivityIndicator,
	Animated,
	Dimensions,
	Easing,
	Image,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native'
import { CardContainer } from '../../autoBarrell'

export function LevelUpModal({
	visible,
	onClose,
	level,
	imageUri,
	loadingImage = false,
	title = '¡Subiste de nivel!',
	subtitle = '',
	showCongrats = true,
}) {
	const [internalVisible, setInternalVisible] = React.useState(visible)
	const backdrop = React.useRef(new Animated.Value(0)).current
	const OFF = React.useMemo(
		() => Math.min(400, Math.round(Dimensions.get('window').height * 0.45)),
		[]
	)
	const translateY = React.useRef(new Animated.Value(OFF)).current

	React.useEffect(() => {
		if (visible) {
			setInternalVisible(true)
			Animated.parallel([
				Animated.timing(backdrop, {
					toValue: 1,
					duration: 240,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
				Animated.timing(translateY, {
					toValue: 0,
					duration: 240,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
			]).start()
		} else if (internalVisible) {
			Animated.parallel([
				Animated.timing(backdrop, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.timing(translateY, {
					toValue: OFF,
					duration: 200,
					useNativeDriver: true,
				}),
			]).start(() => setInternalVisible(false))
		}
	}, [visible])

	const handleClose = () => {
		Animated.parallel([
			Animated.timing(backdrop, {
				toValue: 0,
				duration: 160,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: 60,
				duration: 160,
				useNativeDriver: true,
			}),
		]).start(() => onClose?.())
	}

	if (!internalVisible) return null

	return (
		<Modal
			visible={internalVisible}
			transparent
			animationType="none"
			onRequestClose={handleClose}
		>
			<TouchableWithoutFeedback onPress={handleClose}>
				<Animated.View style={[styles.backdrop, { opacity: backdrop }]} />
			</TouchableWithoutFeedback>
			<View
				style={styles.absoluteFill}
				pointerEvents="box-none"
			>
				<Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
					<CardContainer>
						<View style={{ alignItems: 'center', paddingVertical: 8 }}>
							{showCongrats && (
								<Text style={styles.congrats}>¡Enhorabuena!</Text>
							)}
							<Text style={styles.title}>{title}</Text>
							{!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
							{typeof level === 'number' && (
								<View style={styles.levelPill}>
									<Text style={styles.levelText}>Nivel {level}</Text>
								</View>
							)}
							<View style={{ height: 12 }} />
							{loadingImage ? (
								<ActivityIndicator />
							) : imageUri ? (
								<Image
									source={{ uri: imageUri }}
									style={{ width: 220, height: 220 }}
									resizeMode="contain"
								/>
							) : null}
							<View style={{ height: 16 }} />
							<Pressable
								onPress={handleClose}
								style={styles.closeBtn}
								accessibilityLabel="Cerrar"
							>
								<Text style={styles.closeTxt}>Aceptar</Text>
							</Pressable>
						</View>
					</CardContainer>
				</Animated.View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	backdrop: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.45)',
	},
	absoluteFill: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		justifyContent: 'flex-end',
	},
	sheet: { width: '100%', padding: 16, zIndex: 1000, elevation: 20 },
	congrats: { fontSize: 14, color: '#059669', fontWeight: '700' },
	title: { fontSize: 18, color: '#111827', fontWeight: '800', marginTop: 4 },
	subtitle: {
		fontSize: 14,
		color: '#6B7280',
		marginTop: 4,
		textAlign: 'center',
	},
	levelPill: {
		marginTop: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: '#EEF2FF',
	},
	levelText: { color: '#4F46E5', fontWeight: '800' },
	closeBtn: {
		marginTop: 8,
		paddingHorizontal: 16,
		paddingVertical: 10,
		backgroundColor: '#4F46E5',
		borderRadius: 12,
	},
	closeTxt: { color: '#fff', fontWeight: '800' },
})
