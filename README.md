<div align="center">
  <a href="https://itakai.es">
    <img src="./assets/banner.png" alt="ITAKAI Banner" width="100%">
  </a>

  <h1>🏛️ ITAKAI</h1>
  <p><strong>Plataforma Educativa Gamificada de Código Abierto</strong></p>
  <p>Transforma el aprendizaje en una aventura épica inspirada en la mitología griega</p>

  <p>
    <a href="https://itakai.es"><strong>Website</strong></a> ·
    <a href="https://demo.itakai.es"><strong>Demo en Vivo</strong></a> ·
    <a href="./docs"><strong>Documentación</strong></a> ·
    <a href="https://github.com/itakai-es/platform-new/issues"><strong>Reportar Bug</strong></a> ·
    <a href="https://github.com/itakai-es/platform-new/discussions"><strong>Comunidad</strong></a>
  </p>

  <p>
    <a href="https://github.com/itakai-es/platform-new/stargazers">
      <img src="https://img.shields.io/github/stars/itakai-es/platform-new?style=for-the-badge&logo=starship&color=FFD166&logoColor=white" alt="GitHub stars">
    </a>
    <a href="https://github.com/itakai-es/platform-new/network/members">
      <img src="https://img.shields.io/github/forks/itakai-es/platform-new?style=for-the-badge&logo=git&color=6FEDB7&logoColor=white" alt="GitHub forks">
    </a>
    <a href="https://github.com/itakai-es/platform-new/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/itakai-es/platform-new?style=for-the-badge&logo=opensourceinitiative&color=1A1F3A&logoColor=white" alt="License">
    </a>
    <a href="https://github.com/itakai-es/platform-new/releases">
      <img src="https://img.shields.io/github/v/release/itakai-es/platform-new?style=for-the-badge&logo=github&color=0A0E27&logoColor=white" alt="GitHub release">
    </a>
  </p>

  <p>
    <a href="https://discord.gg/itakai">
      <img src="https://img.shields.io/discord/YOUR_DISCORD_ID?style=for-the-badge&logo=discord&logoColor=white&label=Discord&color=5865F2" alt="Discord">
    </a>
    <a href="https://twitter.com/itakai_es">
      <img src="https://img.shields.io/twitter/follow/itakai_es?style=for-the-badge&logo=x&logoColor=white&color=000000" alt="Twitter">
    </a>
  </p>
</div>

---

## 📸 Vista Previa

<div align="center">
  <img src="./assets/screenshots/dashboard.png" alt="Panel del profesor con clases, chat IA y actividad" width="45%">
  <img src="./assets/screenshots/missions.png" alt="Misiones con narrativas mitológicas y rarezas" width="45%">
  <img src="./assets/screenshots/shop.png" alt="Tienda de poderes y recompensas con monedas" width="45%">
  <img src="./assets/screenshots/ranking.png" alt="Ranking de la clase y estadísticas gamificadas" width="45%">
</div>

---

## ✨ Características Principales

<table>
  <tr>
    <td width="50%">

### 🎮 Gamificación Completa
- **Sistema de XP y niveles** con progresión equilibrada
- **Títulos mitológicos** desde Mortal hasta Dios del Olimpo
- **Logros y medallas** desbloqueables
- **Clasificaciones** en tiempo real
- **Racha de aprendizaje** para motivación diaria

    </td>
    <td width="50%">

### 🎯 Misiones Educativas
- **Misiones temáticas** organizadas por rareza
- **Enigmas interactivos** con recompensas XP
- **Progreso visual** con barras y estadísticas
- **Feedback inmediato** para estudiantes
- **Sistema de hints** progresivo

    </td>
  </tr>
  <tr>
    <td width="50%">

### 👥 Gestión de Roles
- **Estudiantes** - Completan misiones y ganan XP
- **Profesores** - Crean contenido y gestionan clases
- **Admins** - Configuración y analytics del sistema
- **Permisos granulares** por rol
- **Onboarding guiado** para cada perfil

    </td>
    <td width="50%">

### 📊 Analytics Avanzados
- **Dashboard de progreso** personalizado
- **Estadísticas detalladas** por estudiante/clase
- **Gráficos interactivos** de rendimiento
- **Exportación de datos** CSV/PDF
- **Métricas en tiempo real**

    </td>
  </tr>
  <tr>
    <td width="50%">

### 🎨 Diseño Inmersivo
- **Tema mitología griega** consistente
- **Interfaz moderna** con Tailwind CSS
- **Animaciones fluidas** y micro-interacciones
- **Responsive design** para todos los dispositivos
- **Dark mode** nativo

    </td>
    <td width="50%">

### 🔐 Seguridad Robusta
- **Autenticación JWT** con refresh tokens
- **OAuth 2.0** (Google, GitHub)
- **Encriptación** de datos sensibles
- **Rate limiting** y protección DDoS
- **RBAC** (Role-Based Access Control)

    </td>
  </tr>
</table>

---

## 🚀 Instalación Rápida

### Opción 1: Docker (Recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/itakai-es/platform-new.git
cd platform

# Configurar variables de entorno
cp .env.example .env

# Levantar con Docker Compose
docker-compose up -d

# Acceder en http://localhost:4000
```

### Opción 2: Instalación Manual

```bash
# Requisitos: Node.js 18+, pnpm

# Instalar dependencias
pnpm install

# Configurar entorno
cp .env.example .env

# Modo desarrollo
pnpm dev

# Build para producción
pnpm build
pnpm preview
```

### Opción 3: Deploy en la Nube

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/itakai-es/platform-new)
[![Deploy on Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/itakai-es/platform-new)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/itakai)

---

## 🎯 ¿Por Qué ITAKAI?

<table>
  <tr>
    <th>Característica</th>
    <th>ITAKAI</th>
    <th>Moodle</th>
    <th>Google Classroom</th>
    <th>Kahoot</th>
  </tr>
  <tr>
    <td><strong>Gamificación completa</strong></td>
    <td>✅</td>
    <td>🟡 Plugins</td>
    <td>❌</td>
    <td>🟡 Limitada</td>
  </tr>
  <tr>
    <td><strong>100% Open Source</strong></td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
    <td>❌</td>
  </tr>
  <tr>
    <td><strong>Self-hosted</strong></td>
    <td>✅</td>
    <td>✅</td>
    <td>❌</td>
    <td>❌</td>
  </tr>
  <tr>
    <td><strong>Interfaz moderna</strong></td>
    <td>✅</td>
    <td>❌</td>
    <td>🟡</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><strong>Sistema de niveles</strong></td>
    <td>✅</td>
    <td>❌</td>
    <td>❌</td>
    <td>❌</td>
  </tr>
  <tr>
    <td><strong>Clasificaciones</strong></td>
    <td>✅</td>
    <td>🟡 Plugins</td>
    <td>❌</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><strong>Sin límites de usuarios</strong></td>
    <td>✅</td>
    <td>✅</td>
    <td>🟡 Límites</td>
    <td>🟡 Planes</td>
  </tr>
  <tr>
    <td><strong>API REST completa</strong></td>
    <td>✅</td>
    <td>✅</td>
    <td>🟡 Limitada</td>
    <td>❌</td>
  </tr>
</table>

---

## 🛠️ Stack Tecnológico

<div align="center">

### Frontend
[![Nuxt](https://img.shields.io/badge/Nuxt_4-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Pinia](https://img.shields.io/badge/Pinia-FFD166?style=for-the-badge&logo=vue.js&logoColor=black)](https://pinia.vuejs.org/)

### Backend (Opcional - para features avanzadas)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

### Testing & Quality
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)](https://prettier.io/)

### DevOps
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)

</div>

---

## 📚 Documentación

| Sección | Descripción |
|---------|-------------|
| 📖 [Guía de Usuario](./docs/USER_GUIDE.md) | Tutorial completo para estudiantes y profesores |
| 🏗️ [Instalación](./docs/INSTALLATION.md) | Guía detallada de instalación y configuración |
| 🔌 [API Reference](./docs/API.md) | Documentación completa de la API REST |
| 🎨 [Sistema de Diseño](./docs/DESIGN_SYSTEM.md) | Colores, componentes y guías de estilo |
| 🤝 [Guía de Contribución](./CONTRIBUTING.md) | Cómo contribuir al proyecto |
| 🔒 [Seguridad](./SECURITY.md) | Política de seguridad y reporte de vulnerabilidades |

---

## 🗺️ Roadmap

### ✅ Versión 1.0 (Actual)
- [x] Sistema de autenticación completo
- [x] Gamificación (XP, niveles, títulos)
- [x] Misiones y enigmas
- [x] Clasificaciones y estadísticas
- [x] Dashboard para estudiantes y profesores
- [x] Sistema de logros
- [x] Responsive design

### 🚧 Versión 1.1 (En Desarrollo)
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre estudiantes y profesores
- [ ] Asistente IA para ayuda educativa
- [ ] Modo colaborativo para misiones
- [ ] Exportación avanzada de reportes

### 🔮 Versión 2.0 (Planificado)
- [ ] App móvil nativa (iOS/Android)
- [ ] Integración con LMS externos (Moodle, Canvas)
- [ ] Marketplace de misiones comunitarias
- [ ] Sistema de creación de contenido visual
- [ ] Multi-tenancy para instituciones
- [ ] Analytics con IA predictiva

[Ver roadmap completo →](https://github.com/itakai-es/platform-new/projects)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! ITAKAI es un proyecto impulsado por la comunidad.

### Formas de Contribuir

- 🐛 **Reportar bugs** - [Crear issue](https://github.com/itakai-es/platform-new/issues/new?template=bug_report.md)
- 💡 **Sugerir features** - [Crear feature request](https://github.com/itakai-es/platform-new/issues/new?template=feature_request.md)
- 📝 **Mejorar documentación** - Hacer un PR con mejoras
- 🌍 **Traducir** - Ayudar con i18n a otros idiomas
- 💻 **Código** - Revisar [issues abiertos](https://github.com/itakai-es/platform-new/issues)

### Guía Rápida

```bash
# 1. Fork el proyecto
# 2. Crear rama para tu feature
git checkout -b feature/amazing-feature

# 3. Hacer cambios y commit
git commit -m 'feat: add amazing feature'

# 4. Push a tu fork
git push origin feature/amazing-feature

# 5. Abrir Pull Request
```

Lee nuestra [Guía de Contribución](./CONTRIBUTING.md) para más detalles.

---

## 👥 Comunidad

<div align="center">

[![Discord](https://img.shields.io/badge/Discord-Únete_al_servidor-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/itakai)
[![Twitter](https://img.shields.io/badge/Twitter-Síguenos-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/itakai_es)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conéctate-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/company/itakai)

</div>

- 💬 **Discord** - Chat en tiempo real con la comunidad
- 🐦 **Twitter** - Noticias y actualizaciones
- 📧 **Email** - [hola@itakai.es](mailto:hola@itakai.es)
- 🌐 **Blog** - [blog.itakai.es](https://blog.itakai.es)

---

## 🌟 Casos de Uso

### 🏫 Centros Educativos
> "ITAKAI aumentó la participación de nuestros estudiantes en un 85%. La gamificación hace que el aprendizaje sea divertido y medible."
>
> — **IES Innovación**, Madrid

### 👨‍🏫 Profesores Independientes
> "Crear misiones temáticas es súper intuitivo. Mis alumnos están más motivados que nunca."
>
> — **Laura Martínez**, Profesora de Matemáticas

### 🏢 Formación Corporativa
> "Usamos ITAKAI para onboarding de empleados. El sistema de niveles hace el proceso más atractivo."
>
> — **TechCorp**, Barcelona

---

## 📊 Estadísticas del Proyecto

<div align="center">

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/itakai-es/platform-new?style=for-the-badge&logo=git&logoColor=white)
![GitHub contributors](https://img.shields.io/github/contributors/itakai-es/platform-new?style=for-the-badge&logo=github&logoColor=white)
![GitHub issues](https://img.shields.io/github/issues/itakai-es/platform-new?style=for-the-badge&logo=github&logoColor=white)
![GitHub pull requests](https://img.shields.io/github/issues-pr/itakai-es/platform-new?style=for-the-badge&logo=github&logoColor=white)

</div>

---

## 📄 Licencia

ITAKAI está licenciado bajo la [Licencia MIT](./LICENSE).

Esto significa que puedes:
- ✅ Usar comercialmente
- ✅ Modificar el código
- ✅ Distribuir
- ✅ Uso privado

Con la condición de:
- 📋 Incluir el aviso de licencia y copyright

---

## 🙏 Agradecimientos

Agradecemos a todos los contribuidores que han hecho posible este proyecto:

<a href="https://github.com/itakai-es/platform-new/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=itakai-es/platform-new" />
</a>

### Tecnologías que usamos

- [Nuxt](https://nuxt.com/) - El increíble framework de Vue.js
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [Playwright](https://playwright.dev/) - Testing E2E confiable
- [Prisma](https://www.prisma.io/) - ORM moderno para TypeScript
- [Fastify](https://www.fastify.io/) - Framework web ultrarrápido

---

## 🔗 Enlaces Útiles

- 🌐 [Website Oficial](https://itakai.es)
- 📖 [Documentación](./docs)
- 🎮 [Demo en Vivo](https://demo.itakai.es)
- 📰 [Blog](https://blog.itakai.es)
- 🐛 [Reportar Issues](https://github.com/itakai-es/platform-new/issues)
- 💬 [Discusiones](https://github.com/itakai-es/platform-new/discussions)
- 📦 [Releases](https://github.com/itakai-es/platform-new/releases)

---

<div align="center">

### ⭐ Si te gusta ITAKAI, dale una estrella en GitHub

[![Star History Chart](https://api.star-history.com/svg?repos=itakai-es/platform-new&type=Date)](https://star-history.com/#itakai-es/platform-new&Date)

---

**Construido con ❤️ por el equipo de ITAKAI**

[Website](https://itakai.es) • [Demo](https://demo.itakai.es) • [Documentación](./docs) • [Discord](https://discord.gg/itakai)

</div>
