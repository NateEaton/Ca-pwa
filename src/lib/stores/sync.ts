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
 * @fileoverview Cross-device synchronization state management.
 * Handles sync status, error states, and UI indicators for Automerge integration.
 */

import { writable, derived } from 'svelte/store';
import type { SyncState, SyncStatus } from '$lib/types/sync';

// Main sync state
export const syncState = writable<SyncState>({
  status: 'initializing', // <-- Change this from 'offline'
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
    case 'initializing':
      return { icon: 'sync', color: '#ffffff', spinning: true };
    case 'offline':
      return { icon: 'cloud_off', color: 'var(--text-secondary)', spinning: false };
    case 'syncing':
      return { icon: 'sync', color: '#ffffff', spinning: true };
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