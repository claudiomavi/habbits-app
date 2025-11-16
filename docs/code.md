## MVP PROPUESTO

- [ ] Registro / Login (email+verificación + Google/Apple).

  - [ ] Falta Google/Apple
  - [ ] Falta la forgotPassword
    - [ ] Implementar una página web estática con supabase
    - [ ] js que reciba los tokens y permita establecer la nueva contraseña.
    - [ ] Publicarla en Netlify/Vercel y añadir la URL como Redirect en Supabase.
    - [ ] Crear ForgotPassword para enviar a esa URL.

- [ ] Cooperativo: grupos cerrados por invitación/enlace; lista común de hábitos para el grupo.

- [ ] Gamificación: XP por completar hábitos → barra de nivel general. Rachas (streaks).

  - [ ] 1. Cuando se sube de nivel que aparezca un badge con la enhorabuena
  - [ ] 2. Cuando el personaje cambia de forma que apareza un badge que de la enhorabuena para la subida de nivel y que enseñe la nueva forma

- [ ] Exportar/visualizar progreso básico (pantalla de estadísticas).

  - [ ] Estadísticas: racha, % cumplimiento, historial por hábito (para mostrar en gráficas).

- [ ] Notificaciones locales (recordatorios por hábito).

- [x] Onboarding + creación de perfil (nombre, elegir personaje hombre/mujer, avatar básico).

- [x] Home diario: lista de hábitos del día + marcar completado.

- [x] Persistencia y sincronización en Supabase (guardar hábitos, progresos y stats).

- [x] CRUD de hábitos (campos completos desde inicio).

## IDEAS DESARROLLO

- [ ] Poner el loading propuesto por Josemi

- [ ] Cuando se completa una tarea, poner la UI propuesta por Josemi

- [ ] Para los hábitos mensuales poder elegir el día del mes

- Añadir visualización de racha (chip “🔥 Racha X”) en HabitCard y/o en HabitsTodayModal.
- Añadir pruebas manuales/guía para testear el cálculo de streaks y el modal de nivel.
- Crear una pull request con estos cambios.
- Documentar en Confluence el diseño de gamificación (XP, niveles, rachas, evolución de personaje).
- Crear tareas en Jira para el chip de rachas, animaciones extra del modal de evolución y/o telemetría.
