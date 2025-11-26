import { LinearGradient } from 'expo-linear-gradient'
import { Controller } from 'react-hook-form'
import {
	ActivityIndicator,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'

export function CreateProfileTemplate({
	control,
	avatars,
	selectedAvatar,
	setSelectedAvatar,
	handleSubmit,
	onSubmit,
	loading,
}) {
	return (
		<LinearGradient
			colors={require('../../styles/theme').gradients.backgroundSoft}
			style={styles.container}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
		>
			{/* Elementos decorativos flotantes */}
			<View
				style={styles.decorativeContainer}
				pointerEvents="none"
			>
				<Text style={[styles.floatingEmoji, { top: 50, left: 30 }]}>🎮</Text>
				<Text style={[styles.floatingEmoji, { top: 110, right: 30 }]}>🏅</Text>
				<Text style={[styles.floatingEmoji, { bottom: 160, left: 40 }]}>
					👤
				</Text>
				<Text style={[styles.floatingEmoji, { bottom: 90, right: 25 }]}>
					✨
				</Text>
			</View>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				bounces={false}
			>
				{/* Tarjeta principal */}
				<View style={styles.card}>
					{/* Barra de progreso decorativa - más llena que login */}
					<View style={styles.progressBarContainer}>
						<LinearGradient
							colors={require('../../styles/theme').gradients.accent}
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
						<Text style={styles.title}>¡Bienvenido!</Text>
						<Text style={styles.subtitle}>
							Crea tu perfil para empezar tu viaje
						</Text>
					</View>

					{/* Formulario */}
					<View style={styles.form}>
						{/* Nombre Input */}
						<View style={styles.inputGroup}>
							<Text style={styles.label}>Nombre de usuario</Text>
							<Controller
								control={control}
								name="display_name"
								rules={{
									required: 'El nombre es obligatorio',
									minLength: { value: 3, message: 'Mínimo 3 caracteres' },
								}}
								defaultValue=""
								render={({
									field: { onChange, value },
									fieldState: { error },
								}) => (
									<>
										<TextInput
											value={value}
											onChangeText={onChange}
											placeholder="Tu nombre"
											placeholderTextColor={
												require('../../styles/theme').colors.gray400
											}
											style={styles.input}
										/>
										{error && (
											<Text style={styles.errorText}>{error.message}</Text>
										)}
									</>
								)}
							/>
						</View>

						{/* Selector de avatar */}
						<View style={styles.avatarSection}>
							<Text style={styles.label}>Elige tu personaje</Text>
							<View style={styles.avatarContainer}>
								{(avatars || []).map((avatar) => (
									<TouchableOpacity
										key={avatar.id}
										onPress={() => setSelectedAvatar(avatar)}
										style={[
											styles.avatarOption,
											selectedAvatar?.uri === avatar.uri &&
												styles.avatarSelected,
										]}
										activeOpacity={0.7}
									>
										<Image
											source={{ uri: avatar.uri }}
											style={styles.avatarImage}
										/>
										<Text
											style={[
												styles.avatarLabel,
												selectedAvatar?.uri === avatar.uri &&
													styles.avatarLabelSelected,
											]}
										>
											{avatar.label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
							{!selectedAvatar && (
								<Text style={styles.hintText}>
									Selecciona un avatar para continuar
								</Text>
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
								colors={['#4facfe', '#43e97b']}
								style={styles.gradientButton}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 0 }}
							>
								{loading ? (
									<ActivityIndicator color="#fff" />
								) : (
									<Text style={styles.mainButtonText}>Comenzar aventura</Text>
								)}
							</LinearGradient>
						</TouchableOpacity>

						{/* Info adicional */}
						<View style={styles.infoBox}>
							<Text style={styles.infoIcon}>💡</Text>
							<Text style={styles.infoText}>
								Ganarás XP completando hábitos y subirás de nivel. ¡Empieza en
								nivel 1!
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</LinearGradient>
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
		alignSelf: 'stretch',
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
		width: '80%',
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
		textAlign: 'center',
	},
	form: {
		gap: 20,
	},
	inputGroup: {
		gap: 8,
	},
	label: {
		fontSize: typography.size.sm,
		fontFamily: typography.family.semibold,
		color: colors.gray700,
	},
	input: {
		backgroundColor: colors.gray50,
		borderWidth: 2,
		borderColor: colors.gray200,
		borderRadius: radii.lg,
		padding: 14,
		fontSize: typography.size.md,
		color: colors.gray800,
	},
	errorText: {
		fontFamily: typography.family.regular,
		fontSize: typography.size.xs,
		color: colors.red,
		marginTop: 4,
	},
	avatarSection: {
		gap: 12,
	},
	avatarContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 20,
	},
	avatarOption: {
		alignItems: 'center',
		padding: 12,
		borderRadius: radii.xl,
		borderWidth: 3,
		borderColor: 'transparent',
		backgroundColor: colors.gray50,
	},
	avatarSelected: {
		borderColor: colors.orange,
		backgroundColor: 'rgba(255, 106, 0, 0.10)',
	},
	avatarImage: {
		width: 80,
		height: 80,
		borderRadius: radii.xxl,
		marginBottom: 8,
	},
	avatarLabel: {
		fontSize: typography.size.sm,
		fontFamily: typography.family.semibold,
		color: colors.gray500,
	},
	avatarLabelSelected: {
		color: colors.orange,
	},
	hintText: {
		fontSize: typography.size.xs,
		color: colors.gray400,
		textAlign: 'center',
		fontStyle: 'italic',
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
		color: colors.white,
		fontSize: typography.size.md,
		fontFamily: typography.family.bold,
	},
	infoBox: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.gray100,
		padding: 16,
		borderRadius: radii.lg,
		gap: 12,
		borderWidth: 1,
		borderColor: '#BFDBFE',
	},
	infoIcon: {
		fontSize: typography.size.h2,
	},
	infoText: {
		flex: 1,
		fontSize: 13,
		color: '#1E40AF',
		lineHeight: 18,
	},
})
