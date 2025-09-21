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

// USDA FoodData Central API Configuration for Calcium Tracker PWA
export const FDC_CONFIG = {
  // API key from environment variable
  API_KEY: import.meta.env.VITE_FDC_API_KEY || 'DEMO_KEY',
  API_BASE_URL: 'https://api.nal.usda.gov/fdc/v1',
  SEARCH_ENDPOINT: '/foods/search',

  // Default search parameters
  DEFAULT_PAGE_SIZE: 1, // Just need first match for UPC lookups
  DATA_TYPE: ['Branded'], // Only search branded foods for UPC codes

  // Nutrition data IDs for reference (optional)
  NUTRITION_IDS: {
    CALCIUM: 301 // Calcium, Ca (mg)
  }
};