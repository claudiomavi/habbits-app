import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import {
	CardContainer,
	GradientBackground,
	RangeSelector,
	Sparkline,
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
	activeDays = 0,
	topHabits = [],
	bottomHabit = null,
	deltaPct = 0,
	deltaActive = 0,
}) {
	return (
		<GradientBackground style={styles.container}>
			<CardContainer>
				<View style={styles.headerRowCentered}>
					<Text style={styles.title}>Estadísticas</Text>
					<Text style={styles.subtitle}>
						{fromISO} → {toISO}
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
									deltaSuffix=""
								/>
								<SummaryKPI
									label="Hábitos"
									value={String(habits.length)}
								/>
							</View>
							<View style={{ marginTop: 10 }}>
								<Text style={styles.sectionTitle}>Tendencia</Text>
								<Sparkline
									data={dailyCounts.map((d) => d.completedCount)}
									height={44}
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

						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Resumen por hábito</Text>
							<FlatList
								data={habits}
								keyExtractor={(h) => h.id}
								renderItem={({ item: h }) => {
									const s = perHabitStats[h.id] || {}
									return (
										<View style={styles.row}>
											<View style={{ flex: 1 }}>
												<Text style={styles.habitTitle}>{h.title}</Text>
												<Text style={styles.meta}>
													Actual: {s.currentStreak ?? 0} · Máx:{' '}
													{s.maxStreak ?? 0}
												</Text>
												<Text style={styles.meta}>
													Programados: {s.programados ?? 0} · Completados:{' '}
													{s.completados ?? 0} · %:{' '}
													{Number.isFinite(s.pct)
														? Math.round(s.pct * 100) / 100
														: 0}
													%
												</Text>
											</View>
										</View>
									)
								}}
								contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
							/>
						</View>
					</>
				)}
			</CardContainer>
		</GradientBackground>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	headerRowCentered: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
	},
	title: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1F2937',
		textAlign: 'center',
	},
	subtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
	section: { marginTop: 10 },
	sectionTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#111827',
		marginBottom: 6,
	},
	kpisRow: { flexDirection: 'row', gap: 10 },
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F9FAFB',
		borderWidth: 2,
		borderColor: '#E5E7EB',
		borderRadius: 16,
		padding: 12,
		gap: 12,
	},
	habitTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
	meta: { fontSize: 12, color: '#6B7280', marginTop: 4 },
	insightBox: {
		backgroundColor: '#F9FAFB',
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
})
