// src/lib/stores/sync.ts

import { writable, derived } from 'svelte/store';
import type { SyncState, SyncStatus } from '$lib/types/sync';

// Main sync state
export const syncState = writable<SyncState>({
  status: 'offline',
  lastSync: null,
  error: null,
  docId: null,
  isEnabled: false
});

// Helper function to update sync status
export function setSyncStatus(status: SyncStatus, error?: string) {
  syncState.update(state => ({
    ...state,
    status,
    error: error || null,
    lastSync: status === 'synced' ? new Date().toISOString() : state.lastSync
  }));
}

// Helper function to set sync error
export function setSyncError(error: string) {
  syncState.update(state => ({
    ...state,
    status: 'error',
    error
  }));
}

// Derived store for sync icon display
export const syncIcon = derived(syncState, ($syncState) => {
  switch ($syncState.status) {
    case 'offline':
      return { icon: 'cloud_off', color: 'var(--text-secondary)', spinning: false };
    case 'syncing':
      return { icon: 'sync', color: 'var(--primary-color)', spinning: true };
    case 'synced':
      return { icon: 'cloud_done', color: '#4caf50', spinning: false };
    case 'error':
      return { icon: 'cloud_off', color: '#f44336', spinning: false };
    case 'conflict':
      return { icon: 'warning', color: '#ff9800', spinning: false };
    default:
      return { icon: 'cloud_off', color: 'var(--text-secondary)', spinning: false };
  }
});