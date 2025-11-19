## MVP PROPUESTO

- [ ] Registro / Login (email+verificación + Google/Apple).

  - [ ] Falta Google/Apple
  - [ ] Falta la forgotPassword
    - [ ] Implementar una página web estática con supabase
    - [ ] js que reciba los tokens y permita establecer la nueva contraseña.
    - [ ] Publicarla en Netlify/Vercel y añadir la URL como Redirect en Supabase.
    - [ ] Crear ForgotPassword para enviar a esa URL.

- [ ] Cooperativo: grupos cerrados por invitación/enlace; lista común de hábitos para el grupo.

- [ ] Notificaciones locales (recordatorios por hábito).

- [ ] Exportar/visualizar progreso básico (pantalla de estadísticas).

- [x] Gamificación: XP por completar hábitos → barra de nivel general. Rachas (streaks).

- [x] Onboarding + creación de perfil (nombre, elegir personaje hombre/mujer, avatar básico).

- [x] Home diario: lista de hábitos del día + marcar completado.

- [x] Persistencia y sincronización en Supabase (guardar hábitos, progresos y stats).

- [x] CRUD de hábitos (campos completos desde inicio).

## IDEAS DESARROLLO

- [ ] Aplicar colores que ha mandado Miguel

## PÁGINA ESTADISTICAS

### Objetivos de la pestaña Estadísticas

- Claridad para cualquier usuario: lenguaje simple, visualizaciones intuitivas, estados vacíos explicativos.
- Interactividad suficiente: filtros por rango de fechas, por hábito, y “tap” para ver detalle puntual.
- Métricas accionables: que ayuden a entender avances y dónde mejorar, no solo “bonitas”.

### Métricas y visualizaciones propuestas (MVP y siguientes)

#### MVP (primera versión)

- Racha actual y máxima (global y por hábito)
  - Card resumen: racha actual global (suma por ocurrencias programadas), racha máxima. Tooltip con “cómo se calcula”.
  - Gráfico: línea de racha global en el tiempo o “sparkline” por hábito.
- % de cumplimiento por periodos
  - Definición: cumplimiento = completados / programados (usa monday-based y day_of_month).
  - Gráfica de barras por día/semana/mes con colores accesibles, tooltip con numerador/denominador.
- Historial por hábito
  - Lista de hábitos con:
    - sparkline de cumplimiento (últimos 30 días)
    - racha actual del hábito
    - % cumplimiento en el rango seleccionado
  - Tap en un hábito → detalle del hábito (gráfico más grande + calendario/heatmap)
- Calendario/Heatmap
  - Mapa de calor tipo calendario de 30 días: verde si completado en días programados, gris para no programados.
  - Ideal para “ver de un vistazo” constancia y huecos.
  - Comparativas (últimos 7 vs 7 previos; últimos 30 vs 30 previos).

#### Interacciones clave

- Selector de rango: 7, 30, 90 días, “Todo”.
- Filtro por hábito: All vs uno concreto.
- Tap en barra/punto del gráfico → tooltip con fecha, programado vs completado, XP.
- Estados vacíos: mensajes claros para “sin datos” y “aún no tienes hábitos”.

#### Cálculos (alineados con tu lógica actual)

- Programado (weekly): lunes=0; se ignoran días no seleccionados.
- Programado (monthly): day_of_month 1–31; días que no existen en el mes no cuentan como programados.
- Streak:
  - Por ocurrencias programadas consecutivas (daily = todos los días; weekly = solo días marcados; monthly = día elegido).
  - Mostrar racha actual y máxima en el rango (o “histórica” si queremos).
- % Cumplimiento:
  - Numerador: conteo de días programados completos dentro del rango.
  - Denominador: conteo de días programados dentro del rango.
  - Por hábito y global (agregando todos los hábitos).
- XP:
  - Ya lo calculas por evento; podemos sumar por rango y por hábito para gráficos de tendencia.

#### Datos y performance

- Fuente de datos:
  - habits (frequency, days_of_week monday-based, day_of_month)
  - progress (por fecha, completed, xp_awarded)
- Cómputos:
  - MVP: on-the-fly en cliente (apoyándonos en los helpers que ya tienes y extendiéndolos para periodos).
  - Escalado: vistas SQL o materialized views en Supabase que agreguen por día/semana/mes, por user_id y habit_id. Esto reduce latencias y complejidad en cliente.
- Caching:
  - React Query con claves por user, rango, filtros. Prefetch de 7 y 30 días al abrir la pestaña.
  - Fondo: revalidación silenciosa.
- Timezone:
  - Ya estandarizamos en cliente YYYY-MM-DD local. Mantener esto para todo el cálculo de “programado”.

Librería de gráficos recomendada en RN

- victory-native + react-native-svg: estable, suficiente interactividad, tooltips básicos.
- Accesibilidad: colores con buen contraste, paleta colorblind-friendly, descripciones para VoiceOver.

#### Arquitectura de UI

- Nueva Tab “Estadísticas” → pantalla con secciones en tarjetas:
  - Encabezado: rango de fechas + filtro por hábito
  - Card 1: Racha global (actual/máxima)
  - Card 2: % Cumplimiento (barras por día/semana con tooltip)
  - Card 3: Historial por hábito (lista + sparkline + racha del hábito)
  - Card 4: Heatmap de 30 días
- Detalle por hábito: al tocar en la lista, se abre una pantalla secundaria con:
  - Gráfico detallado por fechas
  - Calendario/heatmap
  - Métricas del hábito: racha actual/máxima, % cumplimiento, XP en el rango.

#### Estados y edge cases

- Sin hábitos / sin datos en el rango → mensajes claros y CTA “Crea tu primer hábito”.
- Meses con day_of_month inexistente: no contabilizan como programados.
- Cambios de configuración del hábito: los cálculos se basan en la config actual (no recalc de histórico). Lo documentaremos en un tooltip.

#### Métricas “con historia”

- Racha máxima: podemos calcularla histórica si descargamos suficiente historial (p. ej., 180 días) o si añadimos una vista agregada en DB **en este caso hay que poner todo el historial que podamos porque hay que indicar al usuario su racha total si en el filtro lo pone**.
- % cumplimiento por semana/mes: agregar por periodos (agrupando fechas a semanas ISO y meses). Útil una vista SQL.

### MVP a implementar

- Tab Estadísticas (navegación + layout inicial).
- Selector de rango (7/30/90) y filtro por hábito.
- Card Racha global (actual y máxima en rango).
- Barras % cumplimiento global por día/semana en el rango (tooltip).
- Lista de hábitos con sparkline de cumplimiento y racha actual por hábito.
- Carga con react-query, cálculos en cliente.
- - Heatmap 30/90 días.
- Vista de detalle de hábito.
- Tendencia de XP por día/semana.
- Vistas SQL/materialized views para performance.

### Accesibilidad e i18n

- Labels claros, tooltips con texto alternativo.
- Fechas localizadas (empezando semana en lunes).
- Paletas accesibles y consistentes.
