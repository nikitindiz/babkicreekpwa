interface ImportKeyDataArgs {
  userKey: string;
}

export const importKeyData = ({ userKey }: ImportKeyDataArgs) =>
  window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(userKey),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );
