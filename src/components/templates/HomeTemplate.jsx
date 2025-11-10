import { FlatList, StyleSheet, Text, View } from 'react-native'
import { GradientBackground } from '../atomos/GradientBackground'
import { HeaderBar } from '../organismos/HeaderBar'
import { CardContainer } from '../organismos/CardContainer'
import { HabitCard } from '../organismos/HabitCard'

export function HomeTemplate({
  name,
  initial,
  xpPercent = 0.45,
  loading,
  habits = [],
  progressMap = new Map(),
  onToggle,
  onLogout,
}) {
  return (
    <GradientBackground style={styles.container}>
      <HeaderBar name={name} initial={initial} xpPercent={xpPercent} onLogout={onLogout} />

      <CardContainer>
        <Text style={styles.title}>Hábitos de hoy</Text>
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitCard habit={item} done={!!progressMap.get(item.id)?.completed} onToggle={onToggle} />
          )}
          contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
        />
      </CardContainer>
    </GradientBackground>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 8, marginTop: 6 },
})
