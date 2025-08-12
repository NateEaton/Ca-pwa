// src/lib/types/sync.ts

export type SyncStatus = 'offline' | 'syncing' | 'synced' | 'error' | 'conflict';

export interface SyncState {
  status: SyncStatus;
  lastSync: string | null;
  error: string | null;
  docId: string | null;
  isEnabled: boolean;
}

export interface SyncSettings {
  docId: string;
  encryptionKey: CryptoKey;
  workerUrl: string;
  autoSync: boolean;
  syncInterval: number; // seconds
}

export interface SyncDoc {
  journalEntries: Record<string, any[]>;
  customFoods: any[];
  favorites: number[];
  servingPreferences: any[];
  settings: any;
  metadata: {
    lastModified: string;
    deviceId: string;
    version: string;
  };
}

export interface CloudSyncResponse {
  success: boolean;
  docId: string;
  encrypted?: string;
  lastModified?: string;
  error?: string;
}