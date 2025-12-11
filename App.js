import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { initNotifications } from './src/utils/notifications'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppRouter, useAuthStore } from './src/autoBarrell'
const queryClient = new QueryClient()

export default function App() {
	const { initAuth } = useAuthStore()

	useEffect(() => {
		initNotifications()
		initAuth()
	}, [])

	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				{(() => {
					const FontsProvider = require('./src/styles/FontsProvider').default
					return (
						<FontsProvider>
							<NavigationContainer>
								<AppRouter />
							</NavigationContainer>
						</FontsProvider>
					)
				})()}
			</QueryClientProvider>
		</SafeAreaProvider>
	)
}
