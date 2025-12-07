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

  // Enhanced source metadata
  sourceMetadata?: {
    // Core source info
    sourceType: 'manual' | 'upc_scan' | 'ocr_scan' | null;
    upcSource?: 'usda_fdc' | 'openfoodfacts' | null;
    upc?: string | null;
    sourceKey?: string | null; // fdcId, off_id, etc.
    confidence?: number; // 0-1 for OCR/scan confidence

    // Scan processing details (what was used but not carried through)
    scanData?: {
      originalName?: string; // Raw scanned name before cleanup
      householdMeasure?: string; // e.g., "1 cup (240ml)"
      servingSize?: string; // e.g., "240ml" or "1 container"
      selectedNutrientPer?: string; // "100g" | "serving" | "container"
      calciumPer100g?: number; // Original per-100g value if converted
      brandName?: string; // Brand extracted from scan
      ingredients?: string; // Full ingredient list if available
      allergens?: string[]; // Detected allergens
    };

    // Processing notes
    processingNotes?: {
      measureConversion?: string; // e.g., "Converted from 240ml to 1 cup"
      calciumConversion?: string; // e.g., "Calculated from 150mg per 100g"
      nameNormalization?: string; // e.g., "Simplified from 'Organic Unsweetened...'"
      confidence?: {
        name: number;
        calcium: number;
        measure: number;
      };
    };
  };
}

export interface CalciumSettings {
  dailyGoal: number;
  sortBy: 'time' | 'name' | 'calcium';
  sortOrder: 'asc' | 'desc';
  theme?: 'auto' | 'light' | 'dark';
  colorScheme?: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'teal';
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
  hiddenFoods?: (number | string)[]; // Support both legacy (string) and new (number) formats
  servingPreferences?: UserServingPreference[];
  journalEntries: Record<string, FoodEntry[]>;
}

export interface CalciumState {
  currentDate: string;
  foods: FoodEntry[];
  customFoods: CustomFood[];
  favorites: Set<number>;
  hiddenFoods: Set<number>;
  servingPreferences: Map<number, UserServingPreference>;
  settings: CalciumSettings;
  isLoading: boolean;
}

export interface MeasureSet {
  measure: string;
  calcium: number;
}

export interface USDAFood {
  id: number;
  name: string;
  // Legacy single measure format (for backward compatibility)
  calcium?: number;
  measure?: string;
  // New multi-measure format
  measures?: MeasureSet[];
  isFavorite?: boolean;
}

export interface UserServingPreference {
  foodId: number;
  preferredQuantity: number;
  preferredUnit: string;
  lastUsed: string;
  preferredMeasureIndex?: number; // Optional: index of preferred measure for multi-measure foods
}