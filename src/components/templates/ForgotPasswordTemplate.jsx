import { LinearGradient } from 'expo-linear-gradient'
import { Controller } from 'react-hook-form'
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AuthTemplate } from '../../autoBarrell'

export function ForgotPasswordTemplate({ control, handleSubmit, onSubmit, loading, navigation }) {
	return (
		<AuthTemplate title="Restablecer contraseña" subtitle="Te enviaremos un enlace">
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

			<TouchableOpacity onPress={handleSubmit(onSubmit)} disabled={loading} style={styles.mainButton} activeOpacity={0.8}>
				<LinearGradient colors={require('../../styles/theme').gradients.cta} style={styles.gradientButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
					{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.mainButtonText}>Enviar enlace</Text>}
				</LinearGradient>
			</TouchableOpacity>

			<View style={styles.footer}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Text style={styles.footerLink}>Volver</Text>
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
	mainButton: { marginTop: 8, borderRadius: radii.lg, overflow: 'hidden' },
	gradientButton: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
	mainButtonText: { fontFamily: typography.family.bold, color: colors.white, fontSize: typography.size.md },
	footer: { marginTop: 12, alignItems: 'center' },
	footerLink: { color: colors.lightBlue, fontFamily: typography.family.semibold },
})
