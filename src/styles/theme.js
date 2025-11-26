// Brand theme for Habits
// Paleta basada en el manual de identidad
export const colors = {
	// Core brand
	orange: '#FF6A00', // CTA / acciones
	orangeBg: 'hsl(25, 100%, 85%)',
	green: '#22C55E', // progreso / crecimiento
	lightGreen: '#D1FAE5',
	yellow: '#af8d04', // logros / recordatorios positivos
	yellowBg: '#fdefb4',
	lightBlue: '#4facfe',
	blue: '#4285F4',

	// Neutrals
	white: '#FFFFFF',
	black: '#111827',
	gray800: '#1F2937',
	gray700: '#374151',
	gray600: '#4B5563',
	gray500: '#6B7280',
	gray400: '#9CA3AF',
	gray300: '#D1D5DB',
	gray200: '#E5E7EB',
	gray100: '#F3F4F6',
	gray50: '#F9FAFB',
	red: '#EF4444',
	lightRed: '#FEE2E2',
	bgBase: '#FFF8F1',
}

export const gradients = {
	// Aplicar con moderación, la marca pide fondos claros.
	// Botón principal: leve transición naranja -> amarillo
	cta: ['#FF6A00', '#FF8C1A'],
	// Accento secundario
	accent: ['#22C55E', '#86EFAC'],
	// Fondo cálido sutil para que las cards blancas destaquen
	backgroundSoft: ['#FFD3A1', '#FFEBCC', '#FFFFFF'],
}

export const radii = {
	xxs: 3,
	xs: 6,
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	xxl: 32,
	full: 999,
}

export const shadows = {
	soft: {
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 6 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 4,
	},
}

export const typography = {
	// Cuando integremos Montserrat/Poppins, cambiaremos estas fontFamily
	// a las cargadas por expo-font.
	family: {
		regular: 'Poppins_400',
		medium: 'Poppins_500',
		semibold: 'Poppins_600',
		bold: 'Poppins_700',
		extrabold: 'Poppins_800',
		light: 'Poppins_300',
	},
	size: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 20,
		h2: 24,
		h1: 28,
		xxl: 32,
		xxxl: 48,
	},
	weight: {
		regular: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
		extrabold: '800',
	},
}

export const theme = { colors, gradients, radii, shadows, typography }
export default theme
