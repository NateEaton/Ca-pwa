/*
 * My Calcium Tracker PWA
 * Copyright (C) 2025 Nathan A. Eaton Jr.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Utility class for cryptographic operations including key generation, encryption, and decryption.
 * Uses the WebCrypto API for secure operations required for sync functionality.
 */
export class CryptoUtils {

  /**
   * Checks if the WebCrypto API is available in the current context.
   * @returns True if WebCrypto is available
   */
  static isWebCryptoAvailable(): boolean {
    return typeof crypto !== 'undefined' && crypto.subtle && crypto.getRandomValues;
  }

  /**
   * Generates a cryptographically secure UUID.
   * @returns A UUID string
   */
  static generateUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * Generates a new AES-GCM encryption key.
   * @returns Promise resolving to a CryptoKey
   * @throws Error if WebCrypto is not available
   */
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

  /**
   * Exports a CryptoKey to a base64 string for storage.
   * @param key The CryptoKey to export
   * @returns Promise resolving to a base64 string
   * @throws Error if WebCrypto is not available
   */
  static async exportKey(key: CryptoKey): Promise<string> {
    if (!this.isWebCryptoAvailable()) {
      throw new Error('WebCrypto API is not available.');
    }
    const exported = await crypto.subtle.exportKey('raw', key);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }

  /**
   * Imports a CryptoKey from a base64 string.
   * @param keyString The base64 encoded key string
   * @returns Promise resolving to a CryptoKey
   * @throws Error if WebCrypto is not available
   */
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

  /**
   * Encrypts data using AES-GCM encryption.
   * @param data The data to encrypt
   * @param key The encryption key
   * @returns Promise resolving to base64 encoded encrypted data
   * @throws Error if WebCrypto is not available or encryption fails
   */
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

  /**
   * Decrypts encrypted data using AES-GCM decryption.
   * @param encryptedData Base64 encoded encrypted data
   * @param key The decryption key
   * @returns Promise resolving to the decrypted plaintext
   * @throws Error if WebCrypto is not available or decryption fails
   */
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

  /**
   * Generates a document ID for sync purposes.
   * @returns A document ID string
   */
  static generateDocId(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generates a device ID for identification purposes.
   * @returns A device ID string
   */
  static generateDeviceId(): string {
    const array = new Uint8Array(8);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}