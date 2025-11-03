import { AuthProvider } from './src/context/AuthContext'
import AppRouter from './src/routers/AppRouter'
import './src/styles/global.css'

export default function App() {
	return (
		<AuthProvider>
			<AppRouter />
		</AuthProvider>
	)
}
