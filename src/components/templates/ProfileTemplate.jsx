import React from 'react'
import {
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

export function ProfileTemplate({
	profile,
	xpPercent = 0,
	saving,
	onSave,
	avatarOptions = [],
}) {
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

	React.useEffect(() => {
		setDisplayName(profile?.display_name || '')
		setAvatar(profile?.avatar || null)
		setCharacterId(profile?.character_id || null)
	}, [profile])

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
					{(editing ? avatar?.uri || displayUri : displayUri) ? (
						<Image
							source={{ uri: editing ? avatar?.uri || displayUri : displayUri }}
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
			</CardContainer>

			{editing ? (
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
			) : (
				<View style={{ marginTop: 12 }}>
					<PrimaryButton
						title="Editar perfil"
						onPress={() => setEditing(true)}
					/>
				</View>
			)}
		</GradientBackground>
	)
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
	avatar: { width: 72, height: 72, borderRadius: 16 },
	name: { fontSize: 20, fontWeight: '700', color: '#111827' },
	email: { fontSize: 12, color: '#6B7280', marginTop: 2 },
	level: { fontSize: 12, color: '#6B7280', marginTop: 6 },
	label: { fontSize: 12, color: '#374151' },
	input: {
		backgroundColor: '#F3F4F6',
		borderWidth: 1,
		borderColor: '#E5E7EB',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	avatarsRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
	pickAvatar: { width: 56, height: 56, borderRadius: 12 },
	cancel: {
		color: '#EF4444',
		textAlign: 'center',
		marginTop: 8,
		fontWeight: '700',
	},
})
