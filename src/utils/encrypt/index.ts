// Import the pbkdf2 library if not already available
// You can use a library like 'pbkdf2' from npm to perform key derivation

// User-entered secret key (password)
import { buildDerivedKey } from 'utils/encrypt/buildDerivedKey';
import { encodeText } from 'utils/encrypt/encodeText';
import { decodeText } from 'utils/encrypt/decodeText';
import { importKeyData } from 'utils/encrypt/importKeyData';
import { buildPasswordHash } from 'utils/encrypt/buildPasswordHash';

const userSecretKey = 'MySecretPassword';

// Text to encrypt
const textToEncrypt = 'This is a secret message';

// Generate a random salt
const salt = crypto.getRandomValues(new Uint8Array(16));

const iv = crypto.getRandomValues(new Uint8Array(12));

export const tryMe = async () => {
  const secretKeyData = await importKeyData({ userKey: userSecretKey });
  const derivedKey = await buildDerivedKey({ secretKeyData, salt });

  const encodedData = await encodeText({ text: textToEncrypt, derivedKey, iv });

  console.log('encodedData', encodedData);

  const decryptedText = await decodeText({ source: encodedData, decryptedKey: derivedKey, iv });

  console.log('decryptedText', decryptedText);
};

export class DataEncryptor {
  iv!: Uint8Array;
  salt!: Uint8Array;
  secretKeyData!: CryptoKey;
  derivedKey!: CryptoKey;

  static buildPasswordHash = buildPasswordHash;
  static ERR_UNABLE_DO_DECODE = 'Unable to decode text';

  constructor({ iv, salt }: { iv?: Uint8Array; salt?: Uint8Array } = {}) {
    if (iv) {
      this.iv = iv;
    } else {
      this.iv = crypto.getRandomValues(new Uint8Array(12));
    }
    if (salt) {
      this.salt = salt;
    } else {
      this.salt = crypto.getRandomValues(new Uint8Array(16));
    }
  }

  generateKey = async (passwordHash: string) => {
    this.secretKeyData = await importKeyData({ userKey: passwordHash });
    this.derivedKey = await buildDerivedKey({ secretKeyData: this.secretKeyData, salt: this.salt });

    return this;
  };

  checkPassword = () => {
    const { derivedKey } = this;

    if (!derivedKey) throw new Error('You forgot to use .generateKey() or passwordHash is empty');
  };

  encodeText = (text: string) => {
    const { derivedKey, iv } = this;

    this.checkPassword();

    return encodeText({ text, derivedKey, iv });
  };

  decodeText = async (encodedData: ArrayBuffer) => {
    const { derivedKey, iv } = this;

    this.checkPassword();

    try {
      return await decodeText({ source: encodedData, decryptedKey: derivedKey, iv });
    } catch (_) {
      throw new Error(DataEncryptor.ERR_UNABLE_DO_DECODE);
    }
  };
}

export const encrypt = {
  buildDerivedKey,
  decodeText,
  encodeText,
  importKeyData,
  tryMe,
  buildPasswordHash,
};
