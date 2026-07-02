# 🚀 Guía de Deployment - ITAKAI Frontend

## Requisitos Previos

### En el Servidor VPS

1. **Docker y Docker Compose instalados**
   ```bash
   # Verificar instalación
   docker --version
   docker-compose --version
   ```

2. **DNS configurado** (opcional)
   - Registro A: `itakai.es` → IP del servidor
   - Registro A: `www.itakai.es` → IP del servidor

   Si no tienes dominio, puedes acceder por IP del servidor.

3. **Puerto 80 abierto en firewall**
   ```bash
   # Permitir HTTP
   sudo ufw allow 80/tcp
   sudo ufw status
   ```

4. **Git instalado** (para clonar el repositorio)
   ```bash
   git --version
   ```

---

## 📦 Deployment en 3 Pasos

### Paso 1: Clonar el Repositorio

```bash
# En el servidor VPS
cd /home
git clone <URL_DEL_REPOSITORIO> itakai-frontend
cd itakai-frontend/itakai-frontend
```

### Paso 2: Build y Deploy

```bash
# Build de la imagen de producción (incluye build de Nuxt + Nginx)
docker-compose -f docker-compose.prod.yml build

# Iniciar servicio en background
docker-compose -f docker-compose.prod.yml up -d
```

El build incluye:
- ✅ Instalación de dependencias con pnpm
- ✅ Ejecución de `pnpm generate` (genera SPA estática)
- ✅ Copia de archivos a imagen Nginx
- ✅ Configuración de Nginx para SPA routing

### Paso 3: Verificar Deployment

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Ver estado de contenedores
docker-compose -f docker-compose.prod.yml ps
```

Abrir en navegador:
- ✅ http://itakai.es (si tienes dominio configurado)
- ✅ http://www.itakai.es (redirige a itakai.es sin www)
- ✅ http://IP_DEL_SERVIDOR (si accedes por IP)

---

## 🔄 Actualizaciones

### Actualizar el Código

```bash
# En el servidor
cd /home/itakai-frontend/itakai-frontend

# Actualizar código
git pull origin main

# Rebuild y reiniciar
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

### Actualizar Solo Nginx (sin rebuild de Nuxt)

Si solo cambias configuración de Nginx:

```bash
# Editar configuración
nano nginx/default.conf

# Rebuild y reiniciar
docker-compose -f docker-compose.prod.yml build nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Iniciar servicios
docker-compose -f docker-compose.prod.yml up -d

# Parar servicios
docker-compose -f docker-compose.prod.yml down

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Ver logs en tiempo real
docker-compose -f docker-compose.prod.yml logs -f nginx

# Ver estado de contenedores
docker-compose -f docker-compose.prod.yml ps

# Reconstruir sin cache
docker-compose -f docker-compose.prod.yml build --no-cache
```

### Debugging

```bash
# Entrar al contenedor de nginx
docker exec -it itakai-nginx sh

# Ver configuración de nginx activa
docker exec itakai-nginx nginx -T

# Probar configuración de nginx (sin reiniciar)
docker exec itakai-nginx nginx -t

# Ver archivos estáticos servidos
docker exec itakai-nginx ls -la /usr/share/nginx/html

# Ver logs de nginx dentro del contenedor
docker exec itakai-nginx tail -f /var/log/nginx/access.log
docker exec itakai-nginx tail -f /var/log/nginx/error.log
```

---

## 📊 Monitoreo

### Logs

Los logs se guardan en:
```
logs/
└── nginx/
    ├── access.log  # Requests HTTP
    └── error.log   # Errores de nginx
```

Ver logs:
```bash
# Access logs (desde host)
tail -f logs/nginx/access.log

# Error logs (desde host)
tail -f logs/nginx/error.log

# Logs de Docker Compose
docker-compose -f docker-compose.prod.yml logs -f
```

### Health Check

Nginx incluye health check automático:
- ✅ Se ejecuta cada 30 segundos
- ✅ Reinicia automáticamente si falla 3 veces consecutivas

Verificar salud manualmente:
```bash
curl http://localhost/
# Debe retornar 200 OK con el HTML de la aplicación
```

---

## 🔒 Seguridad

### Headers de Seguridad Configurados

```nginx
X-Frame-Options: SAMEORIGIN           # Previene clickjacking
X-Content-Type-Options: nosniff       # Previene MIME sniffing
X-XSS-Protection: 1; mode=block       # Protección XSS
```

### Firewall

Solo puerto necesario abierto:
- ✅ 80 (HTTP)

```bash
# Verificar puertos abiertos
sudo netstat -tlnp | grep :80

# O con ss
ss -tlnp | grep :80
```

---

## 🐛 Troubleshooting

### Problema: "502 Bad Gateway"

**Causa:** Nginx no puede acceder a los archivos estáticos

**Solución:**
```bash
# Verificar que los archivos existen
docker exec itakai-nginx ls -la /usr/share/nginx/html

# Si no hay archivos, rebuild
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d --force-recreate
```

### Problema: "Page not found" en rutas de la SPA

**Causa:** Configuración de `try_files` incorrecta

**Solución:**
```bash
# Verificar que esta línea existe en nginx/default.conf
# location / {
#     try_files $uri $uri/ /index.html;
# }

# Probar configuración
docker exec itakai-nginx nginx -t

# Reiniciar nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Problema: Build falla con "pnpm-lock.yaml outdated"

**Causa:** El lockfile no está sincronizado con package.json

**Solución:**
```bash
# Regenerar lockfile
pnpm install

# Commit cambios
git add pnpm-lock.yaml
git commit -m "Update pnpm lockfile"
git push

# En servidor: pull y rebuild
git pull
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

### Problema: Contenedor se reinicia constantemente

**Causa:** Health check falla o error en el build

**Solución:**
```bash
# Ver logs completos
docker-compose -f docker-compose.prod.yml logs nginx

# Ver últimos logs
docker logs itakai-nginx --tail 100

# Verificar health check
docker inspect itakai-nginx | grep -A 10 Health
```

---

## 🔧 Configuración Avanzada

### Agregar Dominio Adicional

Editar `nginx/default.conf`:
```nginx
server_name itakai.es www.itakai.es nuevo-dominio.com;
```

Reiniciar:
```bash
docker-compose -f docker-compose.prod.yml restart nginx
```

### Configurar Backend API

Descomentar en `nginx/default.conf`:
```nginx
location /api/ {
    proxy_pass http://backend:3001/;
    # ... resto de configuración
}
```

Agregar servicio backend en `docker-compose.prod.yml`:
```yaml
services:
  backend:
    image: tu-backend-image
    container_name: itakai-backend
    networks:
      - itakai-network

  nginx:
    depends_on:
      - backend
```

### Cambiar Puerto

Si el puerto 80 está ocupado, editar `docker-compose.prod.yml`:
```yaml
ports:
  - "8080:80"  # Servidor escucha en 8080, Nginx interno en 80
```

---

## 📁 Estructura de Archivos

```
itakai-frontend/
├── Dockerfile.prod           # Build multi-stage (Nuxt + Nginx)
├── docker-compose.prod.yml   # Orquestación de contenedores
├── nginx/
│   ├── nginx.conf           # Configuración global de nginx
│   └── default.conf         # Virtual host para itakai.es
└── logs/
    └── nginx/               # Logs de nginx (generados)
        ├── access.log
        └── error.log
```

---

## 🚀 Flujo de Build Completo

### Multi-Stage Dockerfile

El `Dockerfile.prod` tiene 2 etapas:

**Stage 1 - Builder (node:20-alpine):**
1. Instala pnpm
2. Copia package.json y pnpm-lock.yaml
3. Ejecuta `pnpm install --frozen-lockfile`
4. Copia código fuente
5. Ejecuta `pnpm generate` → genera `.output/public/`

**Stage 2 - Production (nginx:alpine):**
1. Copia archivos desde builder: `.output/public/` → `/usr/share/nginx/html/`
2. Copia configuración de nginx
3. Expone puerto 80
4. Inicia nginx

**Resultado:** Imagen final solo contiene:
- ✅ Nginx (~40MB)
- ✅ Archivos estáticos del build (~5-10MB)
- ❌ NO contiene node_modules
- ❌ NO contiene código fuente

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisar logs:** `docker-compose -f docker-compose.prod.yml logs -f`
2. **Verificar DNS:** `dig itakai.es` (si usas dominio)
3. **Verificar configuración:** `docker exec itakai-nginx nginx -t`
4. **Verificar archivos:** `docker exec itakai-nginx ls /usr/share/nginx/html`

---

**Última actualización:** 2026-01-12
**Versión:** 2.0.0 (sin SSL)
