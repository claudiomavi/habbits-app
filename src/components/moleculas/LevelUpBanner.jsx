import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

export function LevelUpBanner({ level, onAccept, imageUri }) {
	return (
		<View style={styles.banner}>
			<Text style={styles.congrats}>¡Enhorabuena!</Text>
			<Text style={styles.title}>¡Has subido de nivel!</Text>
			<View style={{ height: 6 }} />
			<View style={styles.pill}>
				<Text style={styles.pillText}>Nivel {level}</Text>
			</View>
			{imageUri ? (
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
			<Pressable
				hitSlop={12}
				style={styles.btn}
				onPress={onAccept}
				accessibilityLabel="Aceptar"
			>
				<Text style={styles.btnText}>Aceptar</Text>
			</Pressable>
		</View>
	)
}

const { colors, typography, radii } = require('../../styles/theme')

const styles = StyleSheet.create({
	banner: {
		alignItems: 'center',
		backgroundColor: colors.white,
		borderRadius: radii.lg,
		padding: 16,
		borderWidth: 2,
	},
	congrats: {
		fontSize: typography.size.sm,
		color: colors.green,
		fontFamily: typography.family.semibold,
	},
	title: {
		fontSize: typography.size.lg,
		color: colors.black,
		marginTop: 2,
		fontFamily: typography.family.extrabold,
	},
	pill: {
		marginTop: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: radii.full,
		backgroundColor: 'rgba(250, 204, 21, 0.18)',
	},
	pillText: {
		color: colors.yellow,
		fontFamily: typography.family.extrabold,
	},
	btn: {
		backgroundColor: colors.orange,
		paddingHorizontal: 16,
		paddingVertical: 10,
		borderRadius: radii.md,
	},
	btnText: {
		color: colors.white,
		fontFamily: typography.family.extrabold,
	},
})
