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

export type SyncStatus = 'offline' | 'initializing' | 'syncing' | 'synced' | 'error' | 'conflict';

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
  syncGenerationId: string;
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
    syncGenerationId: string;
  };
}

export interface CloudSyncResponse {
  success: boolean;
  docId: string;
  encrypted?: string;
  lastModified?: string;
  error?: string;
}