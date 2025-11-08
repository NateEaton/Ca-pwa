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

import { SyncService } from '$lib/services/SyncService';
import { syncState } from '$lib/stores/sync';
import { get } from 'svelte/store';
import { getMonthKey } from '$lib/types/sync';

/**
 * Utility class for triggering automatic sync operations when data changes.
 * Implements debouncing to prevent excessive sync operations and reduce
 * server load while ensuring data consistency across devices.
 *
 * Smart sync routing:
 * - 'journal' changes: sync only the affected month document
 * - 'persistent' changes: sync only metadata + persistent document
 * - 'all' changes: full bidirectional sync
 */
export class SyncTrigger {
  private static debounceTimer: number | null = null;
  private static readonly DEBOUNCE_DELAY = 2000; // 2 seconds

  /**
   * Trigger a debounced sync operation after data changes.
   * Smart routing based on change type for optimal performance.
   *
   * @param changeType - Type of change: 'journal', 'persistent', or 'all'
   * @param dateString - Date string for journal changes (YYYY-MM-DD format)
   * @returns {void}
   */
  static triggerDataSync(changeType: 'journal' | 'persistent' | 'all' = 'all', dateString?: string): void {
    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer
    this.debounceTimer = window.setTimeout(async () => {
      try {
        const currentSyncState = get(syncState);
        if (!currentSyncState.isEnabled) {
          // Sync is not enabled, no need to sync or log anything
          return;
        }

        const syncService = SyncService.getInstance();

        // Smart routing based on change type
        if (changeType === 'all') {
          // Full sync
          console.log('[SYNC TRIGGER] Full bidirectional sync triggered');
          await syncService.performBidirectionalSync();
        } else if (changeType === 'persistent') {
          // Only sync persistent data (settings, custom foods, favorites)
          console.log('[SYNC TRIGGER] Persistent data sync triggered');
          await syncService.syncPersistentData();
        } else if (changeType === 'journal' && dateString) {
          // Only sync affected month
          const monthKey = getMonthKey(dateString);
          console.log('[SYNC TRIGGER] Month sync triggered for', monthKey);
          await syncService.syncMonth(monthKey);
        } else {
          // Fallback to full sync if parameters are invalid
          console.warn('[SYNC TRIGGER] Invalid parameters, falling back to full sync');
          await syncService.performBidirectionalSync();
        }
      } catch (error) {
        console.warn('Automatic data change sync failed:', error);
      }
    }, this.DEBOUNCE_DELAY);
  }

  /**
   * Cancel any pending sync operation.
   * Useful when the component is being unmounted or sync is no longer needed.
   * 
   * @returns {void}
   */
  static cancelPendingSync(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}