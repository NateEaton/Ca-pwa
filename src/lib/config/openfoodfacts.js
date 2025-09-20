// OpenFoodFacts API Configuration for Calcium Tracker PWA
export const OPENFOODFACTS_CONFIG = {
  // OpenFoodFacts API base URL
  API_BASE_URL: 'https://world.openfoodfacts.org/api/v2',
  PRODUCT_ENDPOINT: '/product', // Pattern: /product/{barcode}.json

  // User agent for API requests (required by OpenFoodFacts)
  USER_AGENT: 'CalciumTracker/1.0 (https://calcium-dev.eatonfamily.net)',

  // Nutrition data field mappings
  NUTRITION_FIELDS: {
    // Calcium fields in nutriments object
    CALCIUM_100G: 'calcium_100g',        // Calcium per 100g
    CALCIUM_SERVING: 'calcium_serving',  // Calcium per serving
    CALCIUM_UNIT: 'calcium_unit',        // Unit (usually 'g' for grams)
  },

  // Serving size fields
  SERVING_FIELDS: {
    QUANTITY: 'serving_quantity',      // Serving quantity (number)
    UNIT: 'serving_quantity_unit',     // Serving unit (e.g., 'g', 'ml')
    SIZE_TEXT: 'serving_size',         // Human-readable serving size
  },

  // Product info fields
  PRODUCT_FIELDS: {
    NAME: 'product_name',
    BRANDS: 'brands',
    INGREDIENTS: 'ingredients_text',
    COMPLETENESS: 'completeness',      // Data completeness score (0-1)
  },

  // Unit conversion
  UNIT_CONVERSION: {
    GRAMS_TO_MG: 1000,    // Convert grams to milligrams
    DEFAULT_UNIT: 'g',    // Default calcium unit in OpenFoodFacts

    // IMPORTANT: OpenFoodFacts has inconsistent calcium units!
    // - calcium_unit often shows "mg" but values are actually in grams (fractions like 0.158)
    // - The OpenFoodFacts website displays these as converted mg values
    // - We hardcode the conversion rather than trust calcium_unit field
    FORCE_CALCIUM_CONVERSION: true  // Always convert calcium values by 1000x
  }
};