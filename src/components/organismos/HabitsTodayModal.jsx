import React from 'react'
import {
	ActivityIndicator,
	Animated,
	Dimensions,
	Easing,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native'
import {
	CardContainer,
	getProgressHistoryForHabit,
	useAuthStore,
} from '../../autoBarrell'

export function HabitsTodayModal({
	visible,
	onClose,
	todaysHabits = [],
	renderHabit,
	loading,
}) {
	const [internalVisible, setInternalVisible] = React.useState(visible)
	const backdrop = React.useRef(new Animated.Value(0)).current
	const OFF = React.useMemo(
		() => Math.min(400, Math.round(Dimensions.get('window').height * 0.45)),
		[]
	)
	const translateY = React.useRef(new Animated.Value(OFF)).current
	const contentOpacity = React.useRef(new Animated.Value(1)).current

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
					duration: 240,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
				Animated.timing(translateY, {
					toValue: OFF,
					duration: 240,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
			]).start(() => setInternalVisible(false))
		}
	}, [visible])

	const handleClose = () => {
		Animated.parallel([
			Animated.timing(backdrop, {
				toValue: 0,
				duration: 180,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: 60,
				duration: 180,
				useNativeDriver: true,
			}),
		]).start(() => onClose?.())
	}

	const { user } = useAuthStore()
	const [streaks, setStreaks] = React.useState({})

	React.useEffect(() => {
		let cancelled = false
		const calcAll = async () => {
			try {
				if (!user?.id || todaysHabits.length === 0) return
				const todayISO = new Date().toISOString().slice(0, 10)
				const results = {}
				for (const h of todaysHabits) {
					// obtener hasta 365 días de historial para cómputos por día/semana/mes
					let history = []
					try {
						history = await getProgressHistoryForHabit(
							user.id,
							h.id,
							todayISO,
							365
						)
					} catch {}
					const completedDates = new Set(
						Array.isArray(history)
							? history.filter((r) => r.completed && r.date).map((r) => r.date)
							: []
					)
					const today = new Date(todayISO)
					const fmt = (d) => d.toISOString().slice(0, 10)
					const isScheduled = (date) => {
						if (h.frequency === 'weekly') {
							const wdSun0 = date.getDay()
							const wdMon0 = (wdSun0 + 6) % 7
							const days = Array.isArray(h.days_of_week)
								? h.days_of_week.map(Number)
								: []
							if (days.length === 0) return true
							return days.includes(wdMon0)
						}
						if (h.frequency === 'monthly') {
							const dom = date.getDate()
							const wanted = h.day_of_month || 1
							return dom === wanted
						}
						return true
					}
					let value = 0
					let unit =
						h.frequency === 'weekly'
							? 'día'
							: h.frequency === 'monthly'
							? 'mes'
							: 'día'
					let cursor = new Date(today)
					for (let i = 0; i < 365; i++) {
						// saltar días no programados
						if (!isScheduled(cursor)) {
							cursor.setDate(cursor.getDate() - 1)
							continue
						}
						if (completedDates.has(fmt(cursor))) {
							value += 1
							cursor.setDate(cursor.getDate() - 1)
						} else {
							break
						}
					}
					results[h.id] = { value, unit }
				}
				if (!cancelled) {
					setStreaks(results)
				}
			} catch (e) {
				if (!cancelled) setStreaks({})
			}
		}
		if (visible) calcAll()
		return () => {
			cancelled = true
		}
	}, [visible, user?.id, todaysHabits])

	if (!internalVisible) return null

	return (
		<Modal
			visible
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
						<View style={styles.header}>
							<Text style={styles.title}>Hábitos de hoy</Text>
							<Pressable
								onPress={handleClose}
								style={styles.closeBtn}
								accessibilityLabel="Cerrar"
							>
								<Text style={styles.closeTxt}>✕</Text>
							</Pressable>
						</View>
						{loading ? (
							<ActivityIndicator />
						) : (
							<FlatList
								data={todaysHabits}
								keyExtractor={(item) => item.id}
								renderItem={({ item }) => {
									const s = streaks[item.id]
									return renderHabit({
										item,
										streak: typeof s?.value === 'number' ? s.value : 0,
										streakUnit:
											s?.unit ||
											(item.frequency === 'weekly'
												? 'día'
												: item.frequency === 'monthly'
												? 'mes'
												: 'día'),
									})
								}}
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
	sheet: {
		width: '100%',
		padding: 16,
	},
	header: { flexDirection: 'row', alignItems: 'center' },
	title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827' },
	closeBtn: { paddingHorizontal: 8, paddingVertical: 4 },
	closeTxt: { fontSize: 18, color: '#6B7280', fontWeight: '700' },
})
