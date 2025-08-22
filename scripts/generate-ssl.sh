#!/bin/bash

# Script para generar certificados SSL auto-firmados para desarrollo

echo "🔐 Generando certificados SSL para desarrollo..."

# Crear directorio ssl si no existe
mkdir -p ssl

# Generar certificado auto-firmado
openssl req -x509 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/C=ES/ST=Madrid/L=Madrid/O=Development/CN=localhost"

if [ $? -eq 0 ]; then
    echo "✅ Certificados SSL generados en ./ssl/"
    echo "📝 Archivos creados:"
    echo "   - ssl/cert.pem (certificado)"
    echo "   - ssl/key.pem (clave privada)"
    echo ""
    echo "🚀 Ahora puedes ejecutar:"
    echo "   npm run build && npm start"
    echo ""
    echo "⚠️  NOTA: Estos son certificados auto-firmados para desarrollo."
    echo "   Tu navegador mostrará una advertencia de seguridad - acepta para continuar."
else
    echo "❌ Error generando certificados SSL"
    exit 1
fi
