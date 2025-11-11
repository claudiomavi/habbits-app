import { Pressable, StyleSheet, Text, View } from 'react-native'

const LABELS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export function DaysOfWeekSelector({ value = [], onChange }) {
	const toggle = (d) => {
		const set = new Set(value)
		set.has(d) ? set.delete(d) : set.add(d)
		const arr = Array.from(set).sort()
		onChange?.(arr)
	}
	return (
		<View>
			<Text style={styles.label}>Días de la semana</Text>
			<View style={styles.row}>
				{LABELS.map((lab, idx) => (
					<Pressable
						key={idx}
						onPress={() => toggle(idx)}
						style={[styles.chip, value?.includes(idx) && styles.active]}
					>
						<Text
							style={[styles.text, value?.includes(idx) && styles.textActive]}
						>
							{lab}
						</Text>
					</Pressable>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	label: { marginTop: 8, fontWeight: '600', color: '#111827' },
	row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
	chip: {
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderRadius: 999,
		backgroundColor: '#E5E7EB',
	},
	active: { backgroundColor: '#4F46E5' },
	text: { color: '#111827' },
	textActive: { color: '#fff', fontWeight: '700' },
})
