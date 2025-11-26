import React from 'react'
import { ActivityIndicator, View } from 'react-native'

// Carga Poppins si está disponible. Si no, continúa con System.
export function FontsProvider({ children }) {
	const [ready, setReady] = React.useState(false)

	React.useEffect(() => {
		let mounted = true
		;(async () => {
			try {
				// Carga dinámica para no romper si no está instalada la dependencia
				const Font =
					(await import('expo-font')).default || (await import('expo-font'))
				try {
					const poppins = await import('@expo-google-fonts/poppins')
					const {
						Poppins_300Light,
						Poppins_400Regular,
						Poppins_500Medium,
						Poppins_600SemiBold,
						Poppins_700Bold,
						Poppins_800ExtraBold,
					} = poppins
					await Font.loadAsync({
						Poppins_300: Poppins_300Light,
						Poppins_400: Poppins_400Regular,
						Poppins_500: Poppins_500Medium,
						Poppins_600: Poppins_600SemiBold,
						Poppins_700: Poppins_700Bold,
						Poppins_800: Poppins_800ExtraBold,
					})
				} catch (e) {
					// Si no existe el paquete de fuentes, seguimos con System
				}
			} catch (e) {
				// Ignorar errores de fuente
			} finally {
				if (mounted) setReady(true)
			}
		})()
		return () => {
			mounted = false
		}
	}, [])

	if (!ready) {
		return (
			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<ActivityIndicator />
			</View>
		)
	}
	return children
}
export default FontsProvider
