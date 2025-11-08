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
import { isOnline } from '$lib/stores/networkStatus';
import { showToast, calciumService, calciumState } from '$lib/stores/calcium';
import { CryptoUtils } from '$lib/utils/cryptoUtils';
import { FEATURES } from '$lib/utils/featureFlags';
import type { SyncSettings, CloudSyncResponse, MetadataDocument, PersistentDocument, MonthDocument } from '$lib/types/sync';
import { getDocumentId, getMonthKey } from '$lib/types/sync';

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
    // Don't immediately set offline status - let initialize() handle it
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
   * and subscribes to centralized network status.
   */
  async initialize(): Promise<void> {
    console.log('[SYNC INIT] Initializing SyncService...');
    this.checkSyncEnabled();

    // Subscribe to centralized network status
    isOnline.subscribe(online => {
      if (online) {
        this.handleOnlineStatus();
      } else {
        this.handleOfflineStatus();
      }
    });

    try {
      const storedSettings = localStorage.getItem('calcium_sync_settings');
      if (storedSettings) {
        console.log('[SYNC INIT] Found stored sync settings, restoring...');
        const settings = JSON.parse(storedSettings);
        console.log('[SYNC INIT] DocId:', settings.docId);
        console.log('[SYNC INIT] SyncGenerationId:', settings.syncGenerationId || '(none - will generate)');

        this.encryptionKeyString = settings.encryptionKeyString;
        const encryptionKey = await CryptoUtils.importKey(settings.encryptionKeyString);
        console.log('[SYNC INIT] Encryption key imported successfully');

        this.settings = {
          docId: settings.docId,
          encryptionKey,
          workerUrl: this.workerUrl,
          autoSync: settings.autoSync || false,
          syncInterval: settings.syncInterval || 60,
          syncGenerationId: settings.syncGenerationId || CryptoUtils.generateUUID(),
          // Initialize documentState for multi-document sync
          documentState: settings.documentState || {
            metadata: { lastModified: null },
            persistent: { lastModified: null },
            months: {}
          }
        };

        console.log('[SYNC INIT] DocumentState:', {
          hasMetadata: !!this.settings.documentState?.metadata,
          hasPersistent: !!this.settings.documentState?.persistent,
          monthsTracked: Object.keys(this.settings.documentState?.months || {}).length
        });

        // Successfully restored. Update state to synced.
        syncState.update(state => ({
          ...state,
          docId: settings.docId,
          isEnabled: true,
          status: 'synced' // Set to 'synced' on successful restore
        }));

        console.log('[SYNC INIT] Starting auto-sync...');
        this.startAutoSync();
        console.log('[SYNC INIT] ✅ Initialization complete');
      } else {
        console.log('[SYNC INIT] No stored settings found');
        if (navigator.onLine) {
          setSyncStatus('offline');
        }
      }
    } catch (error) {
      console.error('[SYNC INIT] ❌ Failed to initialize sync service:', error);
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
    console.log('[CREATE SYNC] Creating new sync document...');
    this.checkSyncEnabled();

    try {
      setSyncStatus('syncing');

      console.log('[CREATE SYNC] Generating DocId and encryption key...');
      const docId = CryptoUtils.generateDocId();
      const encryptionKey = await CryptoUtils.generateKey();
      const syncGenerationId = CryptoUtils.generateUUID();

      console.log('[CREATE SYNC] DocId:', docId);
      console.log('[CREATE SYNC] SyncGenerationId:', syncGenerationId);

      this.settings = {
        docId,
        encryptionKey,
        workerUrl: this.workerUrl,
        autoSync: false,
        syncInterval: 60,
        syncGenerationId,
        documentState: {
          metadata: { lastModified: null },
          persistent: { lastModified: null },
          months: {}
        }
      };

      console.log('[CREATE SYNC] Saving settings to localStorage...');
      await this.saveSettings();

      console.log('[CREATE SYNC] Generating backup of current data...');
      const currentData = await calciumService.generateBackup();

      console.log('[CREATE SYNC] Pushing initial data to cloud...');
      await this.pushToCloud(currentData);

      syncState.update(state => ({
        ...state,
        docId,
        isEnabled: true,
        status: 'synced'
      }));

      console.log('[CREATE SYNC] ✅ Sync document created successfully');
      return docId;
    } catch (error) {
      console.error('[CREATE SYNC] ❌ Failed to create sync doc:', error);
      setSyncError(`Failed to create sync: ${error.message}`);
      throw error;
    }
  }

  /**
   * Pulls data from cloud storage and applies it locally using multi-document sync.
   * @returns Promise resolving to true if data was pulled and applied, false otherwise
   * @throws Error if sync is not configured or pull fails
   */
  async pullFromCloud(): Promise<boolean> {
    if (!this.settings) {
      throw new Error('Sync not configured');
    }

    try {
      console.log('[SYNC PULL] Starting multi-document pull from cloud');
      setSyncStatus('syncing');
      let hasUpdates = false;
      let forcePullAll = false; // Track if we need to force pull all documents

      // Pull metadata first to know what months exist
      const metadataDocId = getDocumentId(this.settings.docId, 'metadata');
      let availableMonths: string[] = [];
      let metadataDoc: MetadataDocument | null = null;

      console.log('[SYNC PULL] Checking metadata document:', metadataDocId);
      if (await this.needsPull(metadataDocId, this.settings.documentState?.metadata.lastModified || null)) {
        console.log('[SYNC PULL] Metadata needs update, pulling...');
        const metadataResult = await this.pullDocument(metadataDocId);
        if (metadataResult) {
          metadataDoc = metadataResult.data;
          availableMonths = metadataDoc.availableMonths || [];
          this.settings.documentState!.metadata.lastModified = metadataResult.lastModified;
          hasUpdates = true;
          console.log('[SYNC PULL] Metadata updated. Available months:', availableMonths);

          // Check for sync generation ID change
          if (metadataDoc.syncGenerationId && metadataDoc.syncGenerationId !== this.settings.syncGenerationId) {
            console.warn('[SYNC PULL] ⚠️ SYNC GENERATION ID CHANGED!');
            console.warn('[SYNC PULL]   Remote:', metadataDoc.syncGenerationId);
            console.warn('[SYNC PULL]   Local:', this.settings.syncGenerationId);
            console.log('[SYNC PULL] Clearing ALL local data and forcing FULL pull of all documents');
            await calciumService.clearApplicationData();
            this.settings.syncGenerationId = metadataDoc.syncGenerationId;
            forcePullAll = true; // Force pull all documents since we cleared all local data
          }
        }
      } else {
        console.log('[SYNC PULL] Metadata up to date, using locally known months');
        // Use locally known months if metadata hasn't changed
        availableMonths = Object.keys(this.settings.documentState?.months || {});
      }

      // Pull persistent document if changed (or if forced)
      const persistentDocId = getDocumentId(this.settings.docId, 'persistent');
      let persistentData: PersistentDocument | null = null;

      console.log('[SYNC PULL] Checking persistent document:', persistentDocId);
      if (forcePullAll || await this.needsPull(persistentDocId, this.settings.documentState?.persistent.lastModified || null)) {
        if (forcePullAll) {
          console.log('[SYNC PULL] Persistent FORCED pull (generation ID changed)...');
        } else {
          console.log('[SYNC PULL] Persistent needs update, pulling...');
        }
        const persistentResult = await this.pullDocument(persistentDocId);
        if (persistentResult) {
          persistentData = persistentResult.data;
          this.settings.documentState!.persistent.lastModified = persistentResult.lastModified;
          hasUpdates = true;
          console.log('[SYNC PULL] Persistent updated. Custom foods:', persistentData.customFoods?.length, 'Favorites:', persistentData.favorites?.length);
        }
      } else {
        console.log('[SYNC PULL] Persistent up to date');
      }

      // Pull month documents that have changed (or if forced)
      const monthData = new Map<string, MonthDocument>();
      console.log('[SYNC PULL] Checking', availableMonths.length, 'month documents');
      if (forcePullAll) {
        console.log('[SYNC PULL] ⚠️ FORCING pull of ALL months (generation ID changed - all local data was cleared)');
      }

      for (const monthKey of availableMonths) {
        const monthDocId = getDocumentId(this.settings.docId, 'month', monthKey);
        const localLastModified = this.settings.documentState?.months[monthKey]?.lastModified || null;

        if (forcePullAll || await this.needsPull(monthDocId, localLastModified)) {
          if (forcePullAll) {
            console.log('[SYNC PULL] Month', monthKey, 'FORCED pull (generation ID changed)...');
          } else {
            console.log('[SYNC PULL] Month', monthKey, 'needs update, pulling...');
          }
          const monthResult = await this.pullDocument(monthDocId);
          if (monthResult) {
            monthData.set(monthKey, monthResult.data);

            if (!this.settings.documentState!.months[monthKey]) {
              this.settings.documentState!.months[monthKey] = { lastModified: null };
            }
            this.settings.documentState!.months[monthKey].lastModified = monthResult.lastModified;
            hasUpdates = true;

            const entryCount = Object.keys(monthResult.data.journalEntries || {}).length;
            console.log('[SYNC PULL] Month', monthKey, 'updated. Days with entries:', entryCount);
          }
        } else {
          console.log('[SYNC PULL] Month', monthKey, 'up to date');
        }
      }

      // If we have updates, apply them selectively without clearing existing data
      if (hasUpdates) {
        console.log('[SYNC PULL] Has updates, applying changes selectively...');

        // Apply persistent data if it was pulled
        if (persistentData) {
          await this.applyPersistentData(persistentData);
        }

        // Apply journal entries from changed months only
        if (monthData.size > 0) {
          console.log('[SYNC PULL] Applying journal entries from', monthData.size, 'changed months');
          let totalDaysApplied = 0;

          for (const [monthKey, monthDoc] of monthData.entries()) {
            const daysInMonth = Object.keys(monthDoc.journalEntries).length;
            console.log('[SYNC PULL] Applying month', monthKey, '-', daysInMonth, 'days');

            for (const [dateString, entries] of Object.entries(monthDoc.journalEntries)) {
              try {
                await calciumService.saveFoodsForDate(dateString, entries as any[]);
              } catch (error) {
                console.warn('[SYNC PULL] Failed to apply entries for', dateString, error);
              }
            }

            totalDaysApplied += daysInMonth;
          }

          console.log('[SYNC PULL] ✅ Applied', totalDaysApplied, 'days of journal entries from', monthData.size, 'months');

          // Reload the UI state to reflect the changes
          console.log('[SYNC PULL] Reloading journal data into UI state...');
          await calciumService.loadDailyFoods();
          console.log('[SYNC PULL] UI state reloaded');
        }

        console.log('[SYNC PULL] ✅ Selective merge completed - existing data preserved');
      } else {
        console.log('[SYNC PULL] No updates found, skipping apply');
      }

      await this.saveSettings();
      setSyncStatus('synced');

      syncState.update(state => ({
        ...state,
        lastSync: new Date().toISOString()
      }));

      console.log('[SYNC PULL] Pull completed successfully. Updates applied:', hasUpdates);
      return hasUpdates;

    } catch (error) {
      console.error('[SYNC PULL] Pull from cloud failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSyncError(`Pull failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Pushes data to cloud storage with encryption using multi-document sync.
   * @param dataToPush Optional data to push; if not provided, generates current backup
   * @throws Error if sync is not configured or push fails
   */
  async pushToCloud(dataToPush?: any): Promise<void> {
    if (!this.settings) {
      throw new Error('Sync not configured');
    }

    try {
      console.log('[SYNC PUSH] Starting multi-document push to cloud');
      setSyncStatus('syncing');

      // Get full backup using existing CalciumService method
      const fullBackup = dataToPush || await calciumService.generateBackup();
      console.log('[SYNC PUSH] Generated full backup');

      // Partition into documents for cloud storage
      const metadata = this.createMetadataDocument(fullBackup);
      const persistent = this.createPersistentDocument(fullBackup);
      const monthDocs = this.createMonthDocuments(fullBackup);

      console.log('[SYNC PUSH] Partitioned into', monthDocs.size, 'month documents');
      console.log('[SYNC PUSH] Metadata:', metadata.availableMonths.length, 'months available');
      console.log('[SYNC PUSH] Persistent: Custom foods:', persistent.customFoods?.length, 'Favorites:', persistent.favorites?.length);

      // Push metadata document
      const metadataDocId = getDocumentId(this.settings.docId, 'metadata');
      console.log('[SYNC PUSH] Pushing metadata document:', metadataDocId);
      const metadataTime = await this.pushDocument(metadataDocId, metadata);
      this.settings.documentState!.metadata.lastModified = metadataTime;

      // Push persistent document
      const persistentDocId = getDocumentId(this.settings.docId, 'persistent');
      console.log('[SYNC PUSH] Pushing persistent document:', persistentDocId);
      const persistentTime = await this.pushDocument(persistentDocId, persistent);
      this.settings.documentState!.persistent.lastModified = persistentTime;

      // Push all month documents
      console.log('[SYNC PUSH] Pushing', monthDocs.size, 'month documents...');
      for (const [monthKey, monthDoc] of monthDocs.entries()) {
        const monthDocId = getDocumentId(this.settings.docId, 'month', monthKey);
        const daysInMonth = Object.keys(monthDoc.journalEntries).length;
        console.log('[SYNC PUSH] Pushing month', monthKey, '(' + daysInMonth, 'days):', monthDocId);
        const monthTime = await this.pushDocument(monthDocId, monthDoc);

        if (!this.settings.documentState!.months[monthKey]) {
          this.settings.documentState!.months[monthKey] = { lastModified: null };
        }
        this.settings.documentState!.months[monthKey].lastModified = monthTime;
      }

      await this.saveSettings();
      setSyncStatus('synced');

      syncState.update(state => ({
        ...state,
        lastSync: new Date().toISOString()
      }));

      console.log('[SYNC PUSH] Push completed successfully. Total documents pushed:', 2 + monthDocs.size);

    } catch (error) {
      console.error('[SYNC PUSH] Push to cloud failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSyncError(`Push failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Sync only persistent data (when preferences or custom foods change)
   * This is more efficient than full sync for settings/food changes
   */
  async syncPersistentData(): Promise<void> {
    if (!this.settings || !get(syncState).isEnabled) return;

    try {
      console.log('[SYNC SMART] Starting persistent data sync');
      setSyncStatus('syncing');

      // Pull persistent and metadata to check for remote changes
      const metadataDocId = getDocumentId(this.settings.docId, 'metadata');
      const persistentDocId = getDocumentId(this.settings.docId, 'persistent');

      let hasRemoteUpdates = false;

      // Check and pull metadata if changed
      if (await this.needsPull(metadataDocId, this.settings.documentState?.metadata.lastModified || null)) {
        console.log('[SYNC SMART] Remote metadata has updates, pulling...');
        const metadataResult = await this.pullDocument(metadataDocId);
        if (metadataResult) {
          this.settings.documentState!.metadata.lastModified = metadataResult.lastModified;
          hasRemoteUpdates = true;
        }
      }

      // Check and pull persistent if changed
      if (await this.needsPull(persistentDocId, this.settings.documentState?.persistent.lastModified || null)) {
        console.log('[SYNC SMART] Remote persistent has updates, pulling...');
        const persistentResult = await this.pullDocument(persistentDocId);
        if (persistentResult) {
          const persistentData = persistentResult.data;
          this.settings.documentState!.persistent.lastModified = persistentResult.lastModified;

          // Apply persistent data changes
          const currentState = get(calciumState);
          if (persistentData.preferences) {
            calciumState.update(state => ({ ...state, settings: persistentData.preferences }));
          }
          if (persistentData.customFoods) {
            calciumState.update(state => ({ ...state, customFoods: persistentData.customFoods }));
          }
          if (persistentData.favorites) {
            calciumState.update(state => ({ ...state, favorites: persistentData.favorites }));
          }
          if (persistentData.hiddenFoods) {
            calciumState.update(state => ({ ...state, hiddenFoods: persistentData.hiddenFoods }));
          }
          if (persistentData.servingPreferences) {
            calciumState.update(state => ({ ...state, servingPreferences: persistentData.servingPreferences }));
          }

          hasRemoteUpdates = true;
          console.log('[SYNC SMART] Applied remote persistent data changes');
        }
      }

      // Now push our local changes
      const fullBackup = await calciumService.generateBackup();

      // Update metadata
      const metadata = this.createMetadataDocument(fullBackup);
      console.log('[SYNC SMART] Pushing metadata document');
      const metadataTime = await this.pushDocument(metadataDocId, metadata);
      this.settings.documentState!.metadata.lastModified = metadataTime;

      // Update persistent
      const persistent = this.createPersistentDocument(fullBackup);
      console.log('[SYNC SMART] Pushing persistent document');
      const persistentTime = await this.pushDocument(persistentDocId, persistent);
      this.settings.documentState!.persistent.lastModified = persistentTime;

      await this.saveSettings();
      setSyncStatus('synced');

      syncState.update(state => ({
        ...state,
        lastSync: new Date().toISOString()
      }));

      console.log('[SYNC SMART] Persistent data sync completed');

    } catch (error) {
      console.error('[SYNC SMART] Persistent data sync failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSyncError(`Sync failed: ${errorMessage}`);
    }
  }

  /**
   * Sync only a specific month (when journal entry changes)
   * This is more efficient than full sync for journal changes
   */
  async syncMonth(monthKey: string): Promise<void> {
    if (!this.settings || !get(syncState).isEnabled) return;

    try {
      console.log('[SYNC SMART] Starting month sync for', monthKey);
      setSyncStatus('syncing');

      const metadataDocId = getDocumentId(this.settings.docId, 'metadata');
      const monthDocId = getDocumentId(this.settings.docId, 'month', monthKey);

      // Pull metadata and specific month to check for remote changes
      let hasRemoteUpdates = false;

      // Check and pull metadata if changed
      if (await this.needsPull(metadataDocId, this.settings.documentState?.metadata.lastModified || null)) {
        console.log('[SYNC SMART] Remote metadata has updates, pulling...');
        const metadataResult = await this.pullDocument(metadataDocId);
        if (metadataResult) {
          this.settings.documentState!.metadata.lastModified = metadataResult.lastModified;
          hasRemoteUpdates = true;
        }
      }

      // Check and pull specific month if changed
      const localLastModified = this.settings.documentState?.months[monthKey]?.lastModified || null;
      if (await this.needsPull(monthDocId, localLastModified)) {
        console.log('[SYNC SMART] Remote month', monthKey, 'has updates, pulling...');
        const monthResult = await this.pullDocument(monthDocId);
        if (monthResult) {
          const monthData = monthResult.data;

          if (!this.settings.documentState!.months[monthKey]) {
            this.settings.documentState!.months[monthKey] = { lastModified: null };
          }
          this.settings.documentState!.months[monthKey].lastModified = monthResult.lastModified;

          // Apply month data changes to IndexedDB
          for (const [dateString, entries] of Object.entries(monthData.journalEntries || {})) {
            await calciumService.saveFoodsForDate(dateString, entries as any[]);
          }

          hasRemoteUpdates = true;
          console.log('[SYNC SMART] Applied remote month', monthKey, 'changes');
        }
      }

      // Now push our local changes for this month
      const fullBackup = await calciumService.generateBackup();

      // Update metadata
      const metadata = this.createMetadataDocument(fullBackup);
      console.log('[SYNC SMART] Pushing metadata document');
      const metadataTime = await this.pushDocument(metadataDocId, metadata);
      this.settings.documentState!.metadata.lastModified = metadataTime;

      // Create and push only this month's document
      const monthDocs = this.createMonthDocuments(fullBackup);
      const monthDoc = monthDocs.get(monthKey);

      if (monthDoc) {
        const daysInMonth = Object.keys(monthDoc.journalEntries).length;
        console.log('[SYNC SMART] Pushing month', monthKey, '(' + daysInMonth, 'days)');
        const monthTime = await this.pushDocument(monthDocId, monthDoc);

        if (!this.settings.documentState!.months[monthKey]) {
          this.settings.documentState!.months[monthKey] = { lastModified: null };
        }
        this.settings.documentState!.months[monthKey].lastModified = monthTime;
      } else {
        console.log('[SYNC SMART] No data found for month', monthKey);
      }

      await this.saveSettings();
      setSyncStatus('synced');

      syncState.update(state => ({
        ...state,
        lastSync: new Date().toISOString()
      }));

      console.log('[SYNC SMART] Month', monthKey, 'sync completed');

    } catch (error) {
      console.error('[SYNC SMART] Month sync failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSyncError(`Sync failed: ${errorMessage}`);
    }
  }

  private async saveSettings(): Promise<void> {
    if (!this.settings) {
      console.warn('[SAVE SETTINGS] No settings to save');
      return;
    }

    console.log('[SAVE SETTINGS] Saving sync settings to localStorage');
    console.log('[SAVE SETTINGS] DocId:', this.settings.docId);
    console.log('[SAVE SETTINGS] SyncGenerationId:', this.settings.syncGenerationId);
    console.log('[SAVE SETTINGS] DocumentState months tracked:', Object.keys(this.settings.documentState?.months || {}).length);

    const keyString = await CryptoUtils.exportKey(this.settings.encryptionKey);
    this.encryptionKeyString = keyString;

    const storageData = {
      docId: this.settings.docId,
      encryptionKeyString: keyString,
      autoSync: this.settings.autoSync,
      syncInterval: this.settings.syncInterval,
      syncGenerationId: this.settings.syncGenerationId,
      documentState: this.settings.documentState
    };

    localStorage.setItem('calcium_sync_settings', JSON.stringify(storageData));
    console.log('[SAVE SETTINGS] ✅ Settings saved successfully');
  }

  /**
   * Create metadata document from full backup
   */
  private createMetadataDocument(fullBackup: any): MetadataDocument {
    console.log('[CREATE METADATA] Creating metadata document from backup');
    const journalData = fullBackup.journalEntries || {};
    console.log('[CREATE METADATA] Total journal dates in backup:', Object.keys(journalData).length);

    const availableMonths = Object.keys(journalData)
      .map(date => getMonthKey(date))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();

    console.log('[CREATE METADATA] Unique months found:', availableMonths.length, '- Months:', availableMonths);

    const now = new Date();
    const currentMonth = getMonthKey(now.toISOString().split('T')[0]);

    const metadata = {
      version: '3.0.0',
      syncGenerationId: this.settings!.syncGenerationId,
      availableMonths,
      currentMonth,
      lastActivity: new Date().toISOString()
    };

    console.log('[CREATE METADATA] ✅ Metadata document created. SyncGenerationId:', metadata.syncGenerationId);
    return metadata;
  }

  /**
   * Create persistent document from full backup
   */
  private createPersistentDocument(fullBackup: any): PersistentDocument {
    console.log('[CREATE PERSISTENT] Creating persistent document from backup');
    console.log('[CREATE PERSISTENT] Custom foods:', fullBackup.customFoods?.length || 0);
    console.log('[CREATE PERSISTENT] Favorites:', fullBackup.favorites?.length || 0);
    console.log('[CREATE PERSISTENT] Hidden foods:', fullBackup.hiddenFoods?.length || 0);
    console.log('[CREATE PERSISTENT] Serving preferences:', fullBackup.servingPreferences?.length || 0);
    console.log('[CREATE PERSISTENT] Has preferences:', !!fullBackup.preferences);

    const persistent = {
      version: '3.0.0',
      lastModified: new Date().toISOString(),
      preferences: fullBackup.preferences,
      customFoods: fullBackup.customFoods,
      favorites: fullBackup.favorites,
      hiddenFoods: fullBackup.hiddenFoods,
      servingPreferences: fullBackup.servingPreferences
    };

    console.log('[CREATE PERSISTENT] ✅ Persistent document created');
    return persistent;
  }

  /**
   * Create month documents from full backup journal entries
   */
  private createMonthDocuments(fullBackup: any): Map<string, MonthDocument> {
    console.log('[CREATE MONTHS] Creating month documents from backup');
    const journalData = fullBackup.journalEntries || {};
    const totalDates = Object.keys(journalData).length;
    console.log('[CREATE MONTHS] Total journal dates to partition:', totalDates);

    const monthDocs = new Map<string, MonthDocument>();

    // Partition journal entries by month
    for (const [dateString, entries] of Object.entries(journalData)) {
      const monthKey = getMonthKey(dateString);

      if (!monthDocs.has(monthKey)) {
        monthDocs.set(monthKey, {
          version: '3.0.0',
          monthKey,
          lastModified: new Date().toISOString(),
          journalEntries: {}
        });
        console.log('[CREATE MONTHS] Created new month document for:', monthKey);
      }

      monthDocs.get(monthKey)!.journalEntries[dateString] = entries as any[];
    }

    console.log('[CREATE MONTHS] ✅ Created', monthDocs.size, 'month documents');
    for (const [monthKey, monthDoc] of monthDocs.entries()) {
      const daysInMonth = Object.keys(monthDoc.journalEntries).length;
      console.log('[CREATE MONTHS]   -', monthKey + ':', daysInMonth, 'days');
    }

    return monthDocs;
  }

  /**
   * Push a single document to cloud (generic helper)
   */
  private async pushDocument(docId: string, data: any): Promise<string> {
    try {
      console.log('[PUSH DOC] Starting push for', docId);
      const dataString = JSON.stringify(data);
      const dataSizeKB = (dataString.length / 1024).toFixed(2);
      console.log('[PUSH DOC]   Data size:', dataSizeKB, 'KB');

      console.log('[PUSH DOC]   Encrypting data...');
      const encrypted = await CryptoUtils.encrypt(
        dataString,
        this.settings!.encryptionKey!
      );
      console.log('[PUSH DOC]   Encrypted size:', (encrypted.length / 1024).toFixed(2), 'KB');

      console.log('[PUSH DOC]   Sending PUT request to worker...');
      const response = await fetch(`${this.settings!.workerUrl}/sync/${docId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encrypted })
      });

      if (!response.ok) {
        console.error('[PUSH DOC] ❌ Failed to push', docId, '- Status:', response.status);
        throw new Error(`Failed to push ${docId}: ${response.status}`);
      }

      const result = await response.json();
      const lastModified = result.lastModified || new Date().toISOString();
      console.log('[PUSH DOC] ✅ Push successful. LastModified:', lastModified);
      return lastModified;
    } catch (error) {
      console.error('[PUSH DOC] ❌ Error pushing', docId + ':', error);
      throw error;
    }
  }

  /**
   * Check if a specific document needs to be pulled (remote is newer)
   */
  private async needsPull(docId: string, localLastModified: string | null): Promise<boolean> {
    try {
      console.log('[NEEDS PULL?] Checking', docId);
      console.log('[NEEDS PULL?]   Local lastModified:', localLastModified || '(none)');

      const response = await fetch(`${this.settings!.workerUrl}/sync/${docId}`, {
        method: 'HEAD'
      });

      if (response.status === 404) {
        console.log('[NEEDS PULL?]   Result: NO - Document not found (404)');
        return false;
      }
      if (!response.ok) {
        console.log('[NEEDS PULL?]   Result: NO - Request failed (status:', response.status + ')');
        return false;
      }

      const remoteLastModified = response.headers.get('Last-Modified') || response.headers.get('X-Last-Modified');
      console.log('[NEEDS PULL?]   Remote lastModified:', remoteLastModified || '(none)');

      if (!remoteLastModified) {
        console.log('[NEEDS PULL?]   Result: YES - No remote timestamp (assume needs pull)');
        return true;
      }

      if (!localLastModified) {
        console.log('[NEEDS PULL?]   Result: YES - No local timestamp (first pull)');
        return true;
      }

      const remoteTime = new Date(remoteLastModified).getTime();
      const localTime = new Date(localLastModified).getTime();
      const needsUpdate = remoteTime > localTime;

      console.log('[NEEDS PULL?]   Result:', needsUpdate ? 'YES' : 'NO', '- Remote time:', remoteTime, 'Local time:', localTime);
      return needsUpdate;
    } catch (error) {
      console.error('[NEEDS PULL?] ❌ Error checking', docId + ':', error);
      return false;
    }
  }

  /**
   * Pull and decrypt a single document
   */
  private async pullDocument(docId: string): Promise<any | null> {
    try {
      console.log('[PULL DOC] Starting pull for', docId);
      console.log('[PULL DOC]   Sending GET request to worker...');

      const response = await fetch(`${this.settings!.workerUrl}/sync/${docId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 404) {
        console.log('[PULL DOC]   Result: Document not found (404)');
        return null;
      }
      if (!response.ok) {
        console.error('[PULL DOC] ❌ Failed to pull', docId, '- Status:', response.status);
        throw new Error(`Failed to pull ${docId}: ${response.status}`);
      }

      console.log('[PULL DOC]   Parsing response...');
      const result = await response.json();
      if (!result.success || !result.encrypted) {
        console.warn('[PULL DOC]   No encrypted data in response');
        return null;
      }

      console.log('[PULL DOC]   Encrypted size:', (result.encrypted.length / 1024).toFixed(2), 'KB');
      console.log('[PULL DOC]   Decrypting data...');
      const decrypted = await CryptoUtils.decrypt(result.encrypted, this.settings!.encryptionKey!);

      console.log('[PULL DOC]   Parsing decrypted JSON...');
      const data = JSON.parse(decrypted);

      const dataSizeKB = (decrypted.length / 1024).toFixed(2);
      console.log('[PULL DOC] ✅ Pull successful. Size:', dataSizeKB, 'KB, LastModified:', result.lastModified);

      return { data, lastModified: result.lastModified };
    } catch (error) {
      console.error('[PULL DOC] ❌ Error pulling', docId + ':', error);
      return null;
    }
  }

  /**
   * Apply persistent data changes without clearing existing data
   */
  private async applyPersistentData(persistentData: PersistentDocument): Promise<void> {
    console.log('[APPLY PERSISTENT] Applying persistent data changes');

    // Update preferences
    if (persistentData.preferences) {
      console.log('[APPLY PERSISTENT] Updating preferences');
      calciumState.update(state => ({
        ...state,
        settings: persistentData.preferences
      }));
      await calciumService.saveSettings();
    }

    // Apply custom foods (merge - CalciumService handles duplicates)
    if (persistentData.customFoods && Array.isArray(persistentData.customFoods)) {
      console.log('[APPLY PERSISTENT] Merging', persistentData.customFoods.length, 'custom foods');
      for (const customFood of persistentData.customFoods) {
        try {
          await calciumService.saveCustomFoodToIndexedDB(customFood);
        } catch (error) {
          console.warn('[APPLY PERSISTENT] Failed to apply custom food:', customFood.name, error);
        }
      }

      // Reload custom foods into state
      console.log('[APPLY PERSISTENT] Reloading custom foods into state...');
      await calciumService.loadCustomFoods();
    }

    // Apply favorites (merge with existing)
    if (persistentData.favorites && Array.isArray(persistentData.favorites)) {
      console.log('[APPLY PERSISTENT] Applying', persistentData.favorites.length, 'favorites');
      try {
        // Get current favorites
        const currentFavorites = get(calciumState).favorites;
        // Merge with new favorites (Set removes duplicates)
        const mergedFavorites = Array.from(new Set([...currentFavorites, ...persistentData.favorites]));
        await calciumService.restoreFavorites(mergedFavorites);
      } catch (error) {
        console.warn('[APPLY PERSISTENT] Failed to apply favorites:', error);
      }
    }

    // Apply hidden foods (merge with existing)
    if (persistentData.hiddenFoods && Array.isArray(persistentData.hiddenFoods)) {
      console.log('[APPLY PERSISTENT] Applying', persistentData.hiddenFoods.length, 'hidden foods');
      try {
        const currentHidden = get(calciumState).hiddenFoods;
        const mergedHidden = Array.from(new Set([...currentHidden, ...persistentData.hiddenFoods]));
        await calciumService.restoreHiddenFoods(mergedHidden);
      } catch (error) {
        console.warn('[APPLY PERSISTENT] Failed to apply hidden foods:', error);
      }
    }

    // Apply serving preferences (newer timestamps win)
    if (persistentData.servingPreferences && Array.isArray(persistentData.servingPreferences)) {
      console.log('[APPLY PERSISTENT] Applying', persistentData.servingPreferences.length, 'serving preferences');
      try {
        const currentPrefs = Array.from(get(calciumState).servingPreferences.values());

        // Merge preferences - newer timestamp wins for same foodId
        const mergedMap = new Map();

        // Add current preferences
        for (const pref of currentPrefs) {
          mergedMap.set(pref.foodId, pref);
        }

        // Overlay with synced preferences (will overwrite if timestamp is newer)
        for (const pref of persistentData.servingPreferences) {
          const existing = mergedMap.get(pref.foodId);
          if (!existing || !existing.lastUsed ||
              (pref.lastUsed && pref.lastUsed > existing.lastUsed)) {
            mergedMap.set(pref.foodId, pref);
          }
        }

        await calciumService.restoreServingPreferences(Array.from(mergedMap.values()));
      } catch (error) {
        console.warn('[APPLY PERSISTENT] Failed to apply serving preferences:', error);
      }
    }

    console.log('[APPLY PERSISTENT] ✅ Persistent data applied');
  }

  // In src/lib/services/SyncService.ts

  /**
   * Joins an existing sync document using a sync URL.
   * @param syncUrl The sync URL containing document ID and encryption key
   * @throws Error if URL is invalid or join fails
   */
  async joinExistingSyncDoc(syncUrl: string): Promise<void> {
    console.log('[JOIN SYNC] Joining existing sync document...');
    this.checkSyncEnabled();

    try {
      setSyncStatus('syncing');

      console.log('[JOIN SYNC] Parsing sync URL...');
      const url = new URL(syncUrl);
      const params = new URLSearchParams(url.hash.substring(1));
      const docId = params.get('sync');
      const encodedKeyString = params.get('key');

      if (!docId || !encodedKeyString) {
        console.error('[JOIN SYNC] ❌ Invalid sync URL format');
        throw new Error('Invalid sync URL format');
      }

      console.log('[JOIN SYNC] DocId:', docId);
      console.log('[JOIN SYNC] Importing encryption key...');
      const keyString = decodeURIComponent(encodedKeyString);
      const encryptionKey = await CryptoUtils.importKey(keyString);
      console.log('[JOIN SYNC] Encryption key imported successfully');

      // Step 1: First, fetch the remote data to learn the correct generation ID
      console.log('[JOIN SYNC] Fetching remote metadata document to get syncGenerationId...');
      const metadataDocId = getDocumentId(docId, 'metadata');
      const response = await fetch(`${this.workerUrl}/sync/${metadataDocId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 404) {
        console.log('[JOIN SYNC] Remote metadata not found (404) - will create new generation ID');
      } else if (!response.ok) {
        console.error('[JOIN SYNC] ❌ Server error:', response.status);
        throw new Error(`Server error: ${response.status}`);
      }

      let remoteGenerationId = null;

      if (response.status !== 404) {
        console.log('[JOIN SYNC] Parsing remote metadata...');
        const result = await response.json();
        if (!result.success || !result.encrypted) {
          console.error('[JOIN SYNC] ❌ No encrypted data received');
          throw new Error(result.error || 'No encrypted data received');
        }

        const decrypted = await CryptoUtils.decrypt(result.encrypted, encryptionKey);
        const metadataDoc = JSON.parse(decrypted);
        remoteGenerationId = metadataDoc.syncGenerationId;

        if (!remoteGenerationId) {
          console.error('[JOIN SYNC] ❌ Sync data is missing a generation ID');
          throw new Error('Sync data is missing a generation ID.');
        }

        console.log('[JOIN SYNC] Remote SyncGenerationId:', remoteGenerationId);
        console.log('[JOIN SYNC] Remote available months:', metadataDoc.availableMonths?.length || 0);
      }

      this.settings = {
        docId,
        encryptionKey,
        workerUrl: this.workerUrl,
        autoSync: false,
        syncInterval: 60,
        syncGenerationId: remoteGenerationId || CryptoUtils.generateUUID(),
        documentState: {
          metadata: { lastModified: null },
          persistent: { lastModified: null },
          months: {}
        }
      };

      console.log('[JOIN SYNC] Saving settings to localStorage...');
      await this.saveSettings();

      console.log('[JOIN SYNC] Performing initial pull from cloud...');
      await this.pullFromCloud();

      syncState.update(state => ({
        ...state,
        docId,
        isEnabled: true,
        status: 'synced',
        lastSync: new Date().toISOString()
      }));

      console.log('[JOIN SYNC] Starting auto-sync...');
      this.startAutoSync();
      console.log('[JOIN SYNC] ✅ Successfully joined sync!');
      showToast("Successfully joined sync!", "success");

    } catch (error) {
      console.error('[JOIN SYNC] ❌ Failed to join sync doc:', error);
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
    console.log('═══════════════════════════════════════════');
    console.log('[BIDIRECTIONAL SYNC] 🔄 Starting full bidirectional sync');
    console.log('═══════════════════════════════════════════');

    this.checkSyncEnabled();

    if (!navigator.onLine) {
      console.warn('[BIDIRECTIONAL SYNC] ⚠️ Offline - queueing sync for later');
      this.isSyncPending = true;
      setSyncStatus('offline');
      return;
    }

    if (!this.settings || !get(syncState).isEnabled) {
      console.warn('[BIDIRECTIONAL SYNC] ⚠️ Sync not enabled or settings missing');
      return;
    }

    console.log('[BIDIRECTIONAL SYNC] Settings:', {
      docId: this.settings.docId,
      hasDocumentState: !!this.settings.documentState,
      monthsTracked: Object.keys(this.settings.documentState?.months || {}).length
    });

    setSyncStatus('syncing');

    try {
      console.log('[BIDIRECTIONAL SYNC] Step 1/2: Pulling from cloud...');
      const startPull = Date.now();
      await this.pullFromCloud();
      const pullDuration = Date.now() - startPull;
      console.log('[BIDIRECTIONAL SYNC] ✅ Pull completed in', pullDuration, 'ms');

      console.log('[BIDIRECTIONAL SYNC] Step 2/2: Pushing to cloud...');
      const startPush = Date.now();
      await this.pushToCloud();
      const pushDuration = Date.now() - startPush;
      console.log('[BIDIRECTIONAL SYNC] ✅ Push completed in', pushDuration, 'ms');

      const totalDuration = Date.now() - startPull;
      console.log('═══════════════════════════════════════════');
      console.log('[BIDIRECTIONAL SYNC] ✅ Bidirectional sync completed successfully');
      console.log('[BIDIRECTIONAL SYNC] Total time:', totalDuration, 'ms');
      console.log('═══════════════════════════════════════════');

    } catch (error) {
      console.error('═══════════════════════════════════════════');
      console.error('[BIDIRECTIONAL SYNC] ❌ SYNC FAILED');
      console.error('[BIDIRECTIONAL SYNC] Error details:', error);
      console.error('═══════════════════════════════════════════');
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
    console.log('[AUTO SYNC] startAutoSync called');
    if (!this.settings) {
      console.log('[AUTO SYNC] No settings, cannot start auto-sync');
      return;
    }
    if (this.isAutoSyncEnabled) {
      console.log('[AUTO SYNC] Auto-sync already enabled, skipping');
      return;
    }

    console.log('[AUTO SYNC] Starting auto-sync...');
    this.isAutoSyncEnabled = true;

    console.log('[AUTO SYNC] Setting up 60-second interval for periodic pulls...');
    this.autoSyncInterval = window.setInterval(async () => {
      if (this.settings && get(syncState).isEnabled) {
        console.log('[AUTO SYNC] Periodic pull triggered (60s interval)');
        await this.pullFromCloud().catch(err => console.warn('[AUTO SYNC] Auto-sync pull failed:', err));
      }
    }, 60000);

    console.log('[AUTO SYNC] Registering window focus event listener...');
    window.addEventListener('focus', this.handleWindowFocus.bind(this));

    console.log('[AUTO SYNC] Registering visibility change event listener...');
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    console.log('[AUTO SYNC] ✅ Auto-sync started successfully');
  }

  /**
   * Stops all automatic sync operations and removes event listeners.
   */
  stopAutoSync(): void {
    console.log('[AUTO SYNC] stopAutoSync called');
    if (!this.isAutoSyncEnabled) {
      console.log('[AUTO SYNC] Auto-sync not enabled, nothing to stop');
      return;
    }

    console.log('[AUTO SYNC] Stopping auto-sync...');
    this.isAutoSyncEnabled = false;

    if (this.autoSyncInterval) {
      console.log('[AUTO SYNC] Clearing periodic interval...');
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }

    console.log('[AUTO SYNC] Removing window focus event listener...');
    window.removeEventListener('focus', this.handleWindowFocus.bind(this));

    console.log('[AUTO SYNC] Removing visibility change event listener...');
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    console.log('[AUTO SYNC] ✅ Auto-sync stopped successfully');
  }

  private async handleWindowFocus(): Promise<void> {
    console.log('[WINDOW FOCUS] Window focus event detected');
    if (this.settings && get(syncState).isEnabled) {
      console.log('[WINDOW FOCUS] Sync enabled, triggering pull from cloud...');
      await this.pullFromCloud().catch(err => console.warn('[WINDOW FOCUS] Focus sync failed:', err));
    } else {
      console.log('[WINDOW FOCUS] Sync not enabled or no settings, skipping pull');
    }
  }

  private async handleVisibilityChange(): Promise<void> {
    console.log('[VISIBILITY] Visibility change event detected. Document hidden:', document.hidden);
    if (!document.hidden && this.settings && get(syncState).isEnabled) {
      console.log('[VISIBILITY] Document visible and sync enabled, triggering pull from cloud...');
      await this.pullFromCloud().catch(err => console.warn('[VISIBILITY] Visibility sync failed:', err));
    } else {
      console.log('[VISIBILITY] Document hidden or sync not enabled, skipping pull');
    }
  }

  /**
   * Disconnects from sync by clearing settings and stopping auto-sync.
   */
  async disconnectSync(): Promise<void> {
    console.log('[DISCONNECT SYNC] Disconnecting from sync...');

    // Stop auto-sync
    console.log('[DISCONNECT SYNC] Stopping auto-sync...');
    this.stopAutoSync();

    // Clear sync settings
    console.log('[DISCONNECT SYNC] Clearing sync settings from memory...');
    this.settings = null;
    this.encryptionKeyString = null;

    // Remove from localStorage
    console.log('[DISCONNECT SYNC] Removing sync settings from localStorage...');
    localStorage.removeItem('calcium_sync_settings');

    // Update sync state
    console.log('[DISCONNECT SYNC] Updating sync state to offline...');
    syncState.update(state => ({
      ...state,
      docId: null,
      isEnabled: false,
      status: 'offline',
      error: null,
      lastSync: null
    }));

    console.log('[DISCONNECT SYNC] ✅ Disconnected from sync');
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
    console.log('[NETWORK] Online status detected');
    if (this.isSyncPending) {
      console.log('[NETWORK] Pending sync detected, triggering bidirectional sync...');
      showToast("Connection restored. Syncing changes...", "info");
      this.isSyncPending = false;
      await this.performBidirectionalSync();
    } else {
      if (get(syncState).isEnabled) {
        console.log('[NETWORK] Sync enabled, setting status to synced');
        setSyncStatus('synced');
      } else {
        console.log('[NETWORK] Sync not enabled, no action taken');
      }
    }
  }

  private handleOfflineStatus(): void {
    console.log('[NETWORK] Offline status detected, setting sync status to offline');
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