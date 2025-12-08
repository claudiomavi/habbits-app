# Cooperativo · Decisiones técnicas y plan

Estado: Aprobado

Decisiones clave

- Modelo de datos: reutilizar tablas existentes con campo group_id
  - habits y progress_entries ya existen. Se usarán con un nuevo campo group_id (si no está ya definido) para asociarlos a grupos.
  - No se crean tablas nuevas group_habits ni group_habit_progress.

- Permisos de hábitos de grupo
  - Crear/editar/eliminar hábitos del grupo: solo owner y admin del grupo.
  - Completar progreso: miembros del grupo (progress_entries con group_id del grupo).

- Leaderboard (Clasificatorio)
  - Fuente: sumar xp_awarded de progress_entries filtrado por group_id.
  - Sin rango temporal: ranking total acumulado por usuario del grupo.

- Ajustes del grupo
  - Owner y Admin pueden: invitar miembros, expulsar miembros.
  - Renombrar grupo: owner (y opcionalmente admin, según RLS que se defina).
  - Eliminar grupo: solo owner.

Plan de implementación (UI con tabs)

1) Group Detail
   - Pantalla: GroupDetail (Stack) -> GroupDetailTemplate (Tabs: Hábitos | Clasificatorio | Ajustes)
   - Navegación: desde "Mis grupos" en Cooperative -> tap = navegar a GroupDetail con groupId.

2) Tab Hábitos (máx. 5 por grupo)
   - Listar hábitos por group_id (limit 5).
   - Crear/editar/eliminar hábito (solo owner/admin).
   - Toggle completar: insertar/actualizar progress_entries con group_id.
   - Validación de límite 5: en cliente + en RLS/RPC para consistencia.

3) Tab Clasificatorio
   - Listado de usuarios del grupo con suma total de xp_awarded en progress_entries por group_id.
   - Orden descendente por total XP.

4) Tab Ajustes
   - Renombrar grupo (update groups.name) — owner.
   - Gestionar miembros: listar, invitar (createInvitation), expulsar (delete group_members); admin y owner pueden hacerlo.
   - Cambiar roles: elevar a admin / revocar admin — owner.
   - Eliminar grupo — owner.

RLS (resumen esperado)

- groups
  - SELECT: miembros (owner/admin/member) del group_id.
  - UPDATE name: owner (posible permitir admin).
  - DELETE: owner.

- group_members
  - SELECT: miembros del grupo.
  - INSERT: owner/admin (añadir miembro invitado) y vía RPC de aceptar invitación.
  - UPDATE role: owner.
  - DELETE: owner/admin (expulsar miembro; no permitir auto-expulsar al owner).

- group_invitations
  - SELECT: por email (invitee) y miembros del grupo.
  - INSERT: owner/admin.
  - UPDATE status: invitee (aceptar/rechazar) o owner/admin (revocar).

- habits
  - SELECT: miembros del grupo (cuando habit.group_id no es null) o autor para hábitos personales.
  - INSERT/UPDATE/DELETE con group_id: owner/admin del grupo.

- progress_entries
  - SELECT: miembros del grupo cuando progress_entries.group_id = group_id del miembro.
  - INSERT/UPDATE: el propio usuario; para group_id, debe ser miembro del grupo.

Notas de implementación en cliente

- Añadida pantalla GroupDetail con tabs (esqueleto) y navegación desde Cooperative.
- Pendiente wiring de supabase para hábitos del grupo, ranking y ajustes según RLS definitivas.

Próximos pasos

- Implementar Tab Hábitos con límite 5 y operaciones CRUD protegidas por rol.
- Implementar Clasificatorio sumando xp_awarded por group_id.
- Implementar Ajustes: renombrar, invitar/expulsar, roles, eliminar grupo.
- Añadir feedback UX (loaders y toasts) y tests básicos.
