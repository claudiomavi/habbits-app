import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRouter, AuthProvider } from './src/autoBarrell'
import './src/styles/global.css'

const queryClient = new QueryClient()

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<AppRouter />
			</AuthProvider>
		</QueryClientProvider>
	)
}
