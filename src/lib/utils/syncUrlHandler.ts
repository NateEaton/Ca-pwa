// src/lib/utils/syncUrlHandler.ts

import { SyncService } from '$lib/services/SyncService';
import { showToast } from '$lib/stores/calcium';

export class SyncUrlHandler {
  
  /**
   * Check URL hash for sync parameters on app load
   */
  static async checkForSyncUrl(): Promise<boolean> {
    const hash = window.location.hash;
    
    if (!hash || !hash.includes('sync=')) {
      return false;
    }
    
    try {
      // Parse hash parameters
      const hashParams = hash.substring(1); // Remove #
      const params = new URLSearchParams(hashParams);
      
      const docId = params.get('sync');
      const encodedKeyString = params.get('key');
      
      console.log('Parsed sync URL params:', { docId, encodedKeyString: encodedKeyString ? 'present' : 'missing' });
      
      if (!docId || !encodedKeyString) {
        console.warn('Invalid sync URL parameters', { docId, encodedKeyString });
        showToast('Invalid sync URL - missing parameters', 'error');
        return false;
      }
      
      // URL decode the key to handle special characters
      const keyString = decodeURIComponent(encodedKeyString);
      console.log('Decoded key string length:', keyString.length);
      
      // Check if we're already synced to this document
      const stored = localStorage.getItem('calcium_sync_settings');
      if (stored) {
        const settings = JSON.parse(stored);
        if (settings.docId === docId) {
          console.log('Already synced to this document');
          this.clearHash();
          showToast('Already synced to this document', 'info');
          return false;
        }
      }
      
      // Show confirmation dialog
      const shouldJoin = await this.showJoinConfirmation(docId);
      
      if (shouldJoin) {
        const syncService = SyncService.getInstance();
        const fullUrl = window.location.href;
        console.log('Attempting to join with URL:', fullUrl);
        await syncService.joinExistingSyncDoc(fullUrl);
        showToast('Successfully joined sync!', 'success');
        this.clearHash();
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
   * Show confirmation dialog for joining sync
   */
  private static async showJoinConfirmation(docId: string): Promise<boolean> {
    const shortId = docId.substring(0, 8);
    const message = `Join sync with document ${shortId}...?\n\nThis will replace your current data with the synced data.`;
    
    return new Promise((resolve) => {
      // Create a simple confirmation dialog
      const confirmed = confirm(message);
      resolve(confirmed);
    });
  }
  
  /**
   * Clear hash from URL
   */
  private static clearHash(): void {
    // Remove hash without triggering navigation
    const url = new URL(window.location.href);
    url.hash = '';
    window.history.replaceState({}, document.title, url.toString());
  }
}