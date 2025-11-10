import { AuthTemplate } from '../../autoBarrell'

export function LoginTemplate({ children, footer }) {
	return (
		<AuthTemplate
			title="Habits"
			subtitle="Convierte rutinas en victorias"
			progressWidth="40%"
		>
			{children}
			{footer}
		</AuthTemplate>
	)
}
