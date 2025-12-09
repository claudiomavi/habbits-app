import Ionicons from '@expo/vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import {
	CardContainer,
	deleteGroup,
	GradientBackground,
	inviteToGroup,
	leaveGroup,
	listGroupMembers,
	removeMember,
	setMemberRole,
	transferOwnership,
	updateGroupName,
	useAuthStore,
	useCooperativeStore,
} from '../../autoBarrell'

export function GroupSettingsTab({ route }) {
	const { groupId } = route.params || {}

	const [name, setName] = useState('')
	const [members, setMembers] = useState([])
	const [loading, setLoading] = useState(false)
	const [email, setEmail] = useState('')
	const [myRole, setMyRole] = useState(null)
	const [transferTo, setTransferTo] = useState('')
	const [transferOpen, setTransferOpen] = useState(false)

	const { user } = useAuthStore()
	const { fetchGroups } = useCooperativeStore()
	const navigation = useNavigation()

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true)
				const list = await listGroupMembers(groupId)
				setMembers(list)
				const mine = list.find((m) => m.user_id === user?.id)
				setMyRole(mine?.role || null)
			} finally {
				setLoading(false)
			}
		}
		if (groupId) load()
	}, [groupId, user?.id])

	const onRename = async () => {
		try {
			if (!name.trim()) return Alert.alert('Nombre requerido')
			await updateGroupName(groupId, name.trim())
			// intentar refrescar la lista de grupos para reflejar el nuevo nombre
			try {
				await fetchGroups(user?.id)
			} catch {}
			Alert.alert('Listo', 'Nombre actualizado')
			setName('')
		} catch (e) {
			console.error('updateGroupName', e)
			Alert.alert('Error', 'No se pudo renombrar el grupo')
		}
	}

	const onInvite = async () => {
		try {
			if (!email.trim()) return Alert.alert('Email requerido')
			await inviteToGroup({ group_id: groupId, email: email.trim() })
			Alert.alert('Invitación enviada')
			setEmail('')
		} catch (e) {
			console.error('inviteToGroup', e)
			Alert.alert('Error', 'No se pudo enviar la invitación')
		}
	}

	const isOwner = myRole === 'owner'
	const isAdmin = myRole === 'admin'
	const canManage = isOwner || isAdmin

	// acciones de miembros
	const onRemove = async (uid) => {
		Alert.alert(
			'Eliminar miembro',
			'¿Seguro que quieres eliminar a este miembro?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Eliminar',
					style: 'destructive',
					onPress: async () => {
						try {
							await removeMember(groupId, uid)
							Alert.alert('Listo', 'Miembro eliminado')
							const list = await listGroupMembers(groupId)
							setMembers(list)
						} catch (e) {
							console.error('removeMember', e)
							Alert.alert('Error', 'No se pudo eliminar')
						}
					},
				},
			]
		)
	}
	const onPromote = async (uid, targetRole) => {
		const actionText = targetRole === 'admin' ? 'Hacer admin' : 'Quitar admin'
		Alert.alert(
			actionText,
			`¿Seguro que quieres ${actionText.toLowerCase()} a este miembro?`,
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: actionText,
					style: 'destructive',
					onPress: async () => {
						try {
							await setMemberRole(groupId, uid, targetRole)
							const list = await listGroupMembers(groupId)
							setMembers(list)
						} catch (e) {
							console.error('setMemberRole', e)
							Alert.alert('Error', 'No se pudo cambiar el rol')
						}
					},
				},
			]
		)
	}
	const onLeave = async () => {
		Alert.alert(
			'Abandonar grupo',
			'¿Seguro que quieres abandonar este grupo?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Abandonar',
					style: 'destructive',
					onPress: async () => {
						try {
							await leaveGroup(groupId)
							Alert.alert('Saliste del grupo')
							try {
								await fetchGroups(user?.id)
							} catch {}
							navigation.navigate('Cooperative')
						} catch (e) {
							console.error('leaveGroup', e)
							Alert.alert('Error', 'No se pudo abandonar el grupo')
						}
					},
				},
			]
		)
	}
	const onDelete = async () => {
		Alert.alert('Eliminar grupo', 'Esta acción no se puede deshacer', [
			{ text: 'Cancelar', style: 'cancel' },
			{
				text: 'Eliminar',
				style: 'destructive',
				onPress: async () => {
					try {
						await deleteGroup(groupId)
						Alert.alert('Grupo eliminado')
						try {
							await fetchGroups(user?.id)
						} catch {}
						navigation.navigate('Cooperative')
					} catch (e) {
						console.error('deleteGroup', e)
						Alert.alert('Error', 'No se pudo eliminar el grupo')
					}
				},
			},
		])
	}
	const onTransfer = async () => {
		try {
			if (!transferTo?.trim())
				return Alert.alert('Introduce el email del nuevo owner')
			const target = members.find(
				(m) =>
					m?.profiles?.email?.toLowerCase() === transferTo.trim().toLowerCase()
			)
			if (!target)
				return Alert.alert(
					'No encontrado',
					'Ese email no pertenece a ningún miembro'
				)
			Alert.alert(
				'Transferir propiedad',
				`Vas a transferir la propiedad a ${
					target?.profiles?.display_name || target?.profiles?.email
				}. ¿Continuar?`,
				[
					{ text: 'Cancelar', style: 'cancel' },
					{
						text: 'Transferir',
						style: 'destructive',
						onPress: async () => {
							try {
								await transferOwnership(groupId, target.user_id)
								Alert.alert('Propiedad transferida')
								const list = await listGroupMembers(groupId)
								setMembers(list)
								navigation.navigate('Cooperative')
							} catch (e) {
								console.error('transferOwnership', e)
								Alert.alert('Error', 'No se pudo transferir la propiedad')
							}
						},
					},
				]
			)
		} catch (e) {
			console.error('transferOwnership', e)
			Alert.alert('Error', 'No se pudo transferir la propiedad')
		}
	}

	return (
		<GradientBackground style={{ flex: 1, padding: 16 }}>
			<ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
				<CardContainer>
					<Text style={styles.sectionTitle}>Ajustes del grupo</Text>
					<View style={{ height: 16 }} />
					{canManage && <Text style={styles.sectionSubtitle}>Renombrar</Text>}
					{canManage && (
						<View style={styles.row}>
							<TextInput
								placeholder="Nuevo nombre"
								value={name}
								onChangeText={setName}
								style={[styles.input, { flex: 1 }]}
							/>
							<TouchableOpacity
								style={[styles.actionBtn, styles.primary]}
								onPress={onRename}
							>
								<Text style={styles.actionText}>Guardar</Text>
							</TouchableOpacity>
						</View>
					)}
					<View style={{ height: 16 }} />
					{canManage && (
						<>
							<Text style={styles.sectionSubtitle}>Invitar miembro</Text>
							<Text style={styles.helper}>
								Introduce el correo del usuario a invitar
							</Text>
						</>
					)}
					{canManage && (
						<View style={styles.row}>
							<TextInput
								placeholder="correo@ejemplo.com"
								autoCapitalize="none"
								keyboardType="email-address"
								value={email}
								onChangeText={setEmail}
								style={[styles.input, { flex: 1 }]}
							/>
							<TouchableOpacity
								style={[styles.actionBtn, styles.primary]}
								onPress={onInvite}
							>
								<Text style={styles.actionText}>Enviar</Text>
							</TouchableOpacity>
						</View>
					)}
					<View style={{ height: 16 }} />
					<Text style={styles.sectionSubtitle}>Miembros</Text>
					{loading ? (
						<Text style={styles.helper}>Cargando...</Text>
					) : members?.length ? (
						<View style={{ gap: 8 }}>
							{members.map((m) => {
								const isMe = m.user_id === user?.id
								const canActOn = canManage && !isMe && m.role !== 'owner'
								const isAdminMember = m.role === 'admin'
								return (
									<View
										key={`${m.group_id}-${m.user_id}`}
										style={[styles.memberRow, isMe && styles.meRow]}
									>
										<Text style={styles.memberName}>
											{m?.profiles?.display_name ||
												m?.profiles?.email ||
												m.user_id?.slice?.(0, 8)}{' '}
											{isMe ? '(Tú)' : ''}
										</Text>
										<View style={styles.actionsRow}>
											<Text style={styles.memberRole}>{m.role}</Text>
											{canActOn && (
												<View style={styles.iconRow}>
													<TouchableOpacity
														style={styles.iconBtnDanger}
														onPress={() => onRemove(m.user_id)}
													>
														<Ionicons
															name="trash-outline"
															size={16}
															color={colors.white}
														/>
													</TouchableOpacity>
													{isOwner && (
														<TouchableOpacity
															style={styles.iconBtnWarn}
															onPress={() =>
																onPromote(
																	m.user_id,
																	isAdminMember ? 'member' : 'admin'
																)
															}
														>
															<Ionicons
																name={
																	isAdminMember
																		? 'remove-circle-outline'
																		: 'add-circle-outline'
																}
																size={16}
																color={colors.white}
															/>
														</TouchableOpacity>
													)}
												</View>
											)}
										</View>
									</View>
								)
							})}
						</View>
					) : (
						<Text style={styles.helper}>No hay miembros</Text>
					)}

					{/* Acciones */}
					<View style={styles.dangerZone}>
						<Text style={styles.dangerZoneTitle}>Zona de peligro</Text>
						<View style={{ gap: 8 }}>
							{!isOwner && (
								<TouchableOpacity
									style={[styles.actionBtn, styles.danger]}
									onPress={onLeave}
								>
									<Text style={styles.actionText}>Abandonar grupo</Text>
								</TouchableOpacity>
							)}
							{isOwner && (
								<>
									<Text style={styles.helper}>
										Selecciona un miembro de la lista inferior
									</Text>
									<View style={styles.row}>
										<View style={[styles.input, styles.transferBox]}>
											<Text style={styles.transferPlaceholder}>
												{transferTo ? transferTo : 'Selecciona un miembro'}
											</Text>
											<View style={styles.transferList}>
												{members
													.filter((m) => m.user_id !== user?.id)
													.map((m) => (
														<TouchableOpacity
															key={m.user_id}
															style={styles.transferOption}
															onPress={() =>
																setTransferTo(m?.profiles?.email || '')
															}
														>
															<Text style={styles.transferOptionText}>
																{m?.profiles?.display_name ||
																	m?.profiles?.email}
															</Text>
														</TouchableOpacity>
													))}
											</View>
										</View>
										<TouchableOpacity
											style={[styles.smallBtn, styles.warning]}
											onPress={onTransfer}
										>
											<Text style={styles.smallBtnText}>Transferir</Text>
										</TouchableOpacity>
									</View>
									<TouchableOpacity
										style={[styles.actionBtn, styles.danger]}
										onPress={onDelete}
									>
										<Text style={styles.actionText}>Eliminar grupo</Text>
									</TouchableOpacity>
								</>
							)}
						</View>
					</View>
				</CardContainer>
			</ScrollView>
		</GradientBackground>
	)
}

const { colors, typography, radii } = require('../../styles/theme')

const styles = StyleSheet.create({
	sectionTitle: {
		fontSize: typography.size.h2,
		fontFamily: typography.family.bold,
		marginBottom: 8,
	},
	sectionSubtitle: {
		fontSize: typography.size.md,
		fontFamily: typography.family.bold,
		marginBottom: 8,
	},
	helper: { color: colors.gray500 },
	row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	input: {
		borderWidth: 1,
		borderColor: colors.gray200,
		backgroundColor: colors.gray50,
		borderRadius: radii.sm,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	actionBtn: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: radii.sm,
	},
	primary: { backgroundColor: colors.orange },
	warning: { backgroundColor: colors.yellow },
	danger: {
		backgroundColor: colors.red,
		width: '50%',
		alignItems: 'center',
		margin: 'auto',
	},
	actionText: {
		color: colors.white,
		fontFamily: typography.family.bold,
	},
	memberRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 12,
		backgroundColor: colors.gray100,
		borderRadius: radii.sm,
	},
	meRow: {
		backgroundColor: colors.yellowBg,
		borderWidth: 1,
		borderColor: colors.yellow,
	},
	memberName: { color: colors.black, fontFamily: typography.family.semibold },
	memberRole: { color: colors.gray500, fontFamily: typography.family.semibold },
	smallBtn: {
		paddingHorizontal: 8,
		paddingVertical: 6,
		borderRadius: radii.xs,
	},
	smallBtnText: {
		color: colors.white,
		fontFamily: typography.family.bold,
		fontSize: typography.size.sm,
	},
	iconRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
	iconBtnDanger: {
		backgroundColor: colors.red,
		padding: 6,
		borderRadius: radii.xs,
	},
	iconBtnWarn: {
		backgroundColor: colors.yellow,
		padding: 6,
		borderRadius: radii.xs,
	},
	actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	transferBox: { flex: 1, paddingVertical: 4, paddingHorizontal: 8 },
	transferPlaceholder: { color: colors.gray500, paddingVertical: 4 },
	transferList: { marginTop: 4, gap: 6 },
	transferOption: { paddingVertical: 6 },
	transferOptionText: { color: colors.black },
	dangerZone: {
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 32,
		gap: 16,
		paddingHorizontal: 8,
	},
	dangerZoneTitle: {
		fontSize: typography.size.md,
		fontFamily: typography.family.bold,
		color: colors.red,
		textTransform: 'uppercase',
		letterSpacing: 1,
	},
})
