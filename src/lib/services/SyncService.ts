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
import { logger } from '$lib/utils/logger';
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
    logger.debug('SYNC INIT', 'Initializing SyncService...');
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
        logger.debug('SYNC INIT', 'Found stored sync settings, restoring...');
        const settings = JSON.parse(storedSettings);
        logger.debug('SYNC INIT', 'DocId:', settings.docId);
        logger.debug('SYNC INIT', 'SyncGenerationId:', settings.syncGenerationId || '(none - will generate)');

        this.encryptionKeyString = settings.encryptionKeyString;
        const encryptionKey = await CryptoUtils.importKey(settings.encryptionKeyString);
        logger.debug('SYNC INIT', 'Encryption key imported successfully');

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

        logger.debug('SYNC INIT', 'DocumentState:', {
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

        logger.debug('SYNC INIT', 'Starting auto-sync...');
        this.startAutoSync();
        logger.debug('SYNC INIT', '✅ Initialization complete');
      } else {
        logger.debug('SYNC INIT', 'No stored settings found');
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
    logger.debug('CREATE SYNC', 'Creating new sync document...');
    this.checkSyncEnabled();

    try {
      setSyncStatus('syncing');

      logger.debug('CREATE SYNC', 'Generating DocId and encryption key...');
      const docId = CryptoUtils.generateDocId();
      const encryptionKey = await CryptoUtils.generateKey();
      const syncGenerationId = CryptoUtils.generateUUID();

      logger.debug('CREATE SYNC', 'DocId:', docId);
      logger.debug('CREATE SYNC', 'SyncGenerationId:', syncGenerationId);

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

      logger.debug('CREATE SYNC', 'Saving settings to localStorage...');
      await this.saveSettings();

      logger.debug('CREATE SYNC', 'Generating backup of current data...');
      const currentData = await calciumService.generateBackup();

      logger.debug('CREATE SYNC', 'Pushing initial data to cloud...');
      await this.pushToCloud(currentData);

      syncState.update(state => ({
        ...state,
        docId,
        isEnabled: true,
        status: 'synced'
      }));

      logger.debug('CREATE SYNC', '✅ Sync document created successfully');
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
      logger.debug('SYNC PULL', 'Starting multi-document pull from cloud');
      setSyncStatus('syncing');
      let hasUpdates = false;
      let forcePullAll = false; // Track if we need to force pull all documents

      // Pull metadata first to know what months exist
      const metadataDocId = getDocumentId(this.settings.docId, 'metadata');
      let availableMonths: string[] = [];
      let metadataDoc: MetadataDocument | null = null;

      logger.debug('SYNC PULL', 'Checking metadata document:', metadataDocId);
      if (await this.needsPull(metadataDocId, this.settings.documentState?.metadata.lastModified || null)) {
        logger.debug('SYNC PULL', 'Metadata needs update, pulling...');
        const metadataResult = await this.pullDocument(metadataDocId);
        if (metadataResult) {
          metadataDoc = metadataResult.data;
          availableMonths = metadataDoc.availableMonths || [];
          this.settings.documentState!.metadata.lastModified = metadataResult.lastModified;
          hasUpdates = true;
          logger.debug('SYNC PULL', 'Metadata updated. Available months:', availableMonths);

          // Check for sync generation ID change
          if (metadataDoc.syncGenerationId && metadataDoc.syncGenerationId !== this.settings.syncGenerationId) {
            logger.debug('SYNC PULL', '⚠️ SYNC GENERATION ID CHANGED!');
            logger.debug('SYNC PULL', '  Remote:', metadataDoc.syncGenerationId);
            logger.debug('SYNC PULL', '  Local:', this.settings.syncGenerationId);
            logger.debug('SYNC PULL', 'Clearing ALL local data and forcing FULL pull of all documents');
            await calciumService.clearApplicationData();
            this.settings.syncGenerationId = metadataDoc.syncGenerationId;
            forcePullAll = true; // Force pull all documents since we cleared all local data
          }
        }
      } else {
        logger.debug('SYNC PULL', 'Metadata up to date, using locally known months');
        // Use locally known months if metadata hasn't changed
        availableMonths = Object.keys(this.settings.documentState?.months || {});
      }

      // Pull persistent document if changed (or if forced)
      const persistentDocId = getDocumentId(this.settings.docId, 'persistent');
      let persistentData: PersistentDocument | null = null;

      logger.debug('SYNC PULL', 'Checking persistent document:', persistentDocId);
      if (forcePullAll || await this.needsPull(persistentDocId, this.settings.documentState?.persistent.lastModified || null)) {
        if (forcePullAll) {
          logger.debug('SYNC PULL', 'Persistent FORCED pull (generation ID changed)...');
        } else {
          logger.debug('SYNC PULL', 'Persistent needs update, pulling...');
        }
        const persistentResult = await this.pullDocument(persistentDocId);
        if (persistentResult) {
          persistentData = persistentResult.data;
          this.settings.documentState!.persistent.lastModified = persistentResult.lastModified;
          hasUpdates = true;
          logger.debug('SYNC PULL', 'Persistent updated. Custom foods:', persistentData.customFoods?.length, 'Favorites:', persistentData.favorites?.length);
        }
      } else {
        logger.debug('SYNC PULL', 'Persistent up to date');
      }

      // Pull month documents that have changed (or if forced)
      const monthData = new Map<string, MonthDocument>();
      logger.debug('SYNC PULL', 'Checking', availableMonths.length, 'month documents');
      if (forcePullAll) {
        logger.debug('SYNC PULL', '⚠️ FORCING pull of ALL months (generation ID changed - all local data was cleared)');
      }

      for (const monthKey of availableMonths) {
        const monthDocId = getDocumentId(this.settings.docId, 'month', monthKey);
        const localLastModified = this.settings.documentState?.months[monthKey]?.lastModified || null;

        if (forcePullAll || await this.needsPull(monthDocId, localLastModified)) {
          if (forcePullAll) {
            logger.debug('SYNC PULL', 'Month', monthKey, 'FORCED pull (generation ID changed)...');
          } else {
            logger.debug('SYNC PULL', 'Month', monthKey, 'needs update, pulling...');
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
            logger.debug('SYNC PULL', 'Month', monthKey, 'updated. Days with entries:', entryCount);
          }
        } else {
          logger.debug('SYNC PULL', 'Month', monthKey, 'up to date');
        }
      }

      // If we have updates, apply them selectively without clearing existing data
      if (hasUpdates) {
        logger.debug('SYNC PULL', 'Has updates, applying changes selectively...');

        // Apply persistent data if it was pulled
        if (persistentData) {
          await this.applyPersistentData(persistentData);
        }

        // Apply journal entries from changed months only
        if (monthData.size > 0) {
          logger.debug('SYNC PULL', 'Applying journal entries from', monthData.size, 'changed months');
          let totalDaysApplied = 0;

          for (const [monthKey, monthDoc] of monthData.entries()) {
            const daysInMonth = Object.keys(monthDoc.journalEntries).length;
            logger.debug('SYNC PULL', 'Applying month', monthKey, '-', daysInMonth, 'days');

            for (const [dateString, entries] of Object.entries(monthDoc.journalEntries)) {
              try {
                await calciumService.saveFoodsForDate(dateString, entries as any[]);
              } catch (error) {
                console.warn('[SYNC PULL] Failed to apply entries for', dateString, error);
              }
            }

            totalDaysApplied += daysInMonth;
          }

          logger.debug('SYNC PULL', '✅ Applied', totalDaysApplied, 'days of journal entries from', monthData.size, 'months');

          // Reload the UI state to reflect the changes
          logger.debug('SYNC PULL', 'Reloading journal data into UI state...');
          await calciumService.loadDailyFoods();
          logger.debug('SYNC PULL', 'UI state reloaded');
        }

        logger.debug('SYNC PULL', '✅ Selective merge completed - existing data preserved');
      } else {
        logger.debug('SYNC PULL', 'No updates found, skipping apply');
      }

      await this.saveSettings();
      setSyncStatus('synced');

      syncState.update(state => ({
        ...state,
        lastSync: new Date().toISOString()
      }));

      logger.debug('SYNC PULL', 'Pull completed successfully. Updates applied:', hasUpdates);
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
      logger.debug('SYNC PUSH', 'Starting multi-document push to cloud');
      setSyncStatus('syncing');

      // Get full backup using existing CalciumService method
      const fullBackup = dataToPush || await calciumService.generateBackup();
      logger.debug('SYNC PUSH', 'Generated full backup');

      // Partition into documents for cloud storage
      const metadata = this.createMetadataDocument(fullBackup);
      const persistent = this.createPersistentDocument(fullBackup);
      const monthDocs = this.createMonthDocuments(fullBackup);

      logger.debug('SYNC PUSH', 'Partitioned into', monthDocs.size, 'month documents');
      logger.debug('SYNC PUSH', 'Metadata:', metadata.availableMonths.length, 'months available');
      logger.debug('SYNC PUSH', 'Persistent: Custom foods:', persistent.customFoods?.length, 'Favorites:', persistent.favorites?.length);

      // Push metadata document
      const metadataDocId = getDocumentId(this.settings.docId, 'metadata');
      logger.debug('SYNC PUSH', 'Pushing metadata document:', metadataDocId);
      const metadataTime = await this.pushDocument(metadataDocId, metadata);
      this.settings.documentState!.metadata.lastModified = metadataTime;

      // Push persistent document
      const persistentDocId = getDocumentId(this.settings.docId, 'persistent');
      logger.debug('SYNC PUSH', 'Pushing persistent document:', persistentDocId);
      const persistentTime = await this.pushDocument(persistentDocId, persistent);
      this.settings.documentState!.persistent.lastModified = persistentTime;

      // Push all month documents
      logger.debug('SYNC PUSH', 'Pushing', monthDocs.size, 'month documents...');
      for (const [monthKey, monthDoc] of monthDocs.entries()) {
        const monthDocId = getDocumentId(this.settings.docId, 'month', monthKey);
        const daysInMonth = Object.keys(monthDoc.journalEntries).length;
        logger.debug('SYNC PUSH', 'Pushing month', monthKey, '(' + daysInMonth, 'days):', monthDocId);
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

      logger.debug('SYNC PUSH', 'Push completed successfully. Total documents pushed:', 2 + monthDocs.size);

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
      logger.debug('SYNC SMART', 'Starting persistent data sync');
      setSyncStatus('syncing');

      // Pull persistent and metadata to check for remote changes
      const metadataDocId = getDocumentId(this.settings.docId, 'metadata');
      const persistentDocId = getDocumentId(this.settings.docId, 'persistent');

      let hasRemoteUpdates = false;

      // Check and pull metadata if changed
      if (await this.needsPull(metadataDocId, this.settings.documentState?.metadata.lastModified || null)) {
        logger.debug('SYNC SMART', 'Remote metadata has updates, pulling...');
        const metadataResult = await this.pullDocument(metadataDocId);
        if (metadataResult) {
          this.settings.documentState!.metadata.lastModified = metadataResult.lastModified;
          hasRemoteUpdates = true;
        }
      }

      // Check and pull persistent if changed
      if (await this.needsPull(persistentDocId, this.settings.documentState?.persistent.lastModified || null)) {
        logger.debug('SYNC SMART', 'Remote persistent has updates, pulling...');
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
          logger.debug('SYNC SMART', 'Applied remote persistent data changes');
        }
      }

      // Now push our local changes
      const fullBackup = await calciumService.generateBackup();

      // Update metadata
      const metadata = this.createMetadataDocument(fullBackup);
      logger.debug('SYNC SMART', 'Pushing metadata document');
      const metadataTime = await this.pushDocument(metadataDocId, metadata);
      this.settings.documentState!.metadata.lastModified = metadataTime;

      // Update persistent
      const persistent = this.createPersistentDocument(fullBackup);
      logger.debug('SYNC SMART', 'Pushing persistent document');
      const persistentTime = await this.pushDocument(persistentDocId, persistent);
      this.settings.documentState!.persistent.lastModified = persistentTime;

      await this.saveSettings();
      setSyncStatus('synced');

      syncState.update(state => ({
        ...state,
        lastSync: new Date().toISOString()
      }));

      logger.debug('SYNC SMART', 'Persistent data sync completed');

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
      logger.debug('SYNC SMART', 'Starting month sync for', monthKey);
      setSyncStatus('syncing');

      const metadataDocId = getDocumentId(this.settings.docId, 'metadata');
      const monthDocId = getDocumentId(this.settings.docId, 'month', monthKey);

      // Pull metadata and specific month to check for remote changes
      let hasRemoteUpdates = false;

      // Check and pull metadata if changed
      if (await this.needsPull(metadataDocId, this.settings.documentState?.metadata.lastModified || null)) {
        logger.debug('SYNC SMART', 'Remote metadata has updates, pulling...');
        const metadataResult = await this.pullDocument(metadataDocId);
        if (metadataResult) {
          this.settings.documentState!.metadata.lastModified = metadataResult.lastModified;
          hasRemoteUpdates = true;
        }
      }

      // Check and pull specific month if changed
      const localLastModified = this.settings.documentState?.months[monthKey]?.lastModified || null;
      if (await this.needsPull(monthDocId, localLastModified)) {
        logger.debug('SYNC SMART', 'Remote month', monthKey, 'has updates, pulling...');
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
          logger.debug('SYNC SMART', 'Applied remote month', monthKey, 'changes');
        }
      }

      // Now push our local changes for this month
      const fullBackup = await calciumService.generateBackup();

      // Update metadata
      const metadata = this.createMetadataDocument(fullBackup);
      logger.debug('SYNC SMART', 'Pushing metadata document');
      const metadataTime = await this.pushDocument(metadataDocId, metadata);
      this.settings.documentState!.metadata.lastModified = metadataTime;

      // Create and push only this month's document
      const monthDocs = this.createMonthDocuments(fullBackup);
      const monthDoc = monthDocs.get(monthKey);

      if (monthDoc) {
        const daysInMonth = Object.keys(monthDoc.journalEntries).length;
        logger.debug('SYNC SMART', 'Pushing month', monthKey, '(' + daysInMonth, 'days)');
        const monthTime = await this.pushDocument(monthDocId, monthDoc);

        if (!this.settings.documentState!.months[monthKey]) {
          this.settings.documentState!.months[monthKey] = { lastModified: null };
        }
        this.settings.documentState!.months[monthKey].lastModified = monthTime;
      } else {
        logger.debug('SYNC SMART', 'No data found for month', monthKey);
      }

      await this.saveSettings();
      setSyncStatus('synced');

      syncState.update(state => ({
        ...state,
        lastSync: new Date().toISOString()
      }));

      logger.debug('SYNC SMART', 'Month', monthKey, 'sync completed');

    } catch (error) {
      console.error('[SYNC SMART] Month sync failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSyncError(`Sync failed: ${errorMessage}`);
    }
  }

  private async saveSettings(): Promise<void> {
    if (!this.settings) {
      logger.debug('SAVE SETTINGS', 'No settings to save');
      return;
    }

    logger.debug('SAVE SETTINGS', 'Saving sync settings to localStorage');
    logger.debug('SAVE SETTINGS', 'DocId:', this.settings.docId);
    logger.debug('SAVE SETTINGS', 'SyncGenerationId:', this.settings.syncGenerationId);
    logger.debug('SAVE SETTINGS', 'DocumentState months tracked:', Object.keys(this.settings.documentState?.months || {}).length);

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
    logger.debug('SAVE SETTINGS', '✅ Settings saved successfully');
  }

  /**
   * Create metadata document from full backup
   */
  private createMetadataDocument(fullBackup: any): MetadataDocument {
    logger.debug('CREATE METADATA', 'Creating metadata document from backup');
    const journalData = fullBackup.journalEntries || {};
    logger.debug('CREATE METADATA', 'Total journal dates in backup:', Object.keys(journalData).length);

    const availableMonths = Object.keys(journalData)
      .map(date => getMonthKey(date))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();

    logger.debug('CREATE METADATA', 'Unique months found:', availableMonths.length, '- Months:', availableMonths);

    const now = new Date();
    const currentMonth = getMonthKey(now.toISOString().split('T')[0]);

    const metadata = {
      version: '3.0.0',
      syncGenerationId: this.settings!.syncGenerationId,
      availableMonths,
      currentMonth,
      lastActivity: new Date().toISOString()
    };

    logger.debug('CREATE METADATA', '✅ Metadata document created. SyncGenerationId:', metadata.syncGenerationId);
    return metadata;
  }

  /**
   * Create persistent document from full backup
   */
  private createPersistentDocument(fullBackup: any): PersistentDocument {
    logger.debug('CREATE PERSISTENT', 'Creating persistent document from backup');
    logger.debug('CREATE PERSISTENT', 'Custom foods:', fullBackup.customFoods?.length || 0);
    logger.debug('CREATE PERSISTENT', 'Favorites:', fullBackup.favorites?.length || 0);
    logger.debug('CREATE PERSISTENT', 'Hidden foods:', fullBackup.hiddenFoods?.length || 0);
    logger.debug('CREATE PERSISTENT', 'Serving preferences:', fullBackup.servingPreferences?.length || 0);
    logger.debug('CREATE PERSISTENT', 'Has preferences:', !!fullBackup.preferences);

    const persistent = {
      version: '3.0.0',
      lastModified: new Date().toISOString(),
      preferences: fullBackup.preferences,
      customFoods: fullBackup.customFoods,
      favorites: fullBackup.favorites,
      hiddenFoods: fullBackup.hiddenFoods,
      servingPreferences: fullBackup.servingPreferences
    };

    logger.debug('CREATE PERSISTENT', '✅ Persistent document created');
    return persistent;
  }

  /**
   * Create month documents from full backup journal entries
   */
  private createMonthDocuments(fullBackup: any): Map<string, MonthDocument> {
    logger.debug('CREATE MONTHS', 'Creating month documents from backup');
    const journalData = fullBackup.journalEntries || {};
    const totalDates = Object.keys(journalData).length;
    logger.debug('CREATE MONTHS', 'Total journal dates to partition:', totalDates);

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
        logger.debug('CREATE MONTHS', 'Created new month document for:', monthKey);
      }

      monthDocs.get(monthKey)!.journalEntries[dateString] = entries as any[];
    }

    logger.debug('CREATE MONTHS', '✅ Created', monthDocs.size, 'month documents');
    for (const [monthKey, monthDoc] of monthDocs.entries()) {
      const daysInMonth = Object.keys(monthDoc.journalEntries).length;
      logger.debug('CREATE MONTHS', '  -', monthKey + ':', daysInMonth, 'days');
    }

    return monthDocs;
  }

  /**
   * Push a single document to cloud (generic helper)
   */
  private async pushDocument(docId: string, data: any): Promise<string> {
    try {
      logger.debug('PUSH DOC', 'Starting push for', docId);
      const dataString = JSON.stringify(data);
      const dataSizeKB = (dataString.length / 1024).toFixed(2);
      logger.debug('PUSH DOC', '  Data size:', dataSizeKB, 'KB');

      logger.debug('PUSH DOC', '  Encrypting data...');
      const encrypted = await CryptoUtils.encrypt(
        dataString,
        this.settings!.encryptionKey!
      );
      logger.debug('PUSH DOC', '  Encrypted size:', (encrypted.length / 1024).toFixed(2), 'KB');

      logger.debug('PUSH DOC', '  Sending PUT request to worker...');
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
      logger.debug('PUSH DOC', '✅ Push successful. LastModified:', lastModified);
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
      logger.debug('NEEDS PULL?', 'Checking', docId);
      logger.debug('NEEDS PULL?', '  Local lastModified:', localLastModified || '(none)');

      const response = await fetch(`${this.settings!.workerUrl}/sync/${docId}`, {
        method: 'HEAD'
      });

      if (response.status === 404) {
        logger.debug('NEEDS PULL?', '  Result: NO - Document not found (404)');
        return false;
      }
      if (!response.ok) {
        logger.debug('NEEDS PULL?', '  Result: NO - Request failed (status:', response.status + ')');
        return false;
      }

      const remoteLastModified = response.headers.get('Last-Modified') || response.headers.get('X-Last-Modified');
      logger.debug('NEEDS PULL?', '  Remote lastModified:', remoteLastModified || '(none)');

      if (!remoteLastModified) {
        logger.debug('NEEDS PULL?', '  Result: YES - No remote timestamp (assume needs pull)');
        return true;
      }

      if (!localLastModified) {
        logger.debug('NEEDS PULL?', '  Result: YES - No local timestamp (first pull)');
        return true;
      }

      const remoteTime = new Date(remoteLastModified).getTime();
      const localTime = new Date(localLastModified).getTime();
      const needsUpdate = remoteTime > localTime;

      logger.debug('NEEDS PULL?', '  Result:', needsUpdate ? 'YES' : 'NO', '- Remote time:', remoteTime, 'Local time:', localTime);
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
      logger.debug('PULL DOC', 'Starting pull for', docId);
      logger.debug('PULL DOC', '  Sending GET request to worker...');

      const response = await fetch(`${this.settings!.workerUrl}/sync/${docId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 404) {
        logger.debug('PULL DOC', '  Result: Document not found (404)');
        return null;
      }
      if (!response.ok) {
        console.error('[PULL DOC] ❌ Failed to pull', docId, '- Status:', response.status);
        throw new Error(`Failed to pull ${docId}: ${response.status}`);
      }

      logger.debug('PULL DOC', '  Parsing response...');
      const result = await response.json();
      if (!result.success || !result.encrypted) {
        logger.debug('PULL DOC', '  No encrypted data in response');
        return null;
      }

      logger.debug('PULL DOC', '  Encrypted size:', (result.encrypted.length / 1024).toFixed(2), 'KB');
      logger.debug('PULL DOC', '  Decrypting data...');
      const decrypted = await CryptoUtils.decrypt(result.encrypted, this.settings!.encryptionKey!);

      logger.debug('PULL DOC', '  Parsing decrypted JSON...');
      const data = JSON.parse(decrypted);

      const dataSizeKB = (decrypted.length / 1024).toFixed(2);
      logger.debug('PULL DOC', '✅ Pull successful. Size:', dataSizeKB, 'KB, LastModified:', result.lastModified);

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
    logger.debug('APPLY PERSISTENT', 'Applying persistent data changes');

    // Update preferences
    if (persistentData.preferences) {
      logger.debug('APPLY PERSISTENT', 'Updating preferences');
      calciumState.update(state => ({
        ...state,
        settings: persistentData.preferences
      }));
      await calciumService.saveSettings();
    }

    // Apply custom foods (merge - CalciumService handles duplicates)
    if (persistentData.customFoods && Array.isArray(persistentData.customFoods)) {
      logger.debug('APPLY PERSISTENT', 'Merging', persistentData.customFoods.length, 'custom foods');
      for (const customFood of persistentData.customFoods) {
        try {
          await calciumService.saveCustomFoodToIndexedDB(customFood);
        } catch (error) {
          console.warn('[APPLY PERSISTENT] Failed to apply custom food:', customFood.name, error);
        }
      }

      // Reload custom foods into state
      logger.debug('APPLY PERSISTENT', 'Reloading custom foods into state...');
      await calciumService.loadCustomFoods();
    }

    // Apply favorites (merge with existing)
    if (persistentData.favorites && Array.isArray(persistentData.favorites)) {
      logger.debug('APPLY PERSISTENT', 'Applying', persistentData.favorites.length, 'favorites');
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
      logger.debug('APPLY PERSISTENT', 'Applying', persistentData.hiddenFoods.length, 'hidden foods');
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
      logger.debug('APPLY PERSISTENT', 'Applying', persistentData.servingPreferences.length, 'serving preferences');
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

    logger.debug('APPLY PERSISTENT', '✅ Persistent data applied');
  }

  // In src/lib/services/SyncService.ts

  /**
   * Joins an existing sync document using a sync URL.
   * @param syncUrl The sync URL containing document ID and encryption key
   * @throws Error if URL is invalid or join fails
   */
  async joinExistingSyncDoc(syncUrl: string): Promise<void> {
    logger.debug('JOIN SYNC', 'Joining existing sync document...');
    this.checkSyncEnabled();

    try {
      setSyncStatus('syncing');

      logger.debug('JOIN SYNC', 'Parsing sync URL...');
      const url = new URL(syncUrl);
      const params = new URLSearchParams(url.hash.substring(1));
      const docId = params.get('sync');
      const encodedKeyString = params.get('key');

      if (!docId || !encodedKeyString) {
        console.error('[JOIN SYNC] ❌ Invalid sync URL format');
        throw new Error('Invalid sync URL format');
      }

      logger.debug('JOIN SYNC', 'DocId:', docId);
      logger.debug('JOIN SYNC', 'Importing encryption key...');
      const keyString = decodeURIComponent(encodedKeyString);
      const encryptionKey = await CryptoUtils.importKey(keyString);
      logger.debug('JOIN SYNC', 'Encryption key imported successfully');

      // Step 1: First, fetch the remote data to learn the correct generation ID
      logger.debug('JOIN SYNC', 'Fetching remote metadata document to get syncGenerationId...');
      const metadataDocId = getDocumentId(docId, 'metadata');
      const response = await fetch(`${this.workerUrl}/sync/${metadataDocId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 404) {
        logger.debug('JOIN SYNC', 'Remote metadata not found (404) - will create new generation ID');
      } else if (!response.ok) {
        console.error('[JOIN SYNC] ❌ Server error:', response.status);
        throw new Error(`Server error: ${response.status}`);
      }

      let remoteGenerationId = null;

      if (response.status !== 404) {
        logger.debug('JOIN SYNC', 'Parsing remote metadata...');
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

        logger.debug('JOIN SYNC', 'Remote SyncGenerationId:', remoteGenerationId);
        logger.debug('JOIN SYNC', 'Remote available months:', metadataDoc.availableMonths?.length || 0);
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

      logger.debug('JOIN SYNC', 'Saving settings to localStorage...');
      await this.saveSettings();

      logger.debug('JOIN SYNC', 'Performing initial pull from cloud...');
      await this.pullFromCloud();

      syncState.update(state => ({
        ...state,
        docId,
        isEnabled: true,
        status: 'synced',
        lastSync: new Date().toISOString()
      }));

      logger.debug('JOIN SYNC', 'Starting auto-sync...');
      this.startAutoSync();
      logger.debug('JOIN SYNC', '✅ Successfully joined sync!');
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
    logger.debug('BIDIRECTIONAL SYNC', '═══════════════════════════════════════════');
    logger.debug('BIDIRECTIONAL SYNC', '🔄 Starting full bidirectional sync');
    logger.debug('BIDIRECTIONAL SYNC', '═══════════════════════════════════════════');

    this.checkSyncEnabled();

    if (!navigator.onLine) {
      logger.debug('BIDIRECTIONAL SYNC', '⚠️ Offline - queueing sync for later');
      this.isSyncPending = true;
      setSyncStatus('offline');
      return;
    }

    if (!this.settings || !get(syncState).isEnabled) {
      logger.debug('BIDIRECTIONAL SYNC', '⚠️ Sync not enabled or settings missing');
      return;
    }

    logger.debug('BIDIRECTIONAL SYNC', 'Settings:', {
      docId: this.settings.docId,
      hasDocumentState: !!this.settings.documentState,
      monthsTracked: Object.keys(this.settings.documentState?.months || {}).length
    });

    setSyncStatus('syncing');

    try {
      logger.debug('BIDIRECTIONAL SYNC', 'Step 1/2: Pulling from cloud...');
      const startPull = Date.now();
      await this.pullFromCloud();
      const pullDuration = Date.now() - startPull;
      logger.debug('BIDIRECTIONAL SYNC', '✅ Pull completed in', pullDuration, 'ms');

      logger.debug('BIDIRECTIONAL SYNC', 'Step 2/2: Pushing to cloud...');
      const startPush = Date.now();
      await this.pushToCloud();
      const pushDuration = Date.now() - startPush;
      logger.debug('BIDIRECTIONAL SYNC', '✅ Push completed in', pushDuration, 'ms');

      const totalDuration = Date.now() - startPull;
      logger.debug('BIDIRECTIONAL SYNC', '═══════════════════════════════════════════');
      logger.debug('BIDIRECTIONAL SYNC', '✅ Bidirectional sync completed successfully');
      logger.debug('BIDIRECTIONAL SYNC', 'Total time:', totalDuration, 'ms');
      logger.debug('BIDIRECTIONAL SYNC', '═══════════════════════════════════════════');

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
    logger.debug('AUTO SYNC', 'startAutoSync called');
    if (!this.settings) {
      logger.debug('AUTO SYNC', 'No settings, cannot start auto-sync');
      return;
    }
    if (this.isAutoSyncEnabled) {
      logger.debug('AUTO SYNC', 'Auto-sync already enabled, skipping');
      return;
    }

    logger.debug('AUTO SYNC', 'Starting auto-sync...');
    this.isAutoSyncEnabled = true;

    logger.debug('AUTO SYNC', 'Setting up 60-second interval for periodic pulls...');
    this.autoSyncInterval = window.setInterval(async () => {
      if (this.settings && get(syncState).isEnabled) {
        logger.debug('AUTO SYNC', 'Periodic pull triggered (60s interval)');
        await this.pullFromCloud().catch(err => console.warn('[AUTO SYNC] Auto-sync pull failed:', err));
      }
    }, 60000);

    logger.debug('AUTO SYNC', 'Registering window focus event listener...');
    window.addEventListener('focus', this.handleWindowFocus.bind(this));

    logger.debug('AUTO SYNC', 'Registering visibility change event listener...');
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    logger.debug('AUTO SYNC', '✅ Auto-sync started successfully');
  }

  /**
   * Stops all automatic sync operations and removes event listeners.
   */
  stopAutoSync(): void {
    logger.debug('AUTO SYNC', 'stopAutoSync called');
    if (!this.isAutoSyncEnabled) {
      logger.debug('AUTO SYNC', 'Auto-sync not enabled, nothing to stop');
      return;
    }

    logger.debug('AUTO SYNC', 'Stopping auto-sync...');
    this.isAutoSyncEnabled = false;

    if (this.autoSyncInterval) {
      logger.debug('AUTO SYNC', 'Clearing periodic interval...');
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }

    logger.debug('AUTO SYNC', 'Removing window focus event listener...');
    window.removeEventListener('focus', this.handleWindowFocus.bind(this));

    logger.debug('AUTO SYNC', 'Removing visibility change event listener...');
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    logger.debug('AUTO SYNC', '✅ Auto-sync stopped successfully');
  }

  private async handleWindowFocus(): Promise<void> {
    logger.debug('WINDOW FOCUS', 'Window focus event detected');
    if (this.settings && get(syncState).isEnabled) {
      logger.debug('WINDOW FOCUS', 'Sync enabled, triggering pull from cloud...');
      await this.pullFromCloud().catch(err => console.warn('[WINDOW FOCUS] Focus sync failed:', err));
    } else {
      logger.debug('WINDOW FOCUS', 'Sync not enabled or no settings, skipping pull');
    }
  }

  private async handleVisibilityChange(): Promise<void> {
    logger.debug('VISIBILITY', 'Visibility change event detected. Document hidden:', document.hidden);
    if (!document.hidden && this.settings && get(syncState).isEnabled) {
      logger.debug('VISIBILITY', 'Document visible and sync enabled, triggering pull from cloud...');
      await this.pullFromCloud().catch(err => console.warn('[VISIBILITY] Visibility sync failed:', err));
    } else {
      logger.debug('VISIBILITY', 'Document hidden or sync not enabled, skipping pull');
    }
  }

  /**
   * Disconnects from sync by clearing settings and stopping auto-sync.
   */
  async disconnectSync(): Promise<void> {
    logger.debug('DISCONNECT SYNC', 'Disconnecting from sync...');

    // Stop auto-sync
    logger.debug('DISCONNECT SYNC', 'Stopping auto-sync...');
    this.stopAutoSync();

    // Clear sync settings
    logger.debug('DISCONNECT SYNC', 'Clearing sync settings from memory...');
    this.settings = null;
    this.encryptionKeyString = null;

    // Remove from localStorage
    logger.debug('DISCONNECT SYNC', 'Removing sync settings from localStorage...');
    localStorage.removeItem('calcium_sync_settings');

    // Update sync state
    logger.debug('DISCONNECT SYNC', 'Updating sync state to offline...');
    syncState.update(state => ({
      ...state,
      docId: null,
      isEnabled: false,
      status: 'offline',
      error: null,
      lastSync: null
    }));

    logger.debug('DISCONNECT SYNC', '✅ Disconnected from sync');
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
    logger.debug('NETWORK', 'Online status detected');
    if (this.isSyncPending) {
      logger.debug('NETWORK', 'Pending sync detected, triggering bidirectional sync...');
      showToast("Connection restored. Syncing changes...", "info");
      this.isSyncPending = false;
      await this.performBidirectionalSync();
    } else {
      if (get(syncState).isEnabled) {
        logger.debug('NETWORK', 'Sync enabled, setting status to synced');
        setSyncStatus('synced');
      } else {
        logger.debug('NETWORK', 'Sync not enabled, no action taken');
      }
    }
  }

  private handleOfflineStatus(): void {
    logger.debug('NETWORK', 'Offline status detected, setting sync status to offline');
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