import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AvatarInitials } from '../atomos/AvatarInitials'
import { XPBar } from '../moleculas/XPBar'

export function HeaderBar({ name, initial, onLogout, xpPercent = 0.45 }) {
  return (
    <View style={styles.header}>
      <AvatarInitials text={initial} size={48} />
      <View style={{ flex: 1 }}>
        <Text style={styles.welcome}>Hola, {name}</Text>
        <XPBar percent={xpPercent} />
      </View>
      {onLogout && (
        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 16, gap: 12 },
  welcome: { color: '#fff', fontSize: 16, fontWeight: '600' },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 10 },
  logoutText: { color: '#fff', fontWeight: '700' },
})
