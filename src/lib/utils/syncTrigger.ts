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
import { logger } from '$lib/utils/logger';

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
  // Separate timers for each sync type to prevent cancellation
  private static journalDebounceTimer: number | null = null;
  private static persistentDebounceTimer: number | null = null;
  private static allDebounceTimer: number | null = null;
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
    // Select and clear the appropriate timer for this sync type
    let timer: number | null = null;

    if (changeType === 'all') {
      if (this.allDebounceTimer) clearTimeout(this.allDebounceTimer);
      logger.debug('SYNC TRIGGER', 'Triggering full sync (debounced)');
      timer = window.setTimeout(async () => {
        this.allDebounceTimer = null;
        await this.executeSync('all');
      }, this.DEBOUNCE_DELAY);
      this.allDebounceTimer = timer;
    } else if (changeType === 'persistent') {
      if (this.persistentDebounceTimer) clearTimeout(this.persistentDebounceTimer);
      logger.debug('SYNC TRIGGER', 'Triggering persistent data sync (debounced)');
      timer = window.setTimeout(async () => {
        this.persistentDebounceTimer = null;
        await this.executeSync('persistent');
      }, this.DEBOUNCE_DELAY);
      this.persistentDebounceTimer = timer;
    } else if (changeType === 'journal' && dateString) {
      if (this.journalDebounceTimer) clearTimeout(this.journalDebounceTimer);
      const monthKey = getMonthKey(dateString);
      logger.debug('SYNC TRIGGER', `Triggering month sync for ${monthKey} (debounced)`);
      timer = window.setTimeout(async () => {
        this.journalDebounceTimer = null;
        await this.executeSync('journal', monthKey);
      }, this.DEBOUNCE_DELAY);
      this.journalDebounceTimer = timer;
    } else {
      // Invalid parameters, fallback to full sync
      logger.warn('[SYNC TRIGGER] Invalid parameters, falling back to full sync');
      if (this.allDebounceTimer) clearTimeout(this.allDebounceTimer);
      timer = window.setTimeout(async () => {
        this.allDebounceTimer = null;
        await this.executeSync('all');
      }, this.DEBOUNCE_DELAY);
      this.allDebounceTimer = timer;
    }
  }

  /**
   * Execute the appropriate sync operation
   * @private
   */
  private static async executeSync(changeType: 'journal' | 'persistent' | 'all', monthKey?: string): Promise<void> {
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
        await syncService.performBidirectionalSync();
      } else if (changeType === 'persistent') {
        // Only sync persistent data (settings, custom foods, favorites)
        await syncService.syncPersistentData();
      } else if (changeType === 'journal' && monthKey) {
        // Only sync affected month
        await syncService.syncMonth(monthKey);
      }
    } catch (error) {
      logger.warn('Automatic data change sync failed:', error);
    }
  }

  /**
   * Cancel any pending sync operation.
   * Useful when the component is being unmounted or sync is no longer needed.
   *
   * @returns {void}
   */
  static cancelPendingSync(): void {
    if (this.journalDebounceTimer) {
      clearTimeout(this.journalDebounceTimer);
      this.journalDebounceTimer = null;
    }
    if (this.persistentDebounceTimer) {
      clearTimeout(this.persistentDebounceTimer);
      this.persistentDebounceTimer = null;
    }
    if (this.allDebounceTimer) {
      clearTimeout(this.allDebounceTimer);
      this.allDebounceTimer = null;
    }
  }
}