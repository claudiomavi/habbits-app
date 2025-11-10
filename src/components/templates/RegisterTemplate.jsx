import { AuthTemplate } from '../../autoBarrell'

export function RegisterTemplate({ children, footer }) {
	return (
		<AuthTemplate
			title="Crear cuenta"
			subtitle="Únete a la comunidad de Habits"
			progressWidth="50%"
		>
			{children}
			{footer}
		</AuthTemplate>
	)
}
