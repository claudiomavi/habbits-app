import { Text } from 'react-native'
import { CardContainer, GradientBackground } from '../../autoBarrell'

export function GroupHabitsTab({ route }) {
	const { groupId } = route.params || {}

	return (
		<GradientBackground style={{ flex: 1, padding: 16 }}>
			<CardContainer>
				<Text style={{ fontWeight: '700' }}>Hábitos del grupo (máx. 5)</Text>
				<Text style={{ color: '#6B7280' }}>Pendiente de implementar</Text>
			</CardContainer>
		</GradientBackground>
	)
}
