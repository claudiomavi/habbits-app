import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AvatarInitials } from '../atomos/AvatarInitials'
import { XPBar } from '../moleculas/XPBar'

export function HeaderBar({
	name,
	initial,
	onLogout,
	xpPercent = 0.45,
	level = 1,
	avatarUri,
}) {
	const size = 48
	return (
		<View style={styles.header}>
			{avatarUri ? (
				<Image
					source={{ uri: avatarUri }}
					style={{ width: size, height: size, borderRadius: size / 4 }}
				/>
			) : (
				<AvatarInitials
					text={initial}
					size={size}
				/>
			)}
			<View style={{ flex: 1 }}>
				<Text style={styles.welcome}>Hola, {name}</Text>
				<Text style={styles.level}>Nivel {level}</Text>
				<XPBar percent={xpPercent} />
			</View>
			{onLogout && (
				<TouchableOpacity
					onPress={onLogout}
					style={styles.logoutBtn}
				>
					<Text style={styles.logoutText}>Salir</Text>
				</TouchableOpacity>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
		gap: 12,
	},
	welcome: { color: '#fff', fontSize: 16, fontWeight: '600' },
	level: { color: '#E5E7EB', fontSize: 12, marginTop: 2 },
	logoutBtn: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: 'rgba(0,0,0,0.2)',
		borderRadius: 10,
	},
	logoutText: { color: '#fff', fontWeight: '700' },
})
