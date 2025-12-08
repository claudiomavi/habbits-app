import Ionicons from '@expo/vector-icons/Ionicons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import {
	ActivityIndicator,
	Alert,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import {
	CardContainer,
	GradientBackground,
	useAuthStore,
	useCooperativeStore,
	useUsersStore,
} from '../../autoBarrell'

function formatDateTime(ts) {
	try {
		const d = new Date(ts)
		const dd = String(d.getDate()).padStart(2, '0')
		const mm = String(d.getMonth() + 1).padStart(2, '0')
		const yy = String(d.getFullYear()).slice(-2)
		const hh = String(d.getHours()).padStart(2, '0')
		const min = String(d.getMinutes()).padStart(2, '0')
		return `${dd}/${mm}/${yy} ${hh}:${min}`
	} catch {
		return ts
	}
}

export function CooperativeTemplate() {
	const { profile } = useUsersStore()
	// const ENABLE_REALTIME =
	// 	String(process.env.EXPO_PUBLIC_ENABLE_REALTIME || '').toLowerCase() ===
	// 	'true'

	const navigation = useNavigation()

	const { user } = useAuthStore()
	const {
		invitations,
		loadingInvites,
		acceptInvitation,
		fetchInvitations,
		rejectInvitation,
		groups,
		loadingGroups,
		fetchGroups,
		createGroup,
		refreshAllCoopFast,
		lastUpdatedAt,
	} = useCooperativeStore()

	const [groupName, setGroupName] = useState('')
	const [selectedGroupId, setSelectedGroupId] = useState(null)

	// Carga únicamente al enfocar mediante refreshAllCoopFast para evitar duplicados
	useEffect(() => {
		const email = user?.email
		const actorId = profile?.character_id || user?.id
		const uid = actorId
		if (!email) return
		fetchInvitations(email, { status: 'pending' })
		if (uid) {
			fetchGroups(user?.id)
		}
	}, [user?.email, profile?.character_id, user?.id])

	// Re-subscribe on screen focus (covers account switch and navigation)
	useFocusEffect(
		useCallback(() => {
			const actorId = profile?.character_id || user?.id
			const uid = actorId
			if (user?.email || uid) refreshAllCoopFast(user?.email, uid)
			return () => {}
		}, [user?.email, profile?.character_id, user?.id])
	)

	// Pull-to-refresh usa actorId
	const onRefresh = () => {
		const actorId = profile?.character_id || user?.id
		refreshAllCoopFast(user?.email, user?.id)
	}

	const onCreateGroup = async () => {
		try {
			if (!groupName.trim()) return Alert.alert('Nombre requerido')
			const actorId = user?.id
			const g = await createGroup({
				name: groupName.trim(),
				owner_id: actorId,
			})
			setGroupName('')
			if (g?.id) setSelectedGroupId(g.id)
		} catch (e) {
			console.error('createGroup', e)
			Alert.alert('Error', 'No se pudo crear el grupo')
		}
	}

	return (
		<GradientBackground style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				refreshControl={
					<RefreshControl
						refreshing={!!(loadingInvites || loadingGroups)}
						onRefresh={onRefresh}
					/>
				}
			>
				<CardContainer>
					<Text style={styles.title}>Modo cooperativo</Text>
					<Text style={styles.subtitle}>
						Invitaciones y gestión básica de grupos (Día 2).
					</Text>

					{/* Notificaciones */}
					<View style={styles.section}>
						<View
							style={[
								styles.row,
								{ justifyContent: 'space-between', alignItems: 'flex-end' },
							]}
						>
							<Text style={styles.sectionTitle}>Invitaciones</Text>
							<View style={[styles.row, { gap: 12 }]}>
								{lastUpdatedAt ? (
									<Text style={styles.updatedAt}>
										Actualizado a las{' '}
										{(() => {
											try {
												const d = new Date(lastUpdatedAt)
												const hh = String(d.getHours()).padStart(2, '0')
												const mm = String(d.getMinutes()).padStart(2, '0')
												return `${hh}:${mm}`
											} catch {
												return ''
											}
										})()}
									</Text>
								) : null}
								<TouchableOpacity
									onPress={() => {
										refreshAllCoopFast(user?.email, user?.id)
									}}
								>
									<Text
										style={[
											styles.helperText,
											{ textDecorationLine: 'underline' },
										]}
									>
										Actualizar
									</Text>
								</TouchableOpacity>
							</View>
						</View>

						{/* Entrantes: invitaciones pendientes */}
						{loadingInvites ? (
							<View style={styles.banner}>
								<ActivityIndicator />
							</View>
						) : invitations?.length ? (
							<View style={styles.banner}>
								<Text style={styles.bannerTitle}>Invitaciones</Text>
								{invitations.map((inv) => (
									<View
										key={inv.id}
										style={styles.inviteRow}
									>
										<View style={{ flex: 1 }}>
											<Text style={styles.inviteText}>
												Grupo:{' '}
												{inv.group_name ||
													groups?.find?.((g) => g.id === inv.group_id)?.name ||
													inv.group_id?.slice?.(0, 8) ||
													'—'}
											</Text>
											<Text style={styles.inviteMeta}>
												Enviada: {formatDateTime(inv.created_at)}
											</Text>
										</View>
										<View style={styles.inviteActions}>
											<TouchableOpacity
												style={[styles.inviteBtn, styles.accept]}
												onPress={async () => {
													try {
														await acceptInvitation(
															inv.id,
															user?.id,
															user?.email
														)
													} catch (e) {
														console.error('acceptInvitation', e)
														Alert.alert(
															'Error',
															'No se pudo aceptar la invitación'
														)
													}
												}}
											>
												<Ionicons
													name="checkmark"
													size={18}
													color={colors.white}
												/>
											</TouchableOpacity>
											<TouchableOpacity
												style={[styles.inviteBtn, styles.reject]}
												onPress={async () => {
													try {
														await rejectInvitation(inv.id, user?.email)
													} catch (e) {
														console.error('rejectInvitation', e)
														Alert.alert(
															'Error',
															'No se pudo rechazar la invitación'
														)
													}
												}}
											>
												<Ionicons
													name="close"
													size={18}
													color={colors.white}
												/>
											</TouchableOpacity>
										</View>
									</View>
								))}
							</View>
						) : null}
					</View>

					{/* Crear grupo */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Crear grupo</Text>
						<View style={styles.row}>
							<TextInput
								placeholder="Nombre del grupo"
								value={groupName}
								onChangeText={setGroupName}
								style={styles.input}
							/>
							<TouchableOpacity
								style={[styles.actionBtn, styles.create]}
								onPress={onCreateGroup}
							>
								<Text style={styles.actionText}>Crear</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Mis grupos */}
					<View style={styles.section}>
						<View style={[styles.row, { justifyContent: 'space-between' }]}>
							<Text style={styles.sectionTitle}>Mis grupos</Text>
							{loadingGroups ? <ActivityIndicator /> : null}
						</View>
						{groups?.length ? (
							<View style={{ gap: 8 }}>
								{groups.map((g) => (
									<TouchableOpacity
										key={g.id}
										style={[
											styles.groupRow,
											selectedGroupId === g.id && styles.groupRowSelected,
										]}
										onPress={() =>
											navigation.navigate('GroupDetail', { groupId: g.id })
										}
									>
										<Text style={styles.groupName}>
											{g.name || g.id?.slice?.(0, 8)}
										</Text>
										{/* <Text style={styles.groupMeta}>ID: {g.id}</Text> */}
									</TouchableOpacity>
								))}
							</View>
						) : (
							<Text style={styles.emptyText}>
								Aún no perteneces a ningún grupo
							</Text>
						)}
					</View>

					{/* Invitaciones por email se gestionan desde Ajustes del grupo */}
				</CardContainer>
			</ScrollView>
		</GradientBackground>
	)
}

const { colors, typography, radii } = require('../../styles/theme')

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	scrollContent: { paddingBottom: 32 },
	title: {
		fontSize: typography.size.xl,
		fontFamily: typography.family.bold,
		color: colors.black,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: typography.size.sm,
		color: colors.gray500,
		marginBottom: 16,
	},
	banner: {
		backgroundColor: colors.gray50,
		borderColor: colors.gray200,
		borderWidth: 2,
		borderRadius: radii.lg,
		padding: 12,
		gap: 8,
	},
	bannerTitle: {
		fontFamily: typography.family.semibold,
		fontSize: typography.size.sm,
		color: colors.gray800,
	},
	inviteRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingVertical: 4,
	},
	inviteText: {
		color: colors.black,
		fontFamily: typography.family.semibold,
		fontSize: typography.size.sm,
	},
	inviteMeta: {
		color: colors.gray500,
		fontSize: typography.size.xs,
		marginTop: 2,
	},
	inviteActions: {
		flexDirection: 'row',
		gap: 8,
	},
	inviteBtn: {
		width: 32,
		height: 32,
		borderRadius: radii.full,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#FFFFFF',
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 2,
		shadowOffset: { width: 0, height: 1 },
		elevation: 2,
	},

	accept: { backgroundColor: colors.green },
	reject: { backgroundColor: colors.red },
	inviteBtnText: { color: colors.white, fontFamily: typography.family.bold },
	bannerEmpty: {
		backgroundColor: colors.gray50,
		borderColor: colors.gray200,
		borderWidth: 2,
		borderRadius: radii.lg,
		padding: 12,
		alignItems: 'center',
	},
	bannerEmptyText: { color: colors.gray500 },
	section: { marginTop: 20, gap: 8 },
	sectionTitle: { fontFamily: typography.family.bold, color: colors.gray800 },
	row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	input: {
		flex: 1,
		borderWidth: 2,
		borderColor: colors.gray200,
		backgroundColor: colors.gray50,
		borderRadius: radii.md,
		paddingHorizontal: 12,
		paddingVertical: 10,
		color: colors.black,
	},
	actionBtn: {
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: radii.md,
	},
	create: { backgroundColor: colors.orange },
	invite: { backgroundColor: colors.indigo || '#4F46E5' },
	actionText: { color: colors.white, fontFamily: typography.family.bold },
	groupRow: {
		padding: 12,
		borderRadius: radii.md,
		borderWidth: 2,
		borderColor: colors.gray200,
		backgroundColor: colors.gray50,
	},
	groupRowSelected: { borderColor: colors.indigo || '#4F46E5' },
	groupName: { color: colors.black, fontFamily: typography.family.semibold },
	groupMeta: { color: colors.gray500, fontSize: typography.size.xs },
	helperText: { color: colors.gray500, fontSize: typography.size.xs },
	updatedAt: {
		color: colors.gray400,
		fontSize: typography.size.xs,
		marginTop: 2,
	},
})
