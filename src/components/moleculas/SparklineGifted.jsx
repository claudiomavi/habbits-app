import { useMemo } from 'react'
import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	useWindowDimensions,
} from 'react-native'
import { LineChart } from 'react-native-gifted-charts'

export function SparklineGifted({
	dailyCounts = [],
	prevDailyCounts = [],
	height = 140,
	color1 = '#10B981',
	color2 = '#60A5FA',
	showComparison = true,
	animate = true,
	animationDuration = 600,
}) {
	const { width: winWidth } = useWindowDimensions()

	// Cálculos de layout
	const count = Array.isArray(dailyCounts) ? dailyCounts.length : 0
	let perPoint = 14
	const initial = 12
	const baseWidth = Math.floor(winWidth - 48)
	const maxTooltipWidth = Math.min(150, Math.floor(winWidth * 0.6))
	const rightPad = Math.ceil(maxTooltipWidth + 12)
	// Espaciado dinámico por punto según ancho y nº de puntos
	const minPx = 20
	const maxPx = 70
	const available = Math.max(0, baseWidth - initial - rightPad)
	const autoPx = count > 1 ? Math.floor(available / (count - 1)) : available
	perPoint = Math.max(minPx, Math.min(maxPx, autoPx))
	// ancho total: margen inicial + (N-1)*espaciado + margen final para tooltip
	const chartWidth = Math.max(
		baseWidth,
		initial + Math.max(0, count - 1) * perPoint
	)
	const hideXLabels = count >= 10

	// Datos para el chart
	const { data, data2 } = useMemo(() => {
		const data = (dailyCounts || []).map((d) => {
			const iso = d?.dateISO || ''
			const dd = iso.slice(8, 10)
			const mm = iso.slice(5, 7)
			const aa = iso.slice(2, 4)
			return {
				value: d.completedCount || 0,
				label: hideXLabels ? '' : `${dd}-${mm}`,
				tooltipLabel: iso ? `${dd}/${mm}/${aa}` : '',
			}
		})
		const data2 = (prevDailyCounts || []).map((d) => ({
			value: d.completedCount || 0,
			label: d.dateISO?.slice(5) || '',
		}))
		return { data, data2 }
	}, [dailyCounts, prevDailyCounts, hideXLabels])

	// Estado vacío
	if (!data || data.length === 0) {
		return <View style={[height, styles.vacuumContainer]} />
	}

	return (
		<View style={styles.container}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingRight: rightPad,
					paddingBottom: 36,
				}}
			>
				<LineChart
					data={data}
					data2={showComparison ? data2 : undefined}
					height={height}
					curved
					areaChart
					showGradient
					showDataPoints
					pressEnabled
					dataPointsColor="transparent"
					dataPointsRadius={8}
					hideRules
					width={chartWidth}
					spacing={perPoint}
					initialSpacing={initial}
					endSpacing={rightPad}
					thickness={3}
					color1={color1}
					color2={color2}
					startOpacity={0.15}
					endOpacity={0.01}
					yAxisTextStyle={{ display: 'none' }}
					xAxisLabelTextStyle={{
						color: require('../../styles/theme').colors.gray400,
						fontSize: 10,
					}}
					focusEnabled={false}
					showStrip={false}
					animateOnDataChange={animate}
					animationDuration={animationDuration}
					pointerConfig={{
						showPointerStrip: true,
						pointerStripUptoDataPoint: true,
						stripColor: '#E5E7EB',
						stripWidth: 2,
						pointerColor: 'transparent',
						radius: 0,
						showPointerLabel: true,
						pointerLabelComponent: (items) => {
							const actual = items?.[0]
							const previous = items?.[1]
							const actualVal = actual?.value ?? 0
							const previousVal = previous?.value ?? 0
							const actualDate = actual?.tooltipLabel || ''
							return (
								<View
									style={[styles.labelContainer, { width: maxTooltipWidth }]}
								>
									{actualDate ? (
										<Text style={styles.dataLabel}>{actualDate}</Text>
									) : null}
									<View style={styles.textLabelContainer}>
										<View
											style={[
												styles.textLabelColor,
												{
													backgroundColor: '#10B981',
												},
											]}
										/>
										<Text style={styles.textLabel}>
											{actualVal} {actualVal === 1 ? 'tarea' : 'tareas'}
										</Text>
									</View>
									<View style={styles.textLabelContainer}>
										<View
											style={[
												styles.textLabelColor,
												{
													backgroundColor: '#60A5FA',
												},
											]}
										/>
										<Text style={styles.textLabel}>
											{previousVal} {previousVal === 1 ? 'tarea' : 'tareas'}
										</Text>
									</View>
								</View>
							)
						},
					}}
				/>
			</ScrollView>
		</View>
	)
}

const { typography, colors } = require('../../styles/theme')

const styles = StyleSheet.create({
	vacuumContainer: {
		backgroundColor: colors.gray100,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: colors.gray200,
	},
	container: { overflow: 'visible', paddingBottom: 8 },
	labelContainer: {
		fontFamily: typography.family.regular,
		backgroundColor: colors.black,
		paddingHorizontal: 8,
		paddingVertical: 6,
		borderRadius: 6,
	},
	dataLabel: {
		fontFamily: typography.family.light,
		color: colors.gray300,
		fontSize: 10,
		marginBottom: 2,
	},
	textLabelContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	textLabelColor: {
		width: 10,
		height: 10,
		borderRadius: 2,
	},
	textLabel: {
		fontFamily: typography.family.regular,
		color: colors.white,
		fontSize: typography.size.xs,
	},
})
