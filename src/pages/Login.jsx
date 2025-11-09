import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { useAuthStore, useUsersStore } from '../autoBarrell'

export function Login() {
	const navigation = useNavigation()
	const { control, handleSubmit } = useForm()
	const [loading, setLoading] = useState(false)

	const { signIn } = useAuthStore()
	const { profileByMail } = useUsersStore()

	const onSubmit = async ({ email, password }) => {
		try {
			setLoading(true)
			const data = await signIn(email, password)
			const user = data?.user || data?.session?.user

			if (!user) {
				Alert.alert(
					'No autorizado',
					'Aún no has verificado tu correo o las credenciales son incorrectas.'
				)
				setLoading(false)
				return
			}

			let profile = null
			try {
				profile = await profileByMail(user.email)
			} catch (err) {
				profile = null
				return err
			}

			if (!profile) {
				navigation.navigate('CreateProfile', { email: user.email })
			} else {
				navigation.navigate('AppStack')
			}
		} catch (err) {
			console.error('Login error:', err)
			Alert.alert('Error', err.message ?? 'Error al iniciar sesión')
		} finally {
			setLoading(false)
		}
	}

	return (
		<LinearGradient
			colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			{/* Elementos decorativos flotantes */}
			<View
				style={styles.decorativeContainer}
				pointerEvents="none"
			>
				<Text style={[styles.floatingEmoji, { top: 60, left: 30 }]}>🏆</Text>
				<Text style={[styles.floatingEmoji, { top: 120, right: 40 }]}>⚡</Text>
				<Text style={[styles.floatingEmoji, { bottom: 180, left: 50 }]}>
					🎯
				</Text>
				<Text style={[styles.floatingEmoji, { bottom: 100, right: 30 }]}>
					🔥
				</Text>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				bounces={false}
			>
				{/* Tarjeta principal */}
				<View style={styles.card}>
					{/* Barra de progreso decorativa */}
					<View style={styles.progressBarContainer}>
						<LinearGradient
							colors={['#4facfe', '#00f2fe', '#43e97b']}
							style={styles.progressFill}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 0 }}
						/>
					</View>

					{/* Logo y título */}
					<View style={styles.logoContainer}>
						<LinearGradient
							colors={['#4facfe', '#43e97b']}
							style={styles.logo}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
						>
							<View style={styles.logoInner}>
								<View style={styles.bar1} />
								<View style={styles.bar2} />
								<View style={styles.bar3} />
							</View>
						</LinearGradient>
						<Text style={styles.title}>Habits</Text>
						<Text style={styles.subtitle}>Convierte rutinas en victorias</Text>
					</View>

					{/* Formulario */}
					<View style={styles.form}>
						{/* Email Input */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Email</Text>
							<Controller
								control={control}
								name="email"
								rules={{ required: true }}
								defaultValue=""
								render={({ field: { onChange, value } }) => (
									<TextInput
										value={value}
										onChangeText={onChange}
										keyboardType="email-address"
										autoCapitalize="none"
										placeholder="tu@email.com"
										placeholderTextColor="#9CA3AF"
										style={styles.input}
									/>
								)}
							/>
						</View>

						{/* Password Input */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Contraseña</Text>
							<Controller
								control={control}
								name="password"
								rules={{ required: true }}
								defaultValue=""
								render={({ field: { onChange, value } }) => (
									<TextInput
										value={value}
										onChangeText={onChange}
										secureTextEntry
										placeholder="••••••••"
										placeholderTextColor="#9CA3AF"
										style={styles.input}
									/>
								)}
							/>
						</View>

						{/* Botón principal */}
						<TouchableOpacity
							onPress={handleSubmit(onSubmit)}
							disabled={loading}
							style={styles.mainButton}
							activeOpacity={0.8}
						>
							<LinearGradient
								colors={['#4facfe', '#43e97b']}
								style={styles.gradientButton}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
							>
								{loading ?
									<ActivityIndicator color="#fff" />
								:	<Text style={styles.mainButtonText}>Entrar</Text>}
							</LinearGradient>
						</TouchableOpacity>

						{/* Olvidaste tu contraseña */}
						<TouchableOpacity
							onPress={() => navigation.navigate('ForgotPassword')}
							style={{ alignItems: 'center' }}
						>
							<Text
								style={{ color: '#4facfe', fontSize: 14, fontWeight: '600' }}
							>
								¿Olvidaste tu contraseña?
							</Text>
						</TouchableOpacity>

						{/* Divider */}
						<View style={styles.divider}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>o continúa con</Text>
							<View style={styles.dividerLine} />
						</View>

						{/* Botones sociales */}
						<View style={styles.socialButtons}>
							<TouchableOpacity
								onPress={() => Alert.alert('Google', 'Próximamente')}
								disabled={loading}
								style={styles.googleButton}
								activeOpacity={0.7}
							>
								<Text style={styles.googleIcon}>G</Text>
								<Text style={styles.socialButtonText}>Google</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => Alert.alert('Apple', 'Próximamente')}
								disabled={loading}
								style={styles.appleButton}
								activeOpacity={0.7}
							>
								<Text style={styles.appleIcon}>A</Text>
								<Text style={styles.socialButtonTextWhite}>Apple</Text>
							</TouchableOpacity>
						</View>

						{/* Registro */}
						<View style={styles.footer}>
							<Text style={styles.footerText}>¿No tienes cuenta? </Text>
							<TouchableOpacity onPress={() => navigation.navigate('Register')}>
								<Text style={styles.footerLink}>Regístrate</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>
		</LinearGradient>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	decorativeContainer: {
		position: 'absolute',
		width: '100%',
		height: '100%',
	},
	floatingEmoji: {
		position: 'absolute',
		fontSize: 48,
		opacity: 0.2,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingVertical: 40,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 32,
		padding: 32,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 10,
		overflow: 'hidden',
	},
	progressBarContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: 4,
		backgroundColor: '#E5E7EB',
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
	},
	progressFill: {
		width: '40%',
		height: '100%',
	},
	logoContainer: {
		alignItems: 'center',
		marginBottom: 24,
		marginTop: 8,
	},
	logo: {
		width: 72,
		height: 72,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		shadowColor: '#4facfe',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	logoInner: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		gap: 4,
	},
	bar1: { width: 6, height: 24, backgroundColor: '#fff', borderRadius: 3 },
	bar2: {
		width: 6,
		height: 18,
		backgroundColor: '#fff',
		borderRadius: 3,
		marginTop: 6,
	},
	bar3: { width: 6, height: 30, backgroundColor: '#fff', borderRadius: 3 },
	title: {
		fontSize: 32,
		fontWeight: 'bold',
		color: '#1F2937',
	},
	subtitle: {
		fontSize: 14,
		color: '#6B7280',
		marginTop: 4,
	},
	form: {
		gap: 16,
	},
	inputGroup: {
		gap: 8,
	},
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
	},
	input: {
		backgroundColor: '#F9FAFB',
		borderWidth: 2,
		borderColor: '#E5E7EB',
		borderRadius: 16,
		padding: 14,
		fontSize: 16,
		color: '#1F2937',
	},
	errorText: {
		fontSize: 12,
		color: '#EF4444',
		marginTop: 4,
	},
	mainButton: {
		marginTop: 8,
		borderRadius: 16,
		overflow: 'hidden',
		shadowColor: '#4facfe',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	gradientButton: {
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	mainButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '700',
	},
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 8,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: '#E5E7EB',
	},
	dividerText: {
		marginHorizontal: 16,
		fontSize: 12,
		color: '#9CA3AF',
	},
	socialButtons: {
		flexDirection: 'row',
		gap: 12,
	},
	googleButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		borderRadius: 12,
		gap: 8,
		backgroundColor: '#fff',
		borderWidth: 2,
		borderColor: '#E5E7EB',
	},
	appleButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		borderRadius: 12,
		gap: 8,
		backgroundColor: '#000',
	},
	googleIcon: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#4285F4',
	},
	appleIcon: {
		fontSize: 18,
		color: '#fff',
	},
	socialButtonText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#374151',
	},
	socialButtonTextWhite: {
		fontSize: 14,
		fontWeight: '600',
		color: '#fff',
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 8,
	},
	footerText: {
		fontSize: 14,
		color: '#6B7280',
	},
	footerLink: {
		fontSize: 14,
		fontWeight: '600',
		color: '#4facfe',
	},
})
