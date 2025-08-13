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
          syncInterval: settings.syncInterval || 60
        };
        
        syncState.update(state => ({ 
          ...state, 
          docId: settings.docId,
          isEnabled: true 
        }));
        
        this.startAutoSync();
      }
    } catch (error) {
      console.error('Failed to initialize sync service:', error);
      setSyncError('Failed to initialize sync');
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

  async pushToCloud(dataToPush?: any): Promise<void> {
    if (!this.settings) {
      throw new Error('Sync not initialized');
    }
    
    try {
      setSyncStatus('syncing');
      
      const data = dataToPush || await calciumService.generateBackup();
      const jsonData = JSON.stringify(data);
      const encrypted = await CryptoUtils.encrypt(jsonData, this.settings.encryptionKey);
      
      const response = await fetch(`${this.workerUrl}/sync/${this.settings.docId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: this.settings.docId, encrypted })
      });
      
      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
      const result: CloudSyncResponse = await response.json();
      if (!result.success) throw new Error(result.error || 'Upload failed');
      
      setSyncStatus('synced');
    } catch (error) {
      console.error('Push to cloud failed:', error);
      setSyncError(`Sync failed: ${error.message}`);
      throw error;
    }
  }

  async pullFromCloud(): Promise<void> {
    if (!this.settings) {
      throw new Error('Sync not initialized');
    }
    
    try {
      setSyncStatus('syncing');
      
      const response = await fetch(`${this.workerUrl}/sync/${this.settings.docId}`);
      if (response.status === 404) {
        setSyncStatus('synced');
        return;
      }
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      
      const result: CloudSyncResponse = await response.json();
      if (!result.success || !result.encrypted) {
        throw new Error(result.error || 'Download failed');
      }
      
      const decrypted = await CryptoUtils.decrypt(result.encrypted, this.settings.encryptionKey);
      const remoteData = JSON.parse(decrypted);

      // Directly call the calciumService to handle the restore process.
      // This will update all data and Svelte stores reactively without a page reload.
      await calciumService.restoreFromBackup(remoteData);
      
      setSyncStatus('synced');
      
    } catch (error) {
      console.error('Pull from cloud failed:', error);
      setSyncError(`Sync failed: ${error.message}`);
      throw error;
    }
  }

  private async saveSettings(): Promise<void> {
    if (!this.settings) return;
    
    const keyString = await CryptoUtils.exportKey(this.settings.encryptionKey);
    this.encryptionKeyString = keyString;
    
    const storageData = {
      docId: this.settings.docId,
      encryptionKeyString: keyString,
      autoSync: this.settings.autoSync,
      syncInterval: this.settings.syncInterval
    };
    
    localStorage.setItem('calcium_sync_settings', JSON.stringify(storageData));
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