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
		const theme = require('../../styles/theme')
		let badgeColor = theme.colors.gray400 // gris por defecto
		if (!isEmpty) {
			if (pct >= 80) badgeColor = theme.colors.green // verde
			else if (pct >= 50) badgeColor = theme.colors.yellow // amarillo
			else badgeColor = theme.colors.red // rojo
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
								color={require('../../styles/theme').colors.gray500}
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
											backgroundColor:
												require('../../styles/theme').colors.yellow,
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
										<Text
											style={[
												styles.insightValue,
												{ color: require('../../styles/theme').colors.red },
											]}
										>
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

const { colors, typography, radii } = require('../../styles/theme')

const styles = StyleSheet.create({
	container: { flex: 1, paddingHorizontal: 16 },
	headerRowCentered: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
	},
	title: {
		fontSize: typography.size.h2,
		fontFamily: typography.family.extrabold,
		lineHeight: 26,
		color: colors.black,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: typography.size.xs,
		color: colors.gray500,
		lineHeight: 18,
		marginTop: 2,
		fontFamily: typography.family.regular,
	},
	section: { marginTop: 12 },
	habitsCardTop: {
		marginTop: 12,
		backgroundColor: colors.white,
		borderWidth: 2,
		borderColor: colors.gray200,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		paddingVertical: 8,
		paddingHorizontal: 12,
	},
	habitsCardBottom: {
		backgroundColor: colors.white,
		borderColor: colors.gray200,
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
		paddingBottom: 12,
	},
	sectionTitle: {
		fontSize: typography.size.lg,
		fontFamily: typography.family.extrabold,
		lineHeight: 22,
		color: colors.black,
		marginBottom: 8,
	},
	kpisRow: { flexDirection: 'row', gap: 10 },
	row: {
		marginTop: -2,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.gray50,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: colors.gray200,
		paddingVertical: 12,
		paddingHorizontal: 12,
		gap: 12,
		overflow: 'hidden',
		position: 'relative',
	},
	rowPressed: {
		backgroundColor: colors.gray200,
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
		fontSize: typography.size.md,
		fontFamily: typography.family.bold,
		lineHeight: 20,
		color: colors.black,
	},
	meta: {
		fontSize: typography.size.xs,
		color: colors.gray600,
		lineHeight: 18,
		marginTop: 4,
	},
	insightBox: {
		backgroundColor: colors.white,
		borderWidth: 2,
		borderColor: colors.gray200,
		borderRadius: radii.lg,
		padding: 12,
		marginTop: 6,
	},
	insightRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 4,
	},
	insightTitle: { fontSize: typography.size.sm, color: colors.gray700 },
	insightValue: {
		fontSize: typography.size.sm,
		color: colors.green,
		fontFamily: typography.family.bold,
	},
	habitLoadingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		marginTop: 4,
	},
	badge: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: radii.full,
		alignSelf: 'flex-start',
	},
	badgeText: {
		color: 'white',
		fontFamily: typography.family.extrabold,
		fontSize: typography.size.xs,
	},
	progressBarContainer: {
		marginTop: 8,
		height: 8,
		borderRadius: radii.full,
		backgroundColor: colors.gray100,
		overflow: 'hidden',
	},
	progressBarFill: {
		height: '100%',
		backgroundColor: colors.green,
	},
})
