import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppRouter, AuthProvider, useAuthStore } from './src/autoBarrell'
import './src/styles/global.css'

const queryClient = new QueryClient()

export default function App() {
	const { initAuth } = useAuthStore()

	useEffect(() => {
		initAuth()
	}, [])

	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<AppRouter />
				</AuthProvider>
			</QueryClientProvider>
		</SafeAreaProvider>
	)
}
