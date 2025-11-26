import { LinearGradient } from 'expo-linear-gradient'
import { Controller } from 'react-hook-form'
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { AuthTemplate } from '../../autoBarrell'

export function RegisterTemplate({
	control,
	confirmPassword,
	password,
	handleSubmit,
	onSubmit,
	loading,
	navigation,
}) {
	return (
		<AuthTemplate
			title="Crear cuenta"
			subtitle="Únete a la comunidad de Habits"
			progressWidth="50%"
		>
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

			{/* Confirm Password Input */}
			<View style={styles.inputGroup}>
				<Text style={styles.label}>Confirmar contraseña</Text>
				<Controller
					control={control}
					name="confirmPassword"
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
				{confirmPassword && confirmPassword !== password && (
					<Text style={styles.errorText}>Las contraseñas no coinciden</Text>
				)}
			</View>

			{/* Botón principal */}
			<TouchableOpacity
				onPress={handleSubmit(onSubmit)}
				disabled={loading}
				style={styles.mainButton}
				activeOpacity={0.8}
			>
				<LinearGradient
					colors={require('../../styles/theme').gradients.cta}
					style={styles.gradientButton}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
				>
					{loading ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Text style={styles.mainButtonText}>Crear cuenta</Text>
					)}
				</LinearGradient>
			</TouchableOpacity>

			{/* Divider */}
			<View style={styles.divider}>
				<View style={styles.dividerLine} />
				<Text style={styles.dividerText}>o regístrate con</Text>
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

			{/* Login link */}
			<View style={styles.footer}>
				<Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Text style={styles.footerLink}>Inicia sesión</Text>
				</TouchableOpacity>
			</View>
		</AuthTemplate>
	)
}

const { colors, typography, radii } = require('../../styles/theme')

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
		fontSize: typography.size.xxxl,
		opacity: 0.2,
	},
	scrollContent: {
		flexGrow: 1,
		justifyContent: 'center',
		paddingHorizontal: 20,
		paddingVertical: 40,
	},
	card: {
		backgroundColor: colors.white,
		borderRadius: radii.xxl,
		padding: 32,
		shadowColor: colors.black,
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
		backgroundColor: colors.gray200,
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
	},
	progressFill: {
		width: '60%',
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
		borderRadius: radii.xl,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
		shadowColor: colors.lightBlue,
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
	bar1: {
		width: 6,
		height: 24,
		backgroundColor: colors.white,
		borderRadius: radii.xxs,
	},
	bar2: {
		width: 6,
		height: 18,
		backgroundColor: colors.white,
		borderRadius: radii.xxs,
		marginTop: 6,
	},
	bar3: {
		width: 6,
		height: 30,
		backgroundColor: colors.white,
		borderRadius: radii.xxs,
	},
	title: {
		fontSize: typography.size.xxl,
		fontFamily: typography.family.bold,
		color: colors.gray800,
	},
	subtitle: {
		fontSize: typography.size.sm,
		color: colors.gray500,
		marginTop: 4,
	},
	form: {
		gap: 16,
	},
	inputGroup: {
		gap: 8,
	},
	label: {
		fontFamily: typography.family.semibold,
		fontSize: typography.size.sm,
		color: colors.gray700,
	},
	input: {
		fontFamily: typography.family.regular,
		backgroundColor: colors.gray50,
		borderWidth: 2,
		borderColor: colors.gray200,
		borderRadius: radii.lg,
		padding: 14,
		fontSize: typography.size.md,
		color: colors.gray800,
	},
	errorText: {
		fontSize: typography.size.xs,
		color: colors.red,
		marginTop: 4,
	},
	mainButton: {
		marginTop: 8,
		borderRadius: radii.lg,
		overflow: 'hidden',
		shadowColor: colors.lightBlue,
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
		fontFamily: typography.family.bold,
		color: colors.white,
		fontSize: typography.size.md,
	},
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 8,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: colors.gray200,
	},
	dividerText: {
		marginHorizontal: 16,
		fontSize: typography.size.xs,
		color: colors.gray400,
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
		borderRadius: radii.md,
		gap: 8,
		backgroundColor: colors.white,
		borderWidth: 2,
		borderColor: colors.gray200,
	},
	appleButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		borderRadius: radii.md,
		gap: 8,
		backgroundColor: colors.black,
	},
	googleIcon: {
		fontSize: typography.size.lg,
		fontFamily: typography.family.bold,
		color: colors.blue,
	},
	appleIcon: {
		fontSize: typography.size.lg,
		color: colors.white,
	},
	socialButtonText: {
		fontSize: typography.size.sm,
		fontFamily: typography.family.semibold,
		color: colors.gray700,
	},
	socialButtonTextWhite: {
		fontSize: typography.size.sm,
		fontFamily: typography.family.semibold,
		color: colors.white,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 8,
	},
	footerText: {
		fontSize: typography.size.sm,
		color: colors.gray500,
	},
	footerLink: {
		fontFamily: typography.family.semibold,
		fontSize: typography.size.sm,
		color: colors.lightBlue,
	},
})
