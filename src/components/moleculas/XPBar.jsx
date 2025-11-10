import { StyleSheet, View } from 'react-native'

export function XPBar({ percent = 0.45 }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bg} />
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(1, percent)) * 100}%` }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { height: 8, marginTop: 6, borderRadius: 6, overflow: 'hidden' },
  bg: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.3)' },
  fill: { height: '100%', backgroundColor: '#43e97b' },
})
