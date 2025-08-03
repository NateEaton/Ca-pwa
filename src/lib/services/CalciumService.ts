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
      const request = indexedDB.open('CalciumTracker', 5);
      
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
        showToast(`Migrated ${legacyCustomFoods.length} custom foods to improved storage`, 'success');
      }

      await this.setMigrationStatus('customFoodsToIndexedDB', true);
    } catch (error) {
      console.error('Custom foods migration failed:', error);
      showToast('Some custom foods may need to be re-added', 'warning');
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

          showToast(`Migrated ${favoriteFoodIds.length} favorites to new system`, 'success');
        }
      }

      await this.setMigrationStatus('favoritesToIDs', true);
    } catch (error) {
      console.error('Favorites migration failed:', error);
      showToast('Some favorites may need to be re-added', 'warning');
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
    showToast('Food added successfully', 'success');
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
    showToast(`Removed ${removedFood.name}`, 'success');
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
    showToast('Food updated successfully', 'success');
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

  async updateSettings(newSettings: Partial<CalciumSettings>): Promise<void> {
    calciumState.update(state => ({
      ...state,
      settings: { ...state.settings, ...newSettings }
    }));

    await this.saveSettings();
    
    if (newSettings.dailyGoal) {
      showToast('Goal updated successfully', 'success');
    }
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
          
          showToast('Custom food saved', 'success');
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
        
        showToast('Custom food deleted', 'success');
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

    const settings: CalciumSettings = {
      dailyGoal: dailyGoal ? parseInt(dailyGoal) : 1000,
      sortBy: 'time',
      sortOrder: 'desc',
      ...(sortSettings ? JSON.parse(sortSettings) : {})
    };

    calciumState.update(state => ({ ...state, settings }));
  }

  private async saveSettings(): Promise<void> {
    const state = get(calciumState);
    
    localStorage.setItem('calcium_goal', state.settings.dailyGoal.toString());
    
    const sortSettings = {
      sortBy: state.settings.sortBy,
      sortOrder: state.settings.sortOrder
    };
    localStorage.setItem('calcium_sort_settings', JSON.stringify(sortSettings));
  }

  private async loadDailyFoods(): Promise<void> {
    const state = get(calciumState);
    const savedFoods = localStorage.getItem(`calcium_foods_${state.currentDate}`);
    
    if (savedFoods) {
      try {
        const foods = JSON.parse(savedFoods);
        calciumState.update(state => ({ ...state, foods }));
      } catch (error) {
        console.error('Error parsing saved foods:', error);
        showToast('Error loading foods for this date', 'error');
      }
    }
  }

  private async saveDailyFoods(): Promise<void> {
    const state = get(calciumState);
    localStorage.setItem(
      `calcium_foods_${state.currentDate}`,
      JSON.stringify(state.foods)
    );
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
    
    // Get journal entries from localStorage
    const journalEntries: Record<string, FoodEntry[]> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('calcium_foods_')) {
        const date = key.replace('calcium_foods_', '');
        try {
          journalEntries[date] = JSON.parse(localStorage.getItem(key) || '[]');
        } catch (error) {
          console.error(`Error parsing foods for date ${date}:`, error);
        }
      }
    }

    // Get custom foods directly from IndexedDB to ensure we have the latest
    const customFoods = await this.getAllCustomFoods();
    
    // Get favorites as array for backup
    const favorites = Array.from(state.favorites);
    
    // Get serving preferences as array for backup
    const servingPreferences = Array.from(state.servingPreferences.values());

    return {
      metadata: {
        version: '2.0.0',
        createdAt: new Date().toISOString(),
        appVersion: 'Svelte Calcium Tracker'
      },
      preferences: state.settings,
      customFoods: customFoods,
      favorites: favorites,
      servingPreferences: servingPreferences,
      journalEntries
    };
  }

  async restoreFromBackup(backupData: any): Promise<void> {
    try {
      // Clear existing data
      await this.clearAllData();
      
      // Restore preferences/settings
      if (backupData.preferences) {
        calciumState.update(state => ({
          ...state,
          settings: backupData.preferences
        }));
        this.saveSettings();
      }
      
      // Restore custom foods to IndexedDB
      if (backupData.customFoods && Array.isArray(backupData.customFoods)) {
        for (const customFood of backupData.customFoods) {
          await this.saveCustomFoodToIndexedDB(customFood);
        }
      }
      
      // Restore favorites
      if (backupData.favorites && Array.isArray(backupData.favorites)) {
        await this.restoreFavorites(backupData.favorites);
      }
      
      // Restore serving preferences
      if (backupData.servingPreferences && Array.isArray(backupData.servingPreferences)) {
        await this.restoreServingPreferences(backupData.servingPreferences);
      }
      
      // Restore journal entries to localStorage
      if (backupData.journalEntries) {
        for (const [date, foods] of Object.entries(backupData.journalEntries)) {
          if (Array.isArray(foods)) {
            localStorage.setItem(`calcium_foods_${date}`, JSON.stringify(foods));
          }
        }
      }
      
      // Reload data into stores
      await this.loadSettings();
      await this.loadCustomFoods();
      await this.loadFavorites();
      await this.loadServingPreferences();
      await this.loadDailyFoods();
      await this.applySortToFoods();
      
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw new Error('Failed to restore backup data');
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
    
    // Clear IndexedDB custom foods, favorites, and serving preferences
    if (this.db) {
      const transaction = this.db.transaction(['customFoods', 'favorites', 'servingPreferences'], 'readwrite');
      const customFoodsStore = transaction.objectStore('customFoods');
      const favoritesStore = transaction.objectStore('favorites');
      const servingPreferencesStore = transaction.objectStore('servingPreferences');
      
      await new Promise<void>((resolve, reject) => {
        const clearCustomFoods = customFoodsStore.clear();
        const clearFavorites = favoritesStore.clear();
        const clearServingPreferences = servingPreferencesStore.clear();
        
        let completedCount = 0;
        const checkComplete = () => {
          completedCount++;
          if (completedCount === 3) resolve();
        };
        
        clearCustomFoods.onsuccess = checkComplete;
        clearFavorites.onsuccess = checkComplete;
        clearServingPreferences.onsuccess = checkComplete;
        clearCustomFoods.onerror = () => reject(clearCustomFoods.error);
        clearFavorites.onerror = () => reject(clearFavorites.error);
        clearServingPreferences.onerror = () => reject(clearServingPreferences.error);
      });
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
   * Get all journal entries from localStorage for reporting
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
          showToast(`Removed ${foodName} from favorites`, 'success');
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
          showToast(`Added ${foodName} to favorites`, 'success');
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
          
          if (favoritesArray.some(f => typeof f === 'string')) {
            showToast(`Migrated ${foodIds.length} favorites from legacy backup`, 'success');
          }
          
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