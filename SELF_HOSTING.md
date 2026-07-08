# Auto-hospedaje de ITAKAI

Guía para desplegar tu propia instancia de ITAKAI con Docker. Toda la
configuración de servicios (IA, generación de imágenes, almacenamiento, dominio
y parámetros generales) se hace **desde el panel de administración**, sin tocar
código: la instancia arranca con unos pocos secretos y el resto se conecta desde
la web.

## Requisitos

- Docker y Docker Compose.
- Un dominio apuntando al servidor (opcional pero recomendado).
- Credenciales de un proveedor de IA compatible con OpenAI (Spark propio, vLLM,
  LiteLLM, etc.) y/o de Google Gemini + OpenRouter. Se introducen **después**,
  desde el panel.

## 1. Arranque

```bash
# 1) Clona el repo y copia el fichero de variables de arranque
cp .env.selfhost.example .env.selfhost

# 2) Genera los secretos y edítalos en .env.selfhost
openssl rand -base64 48   # → JWT_ACCESS_SECRET
openssl rand -base64 48   # → JWT_REFRESH_SECRET
openssl rand -base64 32   # → SETTINGS_ENCRYPTION_KEY
#   define también POSTGRES_PASSWORD y CORS_ORIGIN (tu dominio)

# 3) Levanta el stack (postgres + api + build de la SPA + nginx)
docker compose -f docker-compose.selfhost.yml --env-file .env.selfhost up -d --build
```

La API aplica las migraciones automáticamente al arrancar. Cuando termine,
tendrás la web en `http://TU_SERVIDOR` (puerto `HTTP_PORT`, 80 por defecto).

> **HTTPS / sesiones**: el stack sirve HTTP en el puerto 80 y `.env.selfhost`
> viene con `COOKIE_SECURE=false` para que el login persista sobre HTTP. Para
> cualquier instancia accesible desde internet, **usa HTTPS** (reverse-proxy con
> TLS delante — Caddy, Traefik, Cloudflare — o tus certificados en
> `app/nginx/selfhost.conf`) y pon `COOKIE_SECURE=true`. Servir la autenticación
> por HTTP plano solo es aceptable en redes internas de confianza.

## 2. Crear el administrador (una sola vez)

Define `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env.selfhost` y ejecuta el bootstrap,
que crea el administrador (con **tu** contraseña) y las insignias del sistema:

```bash
docker compose -f docker-compose.selfhost.yml --env-file .env.selfhost exec api pnpm db:bootstrap
```

No crea usuarios de demostración ni contraseñas por defecto. Es idempotente: si el
admin ya existe, no toca su contraseña.

## 3. Configurar desde el panel

Entra como admin y ve a **Configuración** (menú lateral). Cada sección se guarda
por separado y tiene efecto inmediato:

- **Inteligencia artificial** — dos endpoints **compatibles con la API de OpenAI**
  (uno para texto y otro para imágenes); en cada uno pones la URL base, la API key
  y el modelo. Apunta a lo que quieras: OpenAI, tu propio Spark, vLLM, Groq,
  Together, OpenRouter, o Gemini vía su endpoint OpenAI.
- **Almacenamiento** — `Disco local` por defecto (volumen Docker). Para escalar,
  cambia a `S3 / Cloudflare R2` e introduce endpoint, bucket, claves y la URL
  pública del bucket.
- **Dominio** — la URL pública de la instancia (para los enlaces de los emails) y
  los orígenes CORS permitidos.
- **General** — nombre de la plataforma, email de contacto, idioma por defecto,
  registro abierto/cerrado y modo mantenimiento.

Las API keys y las claves de R2 se guardan **cifradas** (AES-256-GCM) con
`SETTINGS_ENCRYPTION_KEY` en la base de datos. En el panel se muestran tal cual
(visibles) para que puedas revisarlas; edítalas cuando quieras cambiarlas.

## Notas de operación

- **Backups**: haz copia del volumen `postgres_data` (base de datos) y, en modo
  local, de `api_uploads` (ficheros subidos).
- **Actualizar**: `git pull` y vuelve a lanzar el `up -d --build`; las
  migraciones se aplican solas al arrancar la API.
- **Prioridad de configuración**: los valores del panel (en base de datos) tienen
  prioridad sobre los del `.env`. El `.env` solo aporta los secretos de arranque
  y, opcionalmente, valores por defecto (ver `api/.env.example`).
- Si cambias `SETTINGS_ENCRYPTION_KEY`, los secretos ya guardados dejan de poder
  descifrarse y habrá que reintroducirlos desde el panel.
