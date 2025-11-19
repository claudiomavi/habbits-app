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

- [x] Barra superior con:
  - [x] Selector de rango (7/30/90/Todo)
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

Me parece perfecto. Te propongo un plan de trabajo para mañana para migrar la Tendencia a Victory Native y dejarlo fino:

## PARA MAÑANA

Objetivo

- Sustituir la Sparkline actual por un gráfico de líneas con área en Victory Native, con tooltip y soporte para comparar con el periodo anterior.

Plan por bloques

1. Dependencias e infraestructura

- Instalar Victory Native (victory-native) y react-native-svg si aún no están.
- Crear un componente SparklineVictory.jsx que reemplace al actual en StatisticsTemplate, manteniendo la API: props data (array de números), height, y opcionalmente series comparativa.

2. Transformación de datos

- Crear helper en utils/stats:
  - getDailySeries(dailyCounts): devuelve [{x: Date, y: number}] usando las fechas del rango.
  - getPrevDailySeries(prevDailyCounts): idem para el periodo anterior.
- Opcional: normalizador de valores para asegurar 0 mínimos y áreas consistentes.

3. Gráfico Victory

- VictoryChart con:
  - VictoryArea + VictoryLine para la serie actual (gradiente/opacity suave).
  - VictoryLine (o dashed) para la serie anterior en color más tenue.
  - Ejes ocultos o minimalistas.
  - Tooltips: VictoryVoronoiContainer para mostrar valor y fecha al tocar.
- Props configurables:
  - showComparison (boolean) para activar overlay con periodo anterior.
  - color y colorSecondary.
  - smooth curve (curveBasis o curveNatural).

4. Integración en UI

- Sustituir Sparkline por SparklineVictory en StatisticsTemplate.
- Pasar dailyCounts y prevDailyCounts desde Statistics.jsx.
- Ajustar el alto y padding para respetar el look & feel actual.

5. Experiencia y accesibilidad

- Añadir animación de entrada suave al cambiar de rango (VictoryAnimate).
- Haptic leve al tocar puntos (opcional).
- Estados vacíos: mensaje sutil si no hay datos suficientes.

6. Rendimiento

- Memoizar series con useMemo.
- Downsampling simple para rangos > 90 días (ej: tomar 1 de cada N puntos).

7. QA y PR

- Probar en iOS/Android con 7/30/custom y con/ sin comparativa.
- Preparar PR con capturas y explicación de trade-offs.

Entregables

- Nuevo componente SparklineVictory.jsx
- Nuevos helpers getDailySeries y getPrevDailySeries
- Integración en StatisticsTemplate
- Flag showComparison para activar la línea del periodo anterior

¿Quieres que además cree las tareas en Jira para cada bloque (infra, gráfico, comparativa, integración, QA), y te deje una PR base con stub del componente para empezar mañana?
