import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export function RangeSelector({ value = '30', onChange, onOpenCustom }) {
	// value can be '7' | '30' | 'custom'
	const items = [
		{ key: '7', label: '7 días' },
		{ key: '30', label: '30 días' },
		{ key: 'custom', label: 'Custom' },
	]
	return (
		<View style={styles.wrapper}>
			{items.map((it) => {
				const selected = value === it.key
				const content = (
					<View style={[styles.pill, selected && styles.pillSelected]}>
						{selected ? (
							<LinearGradient
								colors={['#4facfe', '#43e97b']}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
								style={styles.gradientBg}
							>
								<Text style={[styles.label, styles.labelSelected]}>
									{it.label}
								</Text>
							</LinearGradient>
						) : (
							<Text style={styles.label}>{it.label}</Text>
						)}
					</View>
				)
				const onPress = () => {
					if (it.key === 'custom') onOpenCustom?.()
					else onChange?.(it.key)
				}
				return (
					<Pressable
						key={it.key}
						onPress={onPress}
						style={{ flex: 1 }}
					>
						{content}
					</Pressable>
				)
			})}
		</View>
	)
}

const styles = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		gap: 8,
		backgroundColor: '#F3F4F6',
		padding: 6,
		borderRadius: 16,
		borderWidth: 2,
		borderColor: '#E5E7EB',
	},
	pill: {
		borderRadius: 12,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
	},
	gradientBg: { paddingVertical: 10, borderRadius: 12 },
	pillSelected: {},
	label: {
		textAlign: 'center',
		paddingVertical: 10,
		fontWeight: '700',
		color: '#374151',
	},
	labelSelected: { color: '#fff' },
})
