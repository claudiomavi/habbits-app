import React from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AvatarInitials, CardContainer, GradientBackground, PrimaryButton, XPBar } from '../../autoBarrell'

export function ProfileTemplate({ profile, xpPercent = 0, saving, onSave }) {
  const [editing, setEditing] = React.useState(false)
  const [displayName, setDisplayName] = React.useState(profile?.display_name || '')
  const [avatar, setAvatar] = React.useState(profile?.avatar || null)

  React.useEffect(() => {
    setDisplayName(profile?.display_name || '')
    setAvatar(profile?.avatar || null)
  }, [profile])

  const initial = profile?.display_name
  const avatarUri = avatar?.uri || avatar

  const saveChanges = () => {
    const patch = { display_name: displayName, avatar }
    onSave?.(patch)
    setEditing(false)
  }

  return (
    <GradientBackground style={styles.container}>
      <CardContainer>
        <View style={styles.header}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <AvatarInitials text={initial} size={72} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{profile?.display_name || 'Sin nombre'}</Text>
            <Text style={styles.email}>{profile?.email}</Text>
            <Text style={styles.level}>Nivel {profile?.level ?? 1}</Text>
            <XPBar percent={xpPercent} />
          </View>
        </View>

        {editing ? (
          <View style={{ gap: 12, marginTop: 12 }}>
            <Text style={styles.label}>Nombre para mostrar</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Tu nombre"
              style={styles.input}
            />

            <Text style={styles.label}>Avatar</Text>
            <View style={styles.avatarsRow}>
              {[ // utiliza los mismos de CreateProfile como opciones rápidas
                { id: 'male', uri: 'https://imgur.com/dYYo70A.png', label: 'Hombre' },
                { id: 'female', uri: 'https://imgur.com/0MyPvoE.png', label: 'Mujer' },
                { id: 'none', uri: null, label: 'Inicial' },
              ].map((a) => (
                <TouchableOpacity key={a.id} onPress={() => setAvatar(a.uri ? a : null)}>
                  {a.uri ? (
                    <Image source={{ uri: a.uri }} style={styles.pickAvatar} />
                  ) : (
                    <AvatarInitials text={displayName || initial} size={56} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <PrimaryButton title={saving ? 'Guardando...' : 'Guardar cambios'} onPress={saveChanges} loading={!!saving} />
            <TouchableOpacity onPress={() => setEditing(false)}>
              <Text style={styles.cancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginTop: 12 }}>
            <PrimaryButton title="Editar perfil" onPress={() => setEditing(true)} />
          </View>
        )}
      </CardContainer>
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
  input: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  avatarsRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  pickAvatar: { width: 56, height: 56, borderRadius: 12 },
  cancel: { color: '#EF4444', textAlign: 'center', marginTop: 8, fontWeight: '700' },
})
