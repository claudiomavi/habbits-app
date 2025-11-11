import {
	Alert,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native'
import { DaysOfWeekSelector } from '../moleculas/DaysOfWeekSelector'
import { DifficultySelector } from '../moleculas/DifficultySelector'
import { FrequencySelector } from '../moleculas/FrequencySelector'

export function HabitModal({
	visible,
	editing,
	form,
	setForm,
	onCancel,
	onSave,
}) {
	const setTitle = (t) => setForm((f) => ({ ...f, title: t }))
	const setDifficulty = (d) => setForm((f) => ({ ...f, difficulty: d }))
	const setFrequency = (fr) =>
		setForm((f) => ({
			...f,
			frequency: fr,
			days_of_week: fr === 'weekly' ? f.days_of_week || [] : [],
		}))
	const setDays = (arr) => setForm((f) => ({ ...f, days_of_week: arr }))

	const handleSave = () => {
		if (
			form.frequency === 'weekly' &&
			(!Array.isArray(form.days_of_week) || form.days_of_week.length === 0)
		) {
			return Alert.alert('Selecciona al menos un día de la semana')
		}
		onSave?.()
	}

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onCancel}
		>
			<View style={styles.modalBg}>
				<View style={styles.modalCard}>
					<Text style={styles.modalTitle}>
						{editing ? 'Editar hábito' : 'Nuevo hábito'}
					</Text>

					<Text style={styles.label}>Título</Text>
					<TextInput
						value={form.title}
						onChangeText={setTitle}
						placeholder="Ej. Leer 15 min"
						style={styles.input}
					/>

					<DifficultySelector
						value={Number(form.difficulty) || 1}
						onChange={setDifficulty}
					/>
					<FrequencySelector
						value={form.frequency}
						onChange={setFrequency}
					/>
					{form.frequency === 'weekly' && (
						<DaysOfWeekSelector
							value={form.days_of_week || []}
							onChange={setDays}
						/>
					)}

					<View
						style={[styles.row, { justifyContent: 'flex-end', marginTop: 12 }]}
					>
						<Pressable
							onPress={onCancel}
							style={[styles.btn, styles.cancel]}
						>
							<Text style={styles.btnText}>Cancelar</Text>
						</Pressable>
						<Pressable
							onPress={handleSave}
							style={[styles.btn, styles.save]}
						>
							<Text style={styles.btnText}>Guardar</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalBg: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 16,
	},
	modalCard: {
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		width: '100%',
	},
	modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
	label: { marginTop: 8, fontWeight: '600', color: '#111827' },
	input: {
		borderWidth: 1,
		borderColor: '#E5E7EB',
		borderRadius: 8,
		padding: 10,
		marginTop: 4,
	},
	row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
	btn: {
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 10,
		marginLeft: 8,
	},
	cancel: { backgroundColor: '#6B7280' },
	save: { backgroundColor: '#10B981' },
	btnText: { color: '#fff', fontWeight: '700' },
})
