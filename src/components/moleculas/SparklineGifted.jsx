import { useMemo } from 'react'
import { ScrollView, Text, View, useWindowDimensions } from 'react-native'
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
	// Estimate inner width (card has horizontal padding ~24 on each side)
	const count = Array.isArray(dailyCounts) ? dailyCounts.length : 0
	const minPerPoint = 12
	const baseWidth = Math.floor(winWidth - 48)
	const neededWidth =
		count >= 6 ? Math.max(baseWidth, count * minPerPoint) : baseWidth
	const chartWidth = Math.max(220, neededWidth)
	const maxTooltipWidth = Math.min(150, Math.floor(winWidth * 0.6))
	const hideXLabels = count >= 10

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

	if (!data || data.length === 0) {
		return (
			<View
				style={{
					height,
					backgroundColor: '#F3F4F6',
					borderRadius: 12,
					borderWidth: 2,
					borderColor: '#E5E7EB',
				}}
			/>
		)
	}

	return (
		<View style={{ overflow: 'visible', paddingBottom: 8 }}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingRight: 60, paddingBottom: 24 }}
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
					adjustToWidth
					thickness={3}
					color1={color1}
					color2={color2}
					startOpacity={0.15}
					endOpacity={0.01}
					yAxisTextStyle={{ display: 'none' }}
					xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
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
							const item = items?.[0]
							const val = item?.value ?? 0
							const date = item?.tooltipLabel || ''
							return (
								<View
									style={{
										backgroundColor: '#111827',
										paddingHorizontal: 8,
										paddingVertical: 6,
										borderRadius: 6,
										width: maxTooltipWidth,
									}}
								>
									{date ? (
										<Text
											style={{
												color: '#D1D5DB',
												fontSize: 10,
												marginBottom: 2,
											}}
										>
											{date}
										</Text>
									) : null}
									<Text style={{ color: 'white', fontSize: 12 }}>
										{val} {val === 1 ? 'tarea' : 'tareas'}
									</Text>
								</View>
							)
						},
					}}
				/>
			</ScrollView>
		</View>
	)
}
