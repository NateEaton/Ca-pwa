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
}

export interface BackupData {
  metadata: {
    version: string;
    createdAt: string;
    appVersion: string;
  };
  preferences: CalciumSettings;
  customFoods: CustomFood[];
  favorites?: string[];
  journalEntries: Record<string, FoodEntry[]>;
}

export interface CalciumState {
  currentDate: string;
  foods: FoodEntry[];
  customFoods: CustomFood[];
  favorites: Set<string>;
  settings: CalciumSettings;
  isLoading: boolean;
}

export interface USDAFood {
  name: string;
  calcium: number;
  measure: string;
  isCustom: false;
  isFavorite?: boolean;
}