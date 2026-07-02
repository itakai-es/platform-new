# ITAKAI Frontend

Plataforma educativa gamificada con IA inspirada en la mitología griega.

## 🚀 Stack Tecnológico

- **Nuxt 3** - Framework Vue.js con TypeScript
- **Tailwind CSS** - Framework CSS utility-first con tema personalizado
- **Pinia** - Estado global
- **VeeValidate + Zod** - Validación de formularios
- **MSW** - Mock Service Worker para API mocking
- **@heroicons/vue** - Sistema de iconos
- **date-fns** - Manipulación de fechas

## 📁 Estructura del Proyecto

```
/
├── components/      # Componentes Vue (Atomic Design)
│   ├── atoms/      # Componentes básicos
│   ├── molecules/  # Combinación de átomos
│   ├── organisms/  # Secciones complejas
│   └── templates/  # Estructuras de página
├── pages/          # Rutas automáticas de Nuxt
├── layouts/        # Layouts por rol (teacher, student, parent, admin)
├── composables/    # Lógica reutilizable
├── stores/         # Estado global (Pinia)
├── types/          # Interfaces TypeScript
├── utils/          # Utilidades y helpers
├── middleware/     # Guards de navegación
├── mocks/          # API mockeada (MSW)
└── assets/         # CSS y recursos estáticos
```

## 🛠️ Instalación

```bash
pnpm install
```

## 💻 Desarrollo

Iniciar servidor de desarrollo en `http://localhost:3000`:

```bash
pnpm dev
```

## 📝 Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Build para producción
pnpm generate     # Generar sitio estático
pnpm preview      # Preview del build
pnpm typecheck    # Verificación de tipos TypeScript
pnpm lint         # Linting con ESLint
pnpm lint:fix     # Fix automático de linting
```

## 🎨 Diseño

El diseño sigue el sistema de colores ITAKAI con paleta personalizada:
- **Navy Deep** (#0A0E27) - Fondo principal
- **Gold** (#FFD166) - Rol profesor
- **Mint** (#6FEDB7) - Rol estudiante
- **Lila** (#C4B5FD) - Rol padre/madre

## 🧪 Testing

El proyecto usa MSW (Mock Service Worker) para mockear las APIs durante el desarrollo.
Los handlers se encuentran en `/mocks/handlers/`.

## 📚 Documentación

Para más información sobre el proyecto, consulta la carpeta `/planning/` en el directorio raíz.
