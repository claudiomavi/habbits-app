import { View, Text, Pressable, StyleSheet } from 'react-native'

export function FrequencySelector({ value = 'daily', onChange }) {
  const options = [
    { key: 'daily', label: 'Diario' },
    { key: 'weekly', label: 'Semanal' },
    { key: 'monthly', label: 'Mensual' },
  ]
  return (
    <View>
      <Text style={styles.label}>Frecuencia</Text>
      <View style={styles.row}>
        {options.map((opt) => (
          <Pressable key={opt.key} onPress={() => onChange?.(opt.key)} style={[styles.chip, value === opt.key && styles.active]}>
            <Text style={[styles.text, value === opt.key && styles.textActive]}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  label: { marginTop: 8, fontWeight: '600', color: '#111827' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: '#E5E7EB' },
  active: { backgroundColor: '#4F46E5' },
  text: { color: '#111827' },
  textActive: { color: '#fff', fontWeight: '700' },
})
