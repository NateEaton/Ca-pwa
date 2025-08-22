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

/**
 * @fileoverview USDA food database with calcium content data.
 * Contains 4400+ foods from USDA FoodData Central with calcium measurements.
 */

// Database metadata for source tracking and abstraction
export const DATABASE_METADATA = {
  source: "USDA-FDC",
  label: "USDA FoodData Central",
  name: "USDA FoodData Central - Foundation & SR Legacy",
  description:
    "Comprehensive food database combining USDA FoodData Central (Foundation and SR Legacy sources) with previous USDA Calcium Content Reference data",
  version: "2025.2",
  recordCount: 4483,
  created: "2025-08-09",
  author: "USDA Agricultural Research Service",
  sourceUrls: [
    {
      name: "USDA FoodData Central",
      url: "https://fdc.nal.usda.gov/food-search",
    },
    {
      name: "USDA Calcium Content Reference",
      url: "https://www.nal.usda.gov/sites/default/files/page-files/calcium.pdf",
    },
  ],
  notes:
    "Data programmatically filtered to one element per food type, excluding branded foods from SR Legacy, then merged with abridged calcium reference data",
};

// Cache for the dynamically loaded food database
let _foodDatabaseCache = null;

// Function to dynamically load the food database
export async function loadFoodDatabase() {
  if (_foodDatabaseCache) {
    return _foodDatabaseCache;
  }
  
  const module = await import('./foodDatabaseData.js');
  _foodDatabaseCache = module.DEFAULT_FOOD_DATABASE;
  return _foodDatabaseCache;
}

// Legacy export for backward compatibility - will be loaded dynamically
export let DEFAULT_FOOD_DATABASE = [];

// Initialize the database on first import
loadFoodDatabase().then(data => {
  DEFAULT_FOOD_DATABASE.length = 0;
  DEFAULT_FOOD_DATABASE.push(...data);
});

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

// Helper function to search foods
// @deprecated Use SearchService.searchFoods() instead for enhanced search capabilities
export function searchFoods(
  query,
  customFoods = [],
  favorites = new Set(),
  hiddenFoods = new Set()
) {
  console.warn(
    "Warning: searchFoods() is deprecated. Use SearchService.searchFoods() for better performance and features."
  );

  if (!query || query.trim().length === 0) return [];

  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 0 && !SEARCH_STOPWORDS.includes(word));

  if (keywords.length === 0) return [];

  // Combine default database and custom foods
  const allFoods = [...DEFAULT_FOOD_DATABASE, ...customFoods];

  const results = allFoods
    .map((food) => {
      const searchText = food.name.toLowerCase();
      let score = 0;

      keywords.forEach((keyword) => {
        if (searchText.includes(keyword)) {
          if (searchText.startsWith(keyword)) {
            score += 10;
          } else if (searchText.indexOf(" " + keyword) !== -1) {
            score += 5;
          } else {
            score += 1;
          }
        }
      });

      return { food, score };
    })
    .filter((result) => result.score > 0)
    .filter((result) => !hiddenFoods.has(result.food.id))
    .sort((a, b) => {
      if (favorites.has(a.food.id) && !favorites.has(b.food.id)) return -1;
      if (!favorites.has(a.food.id) && favorites.has(b.food.id)) return 1;
      return b.score - a.score;
    })
    .map((result) => result.food);

  return results.slice(0, 50);
}

// Helper function to normalize measurement units
export function normalizeUnit(unit) {
  if (!unit || typeof unit !== "string") {
    return unit;
  }

  const unitMap = {
    cup: "cup",
    cups: "cup",
    c: "cup",
    tbsp: "tablespoon",
    tablespoon: "tablespoon",
    tablespoons: "tablespoon",
    tsp: "teaspoon",
    teaspoon: "teaspoon",
    teaspoons: "teaspoon",
    oz: "ounce",
    ounce: "ounce",
    ounces: "ounce",
    lb: "pound",
    lbs: "pound",
    pound: "pound",
    pounds: "pound",
    kg: "kilogram",
    kilograms: "kilogram",
    g: "gram",
    grams: "gram",
    mg: "milligram",
    milligrams: "milligram",
    ml: "milliliter",
    milliliters: "milliliter",
    l: "liter",
    liters: "liter",
    "fl oz": "fluid ounce",
    "fluid ounces": "fluid ounce",
    piece: "piece",
    pieces: "piece",
    slice: "slice",
    slices: "slice",
    serving: "serving",
    servings: "serving",
  };

  return unitMap[unit.toLowerCase()] || unit;
}
