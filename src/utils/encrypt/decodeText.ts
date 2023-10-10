interface DecodeTextArgs {
  decryptedKey: CryptoKey;
  iv: Uint8Array;
  source: ArrayBuffer;
}

export const decodeText = async ({ decryptedKey, iv, source }: DecodeTextArgs) => {
  const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, decryptedKey, source);

  return new TextDecoder().decode(decryptedData);
};
