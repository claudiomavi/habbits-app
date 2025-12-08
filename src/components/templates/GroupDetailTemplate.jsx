import React, { useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'

function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
      <Text style={[styles.tabLbl, active && styles.tabLblActive]}>{label}</Text>
    </TouchableOpacity>
  )
}

export function GroupDetailTemplate({ groupId, navigation }) {
  const [tab, setTab] = useState('habits') // habits | leaderboard | settings

  const Title = useMemo(() => (
    <View style={{ padding: 16 }}>
      <Text style={styles.title}>Grupo</Text>
      <Text style={styles.subtitle}>{groupId?.slice?.(0, 8)}</Text>
    </View>
  ), [groupId])

  return (
    <View style={{ flex: 1 }}>
      {Title}
      <View style={styles.tabsRow}>
        <TabButton label="Hábitos" active={tab === 'habits'} onPress={() => setTab('habits')} />
        <TabButton label="Clasificatorio" active={tab === 'leaderboard'} onPress={() => setTab('leaderboard')} />
        <TabButton label="Ajustes" active={tab === 'settings'} onPress={() => setTab('settings')} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {tab === 'habits' && (
          <View>
            <Text style={styles.sectionTitle}>Hábitos del grupo (máx. 5)</Text>
            <Text style={styles.helper}>TODO: listar/crear/limitar a 5 y completar</Text>
          </View>
        )}
        {tab === 'leaderboard' && (
          <View>
            <Text style={styles.sectionTitle}>Clasificatorio</Text>
            <Text style={styles.helper}>TODO: ranking por XP del grupo</Text>
          </View>
        )}
        {tab === 'settings' && (
          <View>
            <Text style={styles.sectionTitle}>Ajustes del grupo</Text>
            <Text style={styles.helper}>TODO: añadir/expulsar miembros, roles, renombrar, eliminar</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 12, color: '#6B7280' },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 8, gap: 8 },
  tabBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#F3F4F6' },
  tabBtnActive: { backgroundColor: '#E0E7FF' },
  tabLbl: { color: '#374151', fontWeight: '600' },
  tabLblActive: { color: '#4338CA' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  helper: { color: '#6B7280' },
})
