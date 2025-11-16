import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

export function LevelUpBanner({ level, onAccept }) {
	return (
		<View style={styles.banner}>
			<Text style={styles.congrats}>¡Enhorabuena!</Text>
			<Text style={styles.title}>¡Has subido de nivel!</Text>
			<View style={{ height: 6 }} />
			<View style={styles.pill}>
				<Text style={styles.pillText}>Nivel {level}</Text>
			</View>
			{/* image removed intentionally */ false ? (
				<>
					<View style={{ height: 12 }} />
					<Image
						source={{ uri: imageUri }}
						style={{ width: 200, height: 200 }}
						resizeMode="contain"
					/>
				</>
			) : null}
			<View style={{ height: 16 }} />
			<Pressable hitSlop={12}
				style={styles.btn}
				onPress={onAccept}
				accessibilityLabel="Aceptar"
			>
				<Text style={styles.btnText}>Aceptar</Text>
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	banner: {
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 16,
		borderWidth: 2,
		borderColor: '#E5E7EB',
	},
	congrats: { fontSize: 14, color: '#059669', fontWeight: '700' },
	title: { fontSize: 18, color: '#111827', fontWeight: '800', marginTop: 2 },
	pill: {
		marginTop: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: '#EEF2FF',
	},
	pillText: { color: '#4F46E5', fontWeight: '800' },
	btn: {
		backgroundColor: '#4F46E5',
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: 12,
	},
	btnText: { color: '#fff', fontWeight: '800' },
})
