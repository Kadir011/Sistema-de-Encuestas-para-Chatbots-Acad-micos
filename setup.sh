#!/bin/bash

echo "======================================"
echo "  Chatbots Education Survey Setup"
echo "======================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

print_success "Node.js encontrado: $(node --version)"

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado."
    exit 1
fi

print_success "npm encontrado: $(npm --version)"

# Verificar si PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL no está instalado. Por favor instala PostgreSQL 14+ primero."
    exit 1
fi

print_success "PostgreSQL encontrado"

echo ""
print_info "Iniciando instalación del proyecto..."
echo ""

# ============================
# BACKEND SETUP
# ============================
echo "📦 Instalando dependencias del Backend..."
cd backend

if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json en backend/"
    exit 1
fi

npm install
if [ $? -eq 0 ]; then
    print_success "Dependencias del backend instaladas"
else
    print_error "Error al instalar dependencias del backend"
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    print_info "Creando archivo .env..."
    cp .env.example .env
    print_success "Archivo .env creado. Por favor configura tus credenciales."
fi

cd ..

# ============================
# FRONTEND SETUP
# ============================
echo ""
echo "📦 Instalando dependencias del Frontend..."
cd frontend

if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json en frontend/"
    exit 1
fi

npm install
if [ $? -eq 0 ]; then
    print_success "Dependencias del frontend instaladas"
else
    print_error "Error al instalar dependencias del frontend"
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    print_info "Creando archivo .env..."
    cp .env.example .env
    print_success "Archivo .env creado"
fi

cd ..

# ============================
# DATABASE SETUP
# ============================
echo ""
echo "🗄️  Configurando Base de Datos..."
print_info "Asegúrate de tener PostgreSQL corriendo"

# Solicitar credenciales de base de datos
read -p "Ingresa el nombre de usuario de PostgreSQL (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -p "Ingresa el nombre de la base de datos (default: chatbots_system): " DB_NAME
DB_NAME=${DB_NAME:-chatbots_system}

print_info "Creando base de datos $DB_NAME..."
createdb -U $DB_USER $DB_NAME 2>/dev/null

if [ -f "backend/database/init.sql" ]; then
    print_info "Ejecutando script de inicialización..."
    psql -U $DB_USER -d $DB_NAME -f backend/database/init.sql
    if [ $? -eq 0 ]; then
        print_success "Base de datos inicializada"
    else
        print_error "Error al inicializar la base de datos"
    fi
else
    print_error "No se encontró backend/database/init.sql"
fi

# ============================
# GENERAR HASH DE CONTRASEÑAS
# ============================
echo ""
print_info "Generando hashes de contraseñas para usuarios de prueba..."

# Crear script temporal de Node.js para generar hashes
cat > backend/generate-hash.js << 'EOF'
import bcrypt from 'bcrypt';

const password = '123456';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then(hash => {
    console.log('Hash para contraseña "123456":');
    console.log(hash);
    
    // Actualizar base de datos
    const updateSQL = `
-- Actualizar contraseñas de usuarios de prueba
UPDATE users SET password = '${hash}' WHERE username IN ('admin', 'profesor1', 'estudiante1', 'estudiante2');
    `;
    
    console.log('\nEjecuta este SQL para actualizar las contraseñas:');
    console.log(updateSQL);
});
EOF

cd backend
node generate-hash.js
rm generate-hash.js
cd ..

# ============================
# FINALIZACIÓN
# ============================
echo ""
echo "======================================"
print_success "¡Instalación completada!"
echo "======================================"
echo ""
print_info "Próximos pasos:"
echo ""
echo "1. Configura las variables de entorno en backend/.env"
echo "2. Actualiza las contraseñas en la base de datos usando el SQL generado arriba"
echo ""
echo "Para iniciar el proyecto:"
echo ""
echo "  Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "  Terminal 2 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Credenciales de prueba:"
echo "  Admin: admin@test.com / 123456"
echo "  Profesor: profesor1@test.com / 123456"
echo "  Estudiante: estudiante1@test.com / 123456"
echo ""
print_success "¡Disfruta del sistema de encuestas!"
echo ""