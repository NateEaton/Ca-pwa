/**
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

/**
 * @fileoverview Enhanced food database with rehydration support.
 * Handles both minified and non-minified data structures transparently.
 * Provides backward compatibility while supporting bundle size optimization.
 */

// --- Data Import and Rehydration Logic ---

let _databaseCache = null;
let _metadataCache = null;

/**
 * Rehydrates minified food data back to full object structure
 * Handles both legacy single-measure and new multi-measure formats
 * @param {Array} minifiedData - Array of minified food objects
 * @param {Object} keyMapping - Mapping from minified keys to full keys
 * @param {Object} measureKeyMapping - Mapping for measure object keys (if available)
 * @returns {Array} Array of fully rehydrated food objects
 */
function rehydrateDatabase(minifiedData, keyMapping, measureKeyMapping) {
  return minifiedData.map((minifiedFood) => {
    const rehydratedFood = {};

    // Rehydrate each property using key mapping
    for (const [minifiedKey, value] of Object.entries(minifiedFood)) {
      const fullKey = keyMapping[minifiedKey];
      if (fullKey) {
        // Special handling for measures arrays
        if (fullKey === 'measures' && Array.isArray(value) && measureKeyMapping) {
          rehydratedFood[fullKey] = value.map(minifiedMeasure => {
            const rehydratedMeasure = {};
            for (const [minMeasureKey, measureValue] of Object.entries(minifiedMeasure)) {
              const fullMeasureKey = measureKeyMapping[minMeasureKey];
              if (fullMeasureKey) {
                rehydratedMeasure[fullMeasureKey] = measureValue;
              } else {
                rehydratedMeasure[minMeasureKey] = measureValue;
              }
            }
            return rehydratedMeasure;
          });
        } else {
          rehydratedFood[fullKey] = value;
        }
      } else {
        // Fallback: if key not in mapping, use as-is (shouldn't happen in normal operation)
        console.warn(`Unknown minified key: ${minifiedKey}`);
        rehydratedFood[minifiedKey] = value;
      }
    }

    // Ensure backward compatibility: if no measures array, create from legacy fields
    if (!rehydratedFood.measures && (rehydratedFood.measure || rehydratedFood.calcium)) {
      rehydratedFood.measures = [{
        measure: rehydratedFood.measure || "",
        calcium: parseFloat(rehydratedFood.calcium || 0)
      }];
    }

    return rehydratedFood;
  });
}

/**
 * Loads and processes the food database, handling both minified and standard formats
 * @returns {Array} The processed food database
 */
async function loadFoodDatabase() {
  if (_databaseCache) {
    return _databaseCache;
  }

  try {
    const module = await import("./foodDatabaseData.js");

    // Check if we have minified data (has KEYS export)
    if (module.KEYS && module.DB) {
      _databaseCache = rehydrateDatabase(module.DB, module.KEYS, module.MEASURE_KEYS);
      _metadataCache = module.DATABASE_METADATA;
    }
    // Check if we have standard format (has DEFAULT_FOOD_DATABASE export)
    else if (module.DEFAULT_FOOD_DATABASE) {
      _databaseCache = module.DEFAULT_FOOD_DATABASE;
      _metadataCache = module.DATABASE_METADATA;
    }
    // Fallback: look for any array export
    else {
      console.warn("Unknown food database format, attempting fallback...");
      // Try to find the first array export
      const arrayExport = Object.values(module).find((exp) =>
        Array.isArray(exp)
      );
      if (arrayExport) {
        _databaseCache = arrayExport;
      } else {
        console.error("No valid food database found in module");
        _databaseCache = [];
      }
      _metadataCache = module.DATABASE_METADATA || getDefaultMetadata();
    }
    return _databaseCache;
  } catch (error) {
    console.error("Error loading food database:", error);
    _databaseCache = [];
    _metadataCache = getDefaultMetadata();
    return _databaseCache;
  }
}

/**
 * Returns default metadata when none is available
 */
function getDefaultMetadata() {
  return {
    version: "4.0",
    recordCount: 0,
    created: new Date().toISOString().split("T")[0],
    author: "Ca PWA Data Pipeline",
    notes: "Default metadata - database may not have loaded correctly",
    sourceUrls: [],
  };
}

// --- Public Exports ---

// Database metadata (loaded asynchronously)
export let DATABASE_METADATA = null;

// Food database (loaded asynchronously)
export let DEFAULT_FOOD_DATABASE = [];

// Load database and metadata on module initialization
loadFoodDatabase()
  .then((database) => {
    // Update the exported arrays
    DEFAULT_FOOD_DATABASE.length = 0;
    DEFAULT_FOOD_DATABASE.push(...database);

    // Update metadata
    DATABASE_METADATA = _metadataCache;
  })
  .catch((error) => {
    console.error("Failed to initialize food database:", error);
    DATABASE_METADATA = getDefaultMetadata();
  });

/**
 * Async function to get fully loaded database
 * Use this in services that need guaranteed database access
 */
export async function getFoodDatabase() {
  return await loadFoodDatabase();
}

/**
 * Async function to get database metadata
 */
export async function getDatabaseMetadata() {
  if (!_metadataCache) {
    await loadFoodDatabase();
  }
  return _metadataCache;
}

/**
 * Get a food by ID (async version for services)
 * @param {number} id - The food ID to find
 * @returns {Object|null} The food object or null if not found
 */
export async function getFoodById(id) {
  const database = await loadFoodDatabase();
  return database.find((food) => food.id === id) || null;
}

// --- Search Functions (Legacy Support) ---

// Search stopwords to ignore
const SEARCH_STOPWORDS = [
  "with",
  "without",
  "and",
  "or",
  "the",
  "of",
  "in",
  "on",
  "at",
  "to",
  "for",
  "from",
  "by",
  "added",
  "prepared",
  "cooked",
  "raw",
  "fresh",
  "frozen",
  "canned",
  "dried",
  "chopped",
  "sliced",
  "diced",
  "whole",
  "ground",
  "boiled",
  "baked",
  "fried",
  "roasted",
  "steamed",
];

/**
 * Legacy search function for backward compatibility
 * @deprecated Use SearchService.searchFoods() instead for enhanced search capabilities
 */
export function searchFoods(
  query,
  customFoods = [],
  favorites = new Set(),
  hiddenFoods = new Set()
) {
  console.warn(
    "Warning: searchFoods() is deprecated. Use SearchService.searchFoods() for better performance and features."
  );

  if (!query || query.trim().length === 0) {
    return [];
  }

  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0 && !SEARCH_STOPWORDS.includes(term));

  if (searchTerms.length === 0) {
    return [];
  }

  const allFoods = [...DEFAULT_FOOD_DATABASE, ...customFoods];

  return allFoods
    .filter((food) => !hiddenFoods.has(food.id))
    .map((food) => {
      const nameWords = food.name.toLowerCase().split(/\s+/);
      let score = 0;

      // Scoring logic
      for (const term of searchTerms) {
        if (food.name.toLowerCase().includes(term)) {
          score += term.length;
          if (nameWords.some((word) => word.startsWith(term))) {
            score += 2;
          }
          if (nameWords.some((word) => word === term)) {
            score += 5;
          }
        }
      }

      return { food, score };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => {
      // Favorites first
      const aFav = favorites.has(a.food.id);
      const bFav = favorites.has(b.food.id);
      if (aFav !== bFav) return bFav - aFav;

      // Then by score
      if (b.score !== a.score) return b.score - a.score;

      // Finally by name
      return a.food.name.localeCompare(b.food.name);
    })
    .slice(0, 50)
    .map((result) => result.food);
}

/**
 * Helper function to get the primary (first) measure from a food
 * Provides backward compatibility for existing code expecting single measure/calcium
 * @param {Object} food - The food object (with measures array or legacy format)
 * @returns {Object} Object with { measure, calcium } for primary serving
 */
export function getPrimaryMeasure(food) {
  // New format: use first measure from array
  if (food.measures && Array.isArray(food.measures) && food.measures.length > 0) {
    return {
      measure: food.measures[0].measure,
      calcium: food.measures[0].calcium
    };
  }
  
  // Legacy format: use direct properties
  return {
    measure: food.measure || "",
    calcium: food.calcium || 0
  };
}

/**
 * Helper function to get all measures from a food
 * @param {Object} food - The food object
 * @returns {Array} Array of { measure, calcium } objects
 */
export function getAllMeasures(food) {
  // New format: return measures array
  if (food.measures && Array.isArray(food.measures)) {
    return food.measures;
  }
  
  // Legacy format: convert to array
  return [{
    measure: food.measure || "",
    calcium: food.calcium || 0
  }];
}

/**
 * Helper function to check if a food has multiple serving options
 * @param {Object} food - The food object
 * @returns {boolean} True if food has multiple measures
 */
export function hasMultipleMeasures(food) {
  return food.measures && Array.isArray(food.measures) && food.measures.length > 1;
}

/**
 * Formats calcium value to at most 1 decimal place
 * Removes trailing .0 for whole numbers
 * @param {number} calcium - The calcium value in mg
 * @returns {string} Formatted calcium value
 */
export function formatCalcium(calcium) {
  if (calcium == null || isNaN(calcium)) return '0';

  // Round to 1 decimal place
  const rounded = Math.round(calcium * 10) / 10;

  // Convert to string and remove trailing .0
  return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1);
}

// For legacy compatibility, maintain the original loadFoodDatabase export
export { loadFoodDatabase };
