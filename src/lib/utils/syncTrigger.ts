// src/lib/utils/syncTrigger.ts

import { SyncService } from '$lib/services/SyncService';

/**
 * Utility to trigger sync when data changes
 * Debounced to avoid excessive syncing
 */
export class SyncTrigger {
  private static debounceTimer: number | null = null;
  private static readonly DEBOUNCE_DELAY = 2000; // 2 seconds

  /**
   * Trigger sync after data change (debounced)
   */
  static triggerDataSync(): void {
    // Clear existing timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Set new timer
    this.debounceTimer = window.setTimeout(async () => {
      try {
        const syncService = SyncService.getInstance();
        await syncService.triggerSync();
        console.log('Data change sync completed');
      } catch (error) {
        console.warn('Data change sync failed:', error);
      }
    }, this.DEBOUNCE_DELAY);
  }

  /**
   * Cancel pending sync (if needed)
   */
  static cancelPendingSync(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}