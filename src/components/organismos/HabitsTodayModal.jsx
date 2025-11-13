import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import { CardContainer } from '../../autoBarrell'

export function HabitsTodayModal({
	visible,
	onClose,
	todaysHabits = [],
	renderHabit,
	loading,
}) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<View style={styles.backdrop}>
				<View style={styles.sheet}>
					<CardContainer>
						<View style={styles.header}>
							<Text style={styles.title}>Hábitos de hoy</Text>
							<Pressable
								onPress={onClose}
								style={styles.closeBtn}
								accessibilityLabel="Cerrar"
							>
								<Text style={styles.closeTxt}>✕</Text>
							</Pressable>
						</View>
						{loading ? (
							<ActivityIndicator />
						) : (
							<FlatList
								data={todaysHabits}
								keyExtractor={(item) => item.id}
								renderItem={renderHabit}
								contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
								style={{ maxHeight: Dimensions.get('window').height * 0.6 }}
							/>
						)}
					</CardContainer>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.35)',
		justifyContent: 'flex-end',
	},
	sheet: {
		width: '100%',
		padding: 16,
	},
	header: { flexDirection: 'row', alignItems: 'center' },
	title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827' },
	closeBtn: { paddingHorizontal: 8, paddingVertical: 4 },
	closeTxt: { fontSize: 18, color: '#6B7280', fontWeight: '700' },
})
