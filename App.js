import { AuthProvider } from './src/context/AuthContext'
import AppRouter from './src/routers/AppRouter'

export default function App() {
	return (
		<AuthProvider>
			<AppRouter />
		</AuthProvider>
	)
}
