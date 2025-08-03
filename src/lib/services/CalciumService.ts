import { get } from 'svelte/store';
import { calciumState, showToast } from '$lib/stores/calcium';
import type { FoodEntry, CustomFood, CalciumSettings } from '$lib/types/calcium';

export class CalciumService {
  private db: IDBDatabase | null = null;

  async initialize(): Promise<void> {
    await this.initializeIndexedDB();
    await this.migrateCustomFoodsIfNeeded();
    await this.loadSettings();
    await this.loadDailyFoods();
    await this.loadCustomFoods();
    
    // Apply initial sort after loading
    await this.applySortToFoods();
    
    calciumState.update(state => ({ ...state, isLoading: false }));
  }

  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CalciumTracker', 3);
      
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

    return {
      metadata: {
        version: '2.0.0',
        createdAt: new Date().toISOString(),
        appVersion: 'Svelte Calcium Tracker'
      },
      preferences: state.settings,
      customFoods: customFoods,
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
    
    // Clear IndexedDB custom foods
    if (this.db) {
      const transaction = this.db.transaction(['customFoods'], 'readwrite');
      const store = transaction.objectStore('customFoods');
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
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

}