import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import {
	CardContainer,
	GradientBackground,
	RangeSelector,
	SparklineGifted,
	SummaryKPI,
} from '../../autoBarrell'

export function StatisticsTemplate({
	loading = false,
	fromISO,
	toISO,
	habits = [],
	perHabitStats = {},
	global = {},
	rangeValue = '30',
	onChangeRange,
	onOpenCustom,
	dailyCounts = [],
	prevDailyCounts = [],
	activeDays = 0,
	topHabits = [],
	bottomHabit = null,
	deltaPct = 0,
	deltaActive = 0,
}) {
	const renderHabit = ({ item: h, index }) => {
		const s = perHabitStats[h.id] || {}
		const isEmpty = (s.programados ?? 0) === 0
		const pct = Number.isFinite(s.pct) ? Math.round(s.pct) : 0
		const ratio = s.programados
			? Math.min(1, Math.max(0, (s.completados ?? 0) / s.programados))
			: 0

		// color del badge según %
		let badgeColor = '#9CA3AF' // gris por defecto
		if (!isEmpty) {
			if (pct >= 80) badgeColor = '#10B981' // verde
			else if (pct >= 50) badgeColor = '#F59E0B' // ámbar
			else badgeColor = '#EF4444' // rojo
		}

		return (
			<Pressable
				style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
				onPress={() => {}}
			>
				<View style={styles.innerTopShadow} />
				<View style={styles.innerBottomShadow} />
				<View style={{ flex: 1 }}>
					<Text
						style={styles.habitTitle}
						numberOfLines={1}
					>
						{h.title}
					</Text>

					{loading ? (
						<View style={styles.habitLoadingRow}>
							<ActivityIndicator
								size="small"
								color="#6B7280"
							/>
							<Text style={styles.meta}>Calculando métricas…</Text>
						</View>
					) : isEmpty ? (
						<Text style={styles.meta}>Sin datos en este período</Text>
					) : (
						<>
							<Text style={styles.meta}>
								Actual: {s.currentStreak ?? 0} · Máx: {s.maxStreak ?? 0}
							</Text>
							<Text style={styles.meta}>
								Programados: {s.programados ?? 0} · Completados:{' '}
								{s.completados ?? 0}
							</Text>
							<View style={styles.progressBarContainer}>
								<View
									style={[styles.progressBarFill, { width: `${ratio * 100}%` }]}
								/>
							</View>
						</>
					)}
				</View>

				{!loading && !isEmpty ? (
					<View style={[styles.badge, { backgroundColor: badgeColor }]}>
						<Text style={styles.badgeText}>{pct}%</Text>
					</View>
				) : null}
			</Pressable>
		)
	}

	const Header = (
		<CardContainer>
			<View style={styles.headerRowCentered}>
				<Text style={styles.title}>Estadísticas</Text>
				<Text style={styles.subtitle}>
					{fromISO?.slice(8, 10)}-{fromISO?.slice(5, 7)} → {toISO?.slice(8, 10)}
					-{toISO?.slice(5, 7)}
				</Text>
			</View>
			<View style={{ marginTop: 8 }}>
				<RangeSelector
					value={rangeValue}
					onChange={onChangeRange}
					onOpenCustom={onOpenCustom}
				/>
			</View>
			{loading ? (
				<View style={{ paddingVertical: 24, alignItems: 'center' }}>
					<ActivityIndicator />
				</View>
			) : (
				<>
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Resumen</Text>
						<View style={styles.kpisRow}>
							<SummaryKPI
								label="Cumplimiento"
								value={`${
									Number.isFinite(global.overallPct)
										? Math.round(global.overallPct)
										: 0
								}%`}
								sublabel={`${global.totalCompleted ?? 0}/${
									global.totalScheduled ?? 0
								}`}
								delta={
									Number.isFinite(deltaPct) ? Number(deltaPct.toFixed(1)) : 0
								}
							/>
							<SummaryKPI
								label="Días activos"
								value={String(activeDays)}
								delta={deltaActive}
							/>
							<SummaryKPI
								label="Hábitos"
								value={String(habits.length)}
							/>
						</View>
						<View style={{ marginTop: 10 }}>
							<Text style={styles.sectionTitle}>Tendencia</Text>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									gap: 12,
									marginVertical: 6,
								}}
							>
								<View
									style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
								>
									<View
										style={{
											width: 10,
											height: 10,
											borderRadius: 2,
											backgroundColor: '#10B981',
										}}
									/>
									<Text style={styles.meta}>Período actual</Text>
								</View>
								<View
									style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
								>
									<View
										style={{
											width: 10,
											height: 10,
											borderRadius: 2,
											backgroundColor: '#60A5FA',
										}}
									/>
									<Text style={styles.meta}>Período anterior</Text>
								</View>
							</View>
							<SparklineGifted
								dailyCounts={dailyCounts}
								prevDailyCounts={prevDailyCounts}
								height={140}
							/>
						</View>

						<View style={{ marginTop: 12 }}>
							<Text style={styles.sectionTitle}>Insights</Text>
							<View style={styles.insightBox}>
								<Text style={styles.meta}>Top 3 hábitos</Text>
								{(topHabits || []).map((h) => (
									<View
										key={h.id}
										style={styles.insightRow}
									>
										<Text style={styles.insightTitle}>{h.title}</Text>
										<Text style={styles.insightValue}>
											{Math.round(h.pct)}%
										</Text>
									</View>
								))}
								{bottomHabit ? (
									<View style={[styles.insightRow, { marginTop: 6 }]}>
										<Text style={styles.insightTitle}>
											Oportunidad: {bottomHabit.title}
										</Text>
										<Text style={[styles.insightValue, { color: '#EF4444' }]}>
											{Math.round(bottomHabit.pct)}%
										</Text>
									</View>
								) : null}
							</View>
						</View>
					</View>
				</>
			)}
		</CardContainer>
	)

	return (
		<GradientBackground style={styles.container}>
			<FlatList
				data={habits}
				keyExtractor={(h) => h.id}
				renderItem={renderHabit}
				ListHeaderComponent={
					<>
						{Header}
						<View style={[styles.habitsCardTop, { marginBottom: -2 }]}>
							<Text style={styles.sectionTitle}>Resumen por hábito</Text>
						</View>
					</>
				}
				ListEmptyComponent={
					!loading ? (
						<CardContainer>
							<View style={{ paddingVertical: 24, alignItems: 'center' }}>
								<Text style={styles.meta}>No tienes hábitos aún</Text>
							</View>
						</CardContainer>
					) : null
				}
				contentContainerStyle={{
					gap: 0,
					paddingTop: 12,
					paddingBottom: 0,
					borderRadius: 24,
				}}
				ListFooterComponent={
					<View style={[styles.habitsCardBottom, { marginTop: -4 }]} />
				}
				ListHeaderComponentStyle={{ gap: 0 }}
				keyboardShouldPersistTaps="handled"
			/>
		</GradientBackground>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, paddingHorizontal: 16 },
	headerRowCentered: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
	},
	title: {
		fontSize: 22,
		fontWeight: '800',
		lineHeight: 26,
		color: '#111827',
		textAlign: 'center',
	},
	subtitle: { fontSize: 12, color: '#6B7280', lineHeight: 18, marginTop: 2 },
	section: { marginTop: 12 },
	habitsCardTop: {
		marginTop: 12,
		backgroundColor: '#FFFFFF',
		borderWidth: 2,
		borderColor: '#E5E7EB',
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	habitsCardBottom: {
		backgroundColor: '#FFFFFF',
		borderColor: '#E5E7EB',
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
		paddingBottom: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '800',
		lineHeight: 22,
		color: '#111827',
		marginBottom: 8,
	},
	kpisRow: { flexDirection: 'row', gap: 10 },
	row: {
		marginTop: -2,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F9FAFB',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#E5E7EB',
		paddingVertical: 12,
		paddingHorizontal: 12,
		gap: 12,
		overflow: 'hidden',
		position: 'relative',
	},
	rowPressed: {
		backgroundColor: '#e8eaed',
	},
	innerTopShadow: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: 'rgba(0,0,0,0.04)',
	},
	innerBottomShadow: {
		bottom: 0,
		left: 0,
		right: 0,
		height: 2,
		backgroundColor: 'rgba(0,0,0,0.03)',
	},
	habitTitle: {
		fontSize: 16,
		fontWeight: '700',
		lineHeight: 20,
		color: '#111827',
	},
	meta: { fontSize: 12, color: '#4B5563', lineHeight: 18, marginTop: 4 },
	insightBox: {
		backgroundColor: '#FFFFFF',
		borderWidth: 2,
		borderColor: '#E5E7EB',
		borderRadius: 16,
		padding: 12,
		marginTop: 6,
	},
	insightRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 4,
	},
	insightTitle: { fontSize: 13, color: '#374151' },
	insightValue: { fontSize: 13, color: '#10B981', fontWeight: '700' },
	habitLoadingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginTop: 4,
	},
	badge: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 999,
		alignSelf: 'flex-start',
	},
	badgeText: { color: 'white', fontWeight: '800', fontSize: 12 },
	progressBarContainer: {
		marginTop: 8,
		height: 8,
		borderRadius: 999,
		backgroundColor: '#F3F4F6',
		overflow: 'hidden',
	},
	progressBarFill: {
		height: '100%',
		backgroundColor: '#10B981',
	},
})
