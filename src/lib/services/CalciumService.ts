import { get } from 'svelte/store';
import { calciumState, showToast } from '$lib/stores/calcium';
import type { FoodEntry, CustomFood, CalciumSettings, UserServingPreference } from '$lib/types/calcium';
import { DEFAULT_FOOD_DATABASE } from '$lib/data/foodDatabase';

export class CalciumService {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    await this.initializeIndexedDB();
    await this.migrateCustomFoodsIfNeeded();
    await this.migrateFavoritesToIDsIfNeeded();
    await this.loadSettings();
    await this.loadDailyFoods();
    await this.loadCustomFoods();
    await this.loadFavorites();
    await this.loadServingPreferences();
    
    // Apply initial sort after loading
    await this.applySortToFoods();
    
    calciumState.update(state => ({ ...state, isLoading: false }));
  }

  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CalciumTracker', 6);
      
      request.onerror = () => {
        console.error('IndexedDB error:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;
        
        if (!db.objectStoreNames.contains('customFoods')) {
          const store = db.createObjectStore('customFoods', {
            keyPath: 'id',
            autoIncrement: true
          });
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

        // Add journalEntries object store in version 6
        if (oldVersion < 6 && !db.objectStoreNames.contains('journalEntries')) {
          const journalStore = db.createObjectStore('journalEntries', { keyPath: 'date' });
          journalStore.createIndex('lastModified', 'lastModified', { unique: false });
          journalStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        }
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
        // console.log(`Migrating ${legacyCustomFoods.length} custom foods to IndexedDB...`);
        
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
      // Get existing name-based favorites
      const transaction = this.db.transaction(['favorites'], 'readonly');
      const store = transaction.objectStore('favorites');
      const request = store.getAll();

      const legacyFavorites = await new Promise<any[]>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });

      if (legacyFavorites.length > 0) {
        // Convert names to IDs
        const favoriteFoodIds: number[] = [];
        
        for (const favRecord of legacyFavorites) {
          const foodName = favRecord.foodName;
          const databaseFood = DEFAULT_FOOD_DATABASE.find(food => food.name === foodName);
          if (databaseFood) {
            favoriteFoodIds.push(databaseFood.id);
          }
        }

        // Clear old favorites store and create new ID-based records
        if (favoriteFoodIds.length > 0) {
          const writeTransaction = this.db.transaction(['favorites'], 'readwrite');
          const writeStore = writeTransaction.objectStore('favorites');
          
          // Clear old name-based favorites
          await new Promise<void>((resolve, reject) => {
            const clearRequest = writeStore.clear();
            clearRequest.onsuccess = () => resolve();
            clearRequest.onerror = () => reject(clearRequest.error);
          });

          // Add new ID-based favorites
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

  // FIXED: Sort the main foods array instead of using derived store
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
          comparison = a.calcium - b.calcium;
          break;
      }
      
      return state.settings.sortOrder === 'asc' ? comparison : -comparison;
    });

    calciumState.update(state => ({
      ...state,
      foods: sortedFoods
    }));
  }

  // NEW: Public method to change sort settings
  async updateSort(sortBy: 'time' | 'name' | 'calcium', sortOrder?: 'asc' | 'desc'): Promise<void> {
    const state = get(calciumState);
    
    // If clicking same sort field, toggle order
    let newSortOrder = sortOrder;
    if (!newSortOrder) {
      if (state.settings.sortBy === sortBy) {
        newSortOrder = state.settings.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        newSortOrder = 'desc'; // Default to desc for new fields
      }
    }

    // Update settings
    calciumState.update(state => ({
      ...state,
      settings: {
        ...state.settings,
        sortBy,
        sortOrder: newSortOrder
      }
    }));

    // Apply sort to foods array
    await this.applySortToFoods();
    
    // Save settings
    await this.saveSettings();
  }

  async addFood(food: Omit<FoodEntry, 'timestamp'>): Promise<void> {
    const newFood: FoodEntry = {
      ...food,
      timestamp: new Date().toISOString()
    };

    // Add to array and re-sort
    calciumState.update(state => ({
      ...state,
      foods: [...state.foods, newFood]
    }));

    await this.applySortToFoods();
    await this.saveDailyFoods();
  }

  // FIXED: Now uses correct index from sorted array
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
  }

  // FIXED: Now uses correct index from sorted array
  async updateFood(index: number, updatedFood: Omit<FoodEntry, 'timestamp'>): Promise<void> {
    const state = get(calciumState);
    
    if (index < 0 || index >= state.foods.length) {
      throw new Error('Invalid food index for update');
    }

    calciumState.update(state => {
      const foods = [...state.foods];
      foods[index] = {
        ...updatedFood,
        timestamp: foods[index].timestamp // Keep original timestamp
      };
      return { ...state, foods };
    });

    // Re-sort after update in case sort field changed
    await this.applySortToFoods();
    await this.saveDailyFoods();
  }

  async changeDate(newDate: string): Promise<void> {
    await this.saveDailyFoods();
    
    calciumState.update(state => ({
      ...state,
      currentDate: newDate,
      foods: []
    }));

    await this.loadDailyFoods();
    await this.applySortToFoods(); // Apply sort to newly loaded foods
  }

  async getSettings(): Promise<CalciumSettings> {
    const state = get(calciumState);
    return state.settings;
  }

  async updateSettings(newSettings: Partial<CalciumSettings>): Promise<void> {
    calciumState.update(state => ({
      ...state,
      settings: { ...state.settings, ...newSettings }
    }));

    await this.saveSettings();
  }

  async saveCustomFood(foodData: { name: string; calcium: number; measure: string }): Promise<CustomFood | null> {
    // console.log('Saving custom food:', foodData);
    const result = await this.saveCustomFoodToIndexedDB(foodData);
    // console.log('Custom food saved:', result);
    return result;
  }

  private async saveCustomFoodToIndexedDB(foodData: { name: string; calcium: number; measure: string }): Promise<CustomFood | null> {
    if (!this.db) {
      console.error('No database connection for saving custom food');
      return null;
    }

    // console.log('Creating custom food object:', foodData);
    const customFood: Omit<CustomFood, 'id'> = {
      ...foodData,
      isCustom: true,
      dateAdded: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(['customFoods'], 'readwrite');
        const store = transaction.objectStore('customFoods');
        const request = store.add(customFood);

        request.onsuccess = () => {
          const savedFood: CustomFood = { ...customFood, id: request.result as number };
          // console.log('Successfully saved custom food to IndexedDB:', savedFood);
          
          calciumState.update(state => ({
            ...state,
            customFoods: [...state.customFoods, savedFood]
          }));
          
          resolve(savedFood);
        };

        request.onerror = () => {
          console.error('Error saving custom food to IndexedDB:', request.error);
          showToast('Failed to save custom food', 'error');
          reject(request.error);
        };

        transaction.onerror = () => {
          console.error('Transaction error saving custom food:', transaction.error);
          reject(transaction.error);
        };
      } catch (error) {
        console.error('Exception in saveCustomFoodToIndexedDB:', error);
        reject(error);
      }
    });
  }

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

  private async saveSettings(): Promise<void> {
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

  private async loadDailyFoods(): Promise<void> {
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

  private async loadCustomFoods(): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['customFoods'], 'readonly');
      const store = transaction.objectStore('customFoods');
      const request = store.getAll();

      request.onsuccess = () => {
        const customFoods: CustomFood[] = (request.result || []).map((food: any) => ({
          ...food,
          isCustom: true
        }));
        
        calciumState.update(state => ({ ...state, customFoods }));
        resolve();
      };

      request.onerror = () => {
        console.error('Error loading custom foods:', request.error);
        resolve();
      };
    });
  }

  async generateBackup(): Promise<any> {
    const state = get(calciumState);
    
    // Get journal entries from IndexedDB
    const journalEntries: Record<string, FoodEntry[]> = {};
    const allJournalEntries = await this.getAllJournalEntries();
    
    // Convert IndexedDB format to backup format (maintain compatibility)
    allJournalEntries.forEach(entry => {
      journalEntries[entry.date] = entry.foods;
    });

    // Get custom foods directly from IndexedDB to ensure we have the latest
    const customFoods = await this.getAllCustomFoods();
    
    // Get favorites as array for backup
    const favorites = Array.from(state.favorites);
    
    // Get serving preferences as array for backup
    const servingPreferences = Array.from(state.servingPreferences.values());

    return {
      metadata: {
        version: '2.1.0', // Increment to indicate IndexedDB backend
        createdAt: new Date().toISOString(),
        appVersion: 'Svelte Calcium Tracker'
      },
      preferences: state.settings,
      customFoods: customFoods,
      favorites: favorites,
      servingPreferences: servingPreferences,
      journalEntries // Maintains existing backup format compatibility
    };
  }

  async restoreFromBackup(backupData: any): Promise<void> {
    try {
      // Clear existing data
      await this.clearAllData();
      
      // Small delay to ensure transactions are completed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Restore preferences/settings
      if (backupData.preferences) {
        calciumState.update(state => ({
          ...state,
          settings: backupData.preferences
        }));
        await this.saveSettings();
      }
      
      // Restore custom foods to IndexedDB
      if (backupData.customFoods && Array.isArray(backupData.customFoods)) {
        for (const customFood of backupData.customFoods) {
          try {
            await this.saveCustomFoodToIndexedDB(customFood);
          } catch (error) {
            console.warn('Failed to restore custom food:', customFood.name, error);
          }
        }
      }
      
      // Restore favorites
      if (backupData.favorites && Array.isArray(backupData.favorites)) {
        try {
          await this.restoreFavorites(backupData.favorites);
        } catch (error) {
          console.warn('Failed to restore favorites:', error);
        }
      }
      
      // Restore serving preferences
      if (backupData.servingPreferences && Array.isArray(backupData.servingPreferences)) {
        try {
          await this.restoreServingPreferences(backupData.servingPreferences);
        } catch (error) {
          console.warn('Failed to restore serving preferences:', error);
        }
      }
      
      // Restore journal entries to IndexedDB
      if (backupData.journalEntries) {
        for (const [dateString, foods] of Object.entries(backupData.journalEntries)) {
          if (Array.isArray(foods)) {
            try {
              await this.saveFoodsForDate(dateString, foods);
            } catch (error) {
              console.warn('Failed to restore journal entry for date:', dateString, error);
            }
          }
        }
      }
      
      // Small delay before reloading
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Reload data into stores
      await this.loadSettings();
      await this.loadCustomFoods();
      await this.loadFavorites();
      await this.loadServingPreferences();
      await this.loadDailyFoods();
      await this.applySortToFoods();
      
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }

  private async clearAllData(): Promise<void> {
    // Clear localStorage journal entries
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('calcium_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear IndexedDB stores one by one to avoid transaction issues
    if (!this.db) {
      console.warn('Database connection not available for clearing IndexedDB data');
      return;
    }

    const clearStore = async (storeName: string) => {
      return new Promise<void>((resolve, reject) => {
        try {
          const transaction = this.db!.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.clear();
          
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
          transaction.onerror = () => reject(transaction.error);
          transaction.onabort = () => reject(new Error(`Transaction aborted for ${storeName}`));
        } catch (error) {
          reject(error);
        }
      });
    };

    try {
      // Clear each store with a small delay between operations
      await clearStore('journalEntries');
      await new Promise(resolve => setTimeout(resolve, 50));
      
      await clearStore('customFoods');
      await new Promise(resolve => setTimeout(resolve, 50));
      
      await clearStore('favorites');
      await new Promise(resolve => setTimeout(resolve, 50));
      
      await clearStore('servingPreferences');
    } catch (error) {
      console.error('Error clearing IndexedDB data:', error);
      // Don't throw here - we want to continue with the restore process
    }
  }

  private async getAllCustomFoods(): Promise<CustomFood[]> {
    if (!this.db) {
      // console.log('No database connection for custom foods');
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
        // console.log('Found custom foods for backup:', customFoods.length, customFoods);
        resolve(customFoods);
      };

      request.onerror = () => {
        console.error('Error loading custom foods for backup:', request.error);
        resolve([]);
      };
    });
  }

  async saveServingPreference(foodId: number, quantity: number, unit: string): Promise<void> {
    if (!this.db) return;

    const preference: UserServingPreference = {
      foodId,
      preferredQuantity: quantity,
      preferredUnit: unit,
      lastUsed: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['servingPreferences'], 'readwrite');
      const store = transaction.objectStore('servingPreferences');
      const request = store.put(preference);

      request.onsuccess = () => {
        // Update the local state
        calciumState.update(state => {
          const newPreferences = new Map(state.servingPreferences);
          newPreferences.set(foodId, preference);
          return { ...state, servingPreferences: newPreferences };
        });
        resolve();
      };

      request.onerror = () => {
        console.error('Error saving serving preference:', request.error);
        reject(request.error);
      };
    });
  }

  getServingPreference(foodId: number): UserServingPreference | null {
    const state = get(calciumState);
    return state.servingPreferences.get(foodId) || null;
  }

  async deleteServingPreference(foodId: number): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['servingPreferences'], 'readwrite');
      const store = transaction.objectStore('servingPreferences');
      const request = store.delete(foodId);

      request.onsuccess = () => {
        // Update the local state
        calciumState.update(state => {
          const newPreferences = new Map(state.servingPreferences);
          newPreferences.delete(foodId);
          return { ...state, servingPreferences: newPreferences };
        });
        resolve();
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
   * Load foods for a specific date from IndexedDB
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
  async saveFoodsForDate(dateString: string, foods: FoodEntry[]): Promise<void> {
    if (!this.db) {
      console.error('Database not initialized');
      return;
    }

    try {
      const totalCalcium = foods.reduce((sum, food) => sum + food.calcium, 0);
      
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
          console.log(`Saved ${foods.length} foods for ${dateString} (${totalCalcium}mg total)`);
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
  async getJournalDateRange(): Promise<{firstDate: string | null, lastDate: string | null}> {
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

  async toggleFavorite(foodId: number): Promise<void> {
    if (!this.db) return;
    
    // Validate foodId
    if (!foodId || typeof foodId !== 'number' || foodId <= 0) {
      console.error('Invalid foodId for toggleFavorite:', foodId);
      showToast('Cannot favorite this food', 'error');
      return;
    }

    const state = get(calciumState);
    const favorites = new Set(state.favorites);
    
    // Find food name for toast message
    const food = DEFAULT_FOOD_DATABASE.find(f => f.id === foodId);
    const foodName = food ? food.name : `Food ID ${foodId}`;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');

      if (favorites.has(foodId)) {
        // Remove from favorites
        const request = store.delete(foodId);
        
        request.onsuccess = () => {
          favorites.delete(foodId);
          calciumState.update(state => ({ ...state, favorites }));
          resolve();
        };

        request.onerror = () => {
          console.error('Error removing favorite:', request.error);
          showToast('Failed to remove favorite', 'error');
          reject(request.error);
        };
      } else {
        // Add to favorites
        const favoriteData = {
          foodId,
          dateAdded: new Date().toISOString()
        };
        
        const request = store.put(favoriteData);

        request.onsuccess = () => {
          favorites.add(foodId);
          calciumState.update(state => ({ ...state, favorites }));
          resolve();
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
        // Initialize with empty set on error
        calciumState.update(state => ({ ...state, favorites: new Set() }));
        resolve();
      };
    });
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
        // Initialize with empty map on error
        calciumState.update(state => ({ ...state, servingPreferences: new Map() }));
        resolve();
      };
    });
  }

  private async restoreFavorites(favoritesArray: (number | string)[]): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['favorites'], 'readwrite');
      const store = transaction.objectStore('favorites');

      // Convert legacy name-based favorites to ID-based
      const foodIds: number[] = [];
      
      for (const favorite of favoritesArray) {
        if (typeof favorite === 'number') {
          // New format: already an ID
          foodIds.push(favorite);
        } else if (typeof favorite === 'string') {
          // Legacy format: convert name to ID
          const databaseFood = DEFAULT_FOOD_DATABASE.find(food => food.name === favorite);
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
          // Update the state after all favorites are restored
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
          checkComplete(); // Continue even if one fails
        };
      }
    });
  }

  private async restoreServingPreferences(preferencesArray: UserServingPreference[]): Promise<void> {
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
          // Update the state after all preferences are restored
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
          checkComplete(); // Continue even if one fails
        };
      }
    });
  }

}