import { useEffect, useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import {
	CardContainer,
	GradientBackground,
	listGroupMembers,
} from '../../autoBarrell'

export function GroupLeaderboardTab({ route }) {
	const { groupId } = route.params || {}
	const [loading, setLoading] = useState(false)
	const [members, setMembers] = useState([])

	useEffect(() => {
		let mounted = true
		async function load() {
			if (!groupId) return
			setLoading(true)
			try {
				const raw = await listGroupMembers(groupId)
				const list = (raw || []).map((m) => ({
					id: `${m.user_id}`,
					name: m?.profiles?.display_name || m?.profiles?.email || 'Sin nombre',
					avatar: m?.profiles?.avatar || null,
					xp: Number(m?.profiles?.xp || 0),
					level: m?.profiles?.level ?? null,
					iamOwner: m.role === 'owner',
				}))
				list.sort((a, b) => b.xp - a.xp)
				if (mounted) setMembers(list)
			} finally {
				if (mounted) setLoading(false)
			}
		}
		load()
		return () => {
			mounted = false
		}
	}, [groupId])

	const renderItem = ({ item, index }) => {
		const isTop = index < 3
		const rowStyle = [
			styles.row,
			isTop && (index === 0 ? styles.podium0 : index === 1 ? styles.podium1 : styles.podium2),
		]
		const posContent = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`
		return (
			<View style={rowStyle}>
				<Text style={[styles.pos, isTop && styles.posTop]}>{posContent}</Text>
				<View style={styles.middle}>
					<Text style={[styles.name, isTop && styles.nameTop]} numberOfLines={1}>
						{index === 0 ? '👑 ' : ''}{item.name}
						{item.iamOwner ? ' (owner)' : ''}
					</Text>
					<Text style={[styles.level, isTop && styles.levelTop]} numberOfLines={1}>
						{item.level ? `Nivel ${item.level}` : '0'}
					</Text>
				</View>
				<Text style={[styles.xp, isTop && styles.xpTop]}>{item.xp} XP</Text>
			</View>
		)
	}

	return (
		<GradientBackground style={{ flex: 1, padding: 16 }}>
			<CardContainer>
				<Text style={styles.title}>Clasificación</Text>
				{loading ? (
					<View style={styles.loading}>
						<ActivityIndicator />
					</View>
				) : (
					<FlatList
						data={members}
						keyExtractor={(i) => i.id}
						renderItem={renderItem}
						ItemSeparatorComponent={() => <View style={styles.sep} />}
						ListEmptyComponent={() => (
							<View style={styles.empty}>
								<Text style={styles.helper}>No hay miembros aún</Text>
							</View>
						)}
					/>
				)}
			</CardContainer>
		</GradientBackground>
	)
}

const { colors, typography } = require('../../styles/theme')
const styles = StyleSheet.create({
	title: { fontFamily: typography.family.bold, fontSize: typography.size.md },
	helper: { color: colors.gray500 },
	loading: { paddingVertical: 16 },
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 12,
		paddingVertical: 10,
		borderRadius: 12,
	},
	pos: { width: 30, textAlign: 'center', color: colors.gray600 },
	posTop: { fontSize: typography.size.lg },
	middle: {
		flex: 1,
		flexDirection: 'row',

		alignItems: 'center',
		gap: 8,
	},
	name: {
		fontFamily: typography.family.semibold,
		color: colors.black,
	},
	level: {
		color: colors.gray500,
		fontSize: typography.size.xs,
		textAlign: 'center',
	},
	xp: {
		fontFamily: typography.family.bold,
		color: colors.black,
		textAlign: 'right',
		minWidth: 60,
	},
	sep: { height: 1, backgroundColor: colors.gray200, marginVertical: 4 },
	empty: { paddingVertical: 12 },
})
