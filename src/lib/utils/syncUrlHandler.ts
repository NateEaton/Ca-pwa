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

// src/lib/utils/syncUrlHandler.ts

import { SyncService } from '$lib/services/SyncService';
import { showToast } from '$lib/stores/calcium';

/**
 * Utility class for handling sync URLs that allow users to join existing
 * sync documents through URL hash parameters. Processes URLs of the format:
 * #sync=DOCUMENT_ID&key=ENCRYPTION_KEY
 */
export class SyncUrlHandler {
  
  /**
   * Check the current URL for sync parameters and process them if found.
   * Validates the sync URL format, checks for existing sync configuration,
   * prompts user for confirmation, and initiates the sync join process.
   * 
   * @returns {Promise<boolean>} True if a sync join was initiated, false otherwise
   * @throws {Error} If sync join process fails
   */
  static async checkForSyncUrl(): Promise<boolean> {
    const hash = window.location.hash;
    
    if (!hash || !hash.includes('sync=')) {
      return false;
    }
    
    try {
      const params = new URLSearchParams(hash.substring(1));
      const docId = params.get('sync');
      const encodedKeyString = params.get('key');
      
      if (!docId || !encodedKeyString) {
        showToast('Invalid sync URL', 'error');
        this.clearHash();
        return false;
      }
      
      const stored = localStorage.getItem('calcium_sync_settings');
      if (stored) {
        const settings = JSON.parse(stored);
        if (settings.docId === docId) {
          showToast('Already synced to this document', 'info');
          this.clearHash();
          return false;
        }
      }
      
      const shouldJoin = await this.showJoinConfirmation(docId);
      
      if (shouldJoin) {
        const syncService = SyncService.getInstance();
        const fullUrl = window.location.href;

        this.clearHash();

        await syncService.joinExistingSyncDoc(fullUrl);
        // The joinExistingSyncDoc method will now handle the reload.
        
        // We return true to inform the layout that a join was initiated.
        return true;
      } else {
        this.clearHash();
        return false;
      }
      
    } catch (error) {
      console.error('Failed to process sync URL:', error);
      showToast(`Failed to join sync: ${error.message}`, 'error');
      this.clearHash();
      return false;
    }
  }
  
  /**
   * Show a confirmation dialog asking the user if they want to join a sync document.
   * Warns the user that joining will replace all current local data.
   * 
   * @param {string} docId - The document ID to join
   * @returns {Promise<boolean>} True if user confirms, false if they cancel
   */
  private static async showJoinConfirmation(docId: string): Promise<boolean> {
    const shortId = docId.substring(0, 8);
    const message = `Join sync with document ${shortId}...?\n\nThis will replace ALL your current local data with the synced data.`;
    return confirm(message);
  }
  
  /**
   * Clear the URL hash to remove sync parameters from the browser address bar.
   * Uses replaceState to avoid adding to browser history.
   * 
   * @returns {void}
   */
  private static clearHash(): void {
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  }
}