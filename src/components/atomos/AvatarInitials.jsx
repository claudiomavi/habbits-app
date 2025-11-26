import { StyleSheet, Text, View } from 'react-native'

export function AvatarInitials({ text = 'U', size = 48 }) {
	return (
		<View
			style={[
				styles.avatar,
				{ width: size, height: size, borderRadius: size / 4 },
			]}
		>
			<Text style={styles.avatarText}>{text?.toUpperCase()?.[0] || 'U'}</Text>
		</View>
	)
}

const { colors, typography } = require('../../styles/theme')
const styles = StyleSheet.create({
	avatar: {
		backgroundColor: 'rgba(255,255,255,0.9)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: { fontWeight: typography.weight.extrabold, color: colors.black },
})
