Ahora quiero por favor que me ayudes a crear con los mismos estilos la página de home:

Habrá que hacerlo todo correctamente y creando su propio crud, store de zustand y fetch en la misma home con tanstack

El estilo tiene que seguir el de login y las otras páginas

Estas son las primeras ideas que teniamos de la app para que te sirvan de guía

Recuerda también que ya te he mandado toda la estructura del database

PRIMERAS IDEAS - HABITS

1. Visión (mision provisoria)
   HABITS es una app nativa enfocada en convertir rutinas diarias en progreso visible y competitivo entre pares. Tono: reto — gamificado más que serio. Objetivo: ayudar a las personas a mejorar mediante hábitos, con un componente cooperativo/competitivo (grupos por invitación) que aumenta la motivación y la retención.

2. Alcance inicial y principios

- Plataforma inicial: Android nativa (React Native) — arquitectura preparada para iOS más adelante.
- Backend: Supabase (auth, Postgres, realtime, storage).
- Notificaciones: locales (configurables por hábito).
- Simplificar: sin IA, sin fotos en esta fase. To-do gamificado + cooperativo.
- Registro obligatorio con verificación por correo; opción de login rápido Google/Apple.

3. MVP propuesto (características imprescindibles)
1. Registro / Login (email+verificación + Google/Apple).
1. Onboarding + creación de perfil (nombre, elegir personaje hombre/mujer, avatar básico).
1. CRUD de hábitos (campos completos desde inicio).
1. Home diario: lista de hábitos del día + marcar completado.
1. Cooperativo: grupos cerrados por invitación/enlace; lista común de hábitos para el grupo.
1. Gamificación: XP por completar hábitos → barra de nivel general. Rachas (streaks).
1. Estadísticas: racha, % cumplimiento, historial por hábito (para mostrar en gráficas).
1. Notificaciones locales (recordatorios por hábito).
1. Persistencia y sincronización en Supabase (guardar hábitos, progresos y stats).
1. Exportar/visualizar progreso básico (pantalla de estadísticas).

1. Reglas de negocio y decisiones (confirmadas por ti)

- Nombre provisional: HABITS.
- Tono: reto / gamificado.
- Frecuencias soportadas desde inicio: diaria / semanal / mensual.
- Modo de hábito: campos completos desde el principio (no módulo “simple”).
- Cooperativo: grupos por invitación, cada grupo usa una lista común de hábitos.
- Competición: el cooperativo será competitivo (quién cumple más).
- Niveles: XP progresivo; XP depende de dificultad + racha. Visualización: barra de nivel general.
- Registro obligatorio (verificación por correo); login social disponible (Google/Apple).
- Guardamos estadísticas detalladas (rachas, fechas, historial).
- Solo Android al lanzamiento inicial.

5. Modelo de datos (esquema básico, para Supabase / Postgres)
   Usuarios

- users
  _ id (uuid, auth)
  _ display*name (text)
  * email (text)
  _ avatar (small enum: "male" | "female")
  _ xp (int, default 0)
  \_ level (int, computed or stored) \* created_at, updated_at
  Hábitos
- habits
  _ id (uuid)
  _ group*id (uuid, nullable) — si null: hábito individual; si no null: hábito del grupo
  * title (text)
  _ description (text, optional)
  _ frequency (enum: "daily","weekly","monthly")
  _ days_of_week (array int 0-6) — para weekly
  _ reminder*time (time, optional)
  * difficulty (int 1-3)
  _ target_value (float, optional) — útil si el hábito tiene objetivo cuantitativo
  _ created_by (user_id) \* created_at, updated_at
  Grupos / Cooperativo
- groups
  _ id (uuid)
  _ name (text)
  _ owner_id (user_id)
  _ invite_code (text) \* created_at
  Miembros de grupo
- group_members \* id, group_id, user_id, role (owner/member), joined_at
  Progreso / Entradas diarias
- progress*entries
  * id (uuid)
  _ habit_id
  _ user*id
  * date (date)
  _ completed (bool)
  _ xp_awarded (int) \* created_at
  Estadísticas agregadas (opcional para rendimiento)
- habit_stats (cache por día/semana) \* habit_id, date, completions_count, completions_by_user JSONB, streaks, etc.
  Notas:
- Realtime: suscribir cambios importantes (habit created/updated, progress) para reflejar en app colaborativa.
- Guardar historial completo en progress_entries para construir gráficas.

6. Lógica de XP / niveles (propuesta)

- baseXP = 10
- XP por completado = baseXP _ difficulty _ streakMultiplier
  - difficulty: 1, 2, o 3
  - streakMultiplier = 1 + (streakDays \* 0.05), capped en 2.0
- Nivel calculado por alguna función acumulativa (ej: level = floor(sqrt(totalXP / 100)) + 1) — ajustable.
- Hitos (future): badges por 30/60 días mantenidos (se dejan para fases posteriores).

7. Pantallas / flujos UI (wireframe checklist)

- Splash / Loading (logo HABITS + personaje simple).
- Onboarding (registro/email verification + elegir avatar hombre/mujer).
- Home (default):
  - lista de hábitos del día (cards)
  - cada card: título, badge dificultad, botón marcar completado, hora recordatorio
  - barra superior: personaje + nombre + nivel + XP bar (touch → pantalla progreso)
  - bottom tabs: Home / Estadísticas / Cooperativo / Perfil
- Crear/Editar hábito (form con campos completos: title, description, frequency, days, reminder_time, difficulty, target)
- Cooperativo (grupo): lista de miembros, invites, lista de hábitos del grupo, tablero comparativo (quién hizo más hoy/semana)
- Estadísticas: racha global, % cumplimiento mensual, historial por hábito (gráfica simple)
- Perfil/Ajustes: logout, cambiar nombre, notification settings (on/off por hábito), support
  Wireframe: preparar pantallas móviles 360–420 px ancho; prototype del flow onboarding→crear hábito→marcar completado→subir XP.

8. Stack técnico y librerías sugeridas
   Frontend (React Native)

- React Native (Expo o bare — recomiendar Expo si queremos acelerar builds y usar Expo Notifications más tarde).
- Estado: zustand (ligero) o react-query para fetching (ya indicaste ambos).
- Formularios: react-hook-form
- UI: Tailwind (via tailwindcss-react-native) o styled-components (tú propusiste ambos; podemos usar Tailwind si prefieres consistencia).
- Animaciones: react-lottie (para micro-animaciones).
- Iconos: react-icons (o react-native-vector-icons)
- Tab navigation: react-navigation
- Supabase client: @supabase/supabase-js
- Otros (los que sugeriste): sweetalert2 (web), @tanstack/react-query, react-spinners, react-color (si se necesita selector color).
  Backend
- Supabase (auth, Postgres, Realtime, Storage).
- Supabase Edge Functions (si se necesitan jobs o lógica server-side).
  Notificaciones
- Local notifications (Capacitor? con React Native: react-native-push-notification o expo-notifications si usas Expo).
- Push por servidor no necesario en MVP (decidido).
  Despliegue / CI
- App: Play Store (APK/AAB) — configurar pipeline para builds (EAS: Expo Application Services si usamos Expo).
- Repo: GitHub + Actions / EAS Build.

9. Prioridad de funcionalidades (MVP → Fases)
   MVP (lo mínimo para lanzar y validar):

- Auth + verificación correo + perfil básico
- Crear/Editar Hábitos (daily/weekly/monthly)
- Home + marcar completado
- XP simple + barra de nivel
- Cooperativo básico (create group, invite, sync shared habits)
- Notificaciones locales
- Estadísticas básicas (racha + % cumplimiento)
  Fase 2 (post-MVP):
- Ajuste de XP según racha/dificultad + hitos
- Ranking y tablero competitivo más elaborado
- Mejoras visuales/animaciones
- Version iOS
- Moderación / privacidad extendida si añadimos fotos o social

10. Riesgos y notas técnicas

- Notifs locales: funcionan sin servidor, buena decisión para MVP, pero ten en cuenta diferencias entre fabricantes Android.
- Sincronización: con Supabase realtime los grupos verán cambios rápido; hay que decidir política de conflictos (último write wins es suficiente al principio).
- Datos: guardamos historial por defecto (útil para estadísticas). Prevén límites de tamaño si la app escala.
- Apple/Google login: requiere configuración en consolas respectivas; planificar early para evitar retrasos si decidimos iOS.
  1. Backlog inicial (issues en Markdown: Authentication, Habits CRUD, Home, Progress, Groups, Stats, Notifications).
