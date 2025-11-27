# PLAN DE IMPLEMENTACIÓN — Cooperativo

## Objetivos

- Crear y gestionar grupos de hábitos cooperativos.
- Invitar usuarios por email.
- Dashboard de grupos y notificaciones.
- Vista de grupo con pestañas: Hábitos, Clasificatorio, Ajustes.

## Alcance MVP (versión 1)

- Grupos con máximo 5 tareas/hábitos por grupo.
- Invitaciones por email (aceptar/rechazar).
- Clasificatorio por puntos ganados.
- Ajustes de grupo: cambiar nombre, añadir/expulsar usuarios, permisos básicos.

---

## Backlog (Checklist general)

- [ ] Invitación por email a otro usuario
- [ ] Dashboard cooperativo con tus grupos y banner de notificaciones
- [ ] Crear nuevo grupo desde el dashboard
- [ ] Cards por cada grupo con info clave (miembros, tareas activas, progreso)
- [ ] Al hacer click, entrar al grupo (tabs: Hábitos / Clasificatorio / Ajustes)
  - [ ] Pestaña Hábitos (max 5 por grupo): listar, crear, completar
  - [ ] Pestaña Clasificatorio: puntos por usuario del grupo
  - [ ] Pestaña Ajustes: cambiar nombre, añadir/expulsar usuarios, permisos

---

## Día 1 — Datos y seguridad (Supabase)

### Estructura de tablas (propuesta)

- groups

  - id (uuid, pk)
  - name (text)
  - owner_id (uuid -> auth.users)
  - created_at (timestamptz)

- group_members

  - group_id (uuid -> groups.id)
  - user_id (uuid -> auth.users)
  - role (text: 'owner' | 'admin' | 'member')
  - joined_at (timestamptz)
  - pk: (group_id, user_id)

- group_invitations

  - id (uuid, pk)
  - group_id (uuid -> groups.id)
  - email (text)
  - status (text: 'pending' | 'accepted' | 'rejected' | 'expired')
  - token (text, opcional si se usa link)
  - created_at (timestamptz)
  - acted_at (timestamptz, nullable)

- group_habits

  - id (uuid, pk)
  - group_id (uuid -> groups.id)
  - title (text)
  - description (text, nullable)
  - schedule (jsonb) // days_of_week / frequency
  - created_by (uuid -> auth.users)
  - created_at (timestamptz)
  - active (bool)

- group_habit_progress
  - id (uuid, pk)
  - group_habit_id (uuid -> group_habits.id)
  - user_id (uuid -> auth.users)
  - date (date, YYYY-MM-DD)
  - completed (bool)
  - points (int, default 0)
  - created_at (timestamptz)

### RLS (Row Level Security) — reglas esenciales

- groups: owner y miembros pueden ver.
- group_members: sólo miembros del group_id.
- group_invitations:
  - crear: owner/admin del grupo
  - leer: por email (si coincide con auth.email) o miembros del grupo
  - actualizar: quien recibe (cambiar status) o owner/admin (revocar)
- group_habits / group_habit_progress:
  - leer: miembros del grupo
  - escribir: miembros (progreso propio); owner/admin para crear/editar hábitos

### Vistas / agregados (opcional)

- leaderboard_view (group_id, user_id, points_sum)
- group_summary_view (group_id, active_habits, members_count, today_completed_pct)

---

## Día 2 — Flujos de invitación y notificaciones

### Invitación por email

- Crear invitación: insert en group_invitations (pending)
- Enviar email: Supabase function / webhook (plantilla: enlace con token)
- Aceptar/Rechazar: endpoint o acción en-app
  - Aceptar → insertar en group_members y marcar invitation.status = 'accepted'
  - Rechazar → invitation.status = 'rejected'

### Notificaciones

- Banner en dashboard: listar invitaciones entrantes (pending) y recientes aceptadas/rechazadas
- Realtime: suscribirse a group_invitations por email del usuario

---

## Día 3 — UI: Dashboard Cooperativo

- Lista de grupos del usuario (group_members por user_id)
- Banner de notificaciones (invitaciones)
- CTA "Crear grupo"
- Card de grupo: nombre, miembros, hábitos activos, % hoy, puntos top 1
- Navegación: al pulsar card → GroupDetail

Componentes (propuesta):

- CooperativeDashboardTemplate.jsx
- GroupCard.jsx
- InvitationsBanner.jsx
- CreateGroupModal.jsx

---

## Día 4 — UI: Group Detail (Tabs)

Tabs:

1. Hábitos
   - Lista (max 5)
   - Crear/editar/eliminar (según rol)
   - Completar hábito (marca progreso, suma puntos)
2. Clasificatorio
   - Tabla ranking: usuario | puntos
   - Periodo: semanal (por defecto)
3. Ajustes
   - Nombre del grupo
   - Gestión de miembros (añadir por email, expulsar)
   - Roles: owner/admin/member

Componentes (propuesta):

- GroupDetailTemplate.jsx
- GroupHabitsTab.jsx
- GroupLeaderboardTab.jsx
- GroupSettingsTab.jsx

---

## Día 5 — Lógica y stores

- Supabase CRUD (src/supabase):

  - crudCoopGroups.js: createGroup, listMyGroups, updateGroup, deleteGroup
  - crudCoopMembers.js: listMembers, addMember, removeMember, updateRole
  - crudCoopInvitations.js: createInvitation, listMyInvitations, accept, reject
  - crudCoopHabits.js: listGroupHabits, create, update, remove (max 5), toggleProgress
  - leaderboard.js: listLeaderboard(groupId, range)

- Stores (zustand):

  - CooperativeStore.js: groups, invitations, selectedGroup, actions async

- Hooks (react-query):
  - useMyGroups, useGroupInvitations, useGroupHabits, useLeaderboard

---

## Día 6 — Puntos y reglas

- Reglas de puntos (MVP):
  - Completar hábito del grupo: +10 puntos (configurable por grupo)
  - Bonus racha semanal por usuario y grupo (opcional): +20
- Validaciones:
  - Límite 5 hábitos por grupo
  - Evitar duplicados de invitación 'pending' por email/group_id

---

## Día 7 — Estilos y guía de UI (alineado a tema)

- Tipografía Poppins y tokens del theme
- Cards blancas con `shadows.soft`
- CTA naranja, progreso verde, logros amarillo
- Badges: estados/coinciden con tema
- Fondo: `gradients.backgroundSoft` en pantallas de alto nivel

---

## Día 8 — QA y checklist

- [ ] Crear grupo
- [ ] Invitar por email y ver banner (dashboard)
- [ ] Aceptar invitación y ver el grupo
- [ ] Crear hábitos en el grupo (max 5)
- [ ] Completar hábito → suma puntos y aparece en ranking
- [ ] Ajustes del grupo: cambiar nombre, añadir/expulsar, roles
- [ ] Realtime: invitaciones y leaderboard actualizan sin recargar
- [ ] RLS: un usuario fuera del grupo no ve ni modifica datos
- [ ] Rendimiento: queries paginadas si hay muchos grupos

---

## Decisiones técnicas

- Identidad: invitación por email (menos fricción que id directo)
- Supabase: RLS estricta; funciones RPC si simplifica roles
- Realtime: canales por group_id para hábitos/progreso y por email para invitaciones
- UX: dashboard primero, tabs dentro del grupo

---

## Roadmap (post-MVP)

- Roles granulares (p. ej., permisos por hábito)
- Historial de actividad del grupo
- Comentarios por hábito
- Retos temporizados entre grupos
- Exportación de métricas del grupo
