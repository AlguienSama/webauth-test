# Script para generar certificados SSL auto-firmados para desarrollo en Windows

Write-Host "Generando certificados SSL para desarrollo..." -ForegroundColor Green

# Crear directorio ssl si no existe
if (!(Test-Path "ssl")) {
    New-Item -ItemType Directory -Path "ssl" | Out-Null
}

# Verificar si OpenSSL esta disponible
try {
    openssl version | Out-Null
} catch {
    Write-Host "ERROR: OpenSSL no encontrado." -ForegroundColor Red
    Write-Host "Opcion 1: Instalar OpenSSL desde https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Yellow
    Write-Host "Opcion 2: Usar chocolatey: choco install openssl" -ForegroundColor Yellow
    Write-Host "Opcion 3: Usar con WSL: wsl openssl ..." -ForegroundColor Yellow
    exit 1
}

# Generar certificado auto-firmado usando argumentos separados
try {
    openssl req -x509 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "//C=ES/ST=Madrid/L=Madrid/O=Development/CN=localhost"
    
    if (Test-Path "ssl/cert.pem" -and Test-Path "ssl/key.pem") {
        Write-Host "SUCCESS: Certificados SSL generados en ./ssl/" -ForegroundColor Green
        Write-Host "Archivos creados:" -ForegroundColor Cyan
        Write-Host "   - ssl/cert.pem (certificado)" -ForegroundColor Gray
        Write-Host "   - ssl/key.pem (clave privada)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Ahora puedes ejecutar:" -ForegroundColor Green
        Write-Host "   npm run build && npm start" -ForegroundColor White
        Write-Host ""
        Write-Host "NOTA: Estos son certificados auto-firmados para desarrollo." -ForegroundColor Yellow
        Write-Host "Tu navegador mostrara una advertencia de seguridad - acepta para continuar." -ForegroundColor Yellow
    } else {
        throw "Archivos de certificado no creados"
    }
} catch {
    Write-Host "ERROR generando certificados SSL: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
