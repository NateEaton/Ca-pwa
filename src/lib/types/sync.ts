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
  // Multi-document sync state tracking
  documentState?: {
    metadata: DocumentState;
    persistent: DocumentState;
    months: Record<string, DocumentState>;
  };
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

/**
 * Multi-Document Sync Types
 * These types support partitioning sync data into multiple small documents
 * to avoid stack overflow errors when JSON.stringify large datasets.
 */

export type DocumentType = 'metadata' | 'persistent' | 'month';

export interface SyncDocumentId {
  baseId: string;        // The main sync ID (e.g., "abc123")
  documentType: DocumentType;
  monthKey?: string;     // Format: "YYYY-MM" (only for month documents)
}

export interface MetadataDocument {
  version: '3.0.0';      // Multi-document format version
  syncGenerationId: string;
  availableMonths: string[];  // ["2024-01", "2024-02", ...]
  currentMonth: string;       // "2024-11"
  lastActivity: string;       // ISO timestamp
}

export interface PersistentDocument {
  version: '3.0.0';
  lastModified: string;
  preferences: any;
  customFoods: any[];
  favorites: number[];
  hiddenFoods: number[];
  servingPreferences: any[];
}

export interface MonthDocument {
  version: '3.0.0';
  monthKey: string;      // "YYYY-MM"
  lastModified: string;
  journalEntries: Record<string, any[]>;  // Only entries for this month
}

export interface DocumentState {
  lastModified: string | null;
}

export interface LocalSyncState {
  baseDocId: string;
  encryptionKey: CryptoKey | null;
  encryptionKeyString: string;
  syncGenerationId: string;
  documents: {
    metadata: DocumentState;
    persistent: DocumentState;
    months: Record<string, DocumentState>;  // "2024-01": { lastModified }
  };
}

/**
 * Helper to generate full document ID for Cloudflare KV
 */
export function getDocumentId(baseId: string, type: DocumentType, monthKey?: string): string {
  if (type === 'metadata') return `${baseId}-metadata`;
  if (type === 'persistent') return `${baseId}-persistent`;
  if (type === 'month' && monthKey) return `${baseId}-${monthKey}`;
  throw new Error('Invalid document type or missing monthKey');
}

/**
 * Parse document ID back to components
 */
export function parseDocumentId(fullDocId: string): SyncDocumentId | null {
  const parts = fullDocId.split('-');
  if (parts.length < 2) return null;

  const baseId = parts[0];
  const suffix = parts.slice(1).join('-');

  if (suffix === 'metadata') {
    return { baseId, documentType: 'metadata' };
  }
  if (suffix === 'persistent') {
    return { baseId, documentType: 'persistent' };
  }

  // Check if it's a month key (YYYY-MM format)
  const monthMatch = suffix.match(/^(\d{4})-(\d{2})$/);
  if (monthMatch) {
    return { baseId, documentType: 'month', monthKey: suffix };
  }

  return null;
}

/**
 * Extract month key from date string
 */
export function getMonthKey(dateString: string): string {
  return dateString.substring(0, 7); // "2024-11-06" -> "2024-11"
}