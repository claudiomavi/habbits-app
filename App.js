import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { AppRouter, useAuthStore } from './src/autoBarrell'
const queryClient = new QueryClient()

export default function App() {
	const { initAuth } = useAuthStore()

	useEffect(() => {
		initAuth()
	}, [])

	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<NavigationContainer>
					<AppRouter />
				</NavigationContainer>
			</QueryClientProvider>
		</SafeAreaProvider>
	)
}
