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