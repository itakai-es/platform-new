# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a ITAKAI! Este documento te guiará en el proceso.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Guía de Estilo](#guía-de-estilo)
- [Proceso de Pull Request](#proceso-de-pull-request)

---

## 📜 Código de Conducta

Este proyecto se adhiere al [Código de Conducta](./CODE_OF_CONDUCT.md). Al participar, se espera que respetes este código.

---

## 🎯 ¿Cómo Puedo Contribuir?

### 🐛 Reportar Bugs

Si encuentras un bug:

1. Verifica que no exista ya un [issue similar](https://github.com/itakai-es/platform/issues)
2. Usa la [plantilla de bug report](https://github.com/itakai-es/platform/issues/new?template=bug_report.md)
3. Incluye:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots (si aplica)
   - Versión de ITAKAI, navegador, SO

### 💡 Sugerir Mejoras

Para nuevas funcionalidades:

1. Abre un [issue de feature request](https://github.com/itakai-es/platform/issues/new?template=feature_request.md)
2. Describe claramente la funcionalidad
3. Explica por qué sería útil
4. Proporciona ejemplos de uso

### 📝 Mejorar Documentación

La documentación es crucial. Puedes:
- Corregir typos
- Mejorar explicaciones
- Añadir ejemplos
- Traducir a otros idiomas

### 💻 Contribuir con Código

Revisa los [issues etiquetados como "good first issue"](https://github.com/itakai-es/platform/labels/good%20first%20issue) para empezar.

---

## 🛠️ Configuración del Entorno

### Requisitos

- **Node.js** 18 o superior
- **pnpm** 8 o superior (recomendado)
- **Docker** (opcional, pero recomendado)

### Setup

```bash
# 1. Fork y clonar el repositorio
git clone https://github.com/TU_USUARIO/platform.git
cd platform

# 2. Instalar dependencias
pnpm install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Levantar en desarrollo
docker-compose up -d
# O sin Docker:
pnpm dev
```

### Verificar instalación

```bash
# Ejecutar tests
pnpm test:e2e

# Verificar linting
pnpm lint

# Verificar tipos
pnpm typecheck
```

---

## 🔄 Proceso de Desarrollo

### 1. Crear una Rama

```bash
# Actualizar main
git checkout main
git pull origin main

# Crear rama para tu feature
git checkout -b feature/nombre-descriptivo
# O para bugfix:
git checkout -b bugfix/nombre-del-bug
```

**Convención de nombres de ramas:**
- `feature/` - Nuevas funcionalidades
- `bugfix/` - Corrección de bugs
- `docs/` - Cambios en documentación
- `refactor/` - Refactorización de código
- `test/` - Añadir o mejorar tests
- `chore/` - Mantenimiento, deps, etc

### 2. Hacer Cambios

- **TDD obligatorio**: Escribe tests E2E primero
- Sigue el [sistema de diseño](./docs/DESIGN_SYSTEM.md)
- No uses `any` en TypeScript
- Usa Tailwind (no CSS inline)
- Documenta funciones complejas

### 3. Commits

Usamos **Conventional Commits**:

```bash
git commit -m "feat: añadir sistema de notificaciones"
git commit -m "fix: resolver bug de login redirect"
git commit -m "docs: actualizar README con ejemplos"
git commit -m "refactor: simplificar cálculo de XP"
git commit -m "test: añadir tests para gamificación"
git commit -m "chore: actualizar dependencias"
```

**Tipos permitidos:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formato (no afecta lógica)
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Mantenimiento
- `perf`: Mejoras de rendimiento
- `ci`: Cambios en CI/CD

### 4. Tests

```bash
# Ejecutar todos los tests E2E
pnpm test:e2e

# Tests específicos
pnpm test:e2e tests/e2e/auth-login.spec.ts

# Modo interactivo (útil para debug)
pnpm test:e2e:ui
```

**Requisitos:**
- ✅ Todos los tests deben pasar
- ✅ Añadir tests para nuevas funcionalidades
- ✅ Coverage > 80% (idealmente)

### 5. Linting

```bash
# Revisar código
pnpm lint

# Auto-fix
pnpm lint:fix

# Validar tipos TypeScript
pnpm typecheck
```

---

## 🎨 Guía de Estilo

### TypeScript

```typescript
// ✅ CORRECTO
interface User {
  id: string
  name: string
  email: string
}

const getUser = async (id: string): Promise<User> => {
  // ...
}

// ❌ INCORRECTO
const getUser = async (id: any): Promise<any> => {
  // ...
}
```

### Componentes Vue

```vue
<!-- ✅ CORRECTO: PascalCase, script setup, TypeScript -->
<script setup lang="ts">
interface Props {
  title: string
  count: number
}

const props = defineProps<Props>()
</script>

<template>
  <div class="rounded-2xl bg-navy-dark p-6">
    <h2 class="text-2xl font-semibold text-white">{{ title }}</h2>
    <p class="text-text-secondary">{{ count }}</p>
  </div>
</template>
```

### Tailwind CSS

```vue
<!-- ✅ CORRECTO: Usar clases de Tailwind y design system -->
<button class="rounded-3xl bg-teacher px-6 py-3 font-semibold">
  Enviar
</button>

<!-- ❌ INCORRECTO: CSS inline o valores arbitrarios -->
<button style="background: gold; border-radius: 20px; padding: 12px 24px;">
  Enviar
</button>
```

### Naming

- **Componentes Vue**: `PascalCase` (Button.vue, MissionCard.vue)
- **Composables**: `camelCase` con prefijo `use` (useAuth.ts)
- **Stores**: `camelCase` (auth.ts, missions.ts)
- **Tipos**: `PascalCase` (User, Mission, Badge)
- **Funciones**: `camelCase` (getUserProfile, calculateXP)
- **Constantes**: `UPPER_SNAKE_CASE` (BASE_XP, MAX_LEVEL)

---

## 🚀 Proceso de Pull Request

### 1. Preparar el PR

Antes de abrir el PR, verifica:

```bash
# 1. Tests pasan
pnpm test:e2e

# 2. Linting correcto
pnpm lint && pnpm typecheck

# 3. Build exitoso
pnpm build

# 4. Commits bien formateados
git log --oneline
```

### 2. Abrir Pull Request

1. Ve a tu fork en GitHub
2. Click en "New Pull Request"
3. Selecciona tu rama
4. Llena la plantilla de PR:
   - ✅ Descripción clara del cambio
   - ✅ Issue relacionado (si aplica)
   - ✅ Screenshots (si cambios visuales)
   - ✅ Checklist completado

### 3. Code Review

- Responde a comentarios constructivamente
- Haz cambios solicitados
- Marca conversaciones como resueltas
- Pide aclaraciones si no entiendes algo

### 4. Merge

Una vez aprobado:
- ✅ Squash and merge (preferido)
- ✅ Mensaje de commit descriptivo
- ✅ Borrar rama después del merge

---

## 📏 Estándares de Código

### Performance

- Evita computaciones pesadas en el render
- Usa `computed` en vez de métodos para valores derivados
- Lazy load componentes grandes
- Optimiza imágenes (WebP, tamaños apropiados)

### Accesibilidad

- Usa roles ARIA apropiados
- Añade `alt` a imágenes
- Asegura contraste de colores (WCAG AA)
- Soporte de teclado en elementos interactivos

### Seguridad

- Nunca commits credenciales
- Valida todas las entradas del usuario
- Sanitiza HTML user-generated
- Usa HTTPS siempre en producción

---

## 🐛 Debugging

### Frontend

```bash
# Ver logs de Docker
docker logs itakai-app -f

# Limpiar caché de Nuxt
docker exec itakai-app rm -rf /app/.nuxt
```

### Tests

```bash
# Modo UI (interactivo)
pnpm test:e2e:ui

# Modo debug (paso a paso)
pnpm test:e2e:debug

# Ver reporte HTML
pnpm test:e2e:report
```

---

## 💬 Necesitas Ayuda?

- 💬 [Discord](https://discord.gg/itakai) - Chat en tiempo real
- 🐛 [Issues](https://github.com/itakai-es/platform/issues) - Problemas técnicos
- 💡 [Discussions](https://github.com/itakai-es/platform/discussions) - Preguntas generales
- 📧 Email: [dev@itakai.es](mailto:dev@itakai.es)

---

## 🙏 Gracias

Cada contribución, sin importar su tamaño, es valiosa. ¡Gracias por hacer de ITAKAI un mejor proyecto!

---

**Happy coding! 🚀**
