# 🔒 Política de Seguridad

## 📢 Reportar una Vulnerabilidad

La seguridad de ITAKAI es nuestra prioridad. Si descubres una vulnerabilidad de seguridad, por favor repórtala de manera responsable.

### ✅ Cómo Reportar

**NO** abras un issue público para vulnerabilidades de seguridad.

En su lugar:

1. **Email**: Envía un correo a [security@itakai.es](mailto:security@itakai.es)
2. **Incluye**:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir el problema
   - Posible impacto y severidad
   - Sugerencias de mitigación (si tienes)

### ⏱️ Tiempo de Respuesta

- **Confirmación inicial**: Dentro de 48 horas
- **Evaluación**: Dentro de 7 días
- **Fix y divulgación**: Según severidad (ver abajo)

## 🎯 Severidades

### 🔴 Crítica
- Exposición de datos sensibles de usuarios
- RCE (Remote Code Execution)
- Escalación de privilegios no autorizada
- **SLA**: Fix en 48-72 horas

### 🟠 Alta
- XSS persistente
- SQL Injection
- CSRF que afecta operaciones críticas
- **SLA**: Fix en 7 días

### 🟡 Media
- XSS reflejado
- Bypass de autenticación en features no críticas
- Information disclosure menor
- **SLA**: Fix en 30 días

### 🟢 Baja
- Issues de configuración
- Best practices no seguidas
- **SLA**: Fix en 90 días

## 🛡️ Prácticas de Seguridad

### Autenticación
- ✅ JWT con refresh tokens
- ✅ Hashing de passwords con bcrypt (salt 10)
- ✅ Rate limiting en endpoints de auth
- ✅ OAuth 2.0 (Google)

### Datos
- ✅ Validación con Zod en frontend y backend
- ✅ Sanitización de inputs user-generated
- ✅ Prepared statements (Prisma ORM)
- ✅ HTTPS obligatorio en producción

### Headers de Seguridad
```
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Dependencies
- ✅ Dependabot habilitado
- ✅ Auditorías semanales con `pnpm audit`
- ✅ Actualizaciones críticas en <48h

## 📋 Vulnerabilidades Conocidas

Ninguna en este momento.

Historial: [SECURITY_ADVISORIES.md](./SECURITY_ADVISORIES.md)

## 🏆 Hall of Fame

Agradecemos a los siguientes investigadores de seguridad:

<!-- Lista de personas que han reportado vulnerabilidades -->
- *Sé el primero en reportar una vulnerabilidad responsablemente*

## 📜 Divulgación Responsable

Seguimos los principios de divulgación coordinada:

1. **Reporte privado** del investigador
2. **Confirmación** del equipo ITAKAI
3. **Desarrollo del fix** en privado
4. **Testing** del fix
5. **Release** del patch
6. **Divulgación pública** después del release
7. **Crédito** al investigador (si lo desea)

## 🔐 Configuración Segura

### Variables de Entorno Sensibles

**NUNCA** commits estos archivos:
- `.env`
- `.env.local`
- `.env.production`
- Archivos con credenciales

### JWT Secrets

Genera secrets fuertes:
```bash
openssl rand -base64 32
```

Mínimo 32 caracteres para `JWT_SECRET` y `JWT_REFRESH_SECRET`.

### PostgreSQL

En producción:
- ✅ Usa contraseñas fuertes (16+ caracteres)
- ✅ Limita conexiones por IP
- ✅ Habilita SSL
- ✅ Backups encriptados

## 📞 Contacto

- **Email de seguridad**: [security@itakai.es](mailto:security@itakai.es)
- **PGP Key**: [https://itakai.es/pgp-key.txt](https://itakai.es/pgp-key.txt) (opcional)

---

**Última actualización**: 2025-03-25
