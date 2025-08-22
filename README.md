# SimpleWebAuthn Demo

Una aplicación de demostración de WebAuthn usando `@simplewebauthn/server` y `@simplewebauthn/browser`.

## 🚀 Inicio rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 📱 Pruebas en móviles

### Opción 1: Acceso directo desde móvil
1. Asegúrate de que tu móvil y computadora estén en la misma red WiFi
2. Encuentra la IP de tu computadora:
   - **Windows**: `ipconfig` en CMD
   - **macOS/Linux**: `ifconfig` o `ip addr` en terminal
3. En tu móvil, abre el navegador y ve a: `http://[IP_COMPUTADORA]:3000`
   - Ejemplo: `http://192.168.1.100:3000`

### Opción 2: Usando ngrok (recomendado para pruebas)
```bash
# Instalar ngrok
npm install -g ngrok

# Crear túnel público
ngrok http 3000

# Usar la URL de ngrok en tu móvil
# Ejemplo: https://abc123.ngrok.io
```

### Opción 3: Usando tu IP pública
1. Configura port forwarding en tu router para el puerto 3000
2. Usa tu IP pública: `http://[IP_PUBLICA]:3000`

## 🧪 Páginas de prueba

- **Página principal**: `http://localhost:3000/` - Demo completo de WebAuthn
- **Página de test**: `http://localhost:3000/test` - Verificar compatibilidad móvil

## 🔧 Solución de problemas móviles

### Error: "WebAuthn no está soportado"
- Asegúrate de usar HTTPS o localhost
- Verifica que el navegador móvil sea compatible (Chrome, Safari, Firefox)

### Error: "Autenticador no disponible"
- En Android: Verifica que tengas huella dactilar configurada
- En iOS: Verifica que tengas Face ID o Touch ID configurado
- En ambos: Asegúrate de que la pantalla esté desbloqueada

### Error: "Usuario canceló"
- Es normal si el usuario no completa la autenticación
- Verifica que el diálogo de autenticación aparezca

## 📋 Requisitos del navegador

- **Chrome**: 67+ (Android 7+)
- **Safari**: 13+ (iOS 13+)
- **Firefox**: 60+ (Android 7+)
- **Edge**: 18+

## 🏗️ Estructura del proyecto

```
webauth-test/
├── src/
│   └── index.ts          # Servidor Express con endpoints WebAuthn
├── public/
│   ├── index.html        # Página principal del demo
│   ├── webauthn.js      # Lógica WebAuthn del cliente
│   └── test-mobile.html # Página de prueba para móviles
├── package.json
└── tsconfig.json
```

## 🔐 Endpoints WebAuthn

- `POST /webauthn/register/options` - Generar opciones de registro
- `POST /webauthn/register/verify` - Verificar registro
- `POST /webauthn/authenticate/options` - Generar opciones de autenticación
- `POST /webauthn/authenticate/verify` - Verificar autenticación

## 💡 Consejos para móviles

1. **Primero registra**: Usa el botón "Registrar" antes de "Entrar"
2. **Usa autenticación biométrica**: Huella dactilar, Face ID, o PIN
3. **Mantén la pantalla desbloqueada**: Durante el proceso de autenticación
4. **Verifica permisos**: Asegúrate de que el navegador tenga permisos para autenticación

## 🚨 Limitaciones

- **Solo para desarrollo**: Usa almacenamiento en memoria
- **Sin persistencia**: Los usuarios se pierden al reiniciar
- **localhost/HTTPS**: WebAuthn requiere contexto seguro
- **Navegador compatible**: Verifica compatibilidad antes de usar

## 📚 Recursos adicionales

- [Documentación SimpleWebAuthn](https://simplewebauthn.dev/)
- [WebAuthn Browser Support](https://caniuse.com/webauthn)
- [WebAuthn MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
