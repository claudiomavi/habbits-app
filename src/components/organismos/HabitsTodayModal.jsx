import React from 'react'
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
	Animated,
	Easing,
	TouchableWithoutFeedback,
} from 'react-native'
import { CardContainer } from '../../autoBarrell'

export function HabitsTodayModal({
	visible,
	onClose,
	todaysHabits = [],
	renderHabit,
	loading,
}) {
	const [internalVisible, setInternalVisible] = React.useState(visible)
	const backdrop = React.useRef(new Animated.Value(0)).current
	const translateY = React.useRef(new Animated.Value(60)).current

	React.useEffect(() => {
		if (visible) {
			setInternalVisible(true)
			Animated.parallel([
				Animated.timing(backdrop, { toValue: 1, duration: 220, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
				Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8, tension: 60 }),
			]).start()
		} else if (internalVisible) {
			Animated.parallel([
				Animated.timing(backdrop, { toValue: 0, duration: 180, useNativeDriver: true, easing: Easing.in(Easing.cubic) }),
				Animated.timing(translateY, { toValue: 60, duration: 180, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
			]).start(() => setInternalVisible(false))
		}
	}, [visible])

	const handleClose = () => {
		Animated.parallel([
			Animated.timing(backdrop, { toValue: 0, duration: 180, useNativeDriver: true }),
			Animated.timing(translateY, { toValue: 60, duration: 180, useNativeDriver: true }),
		]).start(() => onClose?.())
	}

	if (!internalVisible) return null

	return (
		<Modal visible transparent animationType="none" onRequestClose={handleClose}>
			<TouchableWithoutFeedback onPress={handleClose}>
				<Animated.View style={[styles.backdrop, { opacity: backdrop }]} />
			</TouchableWithoutFeedback>
			<View style={styles.absoluteFill} pointerEvents="box-none">
				<Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
					<CardContainer>
						<View style={styles.header}>
							<Text style={styles.title}>Hábitos de hoy</Text>
							<Pressable onPress={handleClose} style={styles.closeBtn} accessibilityLabel="Cerrar">
								<Text style={styles.closeTxt}>✕</Text>
							</Pressable>
						</View>
						{loading ? (
							<ActivityIndicator />
						) : (
							<FlatList
								data={todaysHabits}
								keyExtractor={(item) => item.id}
								renderItem={renderHabit}
								contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
								style={{ maxHeight: Dimensions.get('window').height * 0.6 }}
							/>
						)}
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
		backgroundColor: 'rgba(0,0,0,0.45)'
	},
	absoluteFill: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		justifyContent: 'flex-end',
	},
	sheet: {
		width: '100%',
		padding: 16,
	},
	header: { flexDirection: 'row', alignItems: 'center' },
	title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827' },
	closeBtn: { paddingHorizontal: 8, paddingVertical: 4 },
	closeTxt: { fontSize: 18, color: '#6B7280', fontWeight: '700' },
})
