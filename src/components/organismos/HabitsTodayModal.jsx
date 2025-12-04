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
	getProgressHistoryForHabits,
	useAuthStore,
	useUsersStore,
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
	const { profile } = useUsersStore()
	const [streaks, setStreaks] = React.useState({})

	// IDs estables para consultas
	const actorId = React.useMemo(
		() => profile?.character_id || user?.id,
		[profile?.character_id, user?.id]
	)
	const idsForQueries = React.useMemo(
		() => Array.from(new Set([actorId, user?.id].filter(Boolean))),
		[actorId, user?.id]
	)
	const habitIdsKey = React.useMemo(
		() => JSON.stringify((todaysHabits || []).map((h) => h.id).sort()),
		[todaysHabits]
	)
	const lastRunKeyRef = React.useRef('')
	const inFlightRef = React.useRef(false)

	const makeLocalISO = (d) => {
		const y = d.getFullYear()
		const m = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${y}-${m}-${day}`
	}

	React.useEffect(() => {
		let cancelled = false
		// Pequeño debounce y guard contra reentradas
		const todayISO = makeLocalISO(new Date())
		const runKey = `${todayISO}|${habitIdsKey}|${JSON.stringify(idsForQueries)}`
		if (!visible || !user?.id || !actorId || (todaysHabits || []).length === 0) return
		if (lastRunKeyRef.current === runKey || inFlightRef.current) return
		lastRunKeyRef.current = runKey
		inFlightRef.current = true

		const calcAll = async () => {
			try {
				let progressToday = Array.isArray(todayProgress) ? todayProgress : []
				if (!progressToday.length) {
					try {
						progressToday = await getProgressForDate(idsForQueries, todayISO)
					} catch {}
				}
				const todayDoneMap = new Map(
					(progressToday || []).map((p) => [p.habit_id, !!p.completed])
				)
				let historyBulk = []
				try {
					const habitIds = JSON.parse(habitIdsKey)
					if (Array.isArray(habitIds) && habitIds.length) {
						historyBulk = await getProgressHistoryForHabits(
							idsForQueries,
							habitIds,
							todayISO,
							730
						)
					}
				} catch {}
				const historyByHabit = new Map()
				for (const r of historyBulk || []) {
					if (!historyByHabit.has(r.habit_id)) historyByHabit.set(r.habit_id, [])
					historyByHabit.get(r.habit_id).push(r)
				}
				const results = {}
				const fmt = (d) => {
					const y = d.getFullYear()
					const m = String(d.getMonth() + 1).padStart(2, '0')
					const day = String(d.getDate()).padStart(2, '0')
					return `${y}-${m}-${day}`
				}
				for (const h of todaysHabits || []) {
					const history = historyByHabit.get(h.id) || []
					const completedDates = new Set(
						Array.isArray(history)
							? history.filter((r) => r.completed && r.date).map((r) => r.date)
							: []
					)
					const today = new Date(todayISO)
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
					let unit = h.frequency === 'weekly' ? 'día' : h.frequency === 'monthly' ? 'mes' : 'día'
					let cursor = new Date(today)
					if (!todayCompleted) cursor.setDate(cursor.getDate() - 1)
					for (let i = 0; i < 730; i++) {
						if (!isScheduled(cursor)) { cursor.setDate(cursor.getDate() - 1); continue }
						const iso = fmt(cursor)
						const done = completedDates.has(iso)
						if (done) { value += 1; cursor.setDate(cursor.getDate() - 1) } else { break }
					}
					results[h.id] = { value, unit }
				}
				if (!cancelled) setStreaks(results)
			} catch (e) {
				if (!cancelled) setStreaks({})
			} finally {
				inFlightRef.current = false
			}
		}
		const t = setTimeout(() => { if (!cancelled) calcAll() }, 150)
		return () => { cancelled = true; clearTimeout(t) }
	}, [visible, user?.id, actorId, habitIdsKey, todayProgress, idsForQueries])

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
