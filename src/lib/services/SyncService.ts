// src/lib/services/SyncService.ts

import { get } from 'svelte/store';
import * as Automerge from '@automerge/automerge';
import { syncState, setSyncStatus, setSyncError } from '$lib/stores/sync';
import { showToast } from '$lib/stores/calcium';
import { CryptoUtils } from '$lib/utils/cryptoUtils';
import type { SyncSettings, SyncDoc, CloudSyncResponse } from '$lib/types/sync';
import type { CalciumState } from '$lib/types/calcium';

export class SyncService {
  private static instance: SyncService | null = null;
  private settings: SyncSettings | null = null;
  private automergeDoc: Automerge.Doc<SyncDoc> | null = null;
  private workerUrl = 'https://calcium-sync-worker.calcium-sync.workers.dev';
  private encryptionKeyString: string | null = null; // Track key string for modal

  constructor() {
    setSyncStatus('offline');
  }

  /**
   * Get singleton instance
   */
  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Check if sync is already configured
      const storedSettings = localStorage.getItem('calcium_sync_settings');
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        
        // Store the key string for modal access
        this.encryptionKeyString = settings.encryptionKeyString;
        
        // Restore encryption key
        const encryptionKey = await CryptoUtils.importKey(settings.encryptionKeyString);
        
        this.settings = {
          docId: settings.docId,
          encryptionKey: encryptionKey,
          workerUrl: this.workerUrl,
          autoSync: settings.autoSync || false,
          syncInterval: settings.syncInterval || 60
        };
        
        syncState.update(state => ({ 
          ...state, 
          docId: settings.docId,
          isEnabled: true 
        }));
        
        // Try to pull latest data
        await this.pullFromCloud();
      }
    } catch (error) {
      console.error('Failed to initialize sync service:', error);
      setSyncError('Failed to initialize sync');
    }
  }

  /**
   * Create new sync document and encryption key
   */
  async createNewSyncDoc(): Promise<string> {
    try {
      setSyncStatus('syncing');
      
      // Generate new document ID and encryption key
      const docId = CryptoUtils.generateDocId();
      const encryptionKey = await CryptoUtils.generateKey();
      
      this.settings = {
        docId,
        encryptionKey,
        workerUrl: this.workerUrl,
        autoSync: false,
        syncInterval: 60
      };
      
      // Create initial Automerge document from current IndexedDB data
      const currentData = await this.getCurrentCalciumData();
      this.automergeDoc = Automerge.from<SyncDoc>({
        journalEntries: currentData.journalEntries,
        customFoods: currentData.customFoods,
        favorites: Array.from(currentData.favorites),
        servingPreferences: Array.from(currentData.servingPreferences.values()),
        settings: currentData.settings,
        metadata: {
          lastModified: new Date().toISOString(),
          deviceId: CryptoUtils.generateDeviceId(),
          version: '1.0.0'
        }
      });
      
      // Save settings to localStorage
      await this.saveSettings();
      
      // Push initial data to cloud
      await this.pushToCloud();
      
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

  /**
   * Push local data to cloud
   */
  async pushToCloud(): Promise<void> {
    if (!this.settings || !this.automergeDoc) {
      throw new Error('Sync not initialized');
    }
    
    try {
      setSyncStatus('syncing');
      
      // Get current data and update Automerge doc
      const currentData = await this.getCurrentCalciumData();
      
      this.automergeDoc = Automerge.change(this.automergeDoc, doc => {
        doc.journalEntries = currentData.journalEntries;
        doc.customFoods = currentData.customFoods;
        doc.favorites = Array.from(currentData.favorites);
        doc.servingPreferences = Array.from(currentData.servingPreferences.values());
        doc.settings = currentData.settings;
        doc.metadata.lastModified = new Date().toISOString();
      });
      
      // Use JSON serialization instead of binary for JS-only approach
      const jsonData = JSON.stringify(this.automergeDoc);
      const encrypted = await CryptoUtils.encrypt(jsonData, this.settings.encryptionKey);
      
      // Upload to worker
      const response = await fetch(`${this.workerUrl}/sync/${this.settings.docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId: this.settings.docId,
          encrypted
        })
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
      
      const result: CloudSyncResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      setSyncStatus('synced');
      
    } catch (error) {
      console.error('Push to cloud failed:', error);
      setSyncError(`Sync failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Pull data from cloud and merge with local
   */
  async pullFromCloud(): Promise<void> {
    if (!this.settings) {
      throw new Error('Sync not initialized');
    }
    
    try {
      setSyncStatus('syncing');
      
      // Download from worker
      const response = await fetch(`${this.workerUrl}/sync/${this.settings.docId}`);
      
      if (response.status === 404) {
        // No remote data yet, that's okay
        setSyncStatus('synced');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      const result: CloudSyncResponse = await response.json();
      
      if (!result.success || !result.encrypted) {
        throw new Error(result.error || 'Download failed');
      }
      
      // Decrypt and parse as JSON
      const decrypted = await CryptoUtils.decrypt(result.encrypted, this.settings.encryptionKey);
      const remoteDoc = JSON.parse(decrypted) as Automerge.Doc<SyncDoc>;
      
      // For Phase 2, simple replacement instead of complex merging
      if (remoteDoc) {
        this.automergeDoc = remoteDoc;
        
        // TODO: Apply merged data back to IndexedDB
        // For Phase 2, we'll just log it
        console.log('Merged data:', this.automergeDoc);
      }
      
      setSyncStatus('synced');
      
    } catch (error) {
      console.error('Pull from cloud failed:', error);
      setSyncError(`Sync failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get current calcium data from IndexedDB via CalciumService
   */
  private async getCurrentCalciumData(): Promise<any> {
    // This is a simplified version - we'll enhance this to read from IndexedDB directly
    // For now, create a mock structure based on backup format
    return {
      journalEntries: {}, // TODO: Read from IndexedDB
      customFoods: [], // TODO: Read from IndexedDB  
      favorites: new Set<number>(),
      servingPreferences: new Map(),
      settings: {
        dailyGoal: 1000,
        sortBy: 'time',
        sortOrder: 'desc',
        theme: 'auto'
      }
    };
  }

  /**
   * Save sync settings to localStorage
   */
  private async saveSettings(): Promise<void> {
    if (!this.settings) return;
    
    let keyString: string;
    if (typeof this.settings.encryptionKey === 'string') {
      // Fallback mode - key is already a string
      keyString = this.settings.encryptionKey;
    } else {
      // WebCrypto mode - export the key
      keyString = await CryptoUtils.exportKey(this.settings.encryptionKey);
    }
    
    // Store key string for modal access
    this.encryptionKeyString = keyString;
    
    const storageData = {
      docId: this.settings.docId,
      encryptionKeyString: keyString,
      autoSync: this.settings.autoSync,
      syncInterval: this.settings.syncInterval
    };
    
    localStorage.setItem('calcium_sync_settings', JSON.stringify(storageData));
  }

  /**
   * Join existing sync document from URL
   */
  async joinExistingSyncDoc(syncUrl: string): Promise<void> {
    try {
      setSyncStatus('syncing');
      
      // Parse sync URL
      const url = new URL(syncUrl);
      const hash = url.hash.substring(1); // Remove #
      const params = new URLSearchParams(hash);
      
      const docId = params.get('sync');
      const encodedKeyString = params.get('key');
      
      if (!docId || !encodedKeyString) {
        throw new Error('Invalid sync URL format');
      }
      
      // URL decode the key
      const keyString = decodeURIComponent(encodedKeyString);
      console.log('Decoded key string length:', keyString.length);
      
      // Store key string for modal access
      this.encryptionKeyString = keyString;
      
      // Import encryption key
      const encryptionKey = await CryptoUtils.importKey(keyString);
      
      this.settings = {
        docId,
        encryptionKey,
        workerUrl: this.workerUrl,
        autoSync: false,
        syncInterval: 60
      };
      
      // Save settings
      await this.saveSettings();
      
      // Pull data from cloud
      await this.pullFromCloud();
      
      syncState.update(state => ({
        ...state,
        docId,
        isEnabled: true
      }));
      
    } catch (error) {
      console.error('Failed to join sync doc:', error);
      setSyncError(`Failed to join sync: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get current sync settings (for modal display)
   */
  getSettings(): { docId: string; encryptionKeyString: string } | null {
    if (!this.settings || !this.encryptionKeyString) {
      console.log('Settings check:', { 
        hasSettings: !!this.settings, 
        hasKeyString: !!this.encryptionKeyString,
        docId: this.settings?.docId 
      });
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
}