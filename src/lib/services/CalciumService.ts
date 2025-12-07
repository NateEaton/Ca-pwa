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
import { calciumState, showToast } from '$lib/stores/calcium';
import type { FoodEntry, CustomFood, CalciumSettings, UserServingPreference } from '$lib/types/calcium';
import { DEFAULT_FOOD_DATABASE, getPrimaryMeasure } from '$lib/data/foodDatabase';
import { SyncService } from '$lib/services/SyncService';
import { SyncTrigger } from '$lib/utils/syncTrigger';
import { getBuildInfo } from '$lib/utils/buildInfo';
import { getMonthKey } from '$lib/types/sync';
import { logger } from '$lib/utils/logger';

/**
 * Main service class for managing calcium tracking data including foods, settings, and IndexedDB operations.
 * Handles CRUD operations, data migration, favorites, and backup/restore functionality.
 */
export class CalciumService {
  private db: IDBDatabase | null = null;
  private foodDatabase: any[] = DEFAULT_FOOD_DATABASE;
  private nextCustomFoodId: number = -1;

  /**
   * Initializes the service by setting up IndexedDB, running migrations, and loading all data.
   */
  async initialize(): Promise<void> {
    await this.initializeIndexedDB();
    await this.migrateCustomFoodsIfNeeded();
    await this.migrateFavoritesToIDsIfNeeded();

    // Initialize negative ID counter after database setup
    await this.initializeCustomFoodIdCounter();

    // Migrate existing positive ID custom foods to negative IDs
    await this.migrateExistingCustomFoods();

    // Migrate existing custom foods to include source metadata
    await this.migrateCustomFoodsToSourceMetadata();

    await this.loadSettings();
    await this.loadDailyFoods();
    await this.loadCustomFoods();
    await this.loadFavorites();
    await this.loadHiddenFoods();
    await this.loadServingPreferences();
    await this.applySortToFoods();

    calciumState.update(state => ({ ...state, isLoading: false }));
  }

  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CalciumTracker', 7);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;

        if (!db.objectStoreNames.contains('customFoods')) {
          const store = db.createObjectStore('customFoods', { keyPath: 'id', autoIncrement: true });
          store.createIndex('name', 'name', { unique: false });
          store.createIndex('dateAdded', 'dateAdded', { unique: false });
        }
        if (!db.objectStoreNames.contains('migrations')) {
          db.createObjectStore('migrations', { keyPath: 'name' });
        }
        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: 'foodId' });
        }
        if (!db.objectStoreNames.contains('servingPreferences')) {
          db.createObjectStore('servingPreferences', { keyPath: 'foodId' });
        }
        if (oldVersion < 6 && !db.objectStoreNames.contains('journalEntries')) {
          const journalStore = db.createObjectStore('journalEntries', { keyPath: 'date' });
          journalStore.createIndex('lastModified', 'lastModified', { unique: false });
          journalStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        }
        if (oldVersion < 7 && !db.objectStoreNames.contains('hiddenFoods')) {
          db.createObjectStore('hiddenFoods', { keyPath: 'foodId' });
        }
      };
    });
  }

  private async initializeCustomFoodIdCounter(): Promise<void> {
    if (!this.db) return;
    
    const transaction = this.db.transaction(['customFoods'], 'readonly');
    const store = transaction.objectStore('customFoods');
    const request = store.getAll();
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const customFoods = request.result;
        if (customFoods.length > 0) {
          // Find the most negative ID and go one lower
          const minId = Math.min(...customFoods.map(f => f.id));
          this.nextCustomFoodId = minId < 0 ? minId - 1 : -1;
        }
        resolve();
      };
      request.onerror = () => {
        console.error('Error initializing custom food ID counter:', request.error);
        resolve();
      };
    });
  }

  private async migrateCustomFoodsIfNeeded(): Promise<void> {
    if (!this.db) return;

    const migrationStatus = await this.getMigrationStatus('customFoodsToIndexedDB');
    if (migrationStatus) return;

    try {
      const legacyCustomFoods = this.getLegacyCustomFoods();

      if (legacyCustomFoods.length > 0) {

        for (const food of legacyCustomFoods) {
          await this.saveCustomFoodToIndexedDB({
            name: food.name,
            calcium: food.calcium,
            measure: food.measure || food.servingUnit || 'serving'
          });
        }

        this.clearLegacyCustomFoods();
      }

      await this.setMigrationStatus('customFoodsToIndexedDB', true);
    } catch (error) {
      console.error('Custom foods migration failed:', error);
    }
  }

  private async migrateFavoritesToIDsIfNeeded(): Promise<void> {
    if (!this.db) return;

    const migrationStatus = await this.getMigrationStatus('favoritesToIDs');
    if (migrationStatus) return;

    try {
      const transaction = this.db.transaction(['favorites'], 'readonly');
      const store = transaction.objectStore('favorites');
      const request = store.getAll();

      const legacyFavorites = await new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      if (legacyFavorites.length > 0) {
        const favoriteFoodIds: number[] = [];

        for (const favRecord of legacyFavorites) {
          const foodName = favRecord.foodName;
          const databaseFood = this.foodDatabase.find(food => food.name === foodName);
          if (databaseFood) {
            favoriteFoodIds.push(databaseFood.id);
          }
        }

        if (favoriteFoodIds.length > 0) {
          const writeTransaction = this.db.transaction(['favorites'], 'readwrite');
          const writeStore = writeTransaction.objectStore('favorites');

          await new Promise<void>((resolve, reject) => {
            const clearRequest = writeStore.clear();
            clearRequest.onsuccess = () => resolve();
            clearRequest.onerror = () => reject(clearRequest.error);
          });

          for (const foodId of favoriteFoodIds) {
            const favoriteData = {
              foodId,
              dateAdded: new Date().toISOString()
            };

            await new Promise<void>((resolve, reject) => {
              const addRequest = writeStore.put(favoriteData);
              addRequest.onsuccess = () => resolve();
              addRequest.onerror = () => reject(addRequest.error);
            });
          }

        }
      }

      await this.setMigrationStatus('favoritesToIDs', true);
    } catch (error) {
      console.error('Favorites migration failed:', error);
    }
  }

  private async migrateExistingCustomFoods(): Promise<void> {
    if (!this.db) return;

    const migrationStatus = await this.getMigrationStatus('customFoodsToNegativeIDs');
    if (migrationStatus) return;

    try {
      const transaction = this.db.transaction(['customFoods'], 'readonly');
      const store = transaction.objectStore('customFoods');
      const request = store.getAll();

      const customFoods = await new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      const positiveFoods = customFoods.filter(f => f.id > 0);
      
      if (positiveFoods.length > 0) {
        // Create mapping of old positive IDs to new negative IDs
        const idMapping = new Map<number, number>();
        positiveFoods.forEach((food, index) => {
          const newId = this.nextCustomFoodId - index;
          idMapping.set(food.id, newId);
        });

        // Update journal entries with the new ID mapping
        await this.updateJournalEntriesCustomFoodIds(idMapping);

        // Update custom foods with new negative IDs
        for (const food of positiveFoods) {
          const newId = idMapping.get(food.id)!;
          const newFood = { ...food, id: newId };
          await this.saveCustomFoodToIndexedDB(newFood);
          await this.deleteCustomFoodFromIndexedDB(food.id);
        }

        // Update counter for next custom foods
        this.nextCustomFoodId -= positiveFoods.length;
      }

      await this.setMigrationStatus('customFoodsToNegativeIDs', true);
    } catch (error) {
      console.error('Custom foods negative ID migration failed:', error);
    }
  }

  /**
   * Migrates existing custom foods to include source metadata with default values.
   * This ensures backward compatibility when the sourceMetadata field is added.
   */
  private async migrateCustomFoodsToSourceMetadata(): Promise<void> {
    if (!this.db) return;

    const migrationStatus = await this.getMigrationStatus('customFoodsToSourceMetadata');
    if (migrationStatus) return;

    try {
      const transaction = this.db.transaction(['customFoods'], 'readwrite');
      const store = transaction.objectStore('customFoods');
      const request = store.getAll();

      const allCustomFoods = await new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      // Update each custom food that doesn't have sourceMetadata
      for (const food of allCustomFoods) {
        if (!food.sourceMetadata) {
          const updatedFood = {
            ...food,
            sourceMetadata: {
              sourceType: null // Unknown source for existing foods
            }
          };

          const putTransaction = this.db.transaction(['customFoods'], 'readwrite');
          const putStore = putTransaction.objectStore('customFoods');

          await new Promise<void>((resolve, reject) => {
            const putRequest = putStore.put(updatedFood);
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => reject(putRequest.error);
          });
        }
      }

      await this.setMigrationStatus('customFoodsToSourceMetadata', true);
    } catch (error) {
      console.error('Custom foods source metadata migration failed:', error);
    }
  }

  private async deleteCustomFoodFromIndexedDB(id: number): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['customFoods'], 'readwrite');
      const store = transaction.objectStore('customFoods');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async updateJournalEntriesCustomFoodIds(idMapping: Map<number, number>): Promise<void> {
    if (!this.db) return;

    try {
      const journalEntries = await this.getAllJournalEntries();
      
      for (const entry of journalEntries) {
        let needsUpdate = false;
        const updatedFoods = entry.foods.map((food: any) => {
          if (food.isCustom && food.customFoodId && food.customFoodId > 0) {
            const newId = idMapping.get(food.customFoodId);
            if (newId) {
              needsUpdate = true;
              return {
                ...food,
                customFoodId: newId
              };
            }
          }
          return food;
        });

        if (needsUpdate) {
          await this.saveFoodsForDate(entry.date, updatedFoods);
        }
      }
    } catch (error) {
      console.error('Error updating journal entries for custom food ID migration:', error);
    }
  }

  private getLegacyCustomFoods(): any[] {
    try {
      const keys = ['calcium_custom_foods', 'customFoods', 'custom_foods'];

      for (const key of keys) {
        const stored = localStorage.getItem(key);
        if (stored) {
          return JSON.parse(stored);
        }
      }

      return [];
    } catch (error) {
      console.error('Error reading legacy custom foods:', error);
      return [];
    }
  }

  private clearLegacyCustomFoods(): void {
    const keys = ['calcium_custom_foods', 'customFoods', 'custom_foods'];
    keys.forEach(key => localStorage.removeItem(key));
  }

  private async getMigrationStatus(name: string): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['migrations'], 'readonly');
      const store = transaction.objectStore('migrations');
      const request = store.get(name);

      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });
  }

  private async setMigrationStatus(name: string, completed: boolean): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['migrations'], 'readwrite');
      const store = transaction.objectStore('migrations');
      const request = store.put({ name, completed, date: new Date().toISOString() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async applySortToFoods(): Promise<void> {
    const state = get(calciumState);

    const sortedFoods = [...state.foods].sort((a, b) => {
      let comparison = 0;

      switch (state.settings.sortBy) {
        case 'time':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'calcium':
          // Use getPrimaryMeasure for compatibility with both formats
          const aPrimary = getPrimaryMeasure(a);
          const bPrimary = getPrimaryMeasure(b);
          comparison = aPrimary.calcium - bPrimary.calcium;
          break;
      }

      return state.settings.sortOrder === 'asc' ? comparison : -comparison;
    });

    calciumState.update(state => ({
      ...state,
      foods: sortedFoods
    }));
  }

  /**
   * Updates the sort settings for food entries and re-sorts the current food list.
   * @param sortBy The field to sort by
   * @param sortOrder Optional sort order; if not provided, toggles current order
   */
  async updateSort(sortBy: 'time' | 'name' | 'calcium', sortOrder?: 'asc' | 'desc'): Promise<void> {
    const state = get(calciumState);

    let newSortOrder = sortOrder;
    if (!newSortOrder) {
      if (state.settings.sortBy === sortBy) {
        newSortOrder = state.settings.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        newSortOrder = 'desc';
      }
    }

    calciumState.update(state => ({
      ...state,
      settings: {
        ...state.settings,
        sortBy,
        sortOrder: newSortOrder
      }
    }));

    await this.applySortToFoods();

    await this.saveSettings();
  }

  /**
   * Adds a new food entry to the current day's food list.
   * @param food The food entry data (timestamp will be added automatically)
   */
  async addFood(food: Omit<FoodEntry, 'timestamp'>): Promise<void> {
    const newFood: FoodEntry = {
      ...food,
      timestamp: new Date().toISOString()
    };

    calciumState.update(state => ({
      ...state,
      foods: [...state.foods, newFood]
    }));

    await this.applySortToFoods();
    await this.saveDailyFoods();

    // Trigger smart sync for journal entry change
    const currentDate = get(calciumState).currentDate;
    SyncTrigger.triggerDataSync('journal', currentDate);
  }

  /**
   * Removes a food entry at the specified index from the current day's food list.
   * @param index The index of the food entry to remove
   * @throws Error if index is invalid
   */
  async removeFood(index: number): Promise<void> {
    const state = get(calciumState);

    if (index < 0 || index >= state.foods.length) {
      throw new Error('Invalid food index for removal');
    }

    const removedFood = state.foods[index];

    calciumState.update(state => ({
      ...state,
      foods: state.foods.filter((_, i) => i !== index)
    }));

    await this.saveDailyFoods();

    // Trigger smart sync for journal entry change
    const currentDate = get(calciumState).currentDate;
    SyncTrigger.triggerDataSync('journal', currentDate);
  }

  /**
   * Updates a food entry at the specified index while preserving the original timestamp.
   * @param index The index of the food entry to update
   * @param updatedFood The updated food data
   * @throws Error if index is invalid
   */
  async updateFood(index: number, updatedFood: Omit<FoodEntry, 'timestamp'>): Promise<void> {
    const state = get(calciumState);

    if (index < 0 || index >= state.foods.length) {
      throw new Error('Invalid food index for update');
    }

    calciumState.update(state => {
      const foods = [...state.foods];
      foods[index] = {
        ...updatedFood,
        timestamp: foods[index].timestamp
      };
      return { ...state, foods };
    });

    await this.applySortToFoods();
    await this.saveDailyFoods();

    // Trigger smart sync for journal entry change
    const currentDate = get(calciumState).currentDate;
    SyncTrigger.triggerDataSync('journal', currentDate);
  }

  /**
   * Changes the current date, saving current foods and loading foods for the new date.
   * @param newDate The new date string in YYYY-MM-DD format
   */
  async changeDate(newDate: string): Promise<void> {
    await this.saveDailyFoods();

    calciumState.update(state => ({
      ...state,
      currentDate: newDate,
      foods: []
    }));

    await this.loadDailyFoods();
    await this.applySortToFoods();
  }

  /**
   * Gets the current settings.
   * @returns Promise resolving to the current settings
   */
  async getSettings(): Promise<CalciumSettings> {
    const state = get(calciumState);
    return state.settings;
  }

  /**
   * Updates the settings with new values.
   * @param newSettings Partial settings object with values to update
   */
  async updateSettings(newSettings: Partial<CalciumSettings>): Promise<void> {
    calciumState.update(state => ({
      ...state,
      settings: { ...state.settings, ...newSettings }
    }));

    await this.saveSettings();

    // Trigger smart sync for persistent data change (settings)
    SyncTrigger.triggerDataSync('persistent');
  }

  /**
   * Saves a new custom food to IndexedDB.
   * @param foodData The custom food data
   * @returns Promise resolving to the saved custom food or null if failed
   */
  async saveCustomFood(foodData: {
    name: string;
    calcium: number;
    measure: string;
    sourceMetadata?: CustomFood['sourceMetadata']
  }): Promise<CustomFood | null> {
    const result = await this.saveCustomFoodToIndexedDB(foodData);

    // Trigger smart sync for persistent data change (custom food)
    SyncTrigger.triggerDataSync('persistent');
    return result;
  }

  async saveCustomFoodToIndexedDB(foodData: any): Promise<CustomFood | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['customFoods'], 'readwrite');
      const store = transaction.objectStore('customFoods');
      let request: IDBRequest;

      if (foodData.id && foodData.id < 0) {
        // Updating existing custom food
        const dbObject = {
          name: foodData.name,
          calcium: foodData.calcium,
          measure: foodData.measure,
          isCustom: true,
          dateAdded: foodData.dateAdded || new Date().toISOString(),
          id: foodData.id,
          sourceMetadata: foodData.sourceMetadata || {
            sourceType: 'manual',
            dateAdded: new Date().toISOString()
          }
        };
        request = store.put(dbObject);
      } else {
        // Creating new custom food with negative ID
        const newFoodObject = {
          name: foodData.name,
          calcium: foodData.calcium,
          measure: foodData.measure,
          isCustom: true,
          dateAdded: new Date().toISOString(),
          id: this.nextCustomFoodId,
          sourceMetadata: foodData.sourceMetadata || {
            sourceType: 'manual',
            dateAdded: new Date().toISOString()
          }
        };
        
        // Decrement for next custom food
        this.nextCustomFoodId--;
        
        request = store.put(newFoodObject); // Use put instead of add for manual ID
      }

      request.onsuccess = () => {
        const savedFood: CustomFood = {
          name: foodData.name,
          calcium: foodData.calcium,
          measure: foodData.measure,
          isCustom: true,
          dateAdded: foodData.dateAdded || new Date().toISOString(),
          id: foodData.id || this.nextCustomFoodId + 1, // The ID we just used
          sourceMetadata: foodData.sourceMetadata || {
            sourceType: 'manual',
            dateAdded: new Date().toISOString()
          }
        };

        calciumState.update(state => {
          const newCustomFoods = [...state.customFoods.filter(f => f.id !== savedFood.id), savedFood];
          return { ...state, customFoods: newCustomFoods };
        });
        resolve(savedFood);
      };

      request.onerror = (event) => {
        console.error('Error in saveCustomFoodToIndexedDB:', (event.target as IDBRequest).error);
        reject((event.target as IDBRequest).error);
      };
    });
  }

  /**
   * Deletes a custom food from IndexedDB.
   * @param id The ID of the custom food to delete
   */
  async deleteCustomFood(id: number): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['customFoods'], 'readwrite');
      const store = transaction.objectStore('customFoods');
      const request = store.delete(id);

      request.onsuccess = () => {
        calciumState.update(state => ({
          ...state,
          customFoods: state.customFoods.filter(food => food.id !== id)
        }));
        resolve();

        // Trigger smart sync for persistent data change (delete custom food)
        SyncTrigger.triggerDataSync('persistent');
      };

      request.onerror = () => {
        console.error('Error deleting custom food:', request.error);
        showToast('Failed to delete custom food', 'error');
        reject(request.error);
      };
    });
  }

  private async loadSettings(): Promise<void> {
    const dailyGoal = localStorage.getItem('calcium_goal');
    const sortSettings = localStorage.getItem('calcium_sort_settings');
    const theme = localStorage.getItem('calcium_theme');

    const settings: CalciumSettings = {
      dailyGoal: dailyGoal ? parseInt(dailyGoal) : 1000,
      sortBy: 'time',
      sortOrder: 'desc',
      theme: theme || 'auto',
      ...(sortSettings ? JSON.parse(sortSettings) : {})
    };

    calciumState.update(state => ({ ...state, settings }));
  }

  async saveSettings(): Promise<void> {
    const state = get(calciumState);

    localStorage.setItem('calcium_goal', state.settings.dailyGoal.toString());

    if (state.settings.theme) {
      localStorage.setItem('calcium_theme', state.settings.theme);
    }

    const sortSettings = {
      sortBy: state.settings.sortBy,
      sortOrder: state.settings.sortOrder
    };
    localStorage.setItem('calcium_sort_settings', JSON.stringify(sortSettings));
  }

  async loadDailyFoods(): Promise<void> {
    const state = get(calciumState);

    try {
      const foods = await this.loadFoodsForDate(state.currentDate);
      calciumState.update(state => ({ ...state, foods }));
    } catch (error) {
      console.error('Error loading daily foods:', error);
      showToast('Error loading foods for this date', 'error');
    }
  }

  private async saveDailyFoods(): Promise<void> {
    const state = get(calciumState);

    try {
      await this.saveFoodsForDate(state.currentDate, state.foods);
    } catch (error) {
      console.error('Error saving daily foods:', error);
      showToast('Error saving foods', 'error');
    }
  }

  async loadCustomFoods(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['customFoods'], 'readonly');
      const store = transaction.objectStore('customFoods');
      const request = store.getAll();

      request.onsuccess = () => {
        const customFoods: CustomFood[] = (request.result || []).map((food: any) => {
          // Ensure backward compatibility for foods without sourceMetadata
          if (!food.sourceMetadata) {
            food.sourceMetadata = {
              sourceType: null
            };
          }

          return {
            ...food,
            isCustom: true
          };
        });

        calciumState.update(state => ({ ...state, customFoods }));
        resolve();
      };

      request.onerror = () => {
        console.error('Error loading custom foods:', request.error);
        resolve();
      };
    });
  }

  /**
   * Generates a complete backup of all user data including settings, foods, and sync metadata.
   * @returns Promise resolving to the backup data object
   */
  async generateBackup(): Promise<any> {
    logger.debug('GENERATE BACKUP', 'Starting backup generation...');
    const state = get(calciumState);
    const syncService = SyncService.getInstance();
    const syncSettings = syncService.getSettings();

    const buildInfo = getBuildInfo();

    logger.debug('GENERATE BACKUP', 'Fetching all journal data...');
    const journalEntries = await this.getAllJournalData();
    const journalDates = Object.keys(journalEntries).length;
    logger.debug('GENERATE BACKUP', 'Journal dates:', journalDates);

    logger.debug('GENERATE BACKUP', 'Fetching custom foods...');
    const customFoods = await this.getAllCustomFoods();
    logger.debug('GENERATE BACKUP', 'Custom foods:', customFoods.length);

    const backup = {
      metadata: {
        version: '2.1.0',
        createdAt: new Date().toISOString(),
        appVersion: buildInfo.appVersion,
        buildId: buildInfo.buildId,
        buildTime: buildInfo.buildTime,
        syncGenerationId: syncSettings ? syncSettings.syncGenerationId : null
      },
      preferences: state.settings,
      customFoods: customFoods,
      favorites: Array.from(state.favorites),
      hiddenFoods: Array.from(state.hiddenFoods),
      servingPreferences: Array.from(state.servingPreferences.values()),
      journalEntries
    };

    logger.debug('GENERATE BACKUP', '✅ Backup generated:', {
      journalDates,
      customFoods: customFoods.length,
      favorites: backup.favorites.length,
      hiddenFoods: backup.hiddenFoods.length,
      servingPreferences: backup.servingPreferences.length,
      syncGenerationId: backup.metadata.syncGenerationId
    });

    return backup;
  }

  /**
   * Restores all data from a backup, optionally preserving sync settings.
   * @param backupData The backup data to restore
   * @param options Restore options including whether to preserve sync settings and regenerate sync ID
   */
  async restoreFromBackup(backupData: any, options: {
    preserveSync: boolean,
    regenerateId?: boolean
  } = { preserveSync: false, regenerateId: true }): Promise<void> {
    try {
      logger.debug('RESTORE', 'Starting restore from backup. preserveSync:', options.preserveSync, 'regenerateId:', options.regenerateId);
      logger.debug('RESTORE', 'Backup data summary:', {
        hasPreferences: !!backupData.preferences,
        customFoodsCount: backupData.customFoods?.length || 0,
        favoritesCount: backupData.favorites?.length || 0,
        journalDates: Object.keys(backupData.journalEntries || {}).length
      });

      const syncService = SyncService.getInstance();

      if (options.preserveSync) {
        logger.debug('RESTORE', 'Clearing application data (preserving sync)...');
        await this.clearApplicationData();

        // Only regenerate sync ID if explicitly requested
        // Default is true for backward compatibility, but pullFromCloud will pass false
        if (options.regenerateId !== false) {
          logger.debug('RESTORE', 'Regenerating sync ID...');
          await syncService.regenerateSyncId();
        } else {
          logger.debug('RESTORE', 'Keeping existing sync generation ID (cloud pull mode)');
        }
      } else {
        logger.debug('RESTORE', 'Clearing ALL data (including sync)...');
        await this.clearAllData();
      }

      logger.debug('RESTORE', 'Waiting 300ms for IndexedDB operations to complete...');
      // Allow more time for IndexedDB operations to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      logger.debug('RESTORE', 'Reinitializing custom food ID counter...');
      // Reinitialize the custom food ID counter after clearing data
      this.nextCustomFoodId = -1;
      await this.initializeCustomFoodIdCounter();

      // Verify database connection is still valid
      logger.debug('RESTORE', 'Verifying database connection...');
      if (!this.db || this.db.readyState !== 'done' || !this.db.objectStoreNames.contains('customFoods')) {
        console.warn('[RESTORE] ⚠️ Database connection unstable, reinitializing...');
        await this.initializeIndexedDB();
        await this.initializeCustomFoodIdCounter();
        logger.debug('RESTORE', 'Database reinitialized successfully');
      } else {
        logger.debug('RESTORE', 'Database connection is stable');
      }

      if (backupData.preferences) {
        logger.debug('RESTORE', 'Restoring preferences...');
        // Merge preferences instead of replacing to prevent data loss if backup is incomplete
        calciumState.update(state => ({
          ...state,
          settings: { ...state.settings, ...backupData.preferences }
        }));
        await this.saveSettings();
        logger.debug('RESTORE', 'Preferences restored (merged)');
      }

      if (backupData.customFoods && Array.isArray(backupData.customFoods)) {
        logger.debug('RESTORE', 'Restoring', backupData.customFoods.length, 'custom foods...');
        let restoredCount = 0;
        for (const customFood of backupData.customFoods) {
          try {
            if (customFood.id < 0) {
              // Restore with existing negative ID
              await this.saveCustomFoodToIndexedDB(customFood);
              // Update counter if this ID is more negative
              if (customFood.id < this.nextCustomFoodId) {
                this.nextCustomFoodId = customFood.id - 1;
              }
            } else {
              // Convert positive ID to negative (migration scenario)
              const newCustomFood = { ...customFood, id: this.nextCustomFoodId };
              await this.saveCustomFoodToIndexedDB(newCustomFood);
              this.nextCustomFoodId--;
            }
            restoredCount++;
          } catch (error) {
            console.error('[RESTORE] ❌ Error restoring custom food:', customFood.name, error);
            // Continue with other custom foods even if one fails
          }
        }
        logger.debug('RESTORE', 'Custom foods restored:', restoredCount, '/', backupData.customFoods.length);
      }

      if (backupData.favorites && Array.isArray(backupData.favorites)) {
        logger.debug('RESTORE', 'Restoring', backupData.favorites.length, 'favorites...');
        await this.restoreFavorites(backupData.favorites);
        logger.debug('RESTORE', 'Favorites restored');
      }

      if (backupData.hiddenFoods && Array.isArray(backupData.hiddenFoods)) {
        logger.debug('RESTORE', 'Restoring', backupData.hiddenFoods.length, 'hidden foods...');
        await this.restoreHiddenFoods(backupData.hiddenFoods);
        logger.debug('RESTORE', 'Hidden foods restored');
      }

      if (backupData.servingPreferences && Array.isArray(backupData.servingPreferences)) {
        logger.debug('RESTORE', 'Restoring', backupData.servingPreferences.length, 'serving preferences...');
        await this.restoreServingPreferences(backupData.servingPreferences);
        logger.debug('RESTORE', 'Serving preferences restored');
      }

      if (backupData.journalEntries) {
        const journalDates = Object.keys(backupData.journalEntries);
        logger.debug('RESTORE', 'Restoring journal entries for', journalDates.length, 'dates...');
        let restoredDates = 0;
        for (const [dateString, foods] of Object.entries(backupData.journalEntries)) {
          if (Array.isArray(foods)) {
            await this.saveFoodsForDate(dateString, foods as FoodEntry[]);
            restoredDates++;
            if (restoredDates % 10 === 0) {
              logger.debug('RESTORE', 'Progress:', restoredDates, '/', journalDates.length, 'dates restored');
            }
          }
        }
        logger.debug('RESTORE', 'Journal entries restored for all', restoredDates, 'dates');
      }

      logger.debug('RESTORE', 'Waiting 200ms before reloading data...');
      await new Promise(resolve => setTimeout(resolve, 200));

      logger.debug('RESTORE', 'Reloading all data into state...');
      await this.loadSettings();
      await this.loadCustomFoods();
      await this.loadFavorites();
      await this.loadHiddenFoods();
      await this.loadServingPreferences();
      await this.loadDailyFoods();
      await this.applySortToFoods();
      logger.debug('RESTORE', '✅ Restore completed successfully');

    } catch (error) {
      console.error('[RESTORE] ❌ FATAL ERROR during restore:', error);
      throw error;
    }
  }

private async clearAllData(): Promise<void> {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('calcium_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    await this.clearApplicationData();
  }

  /**
   * Clears all application data from IndexedDB while preserving sync settings.
   */
  async clearApplicationData(): Promise<void> {
    logger.debug('CLEAR DATA', 'Starting to clear all application data from IndexedDB');
    if (!this.db) {
      console.warn('[CLEAR DATA] ⚠️ Database connection not available for clearing IndexedDB data');
      return;
    }

    const storesToClear = ['journalEntries', 'customFoods', 'favorites', 'hiddenFoods', 'servingPreferences'];
    logger.debug('CLEAR DATA', 'Clearing', storesToClear.length, 'stores:', storesToClear);

    for (const storeName of storesToClear) {
      try {
        logger.debug('CLEAR DATA', 'Clearing store:', storeName);
        await new Promise<void>((resolve, reject) => {
          const transaction = this.db!.transaction([storeName], 'readwrite');
          const request = transaction.objectStore(storeName).clear();
          request.onsuccess = () => {
            logger.debug('CLEAR DATA', '✅ Cleared store:', storeName);
            resolve();
          };
          request.onerror = () => {
            console.error('[CLEAR DATA] ❌ Error clearing store:', storeName, request.error);
            reject(request.error);
          };
        });
      } catch (error) {
        console.error(`[CLEAR DATA] ❌ Error clearing IndexedDB store ${storeName}:`, error);
      }
    }

    logger.debug('CLEAR DATA', '✅ All IndexedDB stores cleared successfully');
  }

  private async getAllCustomFoods(): Promise<CustomFood[]> {
    if (!this.db) {
      return [];
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['customFoods'], 'readonly');
      const store = transaction.objectStore('customFoods');
      const request = store.getAll();

      request.onsuccess = () => {
        const customFoods: CustomFood[] = (request.result || []).map((food: any) => ({
          ...food,
          isCustom: true
        }));
        resolve(customFoods);
      };

      request.onerror = () => {
        console.error('Error loading custom foods for backup:', request.error);
        resolve([]);
      };
    });
  }

  /**
   * Saves a user's preferred serving size for a specific food.
   * @param foodId The ID of the food
   * @param quantity The preferred quantity
   * @param unit The preferred unit
   * @param measureIndex Optional: index of preferred measure for multi-measure foods
   */
  async saveServingPreference(foodId: number, quantity: number, unit: string, measureIndex?: number): Promise<void> {
    if (!this.db) return;

    const preference: UserServingPreference = {
      foodId,
      preferredQuantity: quantity,
      preferredUnit: unit,
      lastUsed: new Date().toISOString(),
      ...(measureIndex !== undefined && { preferredMeasureIndex: measureIndex })
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['servingPreferences'], 'readwrite');
      const store = transaction.objectStore('servingPreferences');
      const request = store.put(preference);

      request.onsuccess = () => {
        calciumState.update(state => {
          const newPreferences = new Map(state.servingPreferences);
          newPreferences.set(foodId, preference);
          return { ...state, servingPreferences: newPreferences };
        });
        resolve();

        // Trigger smart sync for persistent data change (serving preference)
        SyncTrigger.triggerDataSync('persistent');
      };

      request.onerror = () => {
        console.error('Error saving serving preference:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Gets the user's saved serving preference for a specific food.
   * @param foodId The ID of the food
   * @returns The serving preference or null if none exists
   */
  getServingPreference(foodId: number): UserServingPreference | null {
    const state = get(calciumState);
    return state.servingPreferences.get(foodId) || null;
  }

  /**
   * Deletes a user's serving preference for a specific food.
   * @param foodId The ID of the food
   */
  async deleteServingPreference(foodId: number): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['servingPreferences'], 'readwrite');
      const store = transaction.objectStore('servingPreferences');
      const request = store.delete(foodId);

      request.onsuccess = () => {
        calciumState.update(state => {
          const newPreferences = new Map(state.servingPreferences);
          newPreferences.delete(foodId);
          return { ...state, servingPreferences: newPreferences };
        });
        resolve();

        // Trigger smart sync for persistent data change (delete serving preference)
        SyncTrigger.triggerDataSync('persistent');
      };

      request.onerror = () => {
        console.error('Error deleting serving preference:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get all journal entries from localStorage for reporting (DEPRECATED - use getAllJournalData)
   */
  /**
   * Gets all journal entries from localStorage (deprecated - use getAllJournalData).
   * @returns Promise resolving to a record of date strings to food entry arrays
   * @deprecated Use getAllJournalData instead
   */
  async getAllEntries(): Promise<Record<string, FoodEntry[]>> {
    const journalData: Record<string, FoodEntry[]> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('calcium_foods_')) {
        const date = key.replace('calcium_foods_', '');
        try {
          const foods = JSON.parse(localStorage.getItem(key) || '[]');
          if (foods && foods.length > 0) {
            journalData[date] = foods;
          }
        } catch (error) {
          console.error(`Error parsing journal data for ${date}:`, error);
        }
      }
    }

    return journalData;
  }

  /**
   * Get all journal data from IndexedDB in the format expected by stats page
   */
  /**
   * Gets all journal data from IndexedDB in the format expected by stats page.
   * @returns Promise resolving to a record of date strings to food entry arrays
   */
  async getAllJournalData(): Promise<Record<string, FoodEntry[]>> {
    const journalData: Record<string, FoodEntry[]> = {};

    try {
      const allEntries = await this.getAllJournalEntries();
      allEntries.forEach(entry => {
        if (entry.foods && entry.foods.length > 0) {
          journalData[entry.date] = entry.foods;
        }
      });
    } catch (error) {
      console.error('Error loading journal data for stats:', error);
    }

    return journalData;
  }

  /**
   * Gets all journal data partitioned by month keys.
   * This is a helper method for SyncService to split data efficiently into monthly documents.
   * @returns Promise resolving to a Map of month keys to journal entries for that month
   */
  async getJournalDataByMonth(): Promise<Map<string, Record<string, FoodEntry[]>>> {
    const allJournalData = await this.getAllJournalData();
    const byMonth = new Map<string, Record<string, FoodEntry[]>>();

    for (const [dateString, entries] of Object.entries(allJournalData)) {
      const monthKey = getMonthKey(dateString); // "2024-11"

      if (!byMonth.has(monthKey)) {
        byMonth.set(monthKey, {});
      }

      byMonth.get(monthKey)![dateString] = entries;
    }

    return byMonth;
  }

  /**
   * Load foods for a specific date from IndexedDB
   */
  /**
   * Loads food entries for a specific date from IndexedDB.
   * @param dateString The date string in YYYY-MM-DD format
   * @returns Promise resolving to array of food entries
   */
  async loadFoodsForDate(dateString: string): Promise<FoodEntry[]> {
    if (!this.db) {
      console.error('Database not initialized');
      return [];
    }

    try {
      const journalEntry = await this.getJournalEntry(dateString);
      return journalEntry ? journalEntry.foods : [];
    } catch (error) {
      console.error(`Error loading foods for date ${dateString}:`, error);
      return [];
    }
  }

  /**
   * Save foods for a specific date to IndexedDB
   */
  /**
   * Saves food entries for a specific date to IndexedDB.
   * @param dateString The date string in YYYY-MM-DD format
   * @param foods Array of food entries to save
   */
  async saveFoodsForDate(dateString: string, foods: FoodEntry[]): Promise<void> {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    try {
      const totalCalcium = foods.reduce((sum, food) => {
        // Use getPrimaryMeasure for compatibility with both formats
        const primaryMeasure = getPrimaryMeasure(food);
        return sum + primaryMeasure.calcium;
      }, 0);

      const journalEntry = {
        date: dateString,
        foods: foods,
        lastModified: Date.now(),
        syncStatus: 'pending',
        totalCalcium: totalCalcium
      };

      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction(['journalEntries'], 'readwrite');
        const store = transaction.objectStore('journalEntries');
        const request = store.put(journalEntry);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          console.error(`Error saving foods for date ${dateString}:`, request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error(`Error saving foods for date ${dateString}:`, error);
      throw error;
    }
  }

  /**
   * Get all journal entries from IndexedDB
   */
  /**
   * Gets all journal entries from IndexedDB with metadata.
   * @returns Promise resolving to array of journal entry objects
   */
  async getAllJournalEntries(): Promise<any[]> {
    if (!this.db) {
      console.error('Database not initialized');
      return [];
    }

    try {
      return await new Promise<any[]>((resolve, reject) => {
        const transaction = this.db!.transaction(['journalEntries'], 'readonly');
        const store = transaction.objectStore('journalEntries');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => {
          console.error('Error loading all journal entries:', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error('Error loading all journal entries:', error);
      return [];
    }
  }

  /**
   * Get date range for journal entries
   */
  /**
   * Gets the date range of all journal entries.
   * @returns Promise resolving to object with first and last dates or null if no entries
   */
  async getJournalDateRange(): Promise<{ firstDate: string | null, lastDate: string | null }> {
    try {
      const entries = await this.getAllJournalEntries();
      if (entries.length === 0) {
        return { firstDate: null, lastDate: null };
      }

      const dates = entries.map(entry => entry.date).sort();
      return {
        firstDate: dates[0],
        lastDate: dates[dates.length - 1]
      };
    } catch (error) {
      console.error('Error getting date range:', error);
      return { firstDate: null, lastDate: null };
    }
  }

  /**
   * Private helper to get a single journal entry
   */
  private async getJournalEntry(dateString: string): Promise<any | null> {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journalEntries'], 'readonly');
      const store = transaction.objectStore('journalEntries');
      const request = store.get(dateString);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Toggles the favorite status of a food by its ID.
   * @param foodId The ID of the food to toggle
   * @throws Error if foodId is invalid
   */
  async toggleFavorite(foodId: number): Promise<void> {
    if (!this.db) return;

    if (!foodId || typeof foodId !== 'number' || foodId <= 0) {
      console.error('Invalid foodId for toggleFavorite:', foodId);
      showToast('Cannot favorite this food', 'error');
      return;
    }

    const state = get(calciumState);
    const favorites = new Set(state.favorites);

    const food = this.foodDatabase.find(f => f.id === foodId);
    const foodName = food ? food.name : `Food ID ${foodId}`;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');

      if (favorites.has(foodId)) {
        const request = store.delete(foodId);

        request.onsuccess = () => {
          favorites.delete(foodId);
          calciumState.update(state => ({ ...state, favorites }));
          resolve();

          // Trigger smart sync for persistent data change (remove favorite)
          SyncTrigger.triggerDataSync('persistent');
        };

        request.onerror = () => {
          console.error('Error removing favorite:', request.error);
          showToast('Failed to remove favorite', 'error');
          reject(request.error);
        };
      } else {
        const favoriteData = {
          foodId,
          dateAdded: new Date().toISOString()
        };

        const request = store.put(favoriteData);

        request.onsuccess = () => {
          favorites.add(foodId);
          calciumState.update(state => ({ ...state, favorites }));
          resolve();

          // Trigger smart sync for persistent data change (add favorite)
          SyncTrigger.triggerDataSync('persistent');
        };

        request.onerror = () => {
          console.error('Error adding favorite:', request.error);
          showToast('Failed to add favorite', 'error');
          reject(request.error);
        };
      }
    });
  }

  private async loadFavorites(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['favorites'], 'readonly');
      const store = transaction.objectStore('favorites');
      const request = store.getAll();

      request.onsuccess = () => {
        const favoriteRecords = request.result || [];
        const favorites = new Set(favoriteRecords.map((record: any) => record.foodId));

        calciumState.update(state => ({ ...state, favorites }));
        resolve();
      };

      request.onerror = () => {
        console.error('Error loading favorites:', request.error);
        calciumState.update(state => ({ ...state, favorites: new Set() }));
        resolve();
      };
    });
  }

  private async loadHiddenFoods(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['hiddenFoods'], 'readonly');
      const store = transaction.objectStore('hiddenFoods');
      const request = store.getAll();

      request.onsuccess = () => {
        const hiddenRecords = request.result || [];
        const hiddenFoods = new Set(hiddenRecords.map((record: any) => record.foodId));

        calciumState.update(state => ({ ...state, hiddenFoods }));
        resolve();
      };

      request.onerror = () => {
        console.error('Error loading hidden foods:', request.error);
        calciumState.update(state => ({ ...state, hiddenFoods: new Set() }));
        resolve();
      };
    });
  }

  /**
   * Toggles the hidden status of a food by its ID.
   * @param foodId The ID of the food to toggle
   * @throws Error if foodId is invalid
   */
  async toggleHiddenFood(foodId: number): Promise<void> {
    if (!this.db) return;

    if (!foodId || typeof foodId !== 'number' || foodId <= 0) {
      console.error('Invalid foodId for toggleHiddenFood:', foodId);
      showToast('Cannot hide this food', 'error');
      return;
    }

    const state = get(calciumState);
    const hiddenFoods = new Set(state.hiddenFoods);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['hiddenFoods'], 'readwrite');
      const store = transaction.objectStore('hiddenFoods');

      if (hiddenFoods.has(foodId)) {
        const request = store.delete(foodId);

        request.onsuccess = () => {
          hiddenFoods.delete(foodId);
          calciumState.update(state => ({ ...state, hiddenFoods }));
          resolve();

          // Trigger smart sync for persistent data change (unhide food)
          SyncTrigger.triggerDataSync('persistent');
        };

        request.onerror = () => {
          console.error('Error removing hidden food:', request.error);
          showToast('Failed to unhide food', 'error');
          reject(request.error);
        };
      } else {
        const hiddenData = {
          foodId,
          dateHidden: new Date().toISOString()
        };

        const request = store.put(hiddenData);

        request.onsuccess = () => {
          hiddenFoods.add(foodId);
          calciumState.update(state => ({ ...state, hiddenFoods }));
          resolve();

          // Trigger smart sync for persistent data change (hide food)
          SyncTrigger.triggerDataSync('persistent');
        };

        request.onerror = () => {
          console.error('Error adding hidden food:', request.error);
          showToast('Failed to hide food', 'error');
          reject(request.error);
        };
      }
    });
  }

  /**
   * Checks if a food is hidden.
   * @param foodId The ID of the food to check
   * @returns True if the food is hidden, false otherwise
   */
  isHidden(foodId: number): boolean {
    const state = get(calciumState);
    return state.hiddenFoods.has(foodId);
  }

  /**
   * Determines if a food ID belongs to a custom food (negative ID) or database food (positive ID).
   * @param foodId The ID to check
   * @returns Object with isCustom and isDatabase flags
   */
  static getFoodType(foodId: number): { isCustom: boolean; isDatabase: boolean } {
    return {
      isCustom: foodId < 0,
      isDatabase: foodId > 0
    };
  }

  /**
   * Finds a food by ID, searching both database and custom foods.
   * @param foodId The ID of the food to find
   * @param customFoods Array of custom foods to search
   * @returns The food object or null if not found
   */
  findFoodById(foodId: number, customFoods: CustomFood[]): any | null {
    if (foodId < 0) {
      // Look in custom foods
      return customFoods.find(f => f.id === foodId) || null;
    } else {
      // Look in main database
      return this.foodDatabase.find(f => f.id === foodId) || null;
    }
  }

  private async loadServingPreferences(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['servingPreferences'], 'readonly');
      const store = transaction.objectStore('servingPreferences');
      const request = store.getAll();

      request.onsuccess = () => {
        const preferenceRecords = request.result || [];
        const servingPreferences = new Map();

        for (const record of preferenceRecords) {
          servingPreferences.set(record.foodId, record);
        }

        calciumState.update(state => ({ ...state, servingPreferences }));
        resolve();
      };

      request.onerror = () => {
        console.error('Error loading serving preferences:', request.error);
        calciumState.update(state => ({ ...state, servingPreferences: new Map() }));
        resolve();
      };
    });
  }

  async restoreFavorites(favoritesArray: (number | string)[]): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');

      const foodIds: number[] = [];

      for (const favorite of favoritesArray) {
        if (typeof favorite === 'number') {
          foodIds.push(favorite);
        } else if (typeof favorite === 'string') {
          const databaseFood = this.foodDatabase.find(food => food.name === favorite);
          if (databaseFood) {
            foodIds.push(databaseFood.id);
          } else {
            console.warn(`Could not find food ID for legacy favorite: ${favorite}`);
          }
        }
      }

      let completedCount = 0;
      const expectedCount = foodIds.length;

      if (expectedCount === 0) {
        resolve();
        return;
      }

      const checkComplete = () => {
        completedCount++;
        if (completedCount === expectedCount) {
          const favorites = new Set(foodIds);
          calciumState.update(state => ({ ...state, favorites }));

          resolve();
        }
      };

      for (const foodId of foodIds) {
        const favoriteData = {
          foodId,
          dateAdded: new Date().toISOString()
        };

        const request = store.put(favoriteData);
        request.onsuccess = checkComplete;
        request.onerror = () => {
          console.error(`Error restoring favorite: ${foodId}`, request.error);
          checkComplete();
        };
      }
    });
  }

  async restoreHiddenFoods(hiddenFoodsArray: (number | string)[]): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['hiddenFoods'], 'readwrite');
      const store = transaction.objectStore('hiddenFoods');
      const foodIds: number[] = [];
      
      for (const hiddenFood of hiddenFoodsArray) {
        if (typeof hiddenFood === 'number') {
          foodIds.push(hiddenFood);
        } else if (typeof hiddenFood === 'string') {
          const databaseFood = this.foodDatabase.find(food => food.name === hiddenFood);
          if (databaseFood) {
            foodIds.push(databaseFood.id);
          } else {
            console.warn(`Could not find food ID for legacy hidden food: ${hiddenFood}`);
          }
        }
      }
      
      let completedCount = 0;
      const expectedCount = foodIds.length;
      
      if (expectedCount === 0) {
        const hiddenFoods = new Set<number>();
        calciumState.update(state => ({ ...state, hiddenFoods }));
        resolve();
        return;
      }
      
      const checkComplete = () => {
        completedCount++;
        if (completedCount === expectedCount) {
          const hiddenFoods = new Set(foodIds);
          calciumState.update(state => ({ ...state, hiddenFoods }));
          resolve();
        }
      };
      
      for (const foodId of foodIds) {
        const hiddenData = {
          foodId,
          dateHidden: new Date().toISOString()
        };
        
        const request = store.put(hiddenData);
        request.onsuccess = checkComplete;
        request.onerror = () => {
          console.error(`Error restoring hidden food: ${foodId}`, request.error);
          checkComplete();
        };
      }
    });
  }

  async restoreServingPreferences(preferencesArray: UserServingPreference[]): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['servingPreferences'], 'readwrite');
      const store = transaction.objectStore('servingPreferences');

      let completedCount = 0;
      const expectedCount = preferencesArray.length;

      if (expectedCount === 0) {
        resolve();
        return;
      }

      const checkComplete = () => {
        completedCount++;
        if (completedCount === expectedCount) {
          const servingPreferences = new Map();
          for (const pref of preferencesArray) {
            servingPreferences.set(pref.foodId, pref);
          }
          calciumState.update(state => ({ ...state, servingPreferences }));
          resolve();
        }
      };

      for (const preference of preferencesArray) {
        const request = store.put(preference);
        request.onsuccess = checkComplete;
        request.onerror = () => {
          console.error(`Error restoring serving preference for food ${preference.foodId}`, request.error);
          checkComplete();
        };
      }
    });
  }

  /**
   * Applies data from a sync operation without clearing existing data.
   * This is the non-destructive counterpart to restoreFromBackup.
   */
  /**
   * Applies data from a sync operation without clearing existing data.
   * This is the non-destructive counterpart to restoreFromBackup.
   * @param syncData The sync data to apply
   */
  async applySyncData(syncData: any): Promise<void> {
    try {

      if (syncData.preferences) {
        calciumState.update(state => ({
          ...state,
          settings: syncData.preferences
        }));
        await this.saveSettings();
      }

      if (syncData.customFoods && Array.isArray(syncData.customFoods)) {
        for (const customFood of syncData.customFoods) {
          try {
            if (customFood.id < 0) {
              // Apply with existing negative ID
              await this.saveCustomFoodToIndexedDB(customFood);
              // Update counter if this ID is more negative
              if (customFood.id < this.nextCustomFoodId) {
                this.nextCustomFoodId = customFood.id - 1;
              }
            } else {
              // Convert positive ID to negative (migration scenario)
              const newCustomFood = { ...customFood, id: this.nextCustomFoodId };
              await this.saveCustomFoodToIndexedDB(newCustomFood);
              this.nextCustomFoodId--;
            }
          } catch (error) {
            console.warn('Failed to apply synced custom food:', customFood.name, error);
          }
        }
      }

      if (syncData.favorites && Array.isArray(syncData.favorites)) {
        try {
          await this.restoreFavorites(syncData.favorites);
        } catch (error) {
          console.warn('Failed to apply synced favorites:', error);
        }
      }

      if (syncData.hiddenFoods && Array.isArray(syncData.hiddenFoods)) {
        try {
          await this.restoreHiddenFoods(syncData.hiddenFoods);
        } catch (error) {
          console.warn('Failed to apply synced hidden foods:', error);
        }
      }

      if (syncData.servingPreferences && Array.isArray(syncData.servingPreferences)) {
        try {
          await this.restoreServingPreferences(syncData.servingPreferences);
        } catch (error) {
          console.warn('Failed to apply synced serving preferences:', error);
        }
      }

      if (syncData.journalEntries) {
        for (const [dateString, foods] of Object.entries(syncData.journalEntries)) {
          if (Array.isArray(foods)) {
            try {
              await this.saveFoodsForDate(dateString, foods as FoodEntry[]);
            } catch (error) {
              console.warn('Failed to apply synced journal entry for date:', dateString, error);
            }
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 200));

      await this.loadSettings();
      await this.loadCustomFoods();
      await this.loadFavorites();
      await this.loadHiddenFoods();
      await this.loadServingPreferences();
      await this.loadDailyFoods();
      await this.applySortToFoods();

    } catch (error) {
      console.error('Error applying sync data:', error);
      throw error;
    }
  }

  async regenerateSyncId(): Promise<void> {
    if (!this.settings) return;
    const newId = CryptoUtils.generateUUID();
    this.settings.syncGenerationId = newId;
    await this.saveSettings();
  }

  /**
   * Gets the source accent color for a custom food based on its source type.
   */
  getSourceAccentColor(food: CustomFood): string {
    const sourceType = food.sourceMetadata?.sourceType;
    switch (sourceType) {
      case 'manual': return 'var(--primary)';
      case 'upc_scan': return 'var(--success)';
      case 'ocr_scan': return 'var(--warning)';
      default: return 'var(--text-secondary)';
    }
  }

  /**
   * Gets the source icon name for a custom food based on its source type.
   */
  getSourceIcon(food: CustomFood): string {
    const sourceType = food.sourceMetadata?.sourceType;
    switch (sourceType) {
      case 'manual': return 'edit';
      case 'upc_scan': return 'qr_code_scanner';
      case 'ocr_scan': return 'photo_camera';
      default: return 'help_outline';
    }
  }

  /**
   * Formats source metadata for user-friendly display.
   */
  formatSourceMetadata(food: CustomFood): string {
    const metadata = food.sourceMetadata;
    if (!metadata) return 'Unknown source';

    switch (metadata.sourceType) {
      case 'manual':
        return 'Added manually';
      case 'upc_scan':
        return metadata.upcSource
          ? `Scanned from ${metadata.upcSource.toUpperCase()}`
          : 'Scanned from barcode';
      case 'ocr_scan':
        const confidence = metadata.confidence ? ` (${Math.round(metadata.confidence * 100)}% confidence)` : '';
        return `Scanned from nutrition label${confidence}`;
      default:
        return metadata.dateAdded
          ? `Added ${new Date(metadata.dateAdded).toLocaleDateString()}`
          : 'Unknown source';
    }
  }

  /**
   * Creates source metadata for a manual food entry.
   */
  createManualSourceMetadata(): CustomFood['sourceMetadata'] {
    return {
      sourceType: 'manual'
    };
  }

  /**
   * Creates source metadata for a UPC scan food entry.
   */
  createUPCSourceMetadata(scanData: any): CustomFood['sourceMetadata'] {
    const metadata: CustomFood['sourceMetadata'] = {
      sourceType: 'upc_scan',
      upc: scanData.upcCode || null,
      sourceKey: scanData.fdcId ? scanData.fdcId.toString() : null,
      confidence: 1.0 // UPC scans are always high confidence
    };

    // Set UPC source based on the service used
    if (scanData.source === 'USDA FDC') {
      metadata.upcSource = 'usda_fdc';
    } else if (scanData.source === 'OpenFoodFacts') {
      metadata.upcSource = 'openfoodfacts';
    }

    // Add scan processing details
    if (scanData.brandOwner || scanData.brandName || scanData.ingredients) {
      metadata.scanData = {
        originalName: scanData.productName || null,
        brandName: scanData.brandOwner || scanData.brandName || null,
        ingredients: scanData.ingredients || null,
        householdMeasure: scanData.servingDisplayText || null,
        calciumPer100g: scanData.calciumValue || null
      };
    }

    // Add processing notes for serving conversions
    if (scanData.finalServingQuantity && scanData.finalServingUnit) {
      metadata.processingNotes = {
        measureConversion: `Serving: ${scanData.finalServingQuantity} ${scanData.finalServingUnit}`,
        calciumConversion: scanData.calciumPerServing
          ? `Calculated ${scanData.calciumPerServing}mg per serving from ${scanData.calciumValue}mg per 100g`
          : null
      };
    }

    return metadata;
  }

  /**
   * Converts confidence string to numeric value.
   */
  private parseConfidence(confidence: any): number {
    if (typeof confidence === 'number') return confidence;
    if (typeof confidence === 'string') {
      const lower = confidence.toLowerCase();
      if (lower === 'high') return 0.9;
      if (lower === 'medium') return 0.7;
      if (lower === 'low') return 0.5;
    }
    return 0.8; // Default
  }

  /**
   * Creates source metadata for an OCR scan food entry.
   */
  createOCRSourceMetadata(scanData: any): CustomFood['sourceMetadata'] {
    const confidenceValue = this.parseConfidence(scanData.confidence);

    const metadata: CustomFood['sourceMetadata'] = {
      sourceType: 'ocr_scan',
      confidence: confidenceValue
    };

    // Add scan processing details
    if (scanData.rawText || scanData.servingQuantity || scanData.calcium) {
      metadata.scanData = {
        originalName: scanData.rawText ? 'From nutrition label scan' : null,
        servingSize: scanData.servingSize || null,
        selectedNutrientPer: scanData.standardMeasureValue && scanData.standardMeasureUnit
          ? `${scanData.standardMeasureValue}${scanData.standardMeasureUnit}`
          : 'serving',
        // Include file name if this was a file scan (not camera capture)
        fileName: scanData.fileName || null
      };
    }

    // Add processing notes for OCR parsing
    if (scanData.servingQuantity && scanData.servingMeasure) {
      metadata.processingNotes = {
        measureConversion: `Parsed: ${scanData.servingQuantity} ${scanData.servingMeasure}`,
        calciumConversion: scanData.calciumValue
          ? `Extracted ${scanData.calciumValue}mg from nutrition label`
          : null,
        confidence: {
          name: 0.5, // OCR doesn't provide names
          calcium: confidenceValue,
          measure: confidenceValue
        }
      };
    }

    return metadata;
  }

}