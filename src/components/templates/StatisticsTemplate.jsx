import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import { CardContainer, GradientBackground } from '../../autoBarrell'

export function StatisticsTemplate({
	loading = false,
	fromISO,
	toISO,
	habits = [],
	perHabitStats = {},
	global = {},
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
				{loading ? (
					<View style={{ paddingVertical: 24, alignItems: 'center' }}>
						<ActivityIndicator />
					</View>
				) : (
					<>
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Resumen</Text>
							<Text style={styles.meta}>
								Programados: {global.totalScheduled ?? 0}
							</Text>
							<Text style={styles.meta}>
								Completados: {global.totalCompleted ?? 0}
							</Text>
							<Text style={styles.meta}>
								Cumplimiento:{' '}
								{Number.isFinite(global.overallPct)
									? Math.round(global.overallPct * 100) / 100
									: 0}
								%
							</Text>
						</View>

						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Por hábito</Text>
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
})
