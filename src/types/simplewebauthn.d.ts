declare module '@simplewebauthn/server' {
  export interface GenerateRegistrationOptionsOpts {
    rpName: string;
    rpID: string;
    userID: Uint8Array;
    userName: string;
    attestationType?: 'none' | 'direct' | 'indirect';
    authenticatorSelection?: {
      residentKey?: 'required' | 'preferred' | 'discouraged';
      userVerification?: 'required' | 'preferred' | 'discouraged';
      authenticatorAttachment?: 'platform' | 'cross-platform';
    };
    excludeCredentials?: Array<{
      id: string;
      transports?: Array<'ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb'>;
    }>;
  }

  export interface RegistrationOptions {
    challenge: string;
    rp: {
      name: string;
      id: string;
    };
    user: {
      id: string;
      name: string;
      displayName: string;
    };
    pubKeyCredParams: Array<{
      type: string;
      alg: number;
    }>;
    timeout: number;
    attestation: string;
    authenticatorSelection: {
      residentKey: string;
      userVerification: string;
      authenticatorAttachment: string;
    };
    excludeCredentials: Array<{
      id: string;
      type: string;
      transports: string[];
    }>;
  }

  export interface GenerateAuthenticationOptionsOpts {
    rpID: string;
    allowCredentials?: Array<{
      id: string;
      transports?: Array<'ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb'>;
    }>;
    userVerification?: 'required' | 'preferred' | 'discouraged';
  }

  export interface AuthenticationOptions {
    challenge: string;
    rpId: string;
    allowCredentials: Array<{
      id: string;
      transports: string[];
    }>;
    userVerification: string;
    timeout: number;
  }

  export interface VerifyRegistrationResponseOpts {
    response: any;
    expectedChallenge: string;
    expectedOrigin: string;
    expectedRPID: string;
  }

  export interface VerifyAuthenticationResponseOpts {
    response: any;
    expectedChallenge: string;
    expectedOrigin: string;
    expectedRPID: string;
    authenticator: {
      id: string;
      publicKey: Uint8Array;
      counter: number;
      transports?: Array<'ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb'>;
    };
    requireUserVerification: boolean;
  }

  export interface VerifiedRegistrationResponse {
    verified: boolean;
    registrationInfo?: {
      credentialID: Uint8Array;
      credentialPublicKey: Uint8Array;
      counter: number;
      credential: {
        id: string;
        publicKey: Uint8Array;
        counter: number;
        transports?: Array<'ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb'>;
      };
      credentialType: string;
    };
  }

  export interface VerifiedAuthenticationResponse {
    verified: boolean;
    authenticationInfo: {
      newCounter: number;
    };
  }

  export function generateRegistrationOptions(opts: GenerateRegistrationOptionsOpts): Promise<RegistrationOptions>;
  export function generateAuthenticationOptions(opts: GenerateAuthenticationOptionsOpts): Promise<AuthenticationOptions>;
  export function verifyRegistrationResponse(opts: VerifyRegistrationResponseOpts): Promise<VerifiedRegistrationResponse>;
  export function verifyAuthenticationResponse(opts: VerifyAuthenticationResponseOpts): Promise<VerifiedAuthenticationResponse>;
}
