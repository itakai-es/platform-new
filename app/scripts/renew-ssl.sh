#!/bin/bash

# ============================================
# Script de Renovación SSL - ITAKAI
# Renueva certificados de Let's Encrypt y reinicia nginx
# ============================================

echo "🔐 Renovando certificados SSL de Let's Encrypt..."

# Renovar certificados (certbot verifica si es necesario renovar)
sudo certbot renew --quiet

# Verificar si hubo cambios en los certificados
if [ $? -eq 0 ]; then
    echo "✅ Renovación completada exitosamente"

    # Reiniciar contenedor nginx para aplicar los nuevos certificados
    echo "🔄 Reiniciando nginx..."
    docker restart itakai-nginx

    if [ $? -eq 0 ]; then
        echo "✅ Nginx reiniciado correctamente"
    else
        echo "❌ Error al reiniciar nginx"
        exit 1
    fi
else
    echo "❌ Error al renovar certificados"
    exit 1
fi

echo "🎉 Proceso completado"
