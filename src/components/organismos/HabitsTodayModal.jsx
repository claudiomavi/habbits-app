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
	getProgressForDate,
	getProgressHistoryForHabit,
	useAuthStore,
} from '../../autoBarrell'

export function HabitsTodayModal({
	visible,
	onClose,
	todaysHabits = [],
	renderHabit,
	loading,
	todayProgress = [],
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

	const makeLocalISO = (d) => {
		const y = d.getFullYear()
		const m = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${y}-${m}-${day}`
	}

	React.useEffect(() => {
		let cancelled = false
		const calcAll = async () => {
			try {
				if (!user?.id || todaysHabits.length === 0) return
				const todayISO = makeLocalISO(new Date())
				// Usar progreso de hoy si viene por props para reactividad inmediata; si no, cargarlo
				let progressToday = Array.isArray(todayProgress) ? todayProgress : []
				if (!progressToday.length) {
					try {
						progressToday = await getProgressForDate(user.id, todayISO)
					} catch {}
				}
				const todayDoneMap = new Map(
					(progressToday || []).map((p) => [p.habit_id, !!p.completed])
				)
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
					const fmt = (d) => makeLocalISO(d)
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
					const todayCompleted = !!todayDoneMap.get(h.id)
					let value = 0
					let unit =
						h.frequency === 'weekly'
							? 'día'
							: h.frequency === 'monthly'
							? 'mes'
							: 'día'
					let cursor = new Date(today)
					// Si hoy no está completado, arrancar el cómputo desde ayer
					if (!todayCompleted) cursor.setDate(cursor.getDate() - 1)
					const debugTrace = []
					for (let i = 0; i < 365; i++) {
						// saltar días no programados
						if (!isScheduled(cursor)) {
							debugTrace.push({ i, iso: fmt(cursor), scheduled: false })
							cursor.setDate(cursor.getDate() - 1)
							continue
						}
						const iso = fmt(cursor)
						const done = completedDates.has(iso)
						debugTrace.push({ i, iso, scheduled: true, done })
						if (done) {
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
	}, [visible, user?.id, todaysHabits, todayProgress])

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
							<Text style={styles.title}>Objetivos diarios</Text>
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

const { colors, typography } = require('../../styles/theme')

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
	title: {
		flex: 1,
		fontSize: typography.size.lg,
		color: colors.black,
		fontFamily: typography.family.bold,
	},
	closeBtn: { paddingHorizontal: 8, paddingVertical: 4 },
	closeTxt: {
		fontSize: typography.size.lg,
		color: colors.gray500,
		fontFamily: typography.family.bold,
	},
})
