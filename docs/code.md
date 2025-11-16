## MVP PROPUESTO

- [ ] Registro / Login (email+verificación + Google/Apple).

  - [ ] Falta Google/Apple
  - [ ] Falta la forgotPassword
    - [ ] Implementar una página web estática con supabase
    - [ ] js que reciba los tokens y permita establecer la nueva contraseña.
    - [ ] Publicarla en Netlify/Vercel y añadir la URL como Redirect en Supabase.
    - [ ] Crear ForgotPassword para enviar a esa URL.

- [ ] Cooperativo: grupos cerrados por invitación/enlace; lista común de hábitos para el grupo.

- [ ] Exportar/visualizar progreso básico (pantalla de estadísticas).

  - [ ] Estadísticas: racha, % cumplimiento, historial por hábito (para mostrar en gráficas).

- [ ] Notificaciones locales (recordatorios por hábito).

- [ ] Gamificación: XP por completar hábitos → barra de nivel general. Rachas (streaks).

- [x] Onboarding + creación de perfil (nombre, elegir personaje hombre/mujer, avatar básico).

- [x] Home diario: lista de hábitos del día + marcar completado.

- [x] Persistencia y sincronización en Supabase (guardar hábitos, progresos y stats).

- [x] CRUD de hábitos (campos completos desde inicio).

## IDEAS DESARROLLO

- [ ] Añadir visualización de racha (chip “🔥 Racha X”) en HabitsTodayModal.

- [ ] Cuando se completa una tarea, poner la UI propuesta por Josemi

```
<div class="checkbox-container">
<input type="checkbox" id="task-check" class="task-checkbox" />
<label for="task-check" class="checkbox-label">
<div class="checkbox-box">
<div class="checkbox-fill"></div>
<div class="checkmark">
<svg viewBox="0 0 24 24" class="check-icon">
<path
            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
          ></path>
</svg>
</div>
<div class="success-ripple"></div>
</div>
<span class="checkbox-text">Complete this awesome task</span>
</label>

</div>
```

```
/* From Uiverse.io by MattiaCode-IT */
.checkbox-container {
  display: inline-block;
  margin: 50px auto;
  user-select: none;
}

.task-checkbox {
  display: none;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 16px;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 8px;
}

.checkbox-label:hover {
  background: rgba(16, 185, 129, 0.05);
  color: #111827;
}

.checkbox-box {
  position: relative;
  width: 22px;
  height: 22px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  margin-right: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
}

.checkbox-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  transform: scale(0);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border-radius: 4px;
  opacity: 0;
}

.checkmark {
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: scale(0.3) rotate(20deg);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.check-icon {
  width: 14px;
  height: 14px;
  fill: white;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.success-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(16, 185, 129, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
}

.checkbox-text {
  transition: all 0.3s ease;
  position: relative;
}

.checkbox-text::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 0;
  height: 2px;
  background: #6b7280;
  transition: width 0.4s ease;
  transform: translateY(-50%);
}

.checkbox-label:hover .checkbox-box {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
}

.task-checkbox:checked + .checkbox-label .checkbox-box {
  border-color: #10b981;
  background: #10b981;
  box-shadow:
    0 4px 12px rgba(16, 185, 129, 0.3),
    0 0 0 2px rgba(16, 185, 129, 0.2);
}

.task-checkbox:checked + .checkbox-label .checkbox-fill {
  transform: scale(1);
  opacity: 1;
}

.task-checkbox:checked + .checkbox-label .checkmark {
  opacity: 1;
  transform: scale(1) rotate(0deg);
  animation: checkPop 0.3s ease-out 0.2s;
}

.task-checkbox:checked + .checkbox-label .success-ripple {
  animation: rippleSuccess 0.6s ease-out;
}

.task-checkbox:checked + .checkbox-label .checkbox-text {
  color: #6b7280;
}

.task-checkbox:checked + .checkbox-label .checkbox-text::after {
  width: 100%;
}

.checkbox-label:active .checkbox-box {
  transform: scale(0.95);
}

@keyframes checkPop {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes rippleSuccess {
  0% {
    width: 0;
    height: 0;
    opacity: 0.6;
  }
  70% {
    width: 50px;
    height: 50px;
    opacity: 0.3;
  }
  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
  }
}
```

- [ ] Para los hábitos mensuales poder elegir el día del mes
