import Ionicons from '@expo/vector-icons/Ionicons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Habits, Home, Profile, Statistics } from '../autoBarrell'

const Tab = createBottomTabNavigator()

export function AppStack() {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarShowLabel: true,
				tabBarActiveTintColor: '#4F46E5',
				tabBarInactiveTintColor: '#6B7280',
				tabBarStyle: {
					backgroundColor: '#fff',
					borderTopColor: '#E5E7EB',
					height: 60,
					paddingBottom: 6,
				},
				tabBarIcon: ({ color, size, focused }) => {
					let iconName = 'home'
					if (route.name === 'Home')
						iconName = focused ? 'home' : 'home-outline'
					if (route.name === 'Hábitos')
						iconName = focused ? 'list' : 'list-outline'
					if (route.name === 'Perfil')
						iconName = focused ? 'person' : 'person-outline'
					if (route.name === 'Estadísticas')
						iconName = focused ? 'stats-chart' : 'stats-chart-outline'
					return (
						<Ionicons
							name={iconName}
							size={size}
							color={color}
						/>
					)
				},
			})}
		>
			<Tab.Screen
				name="Home"
				component={Home}
				options={{ title: 'Inicio' }}
			/>
			<Tab.Screen
				name="Hábitos"
				component={Habits}
			/>
			<Tab.Screen
				name="Perfil"
				component={Profile}
			/>
			<Tab.Screen
				name="Estadísticas"
				component={Statistics}
			/>
		</Tab.Navigator>
	)
}
