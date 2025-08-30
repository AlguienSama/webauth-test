// WebCrypto polyfill for Node.js environments that don't have it
import { webcrypto } from 'crypto';
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as any;
}

import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

type AuthenticatorDevice = {
  id: string; // Base64URLString
  publicKey: Uint8Array;
  counter: number;
  transports?: ("ble" | "cable" | "hybrid" | "internal" | "nfc" | "smart-card" | "usb")[];
};

type User = {
  id: string;
  username: string;
  currentChallenge?: string;
  devices: AuthenticatorDevice[];
};

const app = express();
const port = Number(process.env.PORT || 8081);
const isProduction = process.env.NODE_ENV === 'production';
const protocol = isProduction || port === 8081 ? 'https' : 'http';
const expectedOrigin = process.env.RP_ORIGIN || `${protocol}://exylon.app:${port}`;

// Relying party config
const rpName = process.env.RP_NAME || 'SimpleWebAuthn Demo';
const rpID = process.env.RP_ID || 'exylon.app';

// In-memory user store for demo purposes only
const usernameToUser = new Map<string, User>();

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Test page for mobile debugging
app.get('/test', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'test-mobile.html'));
});

function getOrCreateUser(username: string): User {
  let user = usernameToUser.get(username);
  if (!user) {
    // Use username as ID for demo purposes. In production, use a stable unique ID.
    user = { id: username, username, devices: [] };
    usernameToUser.set(username, user);
  }
  return user;
}

// Registration (Attestation)
app.post('/webauthn/register/options', async (req, res) => {
  const { username } = req.body as { username?: string };
  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  const user = getOrCreateUser(username);

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    // v13 expects userID as Uint8Array
    userID: new TextEncoder().encode(user.id),
    userName: user.username,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform',
    },
    excludeCredentials: user.devices.map((dev) => ({
      id: dev.id,
      transports: dev.transports,
    })),
  });

  user.currentChallenge = options.challenge;

  return res.json(options);
});

app.post('/webauthn/register/verify', async (req, res) => {
  const { username, attestationResponse } = req.body as {
    username?: string;
    attestationResponse?: unknown;
  };
  if (!username || !attestationResponse) {
    return res.status(400).json({ error: 'username and attestationResponse are required' });
  }

  const user = usernameToUser.get(username);
  if (!user || !user.currentChallenge) {
    return res.status(400).json({ error: 'registration not initiated' });
  }

  try {
    const verification = await verifyRegistrationResponse({
      response: attestationResponse as any,
      expectedChallenge: user.currentChallenge,
      expectedOrigin,
      expectedRPID: rpID,
    });

    const { verified, registrationInfo } = verification;
    if (verified && registrationInfo) {
      const { credential, credentialType } = registrationInfo;
      if (credentialType !== 'public-key') {
        return res.status(400).json({ error: 'unsupported credential type' });
      }
      const exists = user.devices.find((d) => d.id === credential.id);
      if (!exists) {
        user.devices.push({
          id: credential.id,
          publicKey: credential.publicKey,
          counter: credential.counter,
          transports: credential.transports,
        });
      }
      user.currentChallenge = undefined;
    }

    return res.json({ verified });
  } catch (err) {
    return res.status(400).json({ error: 'verification failed' });
  }
});

// Authentication (Assertion)
app.post('/webauthn/authenticate/options', async (req, res) => {
  const { username } = req.body as { username?: string };
  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }
  const user = usernameToUser.get(username);
  if (!user || user.devices.length === 0) {
    return res.status(400).json({ error: 'unknown user or no credentials' });
  }

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'preferred',
    allowCredentials: user.devices.map((dev) => ({
      id: dev.id,
      transports: dev.transports,
    })),
  });

  user.currentChallenge = options.challenge;
  return res.json(options);
});

app.post('/webauthn/authenticate/verify', async (req, res) => {
  const { username, assertionResponse } = req.body as {
    username?: string;
    assertionResponse?: any;
  };
  if (!username || !assertionResponse) {
    return res.status(400).json({ error: 'username and assertionResponse are required' });
  }
  const user = usernameToUser.get(username);
  if (!user || !user.currentChallenge) {
    return res.status(400).json({ error: 'authentication not initiated' });
  }

  // Find the authenticator that matches the credential ID
  const credentialIDBase64URL: string = assertionResponse.id;
  const authenticator = user.devices.find((dev) => dev.id === credentialIDBase64URL);
  if (!authenticator) {
    return res.status(400).json({ error: 'authenticator not registered' });
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response: assertionResponse,
      expectedChallenge: user.currentChallenge,
      expectedOrigin,
      expectedRPID: rpID,
      authenticator: {
        id: authenticator.id,
        publicKey: authenticator.publicKey,
        counter: authenticator.counter,
        transports: authenticator.transports,
      },
      requireUserVerification: false,
    });

    const { verified, authenticationInfo } = verification;
    if (verified && authenticationInfo) {
      authenticator.counter = authenticationInfo.newCounter;
      user.currentChallenge = undefined;
    }
    return res.json({ verified });
  } catch (err) {
    return res.status(400).json({ error: 'verification failed' });
  }
});

// Start server with HTTPS if certificates are available
function startServer() {
  // Check if SSL certificates exist
  console.log('📡 Starting HTTP server...');
  app.listen(port, () => {
    console.log(`🔐 WebAuthn demo listening on ${expectedOrigin} (rpID: ${rpID})`);
    if (rpID !== 'localhost' && protocol === 'http') {
      console.log('⚠️  WARNING: HTTP detected on non-localhost - WebAuthn may not work!');
      console.log('💡 For production, please setup HTTPS certificates');
    }
  });
}

startServer();