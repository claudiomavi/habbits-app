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

## DÍA 2

### UI y gráficos (interactivos)

- [ ] Barra superior con:
  - [ ] Selector de rango (7/30/90/Todo)
  - [ ] Filtro de hábito (All / hábito concreto)
- [ ] Cards:
  - [ ] Racha global: racha actual y máxima (en el rango). Tooltip con “cómo se calcula”.
  - [ ] % Cumplimiento: gráfico de barras por día/semana con tooltip (victory-native).
- [ ] Lista “Historial por hábito”:
  - [ ] Cada hábito con sparkline de cumplimiento (últimos 30 días del rango), racha actual del hábito y % cumplimiento.
- [ ] Estados vacíos y loaders.

## DÍA 3

### Pulido y extensiones

- [ ] Heatmap básico (opcional si el tiempo alcanza) para últimos 30/90 días.
- [ ] Optimización:
  - [ ] Prefetch de 7/30 días al abrir la tab.
  - [ ] Memoización de helpers (rango/habits/progress como claves).
- [ ] QA manual:
  - [ ] Casos weekly (p.ej., Lun/Mié/Vie), daily con huecos, monthly (day_of_month 31 en meses cortos), zonas horarias.

## Decisiones técnicas

- Librería gráfica: victory-native + react-native-svg (tooltips, barras/lineas/heatmap simple).
- Accesibilidad: colores con contraste, tooltips claros, estados vacíos explicativos.
- Performance: cálculos en cliente para MVP. Si vemos coste, preparamos vistas SQL (agregados por fecha y hábito) en otra iteración.
