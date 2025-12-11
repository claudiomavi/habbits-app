import React from 'react'
import {
	Animated,
	Easing,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import {
	AvatarInitials,
	CardContainer,
	GradientBackground,
	PrimaryButton,
	XPBar,
} from '../../autoBarrell'

// Helpers and small UI primitives for notifications section
const pad2 = (n) => String(n).padStart(2, '0')

const ToggleSwitch = ({ value, onValueChange }) => {
	return (
		<TouchableOpacity
			onPress={() => onValueChange?.(!value)}
			activeOpacity={0.8}
			style={[styles.switchBase, value ? styles.switchOn : styles.switchOff]}
		>
			<View
				style={[
					styles.switchHandle,
					value ? styles.switchHandleOn : styles.switchHandleOff,
				]}
			/>
		</TouchableOpacity>
	)
}

const NumberPill = ({ value, onInc, onDec }) => {
	return (
		<View style={styles.numPillBase}>
			<TouchableOpacity
				onPress={onDec}
				style={styles.numBtn}
			>
				<Text style={styles.numBtnText}>-</Text>
			</TouchableOpacity>
			<Text style={styles.numValue}>{value}</Text>
			<TouchableOpacity
				onPress={onInc}
				style={styles.numBtn}
			>
				<Text style={styles.numBtnText}>+</Text>
			</TouchableOpacity>
		</View>
	)
}

export function ProfileTemplate({
	profile,
	xpPercent = 0,
	saving,
	onSave,
	avatarOptions = [],
	notificationProps,
}) {
	const [showEditor, setShowEditor] = React.useState(false)
	const [editing, setEditing] = React.useState(false)
	const [displayName, setDisplayName] = React.useState(
		profile?.display_name || ''
	)
	const [avatar, setAvatar] = React.useState(profile?.avatar || null)
	const [characterId, setCharacterId] = React.useState(
		profile?.character_id || null
	)
	const [displayUri, setDisplayUri] = React.useState(
		profile?.avatar?.uri || profile?.avatar || null
	)
	// Animación de sección de edición
	const editOpacity = React.useRef(new Animated.Value(0)).current
	const editTranslate = React.useRef(new Animated.Value(12)).current
	// Animación del botón "Editar perfil" (estado inverso)
	const btnOpacity = React.useRef(new Animated.Value(1)).current
	const btnTranslate = React.useRef(new Animated.Value(0)).current

	React.useEffect(() => {
		setDisplayName(profile?.display_name || '')
		setAvatar(profile?.avatar || null)
		setCharacterId(profile?.character_id || null)
	}, [profile])

	// Animar entrada/salida de la sección de edición y botón inverso
	React.useEffect(() => {
		if (editing) {
			setShowEditor(true)
			Animated.parallel([
				Animated.timing(editOpacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
				Animated.timing(editTranslate, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
				Animated.timing(btnOpacity, {
					toValue: 0,
					duration: 220,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
				Animated.timing(btnTranslate, {
					toValue: -8,
					duration: 220,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
			]).start()
		} else if (showEditor) {
			Animated.parallel([
				Animated.timing(editOpacity, {
					toValue: 0,
					duration: 260,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
				Animated.timing(editTranslate, {
					toValue: 20,
					duration: 260,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
				Animated.timing(btnOpacity, {
					toValue: 1,
					duration: 280,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
				Animated.timing(btnTranslate, {
					toValue: 0,
					duration: 280,
					useNativeDriver: true,
					easing: Easing.out(Easing.cubic),
				}),
			]).start(() => setShowEditor(false))
		}
	}, [editing, showEditor])

	// Resolve display image: prefer character evolution by level; fallback to profile avatar
	React.useEffect(() => {
		let mounted = true
		;(async () => {
			try {
				const level = profile?.level ?? 1
				const fallback = profile?.avatar?.uri || profile?.avatar || null
				if (!profile?.character_id) {
					if (mounted) setDisplayUri(fallback)
					return
				}
				const { getCharacterById, getImageForLevel } = await import(
					'../../autoBarrell'
				)
				const character = await getCharacterById(profile.character_id)
				const evolved = getImageForLevel(character, level) || fallback
				if (mounted) setDisplayUri(evolved)
			} catch (e) {
				console.warn('profile character load', e)
			}
		})()
		return () => {
			mounted = false
		}
	}, [profile?.character_id, profile?.level, profile?.avatar])

	const initial = profile?.display_name

	const saveChanges = () => {
		// Persist only fields that exist in profiles schema
		const patch = {
			display_name: displayName,
			character_id: characterId || null,
		}
		onSave?.(patch)
		setEditing(false)
	}

	return (
		<GradientBackground style={styles.container}>
			<CardContainer>
				<View style={styles.header}>
					<View style={styles.firstRow}>
						{(editing ? avatar?.uri || displayUri : displayUri) ? (
							<Image
								source={{
									uri: editing ? avatar?.uri || displayUri : displayUri,
								}}
								style={styles.avatar}
							/>
						) : (
							<AvatarInitials
								text={initial}
								size={72}
							/>
						)}
						<View style={{ flex: 1 }}>
							<Text style={styles.name}>
								{profile?.display_name || 'Sin nombre'}
							</Text>
							<Text style={styles.email}>{profile?.email}</Text>
							<Text style={styles.level}>Nivel {profile?.level ?? 1}</Text>
							<XPBar percent={xpPercent} />
						</View>
					</View>
					{!editing && (
						<View style={styles.secondRow}>
							<PrimaryButton
								title="Editar perfil"
								onPress={() => setEditing(true)}
							/>
						</View>
					)}
				</View>
			</CardContainer>

			{editing && (
				<Animated.View
					style={{
						opacity: editOpacity,
						transform: [{ translateY: editTranslate }],
					}}
				>
					<CardContainer marginTop={12}>
						<View style={{ gap: 12, marginTop: 12 }}>
							<Text style={styles.label}>Nombre para mostrar</Text>
							<TextInput
								value={displayName}
								onChangeText={setDisplayName}
								placeholder="Tu nombre"
								style={styles.input}
							/>

							<Text style={styles.label}>Avatar / Personaje</Text>
							<View style={styles.avatarsRow}>
								{(avatarOptions && avatarOptions.length
									? avatarOptions
									: [{ id: 'none', uri: null, label: 'Inicial' }]
								).map((a) => (
									<TouchableOpacity
										key={a.id}
										onPress={() => {
											setAvatar(a && a.uri ? a : null)
											setCharacterId(a?.id || null)
											setDisplayUri(a?.uri || null)
										}}
									>
										{a.uri ? (
											<Image
												source={{ uri: a.uri }}
												style={styles.pickAvatar}
											/>
										) : (
											<AvatarInitials
												text={displayName || initial}
												size={56}
											/>
										)}
									</TouchableOpacity>
								))}
							</View>

							<PrimaryButton
								title={saving ? 'Guardando...' : 'Guardar cambios'}
								onPress={saveChanges}
								loading={!!saving}
							/>
							<TouchableOpacity onPress={() => setEditing(false)}>
								<Text style={styles.cancel}>Cancelar</Text>
							</TouchableOpacity>
						</View>
					</CardContainer>
				</Animated.View>
			)}
			{/* Notifications section */}
			<CardContainer marginTop={12}>
				<View style={{ gap: 12 }}>
					<Text style={styles.sectionTitle}>Recordatorios diarios</Text>
					<View style={styles.rowBetween}>
						<Text style={styles.label}>Activar notificaciones</Text>
						<ToggleSwitch
							value={!!notificationProps?.enabled}
							onValueChange={notificationProps?.onToggle}
						/>
					</View>
					<View
						style={[
							styles.rowBetween,
							{ opacity: notificationProps?.enabled ? 1 : 0.5 },
						]}
					>
						<Text style={styles.label}>Hora del día</Text>
						<View
							style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
						>
							<NumberPill
								value={pad2(notificationProps?.hour ?? 9)}
								onInc={() =>
									notificationProps?.onChangeTime?.(
										Math.min(23, (notificationProps?.hour ?? 0) + 1),
										notificationProps?.minute ?? 0
									)
								}
								onDec={() =>
									notificationProps?.onChangeTime?.(
										Math.max(0, (notificationProps?.hour ?? 0) - 1),
										notificationProps?.minute ?? 0
									)
								}
							/>
							<Text style={styles.hourColon}>:</Text>
							<NumberPill
								value={pad2(notificationProps?.minute ?? 0)}
								onInc={() =>
									notificationProps?.onChangeTime?.(
										notificationProps?.hour ?? 0,
										Math.min(59, (notificationProps?.minute ?? 0) + 5)
									)
								}
								onDec={() =>
									notificationProps?.onChangeTime?.(
										notificationProps?.hour ?? 0,
										Math.max(0, (notificationProps?.minute ?? 0) - 5)
									)
								}
							/>
						</View>
					</View>
					<PrimaryButton
						title={
							notificationProps?.saving
								? 'Guardando...'
								: 'Guardar notificaciones'
						}
						onPress={notificationProps?.onSave}
						loading={!!notificationProps?.saving}
					/>
				</View>
			</CardContainer>
		</GradientBackground>
	)
}

const { colors, typography, radii } = require('../../styles/theme')

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	header: { flexDirection: 'column', gap: 12 },
	firstRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
	avatar: { width: 72, height: 72, borderRadius: radii.lg },
	name: {
		fontSize: typography.size.xl,
		color: colors.black,
		fontFamily: typography.family.bold,
	},
	email: {
		fontSize: typography.size.xs,
		color: colors.gray500,
		marginTop: 2,
		fontFamily: typography.family.regular,
	},
	level: {
		fontSize: typography.size.xs,
		color: colors.gray500,
		marginTop: 6,
		fontFamily: typography.family.light,
	},
	sectionTitle: {
		fontSize: typography.size.lg,
		color: colors.black,
		fontFamily: typography.family.bold,
	},
	label: {
		fontSize: typography.size.xs,
		color: colors.gray700,
		fontFamily: typography.family.regular,
	},
	input: {
		backgroundColor: colors.gray100,
		borderWidth: 1,
		borderColor: colors.gray200,
		borderRadius: radii.md,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	avatarsRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
	pickAvatar: { width: 56, height: 56, borderRadius: radii.md },
	cancel: {
		color: colors.red,
		textAlign: 'center',
		marginTop: 8,
		fontFamily: typography.family.bold,
	},
	rowBetween: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	hourColon: {
		fontSize: typography.size.lg,
		color: colors.black,
		fontFamily: typography.family.bold,
	},
	// Toggle switch styles
	switchBase: {
		width: 48,
		height: 28,
		borderRadius: 28 / 2,
		padding: 3,
		borderWidth: 1,
		borderColor: colors.gray300 || colors.gray200,
		backgroundColor: colors.gray200,
	},
	switchOn: { backgroundColor: '#34C759', borderColor: '#34C759' },
	switchOff: { backgroundColor: colors.gray200 },
	switchHandle: {
		width: 22,
		height: 22,
		borderRadius: 11,
		backgroundColor: colors.white,
	},
	switchHandleOn: { marginLeft: 22 },
	switchHandleOff: { marginLeft: 0 },
	// Number pill styles
	numPillBase: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		borderWidth: 1,
		borderColor: colors.gray200,
		backgroundColor: colors.gray100,
		borderRadius: radii.md,
		paddingHorizontal: 8,
		paddingVertical: 6,
		minWidth: 80,
		justifyContent: 'space-between',
	},
	numBtn: {
		width: 28,
		height: 28,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.white,
		borderWidth: 1,
		borderColor: colors.gray200,
	},
	numBtnText: {
		fontFamily: typography.family.bold,
		color: colors.black,
		fontSize: typography.size.md,
	},
	numValue: {
		fontFamily: typography.family.bold,
		color: colors.black,
		fontSize: typography.size.md,
		minWidth: 32,
		textAlign: 'center',
	},
})
