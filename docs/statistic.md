# PLAN DE IMPLEMENTACIÓN

## DÍA 1

### Estructura + datos base

- [x] Navegación:
  - [x] Añadir tab “Estadísticas” al AppStack/TabNavigator.
  - [x] Crear página Statistics.jsx + template StatisticsTemplate.jsx.
- [x] Datos y helpers:
  - [x] Hooks react-query para:
    - [x] getUserHabits(userId)
    - [x] getProgressRange(userId, from, to) (reutilizando endpoints existentes con un rango)
  - [x] Helpers de cálculo (utils/stats):
    - [x] buildScheduleMap(habits, from, to) → “qué días estaban programados por hábito”
    - [x] computeStreakCurrentAndMax(habit, progress, from, to)
    - [x] computeCompliance(habit, progress, from, to) → {programados, completados, pct}
    - [x] computeGlobalAggregates(habits, progress, from, to)
  - [x] Asegurar que todo usa fecha local YYYY-MM-DD (makeLocalISO) y monday-based para weekly; day_of_month para monthly.

## DÍA 2 (actualizado)

### UI y gráficos (interactivos)

- [x] Barra superior con:
  - [x] Selector de rango (7/30/custom) con modal y stepper (+/-) y animaciones.
- [x] Resumen general:
  - [x] KPIs con gradiente (Cumplimiento, Días activos, Hábitos) y delta vs periodo anterior.
  - [x] Tendencia con línea + área (gifted-charts), comparativa de periodo anterior y leyenda.
  - [x] Tooltip por tap (badge externo) cuando X >= 10 días.
- [x] Insights:
  - [x] Top 3 hábitos y “Oportunidad” (peor %).

## DÍA 3 (nuevo plan)

### Pulido y extensiones

- [x] Fix interacción fechas en gráfico (10+):
  - [x] Unificar handler por tap con overlay (Pressable) y normalización por scrollX.
  - [x] Probar en iOS/Android varios tamaños; asegurar selectedLabel en template.
  - [x] Opcional: formato DD/MM y combinación fecha · N hábitos.

## DÍA 25/11

- [ ] Lista “Resumen por hábito” (mejora UI):
  - [ ] Ajustes de fuentes (peso/altura), espaciados y contraste.
  - [ ] Estados vacíos por hábito y loaders.

## Decisiones técnicas

- Librería gráfica: react-native-gifted-charts + react-native-svg (línea + área, comparativa, tooltips por tap; fallback con overlay para rangos largos).
- Accesibilidad: colores con contraste, tooltips claros, estados vacíos explicativos.
- Performance: cálculos en cliente para MVP. Si vemos coste, preparamos vistas SQL (agregados por fecha y hábito) en otra iteración.
