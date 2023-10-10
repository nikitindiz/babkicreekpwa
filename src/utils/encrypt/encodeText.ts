interface EncodeTextArgs {
  derivedKey: CryptoKey;
  iv: Uint8Array;
  text: string;
}

export const encodeText = ({ derivedKey, iv, text }: EncodeTextArgs) => {
  const encodedData = new TextEncoder().encode(text);

  return crypto.subtle.encrypt({ name: 'AES-GCM', iv }, derivedKey, encodedData);
};
