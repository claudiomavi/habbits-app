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

const { colors, typography, radii } = require('../../styles/theme')

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	headerRowCentered: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
	},
	title: {
		fontSize: typography.size.xl,
		fontFamily: typography.family.bold,
		color: colors.gray800,
		textAlign: 'center',
	},
	center: { alignItems: 'center', justifyContent: 'center' },
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.gray50,
		borderWidth: 2,
		borderColor: colors.gray200,
		borderRadius: radii.lg,
		padding: 12,
		gap: 12,
	},
	habitTitle: {
		fontSize: typography.size.md,
		fontFamily: typography.family.semibold,
		color: colors.black,
	},
	meta: {
		fontSize: typography.size.xs,
		color: colors.gray500,
		marginTop: 4,
	},
	actionBtn: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: radii.sm,
	},
	edit: { backgroundColor: colors.orange },
	delete: { backgroundColor: colors.red },
	actionText: { color: colors.white, fontFamily: typography.family.bold },
	fab: {
		position: 'absolute',
		right: 24,
		bottom: 24,
		width: 56,
		height: 56,
		borderRadius: radii.xxl,
		backgroundColor: colors.orange,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 3,
	},
	fabText: {
		color: colors.white,
		fontSize: typography.size.h1,
		lineHeight: 28,
		fontFamily: typography.family.bold,
	},
})
