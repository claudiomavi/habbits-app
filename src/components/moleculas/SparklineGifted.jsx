import { useMemo, useState } from 'react'
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
	const enableScroll = count >= 6
	const minPerPoint = 12
	const baseWidth = Math.floor(winWidth - 48)
	const neededWidth =
		count >= 6 ? Math.max(baseWidth, count * minPerPoint) : baseWidth
	const chartWidth = Math.max(220, neededWidth)
	const hideXLabels = count >= 10
	const [hoverValue, setHoverValue] = useState(null)
	const [hoverLabel, setHoverLabel] = useState('')
	const { data, data2 } = useMemo(() => {
		const data = (dailyCounts || []).map((d) => ({
			value: d.completedCount || 0,
			label: hideXLabels
				? ''
				: `${(d?.dateISO || '').slice(8, 10)}-${(d?.dateISO || '').slice(
						5,
						7
				  )}`,
		}))
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
		<View style={{ overflow: 'hidden' }}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingRight: 12 }}
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
					onPointPress={(item, index) => {
						if (item) {
							setHoverValue(item.value)
							const idx = index ?? 0
							const iso = dailyCounts?.[idx]?.dateISO || ''
							const ddmm = iso ? `${iso.slice(8, 10)}-${iso.slice(5, 7)}` : ''
							setHoverLabel(ddmm)
						}
					}}
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
							const val = items?.[0]?.value ?? 0
							return (
								<View
									style={{
										backgroundColor: '#111827',
										paddingHorizontal: 6,
										paddingVertical: 2,
										borderRadius: 6,
									}}
								>
									<Text style={{ color: 'white', fontSize: 11 }}>{val}</Text>
								</View>
							)
						},
					}}
				/>
			</ScrollView>
			{hoverValue != null ? (
				<View style={{ alignItems: 'flex-end', marginTop: 6 }}>
					{hideXLabels && hoverLabel ? (
						<Text style={{ color: '#6B7280', fontSize: 11, marginBottom: 2 }}>
							{hoverLabel}
						</Text>
					) : null}
					<Text style={{ color: '#111827', fontSize: 12 }}>
						{hoverValue} hábitos
					</Text>
				</View>
			) : null}
		</View>
	)
}
