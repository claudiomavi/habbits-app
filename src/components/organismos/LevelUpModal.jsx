import React from 'react'
import {
	ActivityIndicator,
	Animated,
	Easing,
	Image,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native'
// NOTE: Using plain View inside modal to avoid any interference

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
	const scale = React.useRef(new Animated.Value(0.95)).current

	React.useEffect(() => {
		console.log('[LevelUpModal] effect visible->', visible)
		if (visible) {
			setInternalVisible(true)
			Animated.parallel([
				Animated.timing(backdrop, {
					toValue: 1,
					duration: 240,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
				Animated.spring(scale, {
					toValue: 1,
					useNativeDriver: true,
					friction: 8,
					tension: 60,
				}),
			]).start()
		} else if (internalVisible) {
			Animated.parallel([
				Animated.timing(backdrop, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.timing(scale, {
					toValue: 0.95,
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
			Animated.timing(scale, {
				toValue: 0.95,
				duration: 160,
				useNativeDriver: true,
			}),
		]).start(() => onClose?.())
	}

	console.log('[LevelUpModal] render', { visible, internalVisible })

	return (
		<Modal
			visible={internalVisible}
			transparent
			animationType="none"
			onRequestClose={handleClose}
			presentationStyle="overFullScreen"
			statusBarTranslucent
			hardwareAccelerated
		>
			<Pressable
				onPress={handleClose}
				style={StyleSheet.absoluteFill}
			>
				<Animated.View style={[styles.backdrop, { opacity: backdrop }]} />
			</Pressable>
			<View
				style={[
					styles.absoluteFill,
					{ justifyContent: 'center', alignItems: 'center' },
				]}
				pointerEvents="box-none"
			>
				<Animated.View style={[styles.modalCard, { transform: [{ scale }] }]}>
					<View style={{ alignItems: 'center', paddingVertical: 8 }}>
						{showCongrats && <Text style={styles.congrats}>¡Enhorabuena!</Text>}
						<Text style={styles.title}>{title}</Text>
						{!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
						{typeof level === 'number' && (
							<View style={styles.levelPill}>
								<Text style={styles.levelText}>Nivel {level}</Text>
							</View>
						)}
						<View style={{ height: 12 }} />
						{/* TEMP: strong visibility check block */}
						<View
							style={{
								width: 300,
								height: 240,
								backgroundColor: '#10B981',
								borderRadius: 16,
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>
								SUBISTE DE NIVEL
							</Text>
						</View>
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
	},
	modalCard: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		width: '90%',
		maxWidth: 420,
		zIndex: 1000,
		elevation: 20,
	},
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
