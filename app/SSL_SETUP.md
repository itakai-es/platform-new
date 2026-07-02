# Configuración SSL para ITAKAI (itakai.es + *.itakai.es)

Guía completa para configurar certificados SSL wildcard con Let's Encrypt usando validación DNS.

## Requisitos Previos

- Acceso root/sudo al servidor
- Dominio `itakai.es` configurado con DNS
- Acceso al panel de gestión DNS de tu proveedor
- Docker instalado y funcionando

## Paso 1: Instalar Certbot

```bash
sudo apt update
sudo apt install -y certbot
```

## Paso 2: Generar Certificados con Validación DNS

Para obtener un certificado wildcard (`*.itakai.es`), debes usar validación DNS-01:

```bash
sudo certbot certonly \
  --manual \
  --preferred-challenges dns \
  -d itakai.es \
  -d '*.itakai.es'
```

### Proceso Interactivo

Certbot te pedirá que agregues un registro DNS TXT. Sigue estos pasos:

1. **Certbot mostrará algo como esto:**
   ```
   Please deploy a DNS TXT record under the name:
   _acme-challenge.itakai.es

   with the following value:
   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

   Before continuing, verify the TXT record has been deployed...
   ```

2. **Ve a tu proveedor DNS** y crea un registro TXT:
   - **Tipo:** `TXT`
   - **Nombre/Host:** `_acme-challenge`
   - **Valor:** (copia el valor que te mostró Certbot)
   - **TTL:** 300 segundos (o el mínimo disponible)

3. **Verifica la propagación DNS** (espera 1-5 minutos):
   ```bash
   dig _acme-challenge.itakai.es TXT +short
   # o
   nslookup -type=TXT _acme-challenge.itakai.es
   ```

   Deberías ver el valor del registro TXT que agregaste.

4. **Presiona Enter en Certbot** para continuar la verificación.

5. **Certbot puede pedir un segundo registro TXT** para el wildcard. Repite el mismo proceso.

### Ubicación de Certificados

Una vez completado, los certificados estarán en:

```
/etc/letsencrypt/live/itakai.es/fullchain.pem  - Certificado completo
/etc/letsencrypt/live/itakai.es/privkey.pem    - Clave privada
/etc/letsencrypt/live/itakai.es/chain.pem      - Cadena de certificados
/etc/letsencrypt/live/itakai.es/cert.pem       - Certificado solo
```

## Paso 3: Verificar Configuración de Nginx

La configuración de nginx ya está lista en `nginx/default.conf`. Verifica que esté correcta:

```bash
cat nginx/default.conf | grep ssl_certificate
```

Deberías ver:
```
ssl_certificate /etc/letsencrypt/live/itakai.es/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/itakai.es/privkey.pem;
```

## Paso 4: Desplegar con Docker Compose

El archivo `docker-compose.prod.yml` ya está configurado para montar los certificados:

```bash
# Detener contenedores actuales (si existen)
docker-compose -f docker-compose.prod.yml down

# Construir imagen de producción
docker-compose -f docker-compose.prod.yml build

# Iniciar en producción
docker-compose -f docker-compose.prod.yml up -d
```

## Paso 5: Verificar SSL

Verifica que el sitio esté funcionando correctamente con HTTPS:

```bash
# Verificar que nginx esté escuchando en 443
docker exec itakai-nginx netstat -tulpn | grep :443

# Probar HTTPS localmente
curl -I https://itakai.es

# Verificar certificado SSL
openssl s_client -connect itakai.es:443 -servername itakai.es < /dev/null
```

También puedes verificar en tu navegador o usar herramientas online:
- https://www.ssllabs.com/ssltest/analyze.html?d=itakai.es

## Renovación Automática de Certificados

Los certificados de Let's Encrypt expiran cada 90 días. Configura renovación automática:

### Opción 1: Cron Job (Recomendado)

```bash
# Editar crontab
sudo crontab -e

# Agregar esta línea (renovar cada día a las 3:00 AM)
0 3 * * * /ruta/al/proyecto/scripts/renew-ssl.sh >> /var/log/letsencrypt-renew.log 2>&1
```

### Opción 2: Systemd Timer

```bash
# Crear servicio
sudo nano /etc/systemd/system/certbot-renew.service

# Contenido del servicio:
[Unit]
Description=Renovar certificados SSL de Let's Encrypt
After=network.target

[Service]
Type=oneshot
ExecStart=/ruta/al/proyecto/scripts/renew-ssl.sh

# Crear timer
sudo nano /etc/systemd/system/certbot-renew.timer

# Contenido del timer:
[Unit]
Description=Timer para renovación de certificados SSL

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target

# Activar timer
sudo systemctl enable certbot-renew.timer
sudo systemctl start certbot-renew.timer
```

### Opción 3: Renovación Manual

Ejecuta el script manualmente cuando sea necesario:

```bash
./scripts/renew-ssl.sh
```

O directamente con certbot:

```bash
sudo certbot renew
docker restart itakai-nginx
```

## Solución de Problemas

### Error: "Connection refused" en puerto 443

```bash
# Verificar que el puerto 443 esté abierto en el firewall
sudo ufw status
sudo ufw allow 443/tcp

# Verificar que Docker esté escuchando en 443
docker ps | grep itakai-nginx
```

### Error: "Certificate not found"

```bash
# Verificar que los certificados existen
sudo ls -la /etc/letsencrypt/live/itakai.es/

# Verificar permisos
sudo chmod -R 755 /etc/letsencrypt/live/
sudo chmod -R 755 /etc/letsencrypt/archive/
```

### Error: "Validation failed" durante certbot

- Verifica que el registro DNS TXT esté correctamente configurado
- Espera unos minutos para que el DNS se propague
- Usa `dig` o `nslookup` para confirmar

### Renovación falla con "Cannot find a cert"

```bash
# Listar certificados existentes
sudo certbot certificates

# Forzar renovación específica
sudo certbot renew --cert-name itakai.es --force-renewal
```

## Comandos Útiles

```bash
# Ver logs de nginx
docker logs itakai-nginx -f

# Verificar configuración de nginx
docker exec itakai-nginx nginx -t

# Recargar configuración de nginx sin reiniciar
docker exec itakai-nginx nginx -s reload

# Ver certificados instalados
sudo certbot certificates

# Revocar certificado (si es necesario)
sudo certbot revoke --cert-path /etc/letsencrypt/live/itakai.es/cert.pem

# Eliminar certificado
sudo certbot delete --cert-name itakai.es
```

## Proveedores DNS Populares

### Cloudflare
- Panel: https://dash.cloudflare.com/
- Sección: DNS → Records → Add Record
- Tipo: TXT
- Name: `_acme-challenge`
- Content: (valor de Certbot)
- TTL: Auto

### GoDaddy
- Panel: https://dcc.godaddy.com/
- Sección: DNS → Manage Zones
- Add → TXT Record
- Host: `_acme-challenge`
- TXT Value: (valor de Certbot)
- TTL: 600 segundos

### DigitalOcean
- Panel: https://cloud.digitalocean.com/networking/domains
- Add Record → TXT
- Hostname: `_acme-challenge`
- Value: (valor de Certbot)
- TTL: 300 segundos

### Otros proveedores
- La mayoría tienen una sección de DNS Records donde puedes agregar registros TXT
- Busca "DNS management" o "DNS records" en tu panel de control

## Seguridad Adicional

### Configuración de Firewall (UFW)

```bash
# Permitir HTTP y HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verificar reglas
sudo ufw status
```

### Configuración de Fail2Ban (Opcional)

Protege contra ataques de fuerza bruta:

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Referencias

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Certbot Documentation](https://certbot.eff.org/docs/)
- [Nginx SSL Configuration](https://nginx.org/en/docs/http/configuring_https_servers.html)
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)

## Notas Importantes

- Los certificados wildcard **requieren validación DNS-01** (no HTTP-01)
- Los certificados expiran cada **90 días**
- Configura renovación automática **antes de que expiren**
- El registro TXT se puede eliminar después de obtener el certificado
- Para renovaciones futuras, necesitarás agregar el registro TXT nuevamente

---

**Última actualización:** 2025-11-13
**Versión:** 1.0.0
**Mantenedor:** ITAKAI DevOps Team
