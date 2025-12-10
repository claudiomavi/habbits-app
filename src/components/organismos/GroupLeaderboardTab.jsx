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
		return (
			<View style={styles.row}>
				<Text style={styles.pos}>{index + 1}</Text>
				<View style={styles.middle}>
					<Text
						style={styles.name}
						numberOfLines={1}
					>
						{item.name}
						{item.iamOwner ? ' (owner)' : ''}
					</Text>
					<Text
						style={styles.level}
						numberOfLines={1}
					>
						{item.level ? `Nivel ${item.level}` : ' '}
					</Text>
				</View>
				<Text style={styles.xp}>{item.xp} XP</Text>
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
		paddingVertical: 8,
	},
	pos: { width: 24, textAlign: 'center', color: colors.gray600 },
	middle: { flex: 1, justifyContent: 'center' },
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
