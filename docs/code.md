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

- [ ] Poner el loading propuesto por Josemi

```
<div class="book">
  <div class="book__pg-shadow"></div>
  <div class="book__pg"></div>
  <div class="book__pg book__pg--2"></div>
  <div class="book__pg book__pg--3"></div>
  <div class="book__pg book__pg--4"></div>
  <div class="book__pg book__pg--5"></div>
</div>
```

```
.book,
.book__pg-shadow,
.book__pg {
  animation: cover 5s ease-in-out infinite;
}
.book {
  background-color: hsl(268, 90%, 65%);
  border-radius: 0.25em;
  box-shadow:
    0 0.25em 0.5em hsla(0, 0%, 0%, 0.3),
    0 0 0 0.25em hsl(278, 100%, 57%) inset;
  padding: 0.25em;
  perspective: 37.5em;
  position: relative;
  width: 8em;
  height: 6em;
  transform: translate3d(0, 0, 0);
  transform-style: preserve-3d;
}
.book__pg-shadow,
.book__pg {
  position: absolute;
  left: 0.25em;
  width: calc(50% - 0.25em);
}
.book__pg-shadow {
  animation-name: shadow;
  background-image: linear-gradient(
    -45deg,
    hsla(0, 0%, 0%, 0) 50%,
    hsla(0, 0%, 0%, 0.3) 50%
  );
  filter: blur(0.25em);
  top: calc(100% - 0.25em);
  height: 3.75em;
  transform: scaleY(0);
  transform-origin: 100% 0%;
}
.book__pg {
  animation-name: pg1;
  background-color: hsl(223, 10%, 100%);
  background-image: linear-gradient(
    90deg,
    hsla(223, 10%, 90%, 0) 87.5%,
    hsl(223, 10%, 90%)
  );
  height: calc(100% - 0.5em);
  transform-origin: 100% 50%;
}
.book__pg--2,
.book__pg--3,
.book__pg--4 {
  background-image: repeating-linear-gradient(
      hsl(223, 10%, 10%) 0 0.125em,
      hsla(223, 10%, 10%, 0) 0.125em 0.5em
    ),
    linear-gradient(90deg, hsla(223, 10%, 90%, 0) 87.5%, hsl(223, 10%, 90%));
  background-repeat: no-repeat;
  background-position: center;
  background-size:
    2.5em 4.125em,
    100% 100%;
}
.book__pg--2 {
  animation-name: pg2;
}
.book__pg--3 {
  animation-name: pg3;
}
.book__pg--4 {
  animation-name: pg4;
}
.book__pg--5 {
  animation-name: pg5;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --bg: hsl(223, 10%, 30%);
    --fg: hsl(223, 10%, 90%);
  }
}

/* Animations */
@keyframes cover {
  from,
  5%,
  45%,
  55%,
  95%,
  to {
    animation-timing-function: ease-out;
    background-color: hsl(278, 84%, 67%);
  }
  10%,
  40%,
  60%,
  90% {
    animation-timing-function: ease-in;
    background-color: hsl(271, 90%, 45%);
  }
}
@keyframes shadow {
  from,
  10.01%,
  20.01%,
  30.01%,
  40.01% {
    animation-timing-function: ease-in;
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(0);
  }
  5%,
  15%,
  25%,
  35%,
  45%,
  55%,
  65%,
  75%,
  85%,
  95% {
    animation-timing-function: ease-out;
    transform: translate3d(0, 0, 1px) scaleY(0.2) rotateY(90deg);
  }
  10%,
  20%,
  30%,
  40%,
  50%,
  to {
    animation-timing-function: ease-out;
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(180deg);
  }
  50.01%,
  60.01%,
  70.01%,
  80.01%,
  90.01% {
    animation-timing-function: ease-in;
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(180deg);
  }
  60%,
  70%,
  80%,
  90%,
  to {
    animation-timing-function: ease-out;
    transform: translate3d(0, 0, 1px) scaleY(0) rotateY(0);
  }
}
@keyframes pg1 {
  from,
  to {
    animation-timing-function: ease-in-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(0.4deg);
  }
  10%,
  15% {
    animation-timing-function: ease-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(180deg);
  }
  20%,
  80% {
    animation-timing-function: ease-in;
    background-color: hsl(223, 10%, 45%);
    transform: translate3d(0, 0, 1px) rotateY(180deg);
  }
  85%,
  90% {
    animation-timing-function: ease-in-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(180deg);
  }
}
@keyframes pg2 {
  from,
  to {
    animation-timing-function: ease-in;
    background-color: hsl(223, 10%, 45%);
    transform: translate3d(0, 0, 1px) rotateY(0.3deg);
  }
  5%,
  10% {
    animation-timing-function: ease-in-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(0.3deg);
  }
  20%,
  25% {
    animation-timing-function: ease-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(179.9deg);
  }
  30%,
  70% {
    animation-timing-function: ease-in;
    background-color: hsl(223, 10%, 45%);
    transform: translate3d(0, 0, 1px) rotateY(179.9deg);
  }
  75%,
  80% {
    animation-timing-function: ease-in-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(179.9deg);
  }
  90%,
  95% {
    animation-timing-function: ease-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(0.3deg);
  }
}
@keyframes pg3 {
  from,
  10%,
  90%,
  to {
    animation-timing-function: ease-in;
    background-color: hsl(223, 10%, 45%);
    transform: translate3d(0, 0, 1px) rotateY(0.2deg);
  }
  15%,
  20% {
    animation-timing-function: ease-in-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(0.2deg);
  }
  30%,
  35% {
    animation-timing-function: ease-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(179.8deg);
  }
  40%,
  60% {
    animation-timing-function: ease-in;
    background-color: hsl(223, 10%, 45%);
    transform: translate3d(0, 0, 1px) rotateY(179.8deg);
  }
  65%,
  70% {
    animation-timing-function: ease-in-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(179.8deg);
  }
  80%,
  85% {
    animation-timing-function: ease-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(0.2deg);
  }
}
@keyframes pg4 {
  from,
  20%,
  80%,
  to {
    animation-timing-function: ease-in;
    background-color: hsl(223, 10%, 45%);
    transform: translate3d(0, 0, 1px) rotateY(0.1deg);
  }
  25%,
  30% {
    animation-timing-function: ease-in-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(0.1deg);
  }
  40%,
  45% {
    animation-timing-function: ease-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(179.7deg);
  }
  50% {
    animation-timing-function: ease-in;
    background-color: hsl(223, 10%, 45%);
    transform: translate3d(0, 0, 1px) rotateY(179.7deg);
  }
  55%,
  60% {
    animation-timing-function: ease-in-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(179.7deg);
  }
  70%,
  75% {
    animation-timing-function: ease-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(0.1deg);
  }
}
@keyframes pg5 {
  from,
  30%,
  70%,
  to {
    animation-timing-function: ease-in;
    background-color: hsl(223, 10%, 45%);
    transform: translate3d(0, 0, 1px) rotateY(0);
  }
  35%,
  40% {
    animation-timing-function: ease-in-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(0deg);
  }
  50% {
    animation-timing-function: ease-in-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(179.6deg);
  }
  60%,
  65% {
    animation-timing-function: ease-out;
    background-color: hsl(223, 10%, 100%);
    transform: translate3d(0, 0, 1px) rotateY(0);
  }
}
```
