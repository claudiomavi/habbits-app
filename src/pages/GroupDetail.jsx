import { GroupDetailTemplate } from '../autoBarrell'

export function GroupDetail({ route, navigation }) {
	const { groupId } = route.params || {}
	return (
		<GroupDetailTemplate
			groupId={groupId}
			navigation={navigation}
		/>
	)
}
