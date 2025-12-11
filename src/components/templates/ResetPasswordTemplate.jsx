import { LinearGradient } from 'expo-linear-gradient'
import { Controller } from 'react-hook-form'
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AuthTemplate } from '../../autoBarrell'

export function ResetPasswordTemplate({ control, handleSubmit, onSubmit, loading, newPassword, confirmPassword, navigation }) {
	return (
		<AuthTemplate title="Nueva contraseña" subtitle="Ingresa y confirma tu nueva contraseña">
			<View style={styles.inputGroup}>
				<Text style={styles.label}>Nueva contraseña</Text>
				<Controller
					control={control}
					name="password"
					rules={{ required: true, minLength: 6 }}
					defaultValue=""
					render={({ field: { onChange, value } }) => (
						<TextInput value={value} onChangeText={onChange} secureTextEntry placeholder="••••••••" placeholderTextColor="#9CA3AF" style={styles.input} />
					)}
				/>
			</View>
			<View style={styles.inputGroup}>
				<Text style={styles.label}>Confirmar contraseña</Text>
				<Controller
					control={control}
					name="confirmPassword"
					rules={{ required: true, minLength: 6 }}
					defaultValue=""
					render={({ field: { onChange, value } }) => (
						<TextInput value={value} onChangeText={onChange} secureTextEntry placeholder="••••••••" placeholderTextColor="#9CA3AF" style={styles.input} />
					)}
				/>
				{confirmPassword && confirmPassword !== newPassword ? (
					<Text style={styles.errorText}>Las contraseñas no coinciden</Text>
				) : null}
			</View>

			<TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading} style={styles.mainButton} activeOpacity={0.8}>
				<LinearGradient colors={require('../../styles/theme').gradients.cta} style={styles.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
					{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.mainButtonText}>Guardar nueva contraseña</Text>}
				</LinearGradient>
			</TouchableOpacity>

			<View style={styles.footer}>
				<TouchableOpacity onPress={() => navigation.replace('Login')}>
					<Text style={styles.footerLink}>Volver al login</Text>
				</TouchableOpacity>
			</View>
		</AuthTemplate>
	)
}

const { typography, colors, radii } = require('../../styles/theme')
const styles = StyleSheet.create({
	inputGroup: { gap: 8 },
	label: { fontFamily: typography.family.semibold, fontSize: typography.size.sm, color: colors.gray700 },
	input: { fontFamily: typography.family.regular, backgroundColor: colors.gray50, borderWidth: 2, borderColor: colors.gray200, borderRadius: radii.lg, padding: 14, fontSize: typography.size.md, color: colors.gray800 },
	errorText: { fontSize: typography.size.xs, color: colors.red, marginTop: 4 },
	mainButton: { marginTop: 8, borderRadius: radii.lg, overflow: 'hidden' },
	gradientButton: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
	mainButtonText: { fontFamily: typography.family.bold, color: colors.white, fontSize: typography.size.md },
	footer: { marginTop: 12, alignItems: 'center' },
	footerLink: { color: colors.lightBlue, fontFamily: typography.family.semibold },
})
