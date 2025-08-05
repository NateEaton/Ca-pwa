// src/lib/types/calcium.ts

export interface FoodEntry {
  name: string;
  calcium: number;
  servingQuantity: number;
  servingUnit: string;
  timestamp: string;
  isCustom?: boolean;
  customFoodId?: number;
  note?: string;
}

export interface CustomFood {
  id: number;
  name: string;
  calcium: number;
  measure: string;
  dateAdded: string;
  isCustom: true;
}

export interface CalciumSettings {
  dailyGoal: number;
  sortBy: 'time' | 'name' | 'calcium';
  sortOrder: 'asc' | 'desc';
  theme?: 'auto' | 'light' | 'dark';
}

export interface BackupData {
  metadata: {
    version: string;
    createdAt: string;
    appVersion: string;
  };
  preferences: CalciumSettings;
  customFoods: CustomFood[];
  favorites?: (number | string)[]; // Support both legacy (string) and new (number) formats
  servingPreferences?: UserServingPreference[];
  journalEntries: Record<string, FoodEntry[]>;
}

export interface CalciumState {
  currentDate: string;
  foods: FoodEntry[];
  customFoods: CustomFood[];
  favorites: Set<number>;
  servingPreferences: Map<number, UserServingPreference>;
  settings: CalciumSettings;
  isLoading: boolean;
}

export interface USDAFood {
  id: number;
  name: string;
  calcium: number;
  measure: string;
  isCustom: false;
  isFavorite?: boolean;
}

export interface UserServingPreference {
  foodId: number;
  preferredQuantity: number;
  preferredUnit: string;
  lastUsed: string;
}