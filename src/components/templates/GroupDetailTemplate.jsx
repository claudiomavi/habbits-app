import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { inviteToGroup, listGroupMembers, updateGroupName } from '../../autoBarrell'

function SettingsTab({ groupId }) {
  const [name, setName] = useState('')
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const list = await listGroupMembers(groupId)
        setMembers(list)
      } finally {
        setLoading(false)
      }
    }
    if (groupId) load()
  }, [groupId])

  const onRename = async () => {
    try {
      if (!name.trim()) return Alert.alert('Nombre requerido')
      await updateGroupName(groupId, name.trim())
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

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Ajustes del grupo</Text>
      <Text style={styles.helper}>ID: {groupId?.slice?.(0, 8)}</Text>

      <View style={{ height: 16 }} />
      <Text style={styles.sectionTitle}>Renombrar</Text>
      <View style={styles.row}>
        <TextInput placeholder="Nuevo nombre" value={name} onChangeText={setName} style={[styles.input, { flex: 1 }]} />
        <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={onRename}>
          <Text style={styles.actionText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 16 }} />
      <Text style={styles.sectionTitle}>Invitar miembro</Text>
      <View style={styles.row}>
        <TextInput placeholder="correo@ejemplo.com" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={[styles.input, { flex: 1 }]} />
        <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={onInvite}>
          <Text style={styles.actionText}>Enviar</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 16 }} />
      <Text style={styles.sectionTitle}>Miembros</Text>
      {loading ? (
        <Text style={styles.helper}>Cargando...</Text>
      ) : members?.length ? (
        <View style={{ gap: 8 }}>
          {members.map((m) => (
            <View key={`${m.group_id}-${m.user_id}`} style={styles.memberRow}>
              <Text style={styles.memberName}>{m.user_id?.slice?.(0, 8)}</Text>
              <Text style={styles.memberRole}>{m.role}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.helper}>No hay miembros</Text>
      )}
    </ScrollView>
  )
}

function HabitsTab() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Hábitos del grupo (máx. 5)</Text>
      <Text style={styles.helper}>Pendiente de implementar</Text>
    </ScrollView>
  )
}

function LeaderboardTab() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Clasificatorio</Text>
      <Text style={styles.helper}>Pendiente de implementar</Text>
    </ScrollView>
  )
}

const Tab = createBottomTabNavigator()

export function GroupDetailTemplate({ groupId }) {
  const Title = useMemo(() => (
    <View style={{ padding: 16 }}>
      <Text style={styles.title}>Grupo</Text>
      <Text style={styles.subtitle}>{groupId?.slice?.(0, 8)}</Text>
    </View>
  ), [groupId])

  return (
    <View style={{ flex: 1 }}>
      {Title}
      <View style={{ flex: 1 }}>
        <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="Ajustes">
          <Tab.Screen name="Hábitos" children={() => <HabitsTab groupId={groupId} />} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="list-outline" size={size} color={color} />) }} />
          <Tab.Screen name="Clasificatorio" children={() => <LeaderboardTab groupId={groupId} />} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="stats-chart-outline" size={size} color={color} />) }} />
          <Tab.Screen name="Ajustes" children={() => <SettingsTab groupId={groupId} />} options={{ tabBarIcon: ({ color, size }) => (<Ionicons name="settings-outline" size={size} color={color} />) }} />
        </Tab.Navigator>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 12, color: '#6B7280' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  helper: { color: '#6B7280' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  primary: { backgroundColor: '#4F46E5' },
  actionText: { color: '#fff', fontWeight: '700' },
  memberRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#F3F4F6', borderRadius: 8 },
  memberName: { color: '#111827', fontWeight: '600' },
  memberRole: { color: '#6B7280', fontWeight: '600' },
})
