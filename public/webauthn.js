// Get SimpleWebAuthn functions from global scope
const { startRegistration, startAuthentication } = SimpleWebAuthnBrowser;

const usernameInput = () => document.getElementById('username');
const log = (msg) => {
  const el = document.getElementById('log');
  el.textContent = `${new Date().toLocaleTimeString()} ${msg}\n` + el.textContent;
};

async function post(path, body) {
  try {
    const res = await fetch(path, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(body) 
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    return res.json();
  } catch (err) {
    log('❌ Error en request: ' + err.message);
    throw err;
  }
}

async function register() {
  const username = usernameInput().value.trim();
  if (!username) {
    alert('Ingresa un usuario');
    return;
  }
  
  try {
    log('🔄 Iniciando registro para: ' + username);
    
    // Get registration options
    const opts = await post('/webauthn/register/options', { username });
    log('📋 Opciones de registro recibidas');
    
    // Start registration
    const attResp = await startRegistration(opts);
    log('🔐 Respuesta de registro recibida');
    
    // Verify registration
    const { verified } = await post('/webauthn/register/verify', { 
      username, 
      attestationResponse: attResp 
    });
    
    if (verified) {
      log('✅ Registro exitoso!');
    } else {
      log('❌ Registro falló la verificación');
    }
  } catch (e) {
    console.error('Error en registro:', e);
    if (e.name === 'NotAllowedError') {
      log('❌ Usuario canceló el registro');
    } else if (e.name === 'NotSupportedError') {
      log('❌ Tipo de autenticador no soportado');
    } else if (e.name === 'SecurityError') {
      log('❌ Error de seguridad - verifica HTTPS/localhost');
    } else {
      log('❌ Error en registro: ' + e.message);
    }
  }
}

async function login() {
  const username = usernameInput().value.trim();
  if (!username) {
    alert('Ingresa un usuario');
    return;
  }
  
  try {
    log('🔄 Iniciando login para: ' + username);
    
    // Get authentication options
    const opts = await post('/webauthn/authenticate/options', { username });
    log('📋 Opciones de autenticación recibidas');
    
    // Start authentication
    const assertion = await startAuthentication(opts);
    log('🔐 Respuesta de autenticación recibida');
    
    // Verify authentication
    const { verified } = await post('/webauthn/authenticate/verify', { 
      username, 
      assertionResponse: assertion 
    });
    
    if (verified) {
      log('✅ Login exitoso!');
    } else {
      log('❌ Login falló la verificación');
    }
  } catch (e) {
    console.error('Error en login:', e);
    if (e.name === 'NotAllowedError') {
      log('❌ Usuario canceló la autenticación');
    } else if (e.name === 'NotSupportedError') {
      log('❌ Tipo de autenticador no soportado');
    } else if (e.name === 'SecurityError') {
      log('❌ Error de seguridad - verifica HTTPS/localhost');
    } else {
      log('❌ Error en login: ' + e.message);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  log('🚀 SimpleWebAuthn Demo iniciado');
  
  // Add event listeners
  const registerBtn = document.getElementById('registerBtn');
  const loginBtn = document.getElementById('loginBtn');
  
  if (registerBtn) {
    registerBtn.addEventListener('click', register);
    log('✅ Botón de registro configurado');
  }
  
  if (loginBtn) {
    loginBtn.addEventListener('click', login);
    log('✅ Botón de login configurado');
  }
  
  // Add touch event support for mobile
  if ('ontouchstart' in window) {
    log('📱 Modo táctil detectado');
    registerBtn?.addEventListener('touchstart', register);
    loginBtn?.addEventListener('touchstart', login);
  }
});
