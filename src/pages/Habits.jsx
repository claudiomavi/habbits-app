import { useEffect, useState } from 'react'
import {
	Alert,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native'
import { HabitsTemplate, useAuthStore, useHabitsStore } from '../autoBarrell'

const defaultForm = {
	title: '',
	difficulty: 1,
	frequency: 'daily',
	days_of_week: [],
}

export function Habits() {
	const { user } = useAuthStore()
	const { habits, loading, fetchHabits, addHabit, editHabit, removeHabit } =
		useHabitsStore()
	const [visible, setVisible] = useState(false)
	const [form, setForm] = useState(defaultForm)
	const [editing, setEditing] = useState(null)

	useEffect(() => {
		if (user?.id) fetchHabits(user.id)
	}, [user?.id])

	const openCreate = () => {
		setEditing(null)
		setForm(defaultForm)
		setVisible(true)
	}
	const openEdit = (h) => {
		setEditing(h)
		setForm({
			title: h.title || '',
			difficulty: h.difficulty || 1,
			frequency: h.frequency || 'daily',
			days_of_week: Array.isArray(h.days_of_week) ? h.days_of_week : [],
		})
		setVisible(true)
	}

	const save = async () => {
		try {
			if (!form.title?.trim()) return Alert.alert('Título requerido')
			if (editing) {
				await editHabit(editing.id, {
					title: form.title.trim(),
					difficulty: Number(form.difficulty) || 1,
					frequency: form.frequency,
					days_of_week: form.frequency === 'weekly' ? form.days_of_week : null,
				})
			} else {
				await addHabit({
					title: form.title.trim(),
					difficulty: Number(form.difficulty) || 1,
					frequency: form.frequency,
					days_of_week: form.frequency === 'weekly' ? form.days_of_week : null,
					created_by: user.id,
				})
			}
			setVisible(false)
		} catch (e) {
			console.error('save habit', e)
			Alert.alert('Error', 'No se pudo guardar el hábito')
		}
	}

	const confirmDelete = (h) => {
		Alert.alert('Eliminar hábito', `¿Eliminar "${h.title}"?`, [
			{ text: 'Cancelar', style: 'cancel' },
			{
				text: 'Eliminar',
				style: 'destructive',
				onPress: () =>
					removeHabit(h.id).catch(() => Alert.alert('Error eliminando')),
			},
		])
	}

	const toggleDow = (d) => {
		setForm((f) => {
			const set = new Set(f.days_of_week || [])
			set.has(d) ? set.delete(d) : set.add(d)
			return { ...f, days_of_week: Array.from(set).sort() }
		})
	}

	return (
		<>
			<HabitsTemplate
				habits={habits}
				loading={loading}
				onAddPress={openCreate}
				onEditPress={openEdit}
				onDeletePress={confirmDelete}
			/>

			<Modal
				visible={visible}
				transparent
				animationType="slide"
				onRequestClose={() => setVisible(false)}
			>
				<View style={styles.modalBg}>
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>
							{editing ? 'Editar hábito' : 'Nuevo hábito'}
						</Text>

						<Text style={styles.label}>Título</Text>
						<TextInput
							value={form.title}
							onChangeText={(t) => setForm((f) => ({ ...f, title: t }))}
							placeholder="Ej. Leer 15 min"
							style={styles.input}
						/>

						<Text style={styles.label}>Dificultad (1-3)</Text>
						<TextInput
							value={String(form.difficulty)}
							onChangeText={(t) =>
								setForm((f) => ({
									...f,
									difficulty: t.replace(/[^1-3]/g, '') || '1',
								}))
							}
							keyboardType="number-pad"
							style={styles.input}
						/>

						<Text style={styles.label}>Frecuencia</Text>
						<View style={styles.row}>
							{['daily', 'weekly', 'monthly'].map((opt) => (
								<Pressable
									key={opt}
									onPress={() => setForm((f) => ({ ...f, frequency: opt }))}
									style={[
										styles.chip,
										form.frequency === opt && styles.chipActive,
									]}
								>
									<Text
										style={[
											styles.chipText,
											form.frequency === opt && styles.chipTextActive,
										]}
									>
										{opt}
									</Text>
								</Pressable>
							))}
						</View>

						{form.frequency === 'weekly' && (
							<View>
								<Text style={styles.label}>
									Días de la semana (0=Dom ... 6=Sáb)
								</Text>
								<View style={styles.row}>
									{[0, 1, 2, 3, 4, 5, 6].map((d) => (
										<Pressable
											key={d}
											onPress={() => toggleDow(d)}
											style={[
												styles.chip,
												form.days_of_week?.includes(d) && styles.chipActive,
											]}
										>
											<Text
												style={[
													styles.chipText,
													form.days_of_week?.includes(d) &&
														styles.chipTextActive,
												]}
											>
												{d}
											</Text>
										</Pressable>
									))}
								</View>
							</View>
						)}

						<View
							style={[
								styles.row,
								{ justifyContent: 'flex-end', marginTop: 12 },
							]}
						>
							<Pressable
								onPress={() => setVisible(false)}
								style={[styles.btn, styles.cancel]}
							>
								<Text style={styles.btnText}>Cancelar</Text>
							</Pressable>
							<Pressable
								onPress={save}
								style={[styles.btn, styles.save]}
							>
								<Text style={styles.btnText}>Guardar</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</>
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
	chip: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 999,
		backgroundColor: '#E5E7EB',
	},
	chipActive: { backgroundColor: '#4F46E5' },
	chipText: { color: '#111827' },
	chipTextActive: { color: '#fff', fontWeight: '700' },
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
