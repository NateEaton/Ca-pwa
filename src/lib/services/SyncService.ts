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

import { get } from 'svelte/store';
import { syncState, setSyncStatus, setSyncError } from '$lib/stores/sync';
import { showToast, calciumService } from '$lib/stores/calcium';
import { CryptoUtils } from '$lib/utils/cryptoUtils';
import { FEATURES } from '$lib/utils/featureFlags';
import type { SyncSettings, CloudSyncResponse } from '$lib/types/sync';

/**
 * Service for managing cross-device synchronization using Cloudflare Workers and KV storage.
 * Handles encryption/decryption, offline/online states, and automatic sync operations.
 */
export class SyncService {
  private static instance: SyncService | null = null;
  private settings: SyncSettings | null = null;
  private workerUrl = import.meta.env.VITE_WORKER_URL;
  private encryptionKeyString: string | null = null;
  private autoSyncInterval: number | null = null;
  private isAutoSyncEnabled = false;
  private isSyncPending = false;

  constructor() {
    setSyncStatus('offline');
  }

  /**
   * Gets the singleton instance of SyncService.
   * @returns The SyncService instance
   */
  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  /**
   * Checks if sync functionality is enabled via feature flag
   * @throws {Error} When sync is disabled
   */
  private checkSyncEnabled(): void {
    if (!FEATURES.SYNC_ENABLED) {
      throw new Error('Sync functionality is not enabled. Configure VITE_WORKER_URL to enable sync.');
    }
  }

  /**
   * Initializes the sync service, restores settings from localStorage,
   * and sets up online/offline event listeners.
   */
  async initialize(): Promise<void> {
    this.checkSyncEnabled();

    window.addEventListener('online', this.handleOnlineStatus.bind(this));
    window.addEventListener('offline', this.handleOfflineStatus.bind(this));

    // Check initial status
    if (!navigator.onLine) {
      setSyncStatus('offline');
    }

    try {
      const storedSettings = localStorage.getItem('calcium_sync_settings');
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);

        this.encryptionKeyString = settings.encryptionKeyString;
        const encryptionKey = await CryptoUtils.importKey(settings.encryptionKeyString);

        this.settings = {
          docId: settings.docId,
          encryptionKey,
          workerUrl: this.workerUrl,
          autoSync: settings.autoSync || false,
          syncInterval: settings.syncInterval || 60,
          syncGenerationId: settings.syncGenerationId || CryptoUtils.generateUUID()
        };

        // Successfully restored. Update state to synced.
        syncState.update(state => ({
          ...state,
          docId: settings.docId,
          isEnabled: true,
          status: 'synced' // Set to 'synced' on successful restore
        }));

        this.startAutoSync();
      } else {
        if (navigator.onLine) {
          setSyncStatus('offline');
        }
      }
    } catch (error) {
      console.error('Failed to initialize sync service:', error);
      setSyncError('Failed to initialize sync. Please check settings.');
      // Also remove potentially corrupt settings
      localStorage.removeItem('calcium_sync_settings');
    }
  }

  /**
   * Creates a new sync document with encryption keys and pushes current data to cloud.
   * @returns Promise resolving to the new document ID
   * @throws Error if sync creation fails
   */
  async createNewSyncDoc(): Promise<string> {
    this.checkSyncEnabled();
    
    try {
      setSyncStatus('syncing');

      const docId = CryptoUtils.generateDocId();
      const encryptionKey = await CryptoUtils.generateKey();
      const syncGenerationId = CryptoUtils.generateUUID();

      this.settings = {
        docId,
        encryptionKey,
        workerUrl: this.workerUrl,
        autoSync: false,
        syncInterval: 60,
        syncGenerationId
      };

      await this.saveSettings();

      const currentData = await calciumService.generateBackup();

      await this.pushToCloud(currentData);

      syncState.update(state => ({
        ...state,
        docId,
        isEnabled: true,
        status: 'synced' // Also good to update status here
      }));

      return docId;
    } catch (error) {
      console.error('Failed to create sync doc:', error);
      setSyncError(`Failed to create sync: ${error.message}`);
      throw error;
    }
  }

  /**
   * Pulls data from cloud storage and applies it locally if remote changes exist.
   * @returns Promise resolving to true if data was pulled and applied, false otherwise
   * @throws Error if sync is not configured or pull fails
   */
  async pullFromCloud(): Promise<boolean> {
    if (!this.settings) {
      throw new Error('Sync not configured');
    }

    if (!(await this.hasRemoteChanges())) {
      // Ensure status is correct if we skip
      if (get(syncState).status !== 'synced') setSyncStatus('synced');
      return false;
    }

    try {

      const response = await fetch(`${this.settings.workerUrl}/sync/${this.settings.docId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return false;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.encrypted) {
        throw new Error(result.error || 'No encrypted data received');
      }

      // Check if we need to update based on lastModified
      const currentLastSync = get(syncState).lastSync;
      const remoteLastModified = new Date(result.lastModified).getTime();

      if (currentLastSync && remoteLastModified <= new Date(currentLastSync).getTime()) {
        return false;
      }

      // Decrypt and apply data
      const decrypted = await CryptoUtils.decrypt(result.encrypted, this.settings.encryptionKey);
      const remoteData = JSON.parse(decrypted);

      const remoteGenerationId = remoteData.metadata?.syncGenerationId;

      if (remoteGenerationId && remoteGenerationId !== this.settings.syncGenerationId) {
        showToast("Sync source has been reset. Applying new data...", "info");

        await calciumService.clearApplicationData();

        this.settings.syncGenerationId = remoteGenerationId;
        await this.saveSettings();
      }

      await calciumService.applySyncData(remoteData);

      syncState.update(state => ({
        ...state,
        lastSync: result.lastModified,
      }));

      return true;

    } catch (error) {
      console.error('Pull from cloud failed:', error);
      throw error;
    }
  }

  /**
   * Pushes data to cloud storage with encryption.
   * @param dataToPush Optional data to push; if not provided, generates current backup
   * @throws Error if sync is not configured or push fails
   */
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


    } catch (error) {
      console.error('Push to cloud failed:', error);
      setSyncError(`Push failed: ${error.message}`);
      throw error;
    }
  }

  private async saveSettings(): Promise<void> {
    if (!this.settings) {
      return;
    }

    const keyString = await CryptoUtils.exportKey(this.settings.encryptionKey);
    this.encryptionKeyString = keyString;

    const storageData = {
      docId: this.settings.docId,
      encryptionKeyString: keyString,
      autoSync: this.settings.autoSync,
      syncInterval: this.settings.syncInterval,
      syncGenerationId: this.settings.syncGenerationId
    };

    localStorage.setItem('calcium_sync_settings', JSON.stringify(storageData));
  }

  // In src/lib/services/SyncService.ts

  /**
   * Joins an existing sync document using a sync URL.
   * @param syncUrl The sync URL containing document ID and encryption key
   * @throws Error if URL is invalid or join fails
   */
  async joinExistingSyncDoc(syncUrl: string): Promise<void> {
    this.checkSyncEnabled();
    
    try {
      setSyncStatus('syncing');

      const url = new URL(syncUrl);
      const params = new URLSearchParams(url.hash.substring(1));
      const docId = params.get('sync');
      const encodedKeyString = params.get('key');

      if (!docId || !encodedKeyString) throw new Error('Invalid sync URL format');

      const keyString = decodeURIComponent(encodedKeyString);
      const encryptionKey = await CryptoUtils.importKey(keyString);

      // Step 1: First, fetch the remote data to learn the correct generation ID
      const response = await fetch(`${this.workerUrl}/sync/${docId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.status === 404) {
      } else if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      let remoteData = null;
      let remoteGenerationId = null;

      if (response.status !== 404) {
        const result = await response.json();
        if (!result.success || !result.encrypted) throw new Error(result.error || 'No encrypted data received');

        const decrypted = await CryptoUtils.decrypt(result.encrypted, encryptionKey);
        remoteData = JSON.parse(decrypted);
        remoteGenerationId = remoteData.metadata?.syncGenerationId;

        if (!remoteGenerationId) throw new Error('Sync data is missing a generation ID.');
      }

      this.settings = {
        docId,
        encryptionKey,
        workerUrl: this.workerUrl,
        autoSync: false,
        syncInterval: 60,
        syncGenerationId: remoteGenerationId || CryptoUtils.generateUUID()
      };
      await this.saveSettings();

      if (remoteData) {
        await calciumService.applySyncData(remoteData);
      }

      syncState.update(state => ({
        ...state,
        docId,
        isEnabled: true,
        status: 'synced',
        lastSync: remoteData ? new Date().toISOString() : null
      }));

      this.startAutoSync();
      showToast("Successfully joined sync!", "success");

    } catch (error) {
      console.error('Failed to join sync doc:', error);
      setSyncError(`Failed to join sync: ${error instanceof Error ? error.message : 'Unknown error'}`);

      localStorage.removeItem('calcium_sync_settings');
      this.settings = null;
      syncState.update(state => ({ ...state, isEnabled: false, docId: null, status: 'error' }));
      throw error;
    }
  }

  /**
   * Performs a full bidirectional sync: pulls remote changes first,
   * then pushes local changes. This is the primary method for manual sync.
   */
  /**
   * Performs a complete bidirectional sync: pulls remote changes, then pushes local changes.
   * This is the primary method for manual sync operations.
   * @throws Error if sync is not configured or sync fails
   */
  async performBidirectionalSync(): Promise<void> {
    this.checkSyncEnabled();
    
    if (!navigator.onLine) {
      this.isSyncPending = true;
      setSyncStatus('offline');
      return;
    }

    if (!this.settings || !get(syncState).isEnabled) {
      return;
    }

    setSyncStatus('syncing');

    try {
      await this.pullFromCloud();

      await this.pushToCloud();

    } catch (error) {
      console.error('Bidirectional sync failed:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      showToast(`Sync failed: ${errorMessage}`, "error");
      setSyncError(`Sync failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Gets the current sync settings including document ID and encryption key.
   * @returns Sync settings object or null if not configured
   */
  getSettings(): { docId: string; encryptionKeyString: string; syncGenerationId: string; } | null {
    if (!this.settings || !this.encryptionKeyString) {
      return null;
    }

    return {
      docId: this.settings.docId,
      encryptionKeyString: this.encryptionKeyString,
      syncGenerationId: this.settings.syncGenerationId
    };
  }

  /**
   * Tests the connection to the sync worker.
   * @returns Promise resolving to true if connection is successful
   */
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

  /**
   * Starts automatic sync operations including periodic pulls and window focus events.
   */
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
  }

  /**
   * Stops all automatic sync operations and removes event listeners.
   */
  stopAutoSync(): void {
    if (!this.isAutoSyncEnabled) return;
    this.isAutoSyncEnabled = false;

    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }

    window.removeEventListener('focus', this.handleWindowFocus.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
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

  /**
   * Disconnects from sync by clearing settings and stopping auto-sync.
   */
  async disconnectSync(): Promise<void> {

    // Stop auto-sync
    this.stopAutoSync();

    // Clear sync settings
    this.settings = null;
    this.encryptionKeyString = null;

    // Remove from localStorage
    localStorage.removeItem('calcium_sync_settings');

    // Update sync state
    syncState.update(state => ({
      ...state,
      docId: null,
      isEnabled: false,
      status: 'offline',
      error: null,
      lastSync: null
    }));

  }

  /**
   * Triggers a push-only sync operation.
   */
  async triggerSync(): Promise<void> {
    if (!this.settings || !get(syncState).isEnabled) return;
    await this.pushToCloud().catch(err => console.warn('Triggered sync failed:', err));
  }

  /**
   * Regenerates the sync generation ID, effectively creating a new sync session.
   */
  async regenerateSyncId(): Promise<void> {
    if (!this.settings) return;
    const newId = CryptoUtils.generateUUID();
    this.settings.syncGenerationId = newId;
    await this.saveSettings();
  }

  private async handleOnlineStatus(): Promise<void> {
    if (this.isSyncPending) {
      showToast("Connection restored. Syncing changes...", "info");
      this.isSyncPending = false;
      await this.performBidirectionalSync();
    } else {
      if (get(syncState).isEnabled) {
        setSyncStatus('synced');
      }
    }
  }

  private handleOfflineStatus(): void {
    setSyncStatus('offline');
  }

  // In src/lib/services/SyncService.ts

  private async hasRemoteChanges(): Promise<boolean> {
    if (!this.settings) {
      return false;
    }

    try {
      const response = await fetch(`${this.settings.workerUrl}/sync/${this.settings.docId}`, {
        method: 'HEAD'
      });

      if (response.status === 404) {
        return false;
      }
      if (!response.ok) {
        return true;
      }

      const remoteLastModifiedHeader = response.headers.get('X-Last-Modified');
      const localTimestamp = get(syncState).lastSync;

      if (!remoteLastModifiedHeader) {
        return true;
      }

      const remoteTime = new Date(remoteLastModifiedHeader).getTime();
      const localTime = localTimestamp ? new Date(localTimestamp).getTime() : 0;

      return remoteTime > localTime;

    } catch (error) {
      console.error("HEAD request failed:", error);
      return true;
    }
  }

}