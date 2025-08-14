// src/lib/utils/cryptoUtils.ts

export class CryptoUtils {

  static isWebCryptoAvailable(): boolean {
    return typeof crypto !== 'undefined' && crypto.subtle && crypto.getRandomValues;
  }

  static generateUUID(): string {
    return crypto.randomUUID();
  }

  static async generateKey(): Promise<CryptoKey> {
    if (!this.isWebCryptoAvailable()) {
      throw new Error('WebCrypto API is not available in this insecure context (requires HTTPS).');
    }
    return await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async exportKey(key: CryptoKey): Promise<string> {
    if (!this.isWebCryptoAvailable()) {
      throw new Error('WebCrypto API is not available.');
    }
    const exported = await crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  static async importKey(keyString: string): Promise<CryptoKey> {
    if (!this.isWebCryptoAvailable()) {
      throw new Error('WebCrypto API is not available.');
    }
    const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(data: string, key: CryptoKey): Promise<string> {
    if (!this.isWebCryptoAvailable()) {
      throw new Error('WebCrypto API is not available.');
    }
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      dataBuffer
    );

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  static async decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
    if (!this.isWebCryptoAvailable()) {
      throw new Error('WebCrypto API is not available.');
    }
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  static generateDocId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static generateDeviceId(): string {
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}