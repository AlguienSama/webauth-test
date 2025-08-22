const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return 'localhost';
}

const localIP = getLocalIP();
console.log('🌐 Para pruebas móviles, usa:');
console.log(`   http://${localIP}:3000`);
console.log('');
console.log('📱 O abre esta URL en tu móvil:');
console.log(`   http://${localIP}:3000/test`);
console.log('');
console.log('💡 Asegúrate de que tu móvil esté en la misma red WiFi');
