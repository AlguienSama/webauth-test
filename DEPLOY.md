# 🚀 Guía de Despliegue - WebAuthn Server

## 🔒 **HTTPS es OBLIGATORIO para WebAuthn en producción**

### ✅ **Funciona con HTTP:**
- `localhost` (desarrollo local)
- `127.0.0.1` (desarrollo local)

### ❌ **REQUIERE HTTPS:**
- Servidores públicos
- IPs públicas 
- Dominios (ejemplo.com)
- Móviles accediendo remotamente

## 🛠️ **Pasos para desplegar:**

### **1. Generar certificados SSL**

#### En Linux/macOS:
```bash
chmod +x scripts/generate-ssl.sh
npm run ssl
```

#### En Windows:
```powershell
npm run ssl:win
```

### **2. Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Puerto del servidor
PORT=8081

# Entorno de producción
NODE_ENV=production

# Configuración del Relying Party
RP_NAME=WebAuthn Demo
RP_ID=tu-dominio.com
RP_ORIGIN=https://tu-dominio.com:8081

# Rutas de certificados SSL
SSL_CERT=./ssl/cert.pem
SSL_KEY=./ssl/key.pem
```

### **3. Compilar y ejecutar**

```bash
# Compilar TypeScript
npm run build

# Ejecutar en modo producción con HTTPS
npm run https
```

### **4. Verificar funcionamiento**

- El servidor mostrará: `🔒 Starting HTTPS server...`
- WebAuthn funcionará en dispositivos móviles
- Sin errores de seguridad en navegadores

## 🌐 **Para acceso público:**

### **Opción A: Certificados Let's Encrypt (Recomendado)**
```bash
# Instalar certbot
sudo apt install certbot

# Generar certificado
sudo certbot certonly --standalone -d tu-dominio.com

# Copiar certificados
sudo cp /etc/letsencrypt/live/tu-dominio.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/tu-dominio.com/privkey.pem ./ssl/key.pem
```

### **Opción B: Nginx como proxy inverso**
```nginx
server {
    listen 443 ssl;
    server_name tu-dominio.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🧪 **Testing:**

### **Local (HTTP):**
```bash
npm run dev
# Abrir: http://localhost:3000
```

### **Producción (HTTPS):**
```bash
npm run deploy
# Abrir: https://tu-dominio.com:8081
```

## ⚠️ **Notas importantes:**

1. **Puerto 8081**: Asegúrate de que esté abierto en tu firewall
2. **Certificados**: Renueva los certificados auto-firmados cada año
3. **Seguridad**: En producción, usa siempre Let's Encrypt o certificados válidos
4. **Móviles**: WebAuthn solo funciona con HTTPS en dispositivos móviles

## 🆘 **Solución de problemas:**

### **Error: "WebAuthn not supported"**
- Verifica que estés usando HTTPS
- Comprueba que los certificados SSL sean válidos

### **Error: "SecurityError"**
- Asegúrate de que `RP_ORIGIN` coincida con la URL del navegador
- Verifica que `RP_ID` sea el dominio correcto

### **Certificados no funcionan**
- Verifica permisos de archivos: `chmod 600 ssl/*.pem`
- Comprueba que OpenSSL esté instalado
