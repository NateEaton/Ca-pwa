// src/lib/utils/syncUrlHandler.ts

import { SyncService } from '$lib/services/SyncService';
import { showToast } from '$lib/stores/calcium';

export class SyncUrlHandler {
  
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

        // --- FIX: Clear the hash BEFORE reloading ---
        // This prevents the infinite loop.
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
  
  private static async showJoinConfirmation(docId: string): Promise<boolean> {
    const shortId = docId.substring(0, 8);
    const message = `Join sync with document ${shortId}...?\n\nThis will replace ALL your current local data with the synced data.`;
    return confirm(message);
  }
  
  private static clearHash(): void {
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  }
}