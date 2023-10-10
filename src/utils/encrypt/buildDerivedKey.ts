interface BuildDerivedKeyArgs {
  salt: Uint8Array;
  secretKeyData: CryptoKey;
}

export const buildDerivedKey = ({ salt, secretKeyData }: BuildDerivedKeyArgs) =>
  crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    secretKeyData,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );
