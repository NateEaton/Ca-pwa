// src/lib/utils/cryptoUtils.ts

/**
 * Crypto utilities for end-to-end encryption of sync data
 * Uses AES-GCM with WebCrypto API for secure client-side encryption
 * Falls back to basic encryption for non-HTTPS environments
 */

export class CryptoUtils {
  
  /**
   * Check if WebCrypto is available
   */
  static isWebCryptoAvailable(): boolean {
    return typeof crypto !== 'undefined' && crypto.subtle && crypto.getRandomValues;
  }

  /**
   * Generate a new AES-GCM encryption key
   */
  static async generateKey(): Promise<CryptoKey | string> {
    if (this.isWebCryptoAvailable()) {
      return await crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256
        },
        true, // extractable
        ['encrypt', 'decrypt']
      );
    } else {
      // Fallback: generate a random string key for development
      console.warn('WebCrypto not available, using fallback encryption');
      const array = new Uint8Array(32);
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return btoa(String.fromCharCode(...array));
    }
  }

  /**
   * Export key to base64 string for storage/sharing
   */
  static async exportKey(key: CryptoKey | string): Promise<string> {
    if (typeof key === 'string') {
      return key; // Already a string key
    }
    
    if (this.isWebCryptoAvailable()) {
      const exported = await crypto.subtle.exportKey('raw', key);
      return btoa(String.fromCharCode(...new Uint8Array(exported)));
    } else {
      throw new Error('WebCrypto not available');
    }
  }

  /**
   * Import key from base64 string
   */
  static async importKey(keyString: string): Promise<CryptoKey | string> {
    if (this.isWebCryptoAvailable()) {
      const keyData = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
      return await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
      );
    } else {
      // Return the string key directly for fallback mode
      return keyString;
    }
  }

  /**
   * Encrypt data with AES-GCM or fallback method
   */
  static async encrypt(data: string, key: CryptoKey | string): Promise<string> {
    if (typeof key === 'string') {
      // Fallback encryption (simple XOR - NOT secure, for development only)
      console.warn('Using fallback encryption - NOT SECURE');
      return this.simpleEncrypt(data, key);
    }
    
    if (this.isWebCryptoAvailable()) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // Generate random IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        dataBuffer
      );

      // Combine IV + encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      // Return as base64
      return btoa(String.fromCharCode(...combined));
    } else {
      throw new Error('WebCrypto not available');
    }
  }

  /**
   * Decrypt data with AES-GCM or fallback method
   */
  static async decrypt(encryptedData: string, key: CryptoKey | string): Promise<string> {
    if (typeof key === 'string') {
      // Fallback decryption
      return this.simpleDecrypt(encryptedData, key);
    }
    
    if (this.isWebCryptoAvailable()) {
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      // Extract IV and encrypted data
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } else {
      throw new Error('WebCrypto not available');
    }
  }

  /**
   * Simple fallback encryption (NOT SECURE - for development only)
   */
  private static simpleEncrypt(data: string, key: string): string {
    const keyBytes = atob(key);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      const keyChar = keyBytes.charCodeAt(i % keyBytes.length);
      result += String.fromCharCode(char ^ keyChar);
    }
    return btoa(result);
  }

  /**
   * Simple fallback decryption (NOT SECURE - for development only)
   */
  private static simpleDecrypt(encryptedData: string, key: string): string {
    const data = atob(encryptedData);
    const keyBytes = atob(key);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      const keyChar = keyBytes.charCodeAt(i % keyBytes.length);
      result += String.fromCharCode(char ^ keyChar);
    }
    return result;
  }

  /**
   * Generate a random document ID
   */
  static generateDocId(): string {
    const array = new Uint8Array(16);
    if (this.isWebCryptoAvailable()) {
      crypto.getRandomValues(array);
    } else {
      // Fallback random generation
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate a device ID for metadata
   */
  static generateDeviceId(): string {
    const array = new Uint8Array(8);
    if (this.isWebCryptoAvailable()) {
      crypto.getRandomValues(array);
    } else {
      // Fallback random generation
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}