import { LinearGradient } from 'expo-linear-gradient'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native'

export function PrimaryButton({ title, onPress, loading, style }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={loading} style={[styles.mainButton, style]} activeOpacity={0.8}>
      <LinearGradient colors={['#4facfe', '#43e97b']} style={styles.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.mainButtonText}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  mainButton: { borderRadius: 16, overflow: 'hidden', shadowColor: '#4facfe', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  gradientButton: { paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  mainButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
