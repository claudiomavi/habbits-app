import { View, Text, Pressable, StyleSheet } from 'react-native'

export function DifficultySelector({ value = 1, onChange }) {
  const options = [1, 2, 3]
  return (
    <View>
      <Text style={styles.label}>Dificultad</Text>
      <View style={styles.row}>
        {options.map((opt) => (
          <Pressable key={opt} onPress={() => onChange?.(opt)} style={[styles.chip, value === opt && styles.active]}>
            <Text style={[styles.text, value === opt && styles.textActive]}>{opt}</Text>
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
