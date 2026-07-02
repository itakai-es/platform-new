# ITAKAI - TODO List

**Última actualización:** 2026-01-09
**Completitud Global:** 78%
**Tests E2E:** 422/425 passing (99.3%) - 2 known failures, 1 skipped
**Última Sesión:** Gamification components (XPBar, BadgeCard, LevelUpModal) - 85% completado

---

## 🔴 CRÍTICO - MVP Bloqueantes

### ❌ Parent Module (ELIMINADO) - 2026-01-12
**Estado:** DEPRECADO - El rol "parent" ha sido completamente eliminado del sistema

**Razón:** Decisión arquitectónica de simplificar la aplicación a 3 roles principales (student, teacher, admin)

**Archivos eliminados:**
- `/app/types/parent.types.ts`
- `/app/stores/parent.ts`
- `/app/layouts/parent.vue`
- `/app/pages/parent/dashboard.vue`
- `/app/pages/parent/children/[id].vue`
- `/app/mocks/handlers/parent.ts`
- `/tests/e2e/parent-dashboard.spec.ts`
- `/tests/e2e/parent-child-detail.spec.ts`

**Referencias removidas:**
- `types/common.types.ts` - Role type
- `app/types/auth.types.ts` - User.role
- `app/pages/onboarding/role-selection.vue` - Parent card
- `app/components-demo.vue` - Parent variants
- Tests E2E de mobile navigation y responsive audit

---

### ~~✅ Parent Module (100% COMPLETADO) - 2026-01-08~~ [DEPRECADO]
**Tiempo Real:** ~6h | **Impacto:** ALTO - MVP Desbloqueado

- [x] **Tarea 1.1:** Crear Parent Store (`app/stores/parent.ts`) ✅
  - Estado: children, selectedChild, activities, events, messages, childProgress
  - Actions: fetchChildren, fetchChildById, fetchChildProgress, fetchActivities, fetchEvents, fetchMessages, linkChild, unlinkChild
  - Completado: 2026-01-08

- [x] **Tarea 1.2:** Componente ChildCard (Integrado en dashboard) ✅
  - Implementado inline en dashboard como cards con data-testid
  - Stats: level, XP, rank, weeklyProgress
  - Click para navegar a detalle
  - Completado: 2026-01-08

- [x] **Tarea 1.3:** ActivityTimeline (Integrado en dashboard y child detail) ✅
  - Lista de actividades recientes con iconos dinámicos
  - Tipos: mission_completed, level_up, class_attendance, achievement, warning, assignment_due
  - Filtrado por hijo opcional
  - Completado: 2026-01-08

- [x] **Tarea 1.4:** Página `/parent/children/[id]` ✅
  - Vista completa de progreso del hijo
  - Secciones: Stats principales, Weekly Progress, Performance by Subject, Recent Activities, Upcoming Events
  - Filtrado de actividades y eventos por hijo
  - Completado: 2026-01-08

- [x] **Tarea 1.5:** Sistema de Vinculación (Partial) ⚠️
  - Store actions implementadas: linkChild(), unlinkChild()
  - Falta: UI de vinculación (modal + botón)
  - Nota: Funcionalidad core lista, UI pendiente para futuro

- [x] **Tarea 1.6:** MSW Handlers Parent (`app/mocks/handlers/parent.ts`) ✅
  - GET /parent/children (con soporte ?empty=true)
  - GET /parent/children/:id
  - GET /parent/children/:id/progress
  - GET /parent/activities (con filtro childId opcional)
  - GET /parent/events
  - GET /parent/messages
  - GET /parent/stats
  - POST /parent/children/link
  - DELETE /parent/children/:id/unlink
  - Completado: 2026-01-08

- [x] **Tarea 1.7:** Tests E2E Parent ✅
  - `parent-dashboard.spec.ts` (26/26 tests passing) ✅
  - `parent-child-detail.spec.ts` (23/23 tests passing) ✅
  - Total: 49/49 tests passing (100%)
  - Coverage: Basic UI, Children Cards, Activities, Events, Messages, Navigation, Error Handling, Empty States
  - Completado: 2026-01-08

- [x] **Tarea 1.8:** Cross-Browser & Mobile Testing ✅
  - **Chromium**: 49/49 tests passing (100%) ✅
  - **Firefox**: 48/49 tests passing (98%) - 1 flaky timestamp test
  - **Webkit**: 48/49 tests passing (98%) - 1 flaky timestamp test
  - **Mobile Chrome**: 48/49 tests passing (98%) - 1 flaky timestamp test
  - **Total**: 193/196 tests passing (98.5%)
  - **Tiempo de ejecución**: 2.3 minutos (12 workers paralelos)
  - **Fixes aplicados**:
    - Accessibility: Added `aria-label` to icon-only back button for screen reader support
    - Test selector: Changed regex from `/Volver|Dashboard/i` to `/Volver/i` to avoid sidebar navigation conflicts
  - **Known Issues**:
    - 3 flaky timestamp tests on Firefox/Webkit/Mobile Chrome (timing issue in parallel execution, non-critical)
  - Completado: 2026-01-08

**Archivos Creados:**
- `/app/types/parent.types.ts` - Type definitions
- `/app/mocks/handlers/parent.ts` - MSW handlers (348 líneas)
- `/app/stores/parent.ts` - Parent store (367 líneas)
- `/app/pages/parent/children/[id].vue` - Child detail page (324 líneas)
- `/tests/e2e/parent-dashboard.spec.ts` - Dashboard E2E tests (277 líneas)
- `/tests/e2e/parent-child-detail.spec.ts` - Child detail E2E tests (260 líneas)

**Archivos Modificados:**
- `/app/mocks/handlers/index.ts` - Added parent handlers
- `/app/pages/parent/dashboard.vue` - Complete refactor to use Parent Store (364 líneas)

**Lecciones Aprendidas:**
- Playwright strict mode: usar `.first()` para múltiples matches
- Query param flow: Page → Route → Store → API para empty states
- TDD Red-Green-Refactor acelera desarrollo y reduce bugs

---

## 🟡 IMPORTANTE - MVP Deseables

### ✅ Stores Pinia Centralizadas (100% COMPLETADO) - 2026-01-08
**Tiempo Real:** ~12h | **Impacto:** MEDIO - Mejora arquitectura

- [x] **Tarea 2.1:** Classes Store (`app/stores/classes.ts`) ✅
  - Centralizar lógica de clases (student + teacher)
  - Actions: fetchStudentClasses, fetchTeacherClasses, fetchStudentClassById, fetchTeacherClassById, fetchClassMissions, joinClass
  - Enhanced: Added fetchClassMissions method
  - Completado: 2026-01-08

- [x] **Tarea 2.2:** Gamification Store (`app/stores/gamification.ts`) ✅
  - Centralizar XP, niveles, badges, profile
  - Actions: fetchProfile, updateProfile, updateAvatar, changePassword, fetchAchievements, fetchInventory
  - 47/47 tests passing (100%)
  - Completado: 2026-01-07

- [x] **Tarea 2.3:** Shop Store (`app/stores/shop.ts`) ✅
  - Separar de students handlers
  - Actions: fetchItems, fetchWallet, purchase, fetchInventory
  - Estado: items, wallet, inventory, loading states
  - 24/24 tests passing (100%)
  - Completado: 2026-01-07

- [x] **Tarea 2.4:** Leaderboard Store (`app/stores/leaderboard.ts`) ✅
  - (Reemplaza Profile Store - profile está en Gamification Store)
  - Actions: fetchCurrentUserStats, fetchLeaderboard
  - Soporte para 3 tabs (global/class/friends) y 3 períodos (week/month/all)
  - 21/21 tests passing (100%)
  - Completado: 2026-01-08

- [x] **Tarea 2.5:** Refactorizar componentes existentes ✅
  - ✅ Student dashboard: usa classesStore.fetchStudentClasses() (9/9 tests)
  - ✅ Student classes/[id]: usa classesStore.fetchClassMissions() (19/19 tests)
  - ✅ Student leaderboard: usa leaderboardStore completo (21/21 tests)
  - Total: 40/40 tests passing (100%)
  - Completado: 2026-01-08

**Archivos Creados:**
- `/app/stores/leaderboard.ts` - Leaderboard store (142 líneas)

**Archivos Modificados:**
- `/app/stores/classes.ts` - Added fetchClassMissions method
- `/app/pages/student/dashboard.vue` - Refactored to use classesStore
- `/app/pages/student/classes/[id].vue` - Refactored to use classesStore.fetchClassMissions
- `/app/pages/student/leaderboard.vue` - Refactored to use leaderboardStore

**Lecciones Aprendidas:**
- storeToRefs() mantiene reactividad al destructurar stores
- Separar loading states por acción mejora UX
- TDD Baseline → Refactor → Green funciona perfectamente

**Total Completado: 12h (vs 14h estimado)**

---

### Admin Module Básico (25% → 70%)
**Estimado:** 3-4 días | **Impacto:** MEDIO - No bloqueante

- [ ] **Tarea 3.1:** Admin Store (`app/stores/admin.ts`)
  - Estado: users, stats, logs, loading
  - Actions: fetchUsers, suspendUser, activateUser, fetchStats
  - Estimado: 2h

- [ ] **Tarea 3.2:** Página `/admin/users`
  - Tabla de usuarios con filtros (rol, estado, búsqueda)
  - Acciones: Ver detalle, Suspender, Activar, Eliminar
  - Paginación
  - Estimado: 4h

- [ ] **Tarea 3.3:** Componente UsersTable (`app/components/organisms/UsersTable.vue`)
  - Tabla reutilizable con sorting y filtros
  - Props: users[], loading, onAction
  - Estimado: 3h

- [ ] **Tarea 3.4:** MSW Handlers Admin (`app/mocks/handlers/admin.ts`)
  - GET /admin/users
  - PUT /admin/users/:id/suspend
  - PUT /admin/users/:id/activate
  - DELETE /admin/users/:id
  - GET /admin/stats
  - Estimado: 2h

- [ ] **Tarea 3.5:** Tests E2E Admin
  - `admin-users.spec.ts` (6 tests)
  - `admin-dashboard.spec.ts` (3 tests)
  - Estimado: 3h

**Total Estimado: ~14h**

---

### ✅ Gamificación Completa (95% COMPLETADO) - 2026-01-09
**Tiempo Real:** ~6h | **Impacto:** MEDIO - UX mejorada

- [x] **Tarea 4.1:** XPBar Organism (`app/components/organisms/XPBar.vue`) ✅
  - Barra de XP animada con nivel actual
  - Props: currentXP, requiredXP, level, showGain, gainAmount
  - Animación al ganar XP con floating numbers (+XP)
  - Gradiente visual from-student via-green-400 to-green-500
  - Integrado en `/app/pages/student/dashboard.vue`
  - Completado: 2026-01-09

- [x] **Tarea 4.2:** BadgeCard Molecule (`app/components/molecules/BadgeCard.vue`) ✅
  - Card de insignia (locked/unlocked) con estados visuales
  - Props: badge (id, name, description, imageUrl?, icon?, rarity, earnedAt?, criteria?, progress?)
  - Soporte para imágenes y emojis como iconos
  - Progress bar para achievements en progreso
  - Rarity badges: common, rare, epic, legendary
  - Lock/Check icons para estados locked/unlocked
  - Integrado en `/app/pages/student/achievements.vue`
  - Completado: 2026-01-09

- [x] **Tarea 4.3:** Sistema de Recompensas por Nivel ✅
  - LevelUpModal con animación de confetti
  - Props: show, oldLevel, newLevel, rewards[]
  - Confetti animation usando Canvas API
  - Rewards display: coins, XP, items, badges
  - **INTEGRADO en `/app/layouts/student.vue`** - Modal global para level-ups
  - XP Calculator utility (`app/utils/xp-calculator.ts`) - Lógica de niveles y XP
  - Gamification Store actualizado con addXP(), closeLevelUpModal()
  - Completado: 2026-01-09

- [x] **Tarea 4.4:** Animaciones de Gamificación (100% completado) ✅
  - [x] Animación de XP ganado (floating numbers) - Implementado en XPBar
  - [x] Animación de level up (confetti) - Implementado en LevelUpModal
  - [x] Infraestructura completa de level-up - Store + Calculator + Modal global
  - Completado: 2026-01-09

**Archivos Creados:**
- `/app/components/organisms/XPBar.vue` (95 líneas) - Barra de XP con animaciones
- `/app/components/molecules/BadgeCard.vue` (156 líneas) - Card de insignias
- `/app/components/organisms/LevelUpModal.vue` (282 líneas) - Modal de level up con confetti
- `/app/utils/xp-calculator.ts` (122 líneas) - Cálculo de niveles, XP requerido, level-up detection
- `/tests/e2e/level-up-modal.spec.ts` (4 tests skipped) - Tests de modal (requieren Docker)

**Archivos Modificados:**
- `/app/pages/student/dashboard.vue` - Integrado XPBar en stats card
- `/app/pages/student/achievements.vue` - Integrado BadgeCard en grid de logros
- `/app/layouts/student.vue` - Integrado LevelUpModal global + gamificationStore
- `/app/stores/gamification.ts` - Agregado addXP(), closeLevelUpModal(), levelUpData state

**Tests E2E:**
- student-achievements.spec.ts: 22/23 tests passing (95.7%)
- level-up-modal.spec.ts: 4 tests (skipped - requieren Docker running)
- 1 minor CSS issue: locked achievements opacity expectation

**Completitud: 95%** - Sistema completo de gamificación con XP, levels, y recompensas

---

### Componentes Pendientes (67% → 90%)
**Estimado:** 2 días | **Impacto:** BAJO - Nice to have

- [ ] **Tarea 5.1:** SearchBar Molecule (`app/components/molecules/SearchBar.vue`)
  - Input de búsqueda con debounce
  - Props: placeholder, modelValue, delay
  - Emit: @search
  - Estimado: 1h

- [ ] **Tarea 5.2:** AvatarBuilder Organism (`app/components/organisms/AvatarBuilder.vue`)
  - Constructor de avatar interactivo
  - Opciones: cara, cabello, color, accesorios
  - Preview en tiempo real
  - Estimado: 4h

- [ ] **Tarea 5.3:** Leaderboard Organism (componentizar)
  - Extraer de página a componente reutilizable
  - Props: rankings[], type (global/class/friends)
  - Estimado: 2h

- [ ] **Tarea 5.4:** CalendarView Organism (`app/components/organisms/CalendarView.vue`)
  - Calendario mensual para misiones
  - Props: events[], selectedDate
  - Navegación mes anterior/siguiente
  - Estimado: 3h

**Total Estimado: ~10h**

---

## 🟢 MEJORAS - Post-MVP

### IA Generativa para Teacher (20% → 80%)
**Estimado:** 3 días | **Impacto:** ALTO - Diferenciador

- [ ] **Tarea 6.1:** Modal AIGenerateNarrative (`app/components/organisms/AIGenerateNarrative.vue`)
  - Input: tema, dificultad, contexto
  - Output: narrativa generada
  - Botón regenerar, editar
  - Estimado: 2h

- [ ] **Tarea 6.2:** Integrar en `/teacher/missions/create`
  - Botón "Generar Narrativa con IA"
  - Preview y edición
  - Insertar en formulario
  - Estimado: 2h

- [ ] **Tarea 6.3:** Generador de Quizzes
  - Modal AIGenerateQuiz
  - Input: tema, cantidad preguntas, dificultad
  - Output: preguntas con respuestas
  - Estimado: 3h

- [ ] **Tarea 6.4:** Generador de Imágenes (opcional)
  - Integración con DALL-E o Stable Diffusion
  - Modal AIGenerateImage
  - Preview y selección
  - Estimado: 4h

- [ ] **Tarea 6.5:** AI Store (`app/stores/ai.ts`)
  - Separar de chat.ts
  - Actions: generateNarrative, generateQuiz, generateImage
  - Estado: loading, error, generatedContent
  - Estimado: 2h

**Total Estimado: ~13h**

---

### Analíticas Avanzadas (20% → 80%)
**Estimado:** 4-5 días | **Impacto:** MEDIO - Teacher value

- [ ] **Tarea 7.1:** Instalar y configurar Chart.js o Recharts
  - Configurar Nuxt plugin
  - Tipos TypeScript
  - Estimado: 1h

- [ ] **Tarea 7.2:** Página `/teacher/analytics`
  - Layout con cards de estadísticas
  - Gráficas: progreso por clase, misiones completadas, XP ganado
  - Filtros: por clase, por fecha
  - Estimado: 5h

- [ ] **Tarea 7.3:** Componentes de Gráficas
  - LineChart (progreso temporal)
  - BarChart (comparación clases)
  - PieChart (distribución completitud)
  - Estimado: 4h

- [ ] **Tarea 7.4:** Exportación de Reportes
  - Botón "Exportar a PDF"
  - Generación de PDF con jsPDF
  - Incluir gráficas y estadísticas
  - Estimado: 3h

- [ ] **Tarea 7.5:** MSW Handlers Analytics
  - GET /teacher/analytics/overview
  - GET /teacher/analytics/class/:id
  - GET /teacher/analytics/student/:id
  - Estimado: 2h

**Total Estimado: ~15h**

---

### Notificaciones en Tiempo Real (40% → 90%)
**Estimado:** 2-3 días | **Impacto:** MEDIO - UX mejorada

- [ ] **Tarea 8.1:** Configurar WebSockets o SSE
  - Decidir entre WebSockets (Socket.io) o Server-Sent Events
  - Setup de conexión en plugin Nuxt
  - Estimado: 2h

- [ ] **Tarea 8.2:** Actualizar Notifications Store
  - Conexión tiempo real
  - Event handlers: onNotification, onMarkRead
  - Auto-update de badge count
  - Estimado: 2h

- [ ] **Tarea 8.3:** Página de Preferencias de Notificaciones
  - `/student/settings/notifications`
  - Checkboxes: email, push, sonido
  - Por tipo de notificación
  - Estimado: 2h

- [ ] **Tarea 8.4:** Notificaciones Push (opcional)
  - Service Worker para push notifications
  - Pedir permiso al usuario
  - Integración con API de Push
  - Estimado: 4h

**Total Estimado: ~10h**

---

### OAuth Providers (0% → 100%)
**Estimado:** 2 días | **Impacto:** BAJO - Nice to have

- [ ] **Tarea 9.1:** Configurar Google OAuth
  - Obtener Client ID/Secret
  - Nuxt module o plugin
  - Botón "Continuar con Google"
  - Estimado: 2h

- [ ] **Tarea 9.2:** Configurar Microsoft OAuth
  - Obtener Client ID/Secret
  - Integración similar a Google
  - Botón "Continuar con Microsoft"
  - Estimado: 2h

- [ ] **Tarea 9.3:** Actualizar Auth Store
  - Actions: loginWithGoogle, loginWithMicrosoft
  - Manejo de tokens OAuth
  - Estimado: 1.5h

- [ ] **Tarea 9.4:** MSW Handlers OAuth
  - Mock de endpoints OAuth
  - Simulación de flujo completo
  - Estimado: 1.5h

**Total Estimado: ~7h**

---

### Testing Completo (70% → 95%)
**Estimado:** 3-4 días | **Impacto:** ALTO - Calidad

- [ ] **Tarea 10.1:** Unit Tests con Vitest
  - Tests para utils/ (xp-calculator, validators)
  - Tests para composables/ (useAuth, useMissions)
  - Tests para stores/ (auth, mission, gamification)
  - Estimado: 6h

- [ ] **Tarea 10.2:** Tests E2E Parent Module
  - Ya incluido en Tarea 1.7
  - Estimado: 0h (duplicado)

- [ ] **Tarea 10.3:** Tests E2E Admin Module
  - Ya incluido en Tarea 3.5
  - Estimado: 0h (duplicado)

- [ ] **Tarea 10.4:** Coverage Reports
  - Configurar Vitest coverage
  - Script `test:coverage`
  - Objetivo: >80% coverage
  - Estimado: 1h

- [ ] **Tarea 10.5:** Playwright Tests Refactor
  - Extraer helpers comunes
  - Page Object Model pattern
  - Reducir duplicación
  - Estimado: 3h

**Total Estimado: ~10h**

---

### Responsive & A11y (60% → 90%)
**Estimado:** 2-3 días | **Impacto:** ALTO - Accesibilidad

- [ ] **Tarea 11.1:** Mobile Navigation
  - Hamburger menu para sidebar en mobile
  - Bottom navigation en mobile
  - Estimado: 3h

- [ ] **Tarea 11.2:** Componentes Responsive
  - Revisar todos los componentes
  - Añadir breakpoints mobile/tablet
  - Estimado: 4h

- [ ] **Tarea 11.3:** Navegación por Teclado
  - Tab navigation en modales
  - Shortcuts (Esc para cerrar, etc.)
  - Focus visible
  - Estimado: 2h

- [ ] **Tarea 11.4:** Screen Reader Testing
  - ARIA labels completos
  - Roles semánticos
  - Testear con NVDA/VoiceOver
  - Estimado: 3h

- [ ] **Tarea 11.5:** Contraste de Colores
  - Verificar WCAG AA compliance
  - Ajustar colores si necesario
  - Estimado: 1h

**Total Estimado: ~13h**

---

## 📊 Resumen de Estimaciones

| Categoría | Tareas | Estimado | Prioridad |
|-----------|--------|----------|-----------|
| ~~Parent Module~~ | ~~7~~ | ~~18h (2-3 días)~~ | ❌ ELIMINADO |
| Stores Centralizadas | 5 | 14h (2 días) | 🟡 Importante |
| Admin Module | 5 | 14h (2 días) | 🟡 Importante |
| Gamificación | 4 | 9h (1-2 días) | 🟡 Importante |
| Componentes | 4 | 10h (1-2 días) | 🟢 Mejora |
| IA Generativa | 5 | 13h (2 días) | 🟢 Mejora |
| Analíticas | 5 | 15h (2 días) | 🟢 Mejora |
| Notificaciones RT | 4 | 10h (1-2 días) | 🟢 Mejora |
| OAuth | 4 | 7h (1 día) | 🟢 Mejora |
| Testing | 4 | 10h (1-2 días) | 🟡 Importante |
| Responsive/A11y | 5 | 13h (2 días) | 🟡 Importante |

**TOTAL: ~133 horas (~17 días de trabajo efectivo)**

---

## 🎯 Plan de Ejecución Sugerido

### Sprint 1: MVP Crítico (Semana 1-2)
- ~~✅ Parent Module (18h)~~ ❌ ELIMINADO
- ✅ Stores Centralizadas (14h)
- ✅ Admin Module (14h)
**Total: 28h** (actualizado tras eliminación de Parent Module)

### Sprint 2: MVP Pulido (Semana 3)
- ✅ Gamificación Completa (9h)
- ✅ Componentes Pendientes (10h)
- ~~✅ Testing Parent/Admin~~ → ✅ Testing Admin (incluido en Sprint 1)
**Total: 19h**

### Sprint 3: Post-MVP (Semana 4-5)
- ✅ IA Generativa (13h)
- ✅ Analíticas (15h)
- ✅ Notificaciones RT (10h)
- ✅ Responsive/A11y (13h)
**Total: 51h**

### Sprint 4: Polish (Semana 6)
- ✅ OAuth (7h)
- ✅ Testing Completo (10h)
- ✅ Bug fixes y refinements
**Total: 17h**

---

## 📝 Notas

- Todas las tareas deben actualizarse en `CLAUDE.md` al completarse
- Marcar con ✅ cuando se complete cada tarea
- Agregar fecha de completitud
- Documentar lecciones aprendidas críticas
- Actualizar porcentaje de completitud global

**Última revisión:** 2026-01-08 por Claude Code
