#!/bin/bash

# Script para testear la sincronización core → platform localmente
# Útil antes de hacer push a main

set -e

echo "🔄 Testing sync from core → platform (DRY RUN)"
echo "================================================"

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorios
CORE_DIR="/home/itakai"
PLATFORM_DIR="/tmp/itakai-platform-test"
APP_DIR="$CORE_DIR/app"

echo -e "${BLUE}📁 Core directory:${NC} $CORE_DIR"
echo -e "${BLUE}📁 Platform test directory:${NC} $PLATFORM_DIR"
echo ""

# Limpiar directorio de prueba si existe
if [ -d "$PLATFORM_DIR" ]; then
  echo -e "${YELLOW}🗑️  Cleaning previous test directory...${NC}"
  rm -rf "$PLATFORM_DIR"
fi

# Crear directorio de prueba
echo -e "${BLUE}📦 Creating test platform directory...${NC}"
mkdir -p "$PLATFORM_DIR"

# Copiar app/
echo -e "${BLUE}📋 Copying app/ directory...${NC}"
cp -r "$APP_DIR"/* "$PLATFORM_DIR/"

# Copiar docs (filtrado)
echo -e "${BLUE}📚 Copying public docs...${NC}"
mkdir -p "$PLATFORM_DIR/docs"
if [ -d "$CORE_DIR/docs/planning" ]; then
  cp -r "$CORE_DIR/docs/planning" "$PLATFORM_DIR/docs/"
fi

# Copiar archivos raíz
echo -e "${BLUE}📄 Copying root files...${NC}"
[ -f "$CORE_DIR/README.md" ] && cp "$CORE_DIR/README.md" "$PLATFORM_DIR/" || true
[ -f "$CORE_DIR/CONTRIBUTING.md" ] && cp "$CORE_DIR/CONTRIBUTING.md" "$PLATFORM_DIR/" || true
[ -f "$CORE_DIR/CODE_OF_CONDUCT.md" ] && cp "$CORE_DIR/CODE_OF_CONDUCT.md" "$PLATFORM_DIR/" || true
[ -f "$CORE_DIR/LICENSE" ] && cp "$CORE_DIR/LICENSE" "$PLATFORM_DIR/" || true

# Limpiar archivos sensibles
echo -e "${YELLOW}🧹 Cleaning sensitive files...${NC}"
cd "$PLATFORM_DIR"
rm -f .env .env.prod .env.local
rm -rf logs/ uploads/
rm -rf node_modules/ .nuxt/ .output/ dist/
rm -rf test-results/ playwright-report/
rm -f *.log

# Verificar .env.example existe
if [ ! -f .env.example ]; then
  echo "NUXT_PUBLIC_API_BASE=http://localhost:3001" > .env.example
fi

# Estadísticas
echo ""
echo -e "${GREEN}✅ Sync test completed!${NC}"
echo ""
echo "📊 Statistics:"
echo "  - Files copied: $(find "$PLATFORM_DIR" -type f | wc -l)"
echo "  - Directories: $(find "$PLATFORM_DIR" -type d | wc -l)"
echo "  - Total size: $(du -sh "$PLATFORM_DIR" | cut -f1)"
echo ""

echo -e "${BLUE}🔍 Files that would be pushed to platform:${NC}"
cd "$PLATFORM_DIR"
find . -type f -not -path '*/\.*' | sort | head -30
echo "  ... (showing first 30 files)"
echo ""

echo -e "${YELLOW}⚠️  Review the test directory:${NC}"
echo "  $PLATFORM_DIR"
echo ""
echo -e "${GREEN}🚀 If everything looks good, you can safely push to main${NC}"
echo ""
