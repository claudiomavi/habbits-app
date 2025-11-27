## MVP PROPUESTO

- [ ] Registro / Login (email+verificación + Google/Apple).

  - [ ] Falta Google/Apple
  - [ ] Falta la forgotPassword
    - [ ] Implementar una página web estática con supabase
    - [ ] js que reciba los tokens y permita establecer la nueva contraseña.
    - [ ] Publicarla en Netlify/Vercel y añadir la URL como Redirect en Supabase.
    - [ ] Crear ForgotPassword para enviar a esa URL.

- [ ] Notificaciones locales (recordatorios por hábito).

- [ ] Cooperativo: grupos cerrados por invitación/enlace; lista común de hábitos para el grupo.

- [x] Exportar/visualizar progreso básico (pantalla de estadísticas).

- [x] Gamificación: XP por completar hábitos → barra de nivel general. Rachas (streaks).

- [x] Onboarding + creación de perfil (nombre, elegir personaje hombre/mujer, avatar básico).

- [x] Home diario: lista de hábitos del día + marcar completado.

- [x] Persistencia y sincronización en Supabase (guardar hábitos, progresos y stats).

- [x] CRUD de hábitos (campos completos desde inicio).

## IDEAS DESARROLLO

- [ ] Modificar pantalla de creación personaje (todavía me tienen que decir cosas):

  - [ ] Añadir fecha nacimiento
  - [ ] Ver si creamos un username o usamos email/código uuid (a lo mejor solo ultimos 6 caracteres) para que se pueda buscar en modo cooperativo
  - [ ] Preguntas de los socios...

- [ ] Crear archivo de prerequisitos de Cooperativo

  - [ ] Ver como hacer invitación a otro usuario (yo lo haría con el email)
  - [ ] la primera página de cooperativo debería ser un dashbord con todos tus grupos y arriba que aparezca un banner si hay notificaciones (invitaciones entrantes o aceptadas/rechazadas)
  - [ ] Aquí mismo puedes crear también un nuevo grupo
  - [ ] En esta misma página tienes cards por cada grupo en el que te has unido con a lo mejor alguna información que salte a la vista importante
  - [ ] Haciendo click en una card entras en un grupo donde tienes las tareas (max 5 por grupo)
  - [ ] En esta página yo haría 3 tabs:
    - [ ] Hábitos
    - [ ] Clasificatorio con los puntos ganados por cada usuario en el grupo
    - [ ] Ajustes del grupo (cambiar nombre, añadir o expulsar usuarios, dar permisos a cada usuario)

- [ ] Empezar con Cooperativo
