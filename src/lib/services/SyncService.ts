// src/lib/services/SyncService.ts

import { get } from 'svelte/store';
import { syncState, setSyncStatus, setSyncError } from '$lib/stores/sync';
import { showToast, calciumService } from '$lib/stores/calcium';
import { CryptoUtils } from '$lib/utils/cryptoUtils';
import type { SyncSettings, CloudSyncResponse } from '$lib/types/sync';

export class SyncService {
  private static instance: SyncService | null = null;
  private settings: SyncSettings | null = null;
  private workerUrl = 'https://calcium-sync-worker.calcium-sync.workers.dev';
  private encryptionKeyString: string | null = null;
  private autoSyncInterval: number | null = null;
  private isAutoSyncEnabled = false;

  constructor() {
    setSyncStatus('offline');
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  async initialize(): Promise<void> {
      // The store already defaults to 'initializing', so no need to set it here.
      console.log('Initializing sync service...');

      try {
          const storedSettings = localStorage.getItem('calcium_sync_settings');
          if (storedSettings) {
              console.log('Found stored sync settings. Restoring connection...');
              const settings = JSON.parse(storedSettings);
              
              this.encryptionKeyString = settings.encryptionKeyString;
              const encryptionKey = await CryptoUtils.importKey(settings.encryptionKeyString);
              
              this.settings = {
                  docId: settings.docId,
                  encryptionKey,
                  workerUrl: this.workerUrl,
                  autoSync: settings.autoSync || false,
                  syncInterval: settings.syncInterval || 60
              };

              // Successfully restored. Update state to synced.
              syncState.update(state => ({ 
                  ...state, 
                  docId: settings.docId,
                  isEnabled: true,
                  status: 'synced' // Set to 'synced' on successful restore
              }));
              
              this.startAutoSync();
              console.log('Sync service restored and connection is active.');
          } else {
              // No settings found, so we are offline.
              console.log('No stored sync settings found. Status is offline.');
              setSyncStatus('offline');
          }
      } catch (error) {
          console.error('Failed to initialize sync service:', error);
          setSyncError('Failed to initialize sync. Please check settings.');
          // Also remove potentially corrupt settings
          localStorage.removeItem('calcium_sync_settings');
      }
  }

  async createNewSyncDoc(): Promise<string> {
    try {
      setSyncStatus('syncing');

      const docId = CryptoUtils.generateDocId();
      const encryptionKey = await CryptoUtils.generateKey();

      this.settings = {
        docId,
        encryptionKey,
        workerUrl: this.workerUrl,
        autoSync: false,
        syncInterval: 60
      };

      const currentData = await calciumService.generateBackup();

      await this.saveSettings();
      await this.pushToCloud(currentData);

      syncState.update(state => ({
        ...state,
        docId,
        isEnabled: true
      }));

      return docId;
    } catch (error) {
      console.error('Failed to create sync doc:', error);
      setSyncError(`Failed to create sync: ${error.message}`);
      throw error;
    }
  }

  async pullFromCloud(): Promise<boolean> {
    if (!this.settings) {
      throw new Error('Sync not configured');
    }

    try {
      // The setSyncStatus is now handled by the calling function (performBidirectionalSync)
      // setSyncStatus('syncing'); // This can be removed to avoid redundant state changes

      const response = await fetch(`${this.settings.workerUrl}/sync/${this.settings.docId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // This is not an error. It just means this is a new sync doc with no remote data yet.
        console.log('No remote sync data found (404), which is normal for a new sync.');
        // Don't set status to synced here, let the calling function do it.
        return false; // No remote changes were pulled.
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json(); // Define `result` from the network response.

      if (!result.success || !result.encrypted) {
        throw new Error(result.error || 'No encrypted data received');
      }

      // Check if we need to update based on lastModified
      const currentLastSync = get(syncState).lastSync;
      const remoteLastModified = new Date(result.lastModified).getTime();

      if (currentLastSync && remoteLastModified <= new Date(currentLastSync).getTime()) {
        console.log('Local data is already up to date.');
        return false; // No changes needed
      }

      // Decrypt and apply data
      const decrypted = await CryptoUtils.decrypt(result.encrypted, this.settings.encryptionKey);
      const remoteData = JSON.parse(decrypted);
      
      await calciumService.applySyncData(remoteData);

      // IMPORTANT: Update the lastSync time in the store
      syncState.update(state => ({
        ...state,
        lastSync: result.lastModified,
      }));

      console.log('Successfully pulled and applied remote data');
      return true; // Had remote changes

    } catch (error) {
      console.error('Pull from cloud failed:', error);
      // Let the calling function handle the final error state
      throw error;
    }
  }

  async pushToCloud(dataToPush?: any): Promise<void> {
    if (!this.settings) {
      throw new Error('Sync not configured');
    }

    try {
      setSyncStatus('syncing');

      // Get current data if not provided
      const dataToSync = dataToPush || await calciumService.generateBackup();

      // Encrypt the data
      const encrypted = await CryptoUtils.encrypt(JSON.stringify(dataToSync), this.settings.encryptionKey);

      const response = await fetch(`${this.settings.workerUrl}/sync/${this.settings.docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encrypted }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Push failed');
      }

      // Update sync state
      syncState.update(state => ({
        ...state,
        lastSync: result.lastModified,
        status: 'synced'
      }));

      console.log('Successfully pushed data to cloud');

    } catch (error) {
      console.error('Push to cloud failed:', error);
      setSyncError(`Push failed: ${error.message}`);
      throw error;
    }
  }

  // Add a convenience method for full bidirectional sync
  async performBidirectionalSync(): Promise<void> {
    if (!this.settings || !get(syncState).isEnabled) {
      throw new Error('Sync not configured');
    }

    try {
      // First pull latest changes
      const hadRemoteChanges = await this.pullFromCloud();

      // Then push our current state
      await this.pushToCloud();

      return hadRemoteChanges;
    } catch (error) {
      console.error('Bidirectional sync failed:', error);
      throw error;
    }
  }

  private async saveSettings(): Promise<void> {
    if (!this.settings) {
      console.log('No settings to save');
      return;
    }
    
    const keyString = await CryptoUtils.exportKey(this.settings.encryptionKey);
    this.encryptionKeyString = keyString;
    
    const storageData = {
      docId: this.settings.docId,
      encryptionKeyString: keyString,
      autoSync: this.settings.autoSync,
      syncInterval: this.settings.syncInterval
    };
    
    console.log('Saving sync settings:', { docId: storageData.docId.substring(0, 8) + '...' });
    localStorage.setItem('calcium_sync_settings', JSON.stringify(storageData));
    
    // Immediately verify it was saved
    const verification = localStorage.getItem('calcium_sync_settings');
    console.log('Verification - settings in localStorage:', verification ? 'FOUND' : 'NOT FOUND');
    console.log('Current domain/path:', window.location.origin + window.location.pathname);
  }

  async joinExistingSyncDoc(syncUrl: string): Promise<void> {
    try {
      setSyncStatus('syncing');

      const url = new URL(syncUrl);
      const params = new URLSearchParams(url.hash.substring(1));
      const docId = params.get('sync');
      const encodedKeyString = params.get('key');

      if (!docId || !encodedKeyString) throw new Error('Invalid sync URL format');

      const keyString = decodeURIComponent(encodedKeyString);
      const encryptionKey = await CryptoUtils.importKey(keyString);

      this.settings = {
        docId,
        encryptionKey,
        workerUrl: this.workerUrl,
        autoSync: false,
        syncInterval: 60
      };

      // Save settings to localStorage first.
      await this.saveSettings();

      // Immediately update the syncState store. This is what makes the UI update.
      syncState.update(state => ({ ...state, docId, isEnabled: true }));

      // Now pull the data. This will call calciumService.restoreFromBackup,
      // which handles the data update and subsequent UI reactions.
      await this.pullFromCloud();

    } catch (error) {
      console.error('Failed to join sync doc:', error);
      setSyncError(`Failed to join sync: ${error.message}`);
      localStorage.removeItem('calcium_sync_settings');
      syncState.update(state => ({ ...state, isEnabled: false, docId: null }));
      throw error;
    }
  }

  /**
   * Performs a full bidirectional sync: pulls remote changes first,
   * then pushes local changes. This is the primary method for manual sync.
   */
  async performBidirectionalSync(): Promise<void> {
    if (!this.settings || !get(syncState).isEnabled) {
      console.warn("Bidirectional sync called but sync is not configured.");
      return;
    }

    setSyncStatus('syncing');

    try {
      // Step 1: Pull latest data from the cloud.
      // Our existing pullFromCloud method is smart enough to check timestamps
      // and will apply the data non-destructively using applySyncData.
      console.log("Sync Step 1: Pulling remote changes...");
      const hadRemoteChanges = await this.pullFromCloud();

      if (hadRemoteChanges) {
        showToast("Downloaded latest data", "info");
        // Give the user a moment to see the toast before the next step
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        console.log("No new remote changes to apply.");
      }

      // Step 2: Push our current (and now updated) local data to the cloud.
      console.log("Sync Step 2: Pushing local state...");
      await this.pushToCloud();

      // If both steps succeed, we show a final success message.
      // The status is already set to 'synced' inside pushToCloud.
      showToast("Sync completed", "success");
      console.log("Bidirectional sync completed successfully.");

    } catch (error) {
      // If either the pull or push fails, the entire operation fails.
      console.error('Bidirectional sync failed:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      showToast(`Sync failed: ${errorMessage}`, "error");
      setSyncError(`Sync failed: ${errorMessage}`);
      // We throw the error so the caller knows the operation failed.
      throw error;
    }
  }  

  getSettings(): { docId: string; encryptionKeyString: string } | null {
    if (!this.settings || !this.encryptionKeyString) {
      return null;
    }

    return {
      docId: this.settings.docId,
      encryptionKeyString: this.encryptionKeyString
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      setSyncStatus('syncing');
      const response = await fetch(`${this.workerUrl}/ping`);
      const result = await response.json();
      if (result.success) {
        setSyncStatus('synced');
        return true;
      } else {
        setSyncError('Worker connection failed');
        return false;
      }
    } catch (error) {
      setSyncError(`Connection test failed: ${error.message}`);
      return false;
    }
  }

  startAutoSync(): void {
    if (!this.settings || this.isAutoSyncEnabled) return;
    this.isAutoSyncEnabled = true;

    this.autoSyncInterval = window.setInterval(async () => {
      if (this.settings && get(syncState).isEnabled) {
        await this.pullFromCloud().catch(err => console.warn('Auto-sync pull failed:', err));
      }
    }, 60000);

    window.addEventListener('focus', this.handleWindowFocus.bind(this));
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    console.log('Auto-sync started');
  }

  stopAutoSync(): void {
    if (!this.isAutoSyncEnabled) return;
    this.isAutoSyncEnabled = false;

    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }

    window.removeEventListener('focus', this.handleWindowFocus.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    console.log('Auto-sync stopped');
  }

  private async handleWindowFocus(): Promise<void> {
    if (this.settings && get(syncState).isEnabled) {
      await this.pullFromCloud().catch(err => console.warn('Focus sync failed:', err));
    }
  }

  private async handleVisibilityChange(): Promise<void> {
    if (!document.hidden && this.settings && get(syncState).isEnabled) {
      await this.pullFromCloud().catch(err => console.warn('Visibility sync failed:', err));
    }
  }

  async triggerSync(): Promise<void> {
    if (!this.settings || !get(syncState).isEnabled) return;
    await this.pushToCloud().catch(err => console.warn('Triggered sync failed:', err));
  }
}