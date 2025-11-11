import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
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

	return (
		<HabitsTemplate
			habits={habits}
			loading={loading}
			onAddPress={openCreate}
			onEditPress={openEdit}
			onDeletePress={confirmDelete}
			modalVisible={visible}
			modalForm={form}
			setModalForm={setForm}
			modalEditing={editing}
			onModalCancel={() => setVisible(false)}
			onModalSave={save}
		/>
	)
}
