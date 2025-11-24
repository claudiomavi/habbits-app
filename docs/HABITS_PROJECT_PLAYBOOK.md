# HABITS – Project Playbook

Este documento resume la visión, reglas, estilos, convenciones de desarrollo y estructura de datos del proyecto HABITS. Sirve para compartir con otras IAs y con cualquier persona del equipo para alinear criterios y acelerar el onboarding.

---

## 1) Visión y alcance

- Visión (provisoria): HABITS es una app nativa enfocada en convertir rutinas diarias en progreso visible y competitivo entre pares.
- Tono: reto, gamificado (más lúdico que serio).
- Objetivo: ayudar a las personas a mejorar mediante hábitos, con componente cooperativo/competitivo (grupos por invitación) que incremente motivación y retención.

### Alcance inicial y principios

- Plataforma inicial: Android (preparado para iOS más adelante).
- Backend: Supabase (Auth, Postgres, Realtime, Storage).
- Notificaciones: locales (por hábito).
- Sin IA, sin fotos en esta fase.
- Registro obligatorio con verificación por correo; login social (Google/Apple) planificado.

### MVP (imprescindibles)

1. Auth + verificación por correo + perfil básico.
2. Onboarding + creación de perfil (nombre, avatar básico hombre/mujer).
3. CRUD de hábitos (campos completos desde inicio).
4. Home diario: lista de hábitos del día + marcar completado.
5. Cooperativo: grupos cerrados por invitación (lista común de hábitos).
6. Gamificación: XP por completar hábitos → barra de nivel.
7. Estadísticas: racha, % cumplimiento, historial por hábito.
8. Notificaciones locales (recordatorios por hábito).
9. Persistencia en Supabase (habits, progress, stats).
10. Exportar/visualizar progreso básico (pantalla de estadísticas).

---

## 2) Stack técnico

- React Native (Expo).
- Estado: Zustand para stores locales + @tanstack/react-query para fetching/caché/mutaciones.
- Formularios: react-hook-form.
- UI: estilos propios (sin UI kit pesado) con LinearGradient y estilos RN.
- Navegación: react-navigation (Stack).
- Backend: @supabase/supabase-js.
- Linting/TS: eslint + tsconfig (proyecto actualmente JS, preparado para TS si interesa).

---

## 3) Estructura de carpetas (resumen)

Modelo Atomic Design

- Atoms (atomos): piezas UI indivisibles (botones básicos, inputs, badges).
- Molecules (moleculas): combinación simple de átomos (XPBar, DifficultyBadge).
- Organisms (organismos): secciones con funcionalidad (HeaderBar, HabitCard, CardContainer).
- Templates: esqueletos de página con layout/estilo uniforme (HomeTemplate, AuthTemplate, CreateProfileTemplate, CooperativeTemplate).
- Pages: orquestación de datos, lógica de formularios y navegación; consumen Templates y componentes.

Rationale (por qué Templates + Pages)

- Los Templates fijan estructura y estilo común entre pantallas, evitando duplicación de UI.
- Las Pages se enfocan en la lógica de negocio: TanStack Query/fetch, stores Zustand, react-hook-form y navegación.
- Facilita reuse, pruebas y mantenimiento; reduce conflicto al tocar estilos.

- src/pages: pantallas (Login, Register, CreateProfile, Home, ...)
- src/stores: Zustand stores (AuthStore, UsersStore, HabitsStore)
- src/supabase: cliente y CRUDs (supabaseClient, crudUsers, crudHabits)
- src/routers: AppRouter, AppStack, Redirector
- src/assets, src/components, src/styles, src/utils: por crecer
- app/: entry (Expo)

AutoBarrel: `src/autoBarrell.js` reexporta los módulos clave para imports cortos.

---

## 4) Estilos y guía de UI

### Patrones de interacción (modales)

- Preferimos transiciones custom con `Animated` (backdrop con `Animated.timing` y contenido con `Animated.spring`).
- Bottom-sheet para listas temporales (ej.: Hábitos de hoy): aparece desde abajo, cierra al tocar el fondo o el botón de cerrar.
- Diálogo centrado para edición/creación (ej.: HabitModal) con animación de escala y fondo fade.

Estética base: tarjetas blancas sobre fondo degradado, micro-decoraciones (emojis/gradients), tipografía legible y contraste alto.

- Gradientes principales (ejemplos):
  - Fondo: [#667eea, #764ba2, #f093fb, #4facfe]
  - Acentos/barras: [#4facfe, #00f2fe, #43e97b]
- Tarjetas:
  - Fondo blanco (#fff), borde redondeado grande (24–32), sombra suave.
  - Barra superior de progreso/decoración de 4px.
- Inputs/botones:
  - Inputs: fondo #F9FAFB, borde #E5E7EB, radios 12–16.
  - Botón principal: degradado [#4facfe, #43e97b], texto blanco, bold.
- Tipografía/colores:
  - Títulos: #1F2937, Subtítulos: #6B7280
  - Énfasis/links: #4facfe; Éxito: #22c55e; Error: #EF4444.

Patrones de pantalla a replicar (Login/Register/CreateProfile/Home):

- LinearGradient como contenedor.
- Card blanca con barra superior (progreso/decoración) en gradient.
- Estructura central con título/subtítulo + formulario o lista.
- Botones con gradient y sombras suaves.

---

## 5) Conexiones de datos y estado

### Navegación y subpantallas no-tab

- La pantalla "Cooperative" se registra fuera de las tabs como `Stack.Screen` y se navega desde Home (acción). Esto permite flujos secundarios sin añadir nuevas tabs.

- Supabase client: `src/supabase/supabaseClient.js`.
- Auth: `src/stores/AuthStore.js` controla sesión (user, session, signIn/signOut/signUp expuestos vía crudUsers/AuthStore).
- Perfil: `src/stores/UsersStore.js` maneja perfil (fetch/update o creación).
- Hábitos: `src/stores/HabitsStore.js` y `src/supabase/crudHabits.js` (ver sección CRUD).
- React Query: usar queries por clave: ["habits", user.id], ["progress", user.id, dateISO], etc.

### Convenciones

- No hardcodear IDs/valores; toda query debe filtrarse por usuario/grupo.
- Invalidate de queries tras mutación para refrescar estado.
- Manejar estados de carga y error visibles para el usuario.

---

## 6) CRUD y lógica de Hábitos

Archivo: `src/supabase/crudHabits.js`

- getHabitsByUser(user_id): lista hábitos del usuario (created_by = user_id).
- createHabit(payload): inserta un hábito (id UUID generado por DB, created_at, etc.).
- updateHabit(id, changes): actualiza un hábito por id.
- deleteHabit(id): borra un hábito.
- getProgressForDate(user_id, dateISO): progreso del día para el usuario.
- upsertProgress({ habit_id, user_id, dateISO, completed, xp_awarded, client_awarded? }):
  - Si completed=true → inserta/actualiza la fila con xp_awarded y devuelve xp_delta positivo.
  - Si completed=false → elimina la fila del día y devuelve xp_delta negativo equivalente al último xp_awarded (usa client_awarded como respaldo).

Store: `src/stores/HabitsStore.js`

- Estado: habits, loading
- Acciones: fetchHabits, addHabit, editHabit, removeHabit

Uso en Home (`src/pages/Home.jsx`):

- Lista de hábitos del día (filtro por frequency y days_of_week para semanal).
- Botón "Marcar/Hecho" ejecuta upsertProgress; invalidación de ["progress", user.id, dateISO].
- XP provisional: base 10 \* dificultad (se puede refinar con streak).

---

## 7) Modelo de datos (Supabase / Postgres)

Resumen de tablas relevantes (tal como has compartido):

- groups

  - id (uuid, PK, not null)
  - name (text, not null)
  - owner_id (uuid)
  - invite_code (text)
  - created_at (timestamptz)

- group_members

  - id (uuid, PK, not null)
  - group_id (uuid)
  - user_id (uuid)
  - role (text)
  - joined_at (timestamptz)

- habits

  - id (uuid, PK, not null)
  - group_id (uuid, nullable) → si null: hábito individual
  - title (text, not null)
  - description (text)
  - frequency (text: 'daily' | 'weekly' | 'monthly')
  - days_of_week (ARRAY int 0–6, monday-based) (para weekly)
    - Convención monday-based: 0=Lun, 1=Mar, 2=Mié, 3=Jue, 4=Vie, 5=Sáb, 6=Dom
  - day_of_month (smallint, nullable; 1–31) (para monthly)
  - reminder_time (time)
  - difficulty (int 1–3)
  - target_value (numeric, opcional)
  - created_by (uuid)
  - created_at (timestamptz)
  - updated_at (timestamptz)

- habit_stats

  - id (uuid, PK, not null)
  - habit_id (uuid)
  - date (date, not null)
  - completions_count (int)
  - completions_by_user (jsonb)
  - streaks (jsonb)
  - created_at (timestamptz)

- progress_entries

  - id (uuid, PK, not null)
  - habit_id (uuid)
  - user_id (uuid)
  - date (date, not null)
  - completed (boolean)
  - xp_awarded (int)
  - created_at (timestamptz)

- profiles
  - id (bigint, PK, not null)
  - id_auth (uuid)
  - email (text)
  - display_name (text)
  - character_id (uuid) -- FK a public.characters(id)
  - xp (int)
  - level (int)
  - created_at (timestamptz)
  - updated_at (timestamptz)

Nota: avatar (text) queda deprecado/opcional y no se persiste desde la app; la imagen se resuelve por character_id + level vía tabla characters.

Nota: ajusta los tipos/constraints definitivos en la DB si es necesario.

---

## 8) Reglas de XP / niveles (vigente)

- baseXP = 10
- XP por completado = baseXP _difficulty_ streakMultiplier
  - difficulty: 1, 2, o 3
  - streakDays: número de ocurrencias programadas consecutivas completadas
    - daily: días consecutivos (todos los días son programados)
    - weekly: solo cuentan los días seleccionados; p.ej., si el usuario eligió Lun-Mié-Vie, Mar/Jue no rompen racha
    - monthly: solo cuenta el día del mes elegido; se compara mes a mes con day_of_month
  - streakMultiplier = min(2.0, 1 + (streakDays \* 0.05))
- Level (ejemplo): level = floor(sqrt(totalXP / 100)) + 1

Decisiones pendientes:

- Cómo mantener streak por hábito (con habit_stats o cálculo on the fly).
- Dónde actualizar XP del perfil (trigger DB vs. en cliente con llamada adicional).

---

## 9) Estándares de código y convenciones

- Nombres: camelCase en JS, snake_case en DB.
- Componentes funcionales + hooks.
- Stores zustand minimalistas, lógica de red en CRUD separados de UI.
- React Query para all fetch/mutaciones no-triviales (sin duplicar en store).
- Manejo de errores con Alert y logs `console.error` durante desarrollo.
- Evitar hardcodes; constantes en módulo si se repiten.
- Al finalizar features, limpiar logs.

Pull Requests

- Rama feature/xxx o fix/xxx
- PR con descripción clara, checklist de pruebas manuales y capturas cuando aplique.

---

## 10) Supabase: configuración y permisos (RLS)

Autenticación

- Email/password con verificación.
- Proveedores sociales (Google/Apple) planificados.
- Deep links (reset password) diferido por ahora.

RLS (Row-Level Security)

- Activar RLS en tablas sensibles (habits, progress_entries, habit_stats, groups, group_members, profiles).
- Políticas activas (JSON, proporcionadas):

```json
[
	{
		"schemaname": "public",
		"tablename": "group_members",
		"policyname": "members can view members",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "SELECT",
		"qual": "(EXISTS ( SELECT 1\n FROM group_members gm\n WHERE ((gm.group_id = group_members.group_id) AND (gm.user_id = auth.uid()))))",
		"with_check": null
	},
	{
		"schemaname": "public",
		"tablename": "group_members",
		"policyname": "user can insert self",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "INSERT",
		"qual": null,
		"with_check": "(user_id = auth.uid())"
	},
	{
		"schemaname": "public",
		"tablename": "groups",
		"policyname": "members can view group",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "SELECT",
		"qual": "(EXISTS ( SELECT 1\n FROM group_members gm\n WHERE ((gm.group_id = gm.id) AND (gm.user_id = auth.uid()))))",
		"with_check": null
	},
	{
		"schemaname": "public",
		"tablename": "groups",
		"policyname": "owner can modify group",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "UPDATE",
		"qual": "(owner_id = auth.uid())",
		"with_check": null
	},
	{
		"schemaname": "public",
		"tablename": "groups",
		"policyname": "owner can delete group",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "DELETE",
		"qual": "(owner_id = auth.uid())",
		"with_check": null
	},
	{
		"schemaname": "public",
		"tablename": "habits",
		"policyname": "users can view own habits",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "SELECT",
		"qual": "(auth.uid() = created_by)",
		"with_check": null
	},
	{
		"schemaname": "public",
		"tablename": "habits",
		"policyname": "users can delete own habits",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "DELETE",
		"qual": "(auth.uid() = created_by)",
		"with_check": null
	},
	{
		"schemaname": "public",
		"tablename": "habits",
		"policyname": "users can insert habits",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "INSERT",
		"qual": null,
		"with_check": "(auth.uid() = created_by)"
	},
	{
		"schemaname": "public",
		"tablename": "habits",
		"policyname": "users can modify own habits",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "UPDATE",
		"qual": "(auth.uid() = created_by)",
		"with_check": null
	},
	{
		"schemaname": "public",
		"tablename": "profiles",
		"policyname": "users can insert their own profile",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "INSERT",
		"qual": null,
		"with_check": "(auth.uid() = id_auth)"
	},
	{
		"schemaname": "public",
		"tablename": "profiles",
		"policyname": "users can view self",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "SELECT",
		"qual": "(auth.uid() = id_auth)",
		"with_check": null
	},
	{
		"schemaname": "public",
		"tablename": "profiles",
		"policyname": "users can update self",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "UPDATE",
		"qual": "(auth.uid() = id_auth)",
		"with_check": null
	},
	{
		"schemaname": "public",
		"tablename": "progress_entries",
		"policyname": "users can view own progress",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "SELECT",
		"qual": "(auth.uid() = user_id)",
		"with_check": null
	},
	{
		"schemaname": "public",
		"tablename": "progress_entries",
		"policyname": "users can insert own progress",
		"permissive": "PERMISSIVE",
		"roles": "{public}",
		"cmd": "INSERT",
		"qual": null,
		"with_check": "(auth.uid() = user_id)"
	}
]
```

- Grants actuales (JSON, proporcionados):

```json
[
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "INSERT",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "SELECT",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "UPDATE",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "DELETE",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "TRUNCATE",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "REFERENCES",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "TRIGGER",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "INSERT",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "SELECT",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "UPDATE",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "DELETE",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "TRUNCATE",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "REFERENCES",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "TRIGGER",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "INSERT",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "SELECT",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "UPDATE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "DELETE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "TRUNCATE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "REFERENCES",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "TRIGGER",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "INSERT",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "SELECT",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "UPDATE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "DELETE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "TRUNCATE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "REFERENCES",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "group_members",
		"privilege_type": "TRIGGER",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "INSERT",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "REFERENCES",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "TRUNCATE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "DELETE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "UPDATE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "SELECT",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "INSERT",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "TRIGGER",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "REFERENCES",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "TRUNCATE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "DELETE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "UPDATE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "SELECT",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "INSERT",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "TRIGGER",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "REFERENCES",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "TRUNCATE",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "DELETE",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "UPDATE",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "SELECT",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "TRIGGER",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "TRIGGER",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "REFERENCES",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "TRUNCATE",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "DELETE",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "UPDATE",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "SELECT",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "groups",
		"privilege_type": "INSERT",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "TRIGGER",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "REFERENCES",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "TRUNCATE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "DELETE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "UPDATE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "SELECT",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "INSERT",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "TRIGGER",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "REFERENCES",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "TRUNCATE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "DELETE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "UPDATE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "SELECT",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "INSERT",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "TRIGGER",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "REFERENCES",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "TRUNCATE",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "DELETE",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "UPDATE",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "SELECT",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "INSERT",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "TRIGGER",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "REFERENCES",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "TRUNCATE",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "DELETE",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "UPDATE",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "SELECT",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "habit_stats",
		"privilege_type": "INSERT",
		"grantee": "postgres"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "TRIGGER",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "REFERENCES",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "TRUNCATE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "DELETE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "UPDATE",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "SELECT",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "INSERT",
		"grantee": "service_role"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "TRIGGER",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "REFERENCES",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "TRUNCATE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "DELETE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "UPDATE",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "SELECT",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "INSERT",
		"grantee": "authenticated"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "TRIGGER",
		"grantee": "anon"
	},
	{
		"table_schema": "public",
		"table_name": "habits",
		"privilege_type": "REFERENCES",
		"grantee": "anon"
	}
]
```

Cómo exportar permisos/políticas (guía rápida):

- Desde el SQL editor de Supabase:
  - Listar políticas: `select * from pg_policies where schemaname = 'public' order by tablename;`
  - Listar grants: `select table_schema, table_name, privilege_type, grantee from information_schema.table_privileges where table_schema = 'public' order by table_name;`
- Con Supabase CLI (si usáis repo con migraciones):
  - `supabase db pull` (extrae esquema localmente)
  - `supabase db diff -f rls_export.sql` (genera diff)
- Si prefieres, pásame capturas o el output SQL y lo incorporamos aquí en un anexo.

---

## 11) Actualizaciones recientes (Q4)

### Streaks y multiplicador (streakMultiplier)

- Lógica unificada para contar rachas por ocurrencias programadas consecutivas (no por días naturales):
  - daily: días consecutivos
  - weekly: lunes=0, se saltan los días no seleccionados
  - monthly: day_of_month (1–31)
- Cálculo usa fecha local (YYYY-MM-DD) en cliente, evitando UTC.
- Se incluye “hoy” en la racha si se está marcando como completado (newCompleted).
- streakMultiplier = min(2.0, 1 + 0.05 \* streakDays), tope 2.0.
- Logs añadidos para depuración:
  - [StreakMultiplier] y [StreakMultiplier:trace] en Home.jsx.
  - [Streak:UI:trace] en HabitsTodayModal.jsx.

### UI y reactividad

- HabitsTodayModal ahora recalcula la racha al marcar/desmarcar (usa todayProgress por props para reactualizar en tiempo real).
- Pastilla dev en HabitCard con “×1.xx” para validar el multiplicador en desarrollo.

### Monthly: selección de día del mes

- Nuevo campo day_of_month (1–31) en la creación/edición de hábitos (HabitModal).
- Home.jsx muestra como “hoy” un hábito monthly cuando el día actual coincide con day_of_month.
- Modelo de datos actualizado en Playbook: day_of_month SMALLINT NULL CHECK (1–31).

### 11.x UI/UX: Modales y Scroll

- Modal de Hábitos de Hoy (Home): transición custom con Animated (fade de fondo + spring desde abajo). Cierre suave al tocar fuera o con botón ✕.
- HabitModal (crear/editar hábito): transición custom (fade + scale spring) y cierre animado.
- CooperativeTemplate: incluye botón “Volver” (navigation.goBack).

### 11.1 Home: toggle de hábitos y progreso del día

- Update optimista robusto del progreso del día en la query ["progress", userId, dateISO]. Se pasa el estado deseado (desired) desde el botón para evitar lecturas stale.
- Mutación upsertProgress con comportamiento server-aligned:
  - Al marcar: crea/actualiza progress_entries con completed=true y xp_awarded.
  - Al desmarcar: elimina la fila del día en progress_entries (no se guarda completed=false). La API devuelve xp_delta negativo igual a los XP concedidos previamente (si no encuentra la fila, usa client_awarded enviado por el cliente como respaldo).
- onSuccess: la UI concilia el caché con el resultado del servidor:
  - Si res.completed === false, se elimina la entrada de la lista del día.
  - Si es true, se inserta/actualiza la entrada con los datos devueltos.
- onError: rollback completo del caché y del XP optimista.
- Recomendación DB: índice único para evitar duplicados por día: `create unique index if not exists progress_unique_per_day on public.progress_entries (user_id, habit_id, date);`

### 11.2 XP y nivel del perfil

- La mutación de progreso devuelve `xp_delta` (positivo al marcar, negativo al desmarcar). En Home se aplica `updateProfileXpAndLevel(user.id, xp_delta)` tras el éxito.
- La fórmula de nivel actual se mantiene en cliente: `level = floor(sqrt(totalXP / 100)) + 1`.
- Si en el futuro se desea desacoplar la progresión, crear tabla `levels` en Supabase (level, xp_required) y computar el nivel consultando `xp_required`.

### 11.3 Perfil: datos reales y edición

- ProfileTemplate muestra: imagen de personaje (por nivel), nombre, email, nivel, XP bar, y permite editar display_name y personaje.
- Profile.jsx asegura el fetch del perfil y calcula el porcentaje de XP del nivel actual.
- UsersStore expone `updateProfile` y se usa `updateProfileFields` (Supabase) para persistir cambios de display_name y character_id.
- Nota: avatar (text) de profiles queda deprecado/opcional; no se persiste desde la app.

### 11.4 Personajes (characters) como fuente de avatares

- Nueva tabla (sugerida) `characters` para centralizar assets y evoluciones por nivel.
  - Campos: id (uuid), key (text unique), name (text), gender (text), active (bool), image_url (fallback), variants (jsonb: [{ level_from, image_url }]), created_at.
- CRUD en cliente: `src/supabase/crudCharacters.js`
  - `getCharacters()`, `getCharacterById(id)`, `upsertCharacter(character)`, `deleteCharacter(id)`, `getImageForLevel(character, level)`.
- Integración:
  - CreateProfile carga `getCharacters()` y mapea opciones de avatar desde Supabase; guarda `character_id` en `profiles` (sin persistir avatar).
  - Profile carga opciones por nivel actual y permite cambiar el personaje (actualiza `character_id`).
- Esquema en `profiles`: `character_id uuid references public.characters(id)`.
- Render de imagen: se calcula en cliente con `getImageForLevel` en base al `level` actual.

### 11.5 RLS/Permisos necesarios para progreso

- Asegurar políticas RLS de `progress_entries` para DELETE además de SELECT/INSERT/UPDATE:
  - `create policy "users can delete own progress" on public.progress_entries for delete using (auth.uid() = user_id);`

### 11.6 Analítica y Estadísticas

- Pestaña “Estadísticas” con:

  - Selector de rango (7/30/custom) con modal y stepper (+/-), animaciones y leyenda de colores.
  - Resumen general (KPIs: Cumplimiento, Días activos, Hábitos) con delta vs periodo anterior.
  - Tendencia con react-native-gifted-charts (línea + área) y comparativa del periodo anterior.
  - Tooltip con fecha dd/mm/aa y “N tarea(s)” al tap sobre un punto.
  - Scroll horizontal desde 6 días y ancho dinámico calculado manualmente sin adjustToWidth:
    - width = baseWidth vs initial + (count - 1) * perPoint + rightPad
    - perPoint por defecto 14; initial 12; rightPad = ceil(maxTooltipWidth + 12)
  - Evitar recorte del tooltip al final:
    - endSpacing y ScrollView paddingRight sincronizados con rightPad
    - tooltip con width fijo (maxTooltipWidth), pointerLabelComponent
  - Para 10+ días, se ocultan labels del eje X; la fecha siempre va en el tooltip
  - Mantener área degradada y puntos ocultos para una línea clara
  - Insights: Top 3 hábitos y “Oportunidad”.
  - Lista “Resumen por hábito”: tarjetas a pulir (tipografías/espaciado) y acceso a detalle.

- Decisiones:

  - Gráficos con gifted-charts + react-native-svg (mejor compatibilidad en Expo RN 0.81/React 19).
  - Fallback por overlay Pressable para detección de taps en rangos largos (10+), enviando la fecha al template.

- Próximos:
  - Fix fechas en rangos 10+ (normalizar tap con scrollX, formato DD/MM opcional, mostrar fecha · N hábitos).
  - Mejorar tarjetas del resumen por hábito (jerarquía tipográfica y espaciados, estados vacíos/loader por hábito).
  - Pantalla de detalle de hábito con KPIs y gráfico de tendencia individual (misma lib y comparativa), navegación desde la tarjeta.
