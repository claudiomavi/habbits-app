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
- [ ] Lista “Resumen por hábito” (mejoras de legibilidad):
  - [ ] Ajuste de tipografías, espaciados y jerarquías en cada tarjeta.
  - [ ] Acceso a detalle de hábito.
- [ ] Estados vacíos y loaders.

## DÍA 3 (nuevo plan)

### Pulido y extensiones

- [ ] Fix interacción fechas en gráfico (10+):
  - [ ] Unificar handler por tap con overlay (Pressable) y normalización por scrollX.
  - [ ] Probar en iOS/Android varios tamaños; asegurar selectedLabel en template.
  - [ ] Opcional: formato DD/MM y combinación fecha · N hábitos.
- [ ] Lista “Resumen por hábito” (mejora UI):
  - [ ] Ajustes de fuentes (peso/altura), espaciados y contraste.
  - [ ] Estados vacíos por hábito y loaders.
- [ ] Detalle de hábito (nueva pantalla):
  - [ ] KPIs del hábito (racha actual/máxima en rango, cumplimiento, días activos del hábito).
  - [ ] Gráfico tendencia del hábito (gifted-charts) con comparativa de periodo anterior.
  - [ ] Rutas y navegación desde la tarjeta en el listado.
- [ ] Heatmap básico (opcional si el tiempo alcanza) para últimos 30/90 días.
- [ ] Optimización:
  - [ ] Prefetch de 7/30 días al abrir la tab.
  - [ ] Memoización de helpers (rango/habits/progress como claves).
- [ ] QA manual:
  - [ ] Casos weekly (p.ej., Lun/Mié/Vie), daily con huecos, monthly (day_of_month 31 en meses cortos), zonas horarias.

## Decisiones técnicas

- Librería gráfica: react-native-gifted-charts + react-native-svg (línea + área, comparativa, tooltips por tap; fallback con overlay para rangos largos).
- Accesibilidad: colores con contraste, tooltips claros, estados vacíos explicativos.
- Performance: cálculos en cliente para MVP. Si vemos coste, preparamos vistas SQL (agregados por fecha y hábito) en otra iteración.
