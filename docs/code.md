## MVP PROPUESTO

- [ ] Registro / Login (email+verificación + Google/Apple).

  - [ ] Falta Google/Apple
  - [ ] Falta la forgotPassword
    - [ ] Implementar una página web estática con supabase
    - [ ] js que reciba los tokens y permita establecer la nueva contraseña.
    - [ ] Publicarla en Netlify/Vercel y añadir la URL como Redirect en Supabase.
    - [ ] Crear ForgotPassword para enviar a esa URL.

- [ ] Notificaciones locales (recordatorios por hábito).

- [x] Cooperativo: grupos cerrados por invitación/enlace; lista común de hábitos para el grupo.

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
