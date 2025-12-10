import {
	CardContainer,
	createHabit,
	deleteHabit,
	getProgressForDate,
	getHabitsByGroup,
	GradientBackground,
	HabitCard,
	HabitModal,
	listGroupMembers,
	upsertProgress,
	useAuthStore,
	useUsersStore,
} from '../../autoBarrell'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'

export function GroupHabitsTab({ route }) {
	const { groupId } = route.params || {}
	const { user } = useAuthStore()
	const { optimisticUpdateXp } = useUsersStore()
	const qc = useQueryClient()

	const [visible, setVisible] = useState(false)
	const [form, setForm] = useState({
		title: '',
		difficulty: 1,
		frequency: 'daily',
		days_of_week: [],
		day_of_month: 1,
	})
	const [editing, setEditing] = useState(null)
	const [myRole, setMyRole] = useState(false)

	useEffect(() => {
		let mounted = true
		const loadRole = async () => {
			try {
				const members = await listGroupMembers(groupId)
				const mine = members.find((m) => m.user_id === user?.id)
				if (mounted) setMyRole(mine?.role || null)
			} catch {}
		}
		if (groupId && user?.id) loadRole()
		return () => {
			mounted = false
		}
	}, [groupId, user?.id])

	const canManage = myRole === 'owner' || myRole === 'admin'

	const makeLocalISO = (d) => {
		const y = d.getFullYear()
		const m = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${y}-${m}-${day}`
	}
	const todayISO = makeLocalISO(new Date())

	const { data: habits = [], isLoading: habitsLoading } = useQuery({
		queryKey: ['group_habits', groupId],
		queryFn: () => getHabitsByGroup(groupId),
		enabled: !!groupId,
	})

	const { data: progress = [], isLoading: progressLoading } = useQuery({
		queryKey: ['progress', user?.id, todayISO],
		queryFn: () => getProgressForDate(user?.id, todayISO),
		enabled: !!user?.id,
		staleTime: 30_000,
		gcTime: 5 * 60_000,
	})

	const progressMap = useMemo(() => {
		const map = new Map()
		for (const p of progress) map.set(p.habit_id, p)
		return map
	}, [progress])

	const openCreate = () => {
		setEditing(null)
		setForm({
			title: '',
			difficulty: 1,
			frequency: 'daily',
			days_of_week: [],
			day_of_month: 1,
		})
		if ((habits || []).length >= 5) {
			Alert.alert('Límite alcanzado', 'Máximo 5 hábitos por grupo')
			return
		}
		setVisible(true)
	}
	const openEdit = (h) => {
		setEditing(h)
		setForm({
			title: h.title || '',
			difficulty: h.difficulty || 1,
			frequency: h.frequency || 'daily',
			days_of_week: Array.isArray(h.days_of_week) ? h.days_of_week : [],
			day_of_month: h.day_of_month || 1,
		})
		setVisible(true)
	}

	const onDelete = (h) => {
		Alert.alert('Eliminar hábito', `¿Eliminar "${h.title}"?`, [
			{ text: 'Cancelar', style: 'cancel' },
			{
				text: 'Eliminar',
				style: 'destructive',
				onPress: async () => {
					try {
						await deleteHabit(h.id)
						await qc.invalidateQueries({ queryKey: ['group_habits', groupId] })
					} catch (e) {
						Alert.alert('Error', 'No se pudo eliminar')
					}
				},
			},
		])
	}

	const save = async () => {
		try {
			if (!form.title?.trim()) return Alert.alert('Título requerido')
			if (editing) {
				// reutiliza updateHabit
				const { updateHabit } = require('../../autoBarrell')
				await updateHabit(editing.id, {
					title: form.title.trim(),
					difficulty: Number(form.difficulty) || 1,
					frequency: form.frequency,
					days_of_week: form.frequency === 'weekly' ? form.days_of_week : null,
					day_of_month:
						form.frequency === 'monthly'
							? Number(form.day_of_month) || 1
							: null,
				})
			} else {
				if ((habits || []).length >= 5)
					return Alert.alert('Límite alcanzado', 'Máximo 5 hábitos por grupo')
				await createHabit({
					title: form.title.trim(),
					difficulty: Number(form.difficulty) || 1,
					frequency: form.frequency,
					days_of_week: form.frequency === 'weekly' ? form.days_of_week : null,
					day_of_month:
						form.frequency === 'monthly'
							? Number(form.day_of_month) || 1
							: null,
					group_id: groupId,
					created_by: user?.id,
				})
			}
			setVisible(false)
			await qc.invalidateQueries({ queryKey: ['group_habits', groupId] })
		} catch (e) {
			console.error('save group habit', e)
			Alert.alert('Error', 'No se pudo guardar el hábito')
		}
	}

	const toggleMutation = useMutation({
		onMutate: async ({ habit, desired }) => {
			await qc.cancelQueries({
				queryKey: ['progress', user?.id, todayISO],
			})
			const previous = qc.getQueryData(['progress', user?.id, todayISO]) || []
			const cached = Array.isArray(previous) ? previous : []
			const existing = cached.find((p) => p.habit_id === habit.id)
			const newCompleted =
				typeof desired === 'boolean' ? desired : !(existing?.completed ?? false)
			const baseXP = 10
			const earned = baseXP * (habit.difficulty || 1)
			const deltaXp = newCompleted
				? Math.round(earned)
				: -(existing?.xp_awarded || 0)
			const next = (() => {
				const copy = [...cached]
				const idx = copy.findIndex((p) => p.habit_id === habit.id)
				if (idx >= 0) {
					copy[idx] = {
						...copy[idx],
						completed: newCompleted,
						xp_awarded: newCompleted ? Math.round(earned) : 0,
					}
				} else {
					copy.push({
						id: `tmp_${habit.id}_${todayISO}`,
						habit_id: habit.id,
						user_id: user?.id,
						group_id: groupId,
						date: todayISO,
						completed: newCompleted,
						xp_awarded: newCompleted ? Math.round(earned) : 0,
					})
				}
				return copy
			})()
			qc.setQueryData(['progress', user?.id, todayISO], next)
			try {
				optimisticUpdateXp(deltaXp)
			} catch {}
			return { previous }
		},
		mutationFn: async ({ habit, desired }) => {
			// servidor
			const cached = qc.getQueryData(['progress', user?.id, todayISO]) || []
			const existing = Array.isArray(cached)
				? cached.find((p) => p.habit_id === habit.id)
				: undefined
			const newCompleted =
				typeof desired === 'boolean' ? desired : !(existing?.completed ?? false)
			const baseXP = 10
			const earned = baseXP * (habit.difficulty || 1)
			const res = await upsertProgress({
				habit_id: habit.id,
				user_id: user?.id,
				dateISO: todayISO,
				completed: newCompleted,
				xp_awarded: newCompleted ? Math.round(earned) : 0,
				client_awarded: existing?.xp_awarded || 0,
			})
			return res
		},
		onError: (_e, _vars, ctx) => {
			if (ctx?.previous)
				qc.setQueryData(['progress', user?.id, todayISO], ctx.previous)
		},
		onSettled: () => {
			qc.invalidateQueries({
				queryKey: ['group_progress', groupId, user?.id, todayISO],
			})
		},
	})

	const renderRow = ({ item }) => {
		const done = !!progressMap.get(item.id)?.completed
		return (
			<View style={styles.row}>
				<View style={{ flex: 1 }}>
					<HabitCard
						habit={item}
						done={done}
						canManage={canManage}
						onEdit={openEdit}
						onDelete={onDelete}
						onToggle={() =>
							toggleMutation.mutate({ habit: item, desired: !done })
						}
					/>
				</View>
			</View>
		)
	}

	return (
		<GradientBackground
			style={{
				paddingTop: 0,
				paddingBottom: 16,
				paddingHorizontal: 16,
			}}
		>
			<CardContainer>
				<View style={styles.headerRowCentered}>
					<Text style={styles.title}>Hábitos del grupo (máx. 5)</Text>
				</View>
				{habitsLoading ? (
					<View style={styles.center}>
						<ActivityIndicator />
					</View>
				) : habits?.length ? (
					<FlatList
						data={habits}
						keyExtractor={(item) => item.id}
						renderItem={renderRow}
						contentContainerStyle={{
							gap: 12,
							paddingVertical: 8,
							paddingHorizontal: 4,
						}}
					/>
				) : (
					<View style={[styles.center, { paddingVertical: 32 }]}>
						<Text style={styles.emptyTitle}>El grupo no tiene hábitos</Text>
						<Text style={styles.emptyText}>
							{canManage
								? 'Pulsa + para crear el primer hábito del grupo'
								: 'Espera a que un admin cree los hábitos del grupo'}
						</Text>
					</View>
				)}
			</CardContainer>

			{canManage && (
				<TouchableOpacity
					accessibilityRole="button"
					accessibilityLabel="Crear hábito"
					onPress={openCreate}
					style={styles.fab}
				>
					<Text style={styles.fabText}>+</Text>
				</TouchableOpacity>
			)}

			<HabitModal
				visible={visible}
				editing={editing}
				form={form}
				setForm={setForm}
				onCancel={() => setVisible(false)}
				onSave={save}
			/>
		</GradientBackground>
	)
}

const { colors, typography, radii } = require('../../styles/theme')
const styles = StyleSheet.create({
	headerRowCentered: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 8,
	},
	title: {
		fontFamily: typography.family.bold,
		fontSize: typography.size.xl,
		color: colors.gray800,
	},
	helper: { color: colors.gray500 },
	center: { alignItems: 'center', justifyContent: 'center' },
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	iconBtn: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: radii.sm },
	edit: { backgroundColor: colors.orange },
	delete: { backgroundColor: colors.red },
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
		fontFamily: typography.family.semibold,
	},
	emptyTitle: {
		fontSize: typography.size.md,
		fontFamily: typography.family.bold,
		color: colors.black,
	},
	emptyText: { fontSize: typography.size.xs, color: colors.gray500 },
})
