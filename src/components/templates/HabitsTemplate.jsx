import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import {
	CardContainer,
	DifficultyBadge,
	GradientBackground,
} from '../../autoBarrell'

import { HabitModal } from '../organismos/HabitModal'

export function HabitsTemplate({
	habits = [],
	loading,
	onAddPress,
	onEditPress,
	onDeletePress,
	modalVisible,
	modalForm,
	setModalForm,
	modalEditing,
	onModalCancel,
	onModalSave,
}) {
	return (
		<GradientBackground style={styles.container}>
			<CardContainer>
				<View style={styles.headerRowCentered}>
					<Text style={styles.title}>Mis hábitos</Text>
				</View>
				{loading ? (
					<View style={styles.center}>
						<ActivityIndicator />
					</View>
				) : habits?.length ? (
					<FlatList
						data={habits}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<View style={styles.row}>
								<View style={{ flex: 1 }}>
									<Text style={styles.habitTitle}>{item.title}</Text>
									<Text style={styles.meta}>
										Frecuencia: {item.frequency || 'daily'}
										{Array.isArray(item.days_of_week) &&
										item.days_of_week.length
											? ` · días ${item.days_of_week.join(',')}`
											: ''}
									</Text>
								</View>
								<DifficultyBadge value={item.difficulty || 1} />
								<TouchableOpacity
									style={[styles.actionBtn, styles.edit]}
									onPress={() => onEditPress?.(item)}
								>
									<Text style={styles.actionText}>Editar</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={[styles.actionBtn, styles.delete]}
									onPress={() => onDeletePress?.(item)}
								>
									<Text style={styles.actionText}>Borrar</Text>
								</TouchableOpacity>
							</View>
						)}
						contentContainerStyle={{
							gap: 12,
							paddingVertical: 8,
							paddingHorizontal: 4,
						}}
					/>
				) : (
					<View style={[styles.center, { paddingVertical: 32 }]}>
						<Text style={styles.emptyTitle}>Aún no tienes hábitos</Text>
						<Text style={styles.emptyText}>
							Pulsa el botón + para crear tu primer hábito
						</Text>
					</View>
				)}
			</CardContainer>

			<TouchableOpacity
				accessibilityRole="button"
				accessibilityLabel="Crear hábito"
				onPress={onAddPress}
				style={styles.fab}
			>
				<Text style={styles.fabText}>+</Text>
			</TouchableOpacity>

			<HabitModal
				visible={modalVisible}
				editing={modalEditing}
				form={modalForm}
				setForm={setModalForm}
				onCancel={onModalCancel}
				onSave={onModalSave}
			/>
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
	center: { alignItems: 'center', justifyContent: 'center' },
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
	actionBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
	edit: { backgroundColor: '#4F46E5' },
	delete: { backgroundColor: '#EF4444' },
	actionText: { color: '#fff', fontWeight: '700' },
	fab: {
		position: 'absolute',
		right: 24,
		bottom: 24,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: '#4F46E5',
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 3,
	},
	fabText: { color: '#fff', fontSize: 28, lineHeight: 28, fontWeight: '700' },
})
