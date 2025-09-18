// USDA FoodData Central API Service for UPC lookup
import { FDC_CONFIG } from '$lib/config/fdc.js';

export class FDCService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = FDC_CONFIG.API_BASE_URL;
    this.searchEndpoint = FDC_CONFIG.SEARCH_ENDPOINT;
  }

  /**
   * Search for a product by UPC/GTIN code
   * @param {string} upcCode - The UPC/GTIN code to search for
   * @returns {Promise<Object>} Product data or null if not found
   */
  async searchByUPC(upcCode) {
    console.log('FDC: Starting UPC lookup for:', upcCode);

    try {
      // Validate UPC code
      if (!upcCode || typeof upcCode !== 'string') {
        throw new Error('Invalid UPC code provided');
      }

      // Clean UPC code (remove spaces and non-digits, standardize format)
      const originalUPC = upcCode;
      const cleanUPC = upcCode.replace(/\D/g, '');
      console.log(`FDC: UPC format - original: "${originalUPC}" → cleaned: "${cleanUPC}"`);

      if (cleanUPC.length < 8 || cleanUPC.length > 14) {
        throw new Error(`UPC code must be between 8-14 digits. Got ${cleanUPC.length} digits: "${cleanUPC}"`);
      }

      // Validate API key
      console.log('FDC: Current API key:', this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'undefined');
      if (!this.apiKey || this.apiKey === 'DEMO_KEY') {
        console.warn('FDC: Using DEMO_KEY with rate limits. Configure VITE_FDC_API_KEY for production.');
      }

      const searchParams = {
        query: cleanUPC,
        dataType: FDC_CONFIG.DATA_TYPE,
        pageSize: FDC_CONFIG.DEFAULT_PAGE_SIZE
      };

      const url = `${this.baseUrl}${this.searchEndpoint}?api_key=${this.apiKey}`;
      console.log('FDC: Making API request to:', url.replace(this.apiKey, 'HIDDEN_KEY'));
      console.log('FDC: Request payload:', JSON.stringify(searchParams, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams)
      });

      console.log('FDC: API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('FDC: API error response:', errorText);
        throw new Error(`FDC API error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('FDC: API response data:', result);

      // Check if we got results
      if (!result.foods || result.foods.length === 0) {
        console.log('FDC: No products found for UPC:', cleanUPC);
        return null;
      }

      // Handle multiple records - select the one with most recent publishedDate
      let product;
      if (result.foods.length > 1) {
        console.log(`FDC: Found ${result.foods.length} records for UPC ${cleanUPC}, selecting most recent`);

        // Sort by publishedDate (most recent first)
        const sortedFoods = result.foods.sort((a, b) => {
          const dateA = new Date(a.publishedDate || '1900-01-01');
          const dateB = new Date(b.publishedDate || '1900-01-01');
          return dateB.getTime() - dateA.getTime();
        });

        product = sortedFoods[0];
        console.log(`FDC: Selected record with publishedDate: ${product.publishedDate}`);
      } else {
        product = result.foods[0];
        console.log(`FDC: Single record found for UPC ${cleanUPC}`);
      }

      return this.parseProductData(product, cleanUPC);

    } catch (error) {
      console.error('FDC lookup failed:', error);

      // Provide more helpful error messages
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to USDA database. Please check your internet connection.');
      }

      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Please check your internet connection and try again.');
      }

      throw error;
    }
  }

  /**
   * Parse USDA FDC product data into our standard format
   * @param {Object} product - Raw product data from FDC API
   * @param {string} upcCode - The original UPC code searched
   * @returns {Object} Parsed product data
   */
  parseProductData(product, upcCode) {
    console.log('FDC: Parsing product data...');

    try {
      // Extract basic product info
      const productName = product.description || 'Unknown Product';
      const brandOwner = product.brandOwner || '';
      const brandName = product.brandName || product.brandOwner || '';
      const ingredients = product.ingredients || '';

      // Extract serving size information
      let servingSize = '';
      let servingCount = 1;
      let servingUnit = '';

      if (product.servingSize && product.servingSizeUnit) {
        servingCount = product.servingSize;
        servingUnit = product.servingSizeUnit;
        servingSize = `${product.servingSize} ${product.servingSizeUnit}`;
      } else if (product.householdServingFullText) {
        servingSize = product.householdServingFullText;
        // Try to parse count and unit from text like "11 g" or "1 cup"
        const match = servingSize.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
        if (match) {
          servingCount = parseFloat(match[1]);
          servingUnit = match[2].trim();
        }
      }

      console.log('FDC: Serving info - count:', servingCount, 'unit:', servingUnit, 'full:', servingSize);
      console.log('FDC: Raw serving data from API:', {
        servingSize: product.servingSize,
        servingSizeUnit: product.servingSizeUnit,
        householdServingFullText: product.householdServingFullText
      });

      // Extract calcium from labelNutrients and foodNutrients
      let calcium = '';
      let calciumValue = null;

      console.log('FDC: Raw product data for calcium analysis:', {
        labelNutrients: product.labelNutrients,
        foodNutrients: product.foodNutrients ? product.foodNutrients.filter(n => n.nutrientName && n.nutrientName.toLowerCase().includes('calcium')) : null,
        servingSize: product.servingSize,
        servingSizeUnit: product.servingSizeUnit
      });

      // First try labelNutrients
      if (product.labelNutrients && product.labelNutrients.calcium) {
        calciumValue = product.labelNutrients.calcium.value;
        if (calciumValue !== null && calciumValue !== undefined) {
          calcium = `${calciumValue} mg`;
          console.log('FDC: Found calcium in labelNutrients:', calcium);
        }
      }

      // If no calcium in labelNutrients, check foodNutrients array
      if (!calciumValue && product.foodNutrients) {
        const calciumNutrient = product.foodNutrients.find(
          nutrient => nutrient.nutrientNumber === "301" || // Calcium nutrient number
                      nutrient.nutrientId === 301 || // Fallback to nutrientId
                      (nutrient.nutrientName && nutrient.nutrientName.toLowerCase().includes('calcium'))
        );

        if (calciumNutrient && calciumNutrient.value) {
          calciumValue = calciumNutrient.value;
          calcium = `${calciumValue} mg`;
          console.log('FDC: Found calcium in foodNutrients:', calcium);
        }
      }

      // Extract calcium percent daily value from foodNutrients
      let calciumPercentDV = null;
      let calciumFromPercentDV = null;
      if (product.foodNutrients) {
        const calciumNutrient = product.foodNutrients.find(
          nutrient => nutrient.nutrientNumber === "301" ||
                      nutrient.nutrientId === 301 ||
                      (nutrient.nutrientName && nutrient.nutrientName.toLowerCase().includes('calcium'))
        );
        if (calciumNutrient && calciumNutrient.percentDailyValue) {
          calciumPercentDV = calciumNutrient.percentDailyValue;
          // Calculate calcium amount from percent DV: (percentDV / 100) * 1300mg
          calciumFromPercentDV = Math.round((calciumPercentDV / 100) * 1300);
        }
      }

      // Calculate per-serving calcium from API calcium (per 100g) and serving size
      let calciumPerServing = null;
      console.log('FDC: Per-serving calcium calculation check:');
      console.log(`  - calciumValue: ${calciumValue} (type: ${typeof calciumValue})`);
      console.log(`  - servingCount: ${servingCount} (type: ${typeof servingCount})`);
      console.log(`  - servingUnit: "${servingUnit}" (type: ${typeof servingUnit})`);
      console.log(`  - isVolumeOrMassUnit: ${this.isVolumeOrMassUnit(servingUnit)}`);

      if (calciumValue && servingCount && this.isVolumeOrMassUnit(servingUnit)) {
        // API calcium is per 100g, calculate for actual serving size
        // Treating grams and milliliters as equivalent (1:1 density)
        calciumPerServing = Math.round((calciumValue * servingCount) / 100);
        console.log(`FDC: ✅ Calculated per-serving calcium: ${calciumValue}mg/100g × ${servingCount}${servingUnit} / 100 = ${calciumPerServing}mg`);
      } else {
        console.log('FDC: ❌ Cannot calculate per-serving calcium - missing required data');
        if (!calciumValue) console.log('    Missing calciumValue');
        if (!servingCount) console.log('    Missing servingCount');
        if (!this.isVolumeOrMassUnit(servingUnit)) console.log(`    Invalid servingUnit: "${servingUnit}"`);
      }

      const result = {
        source: 'USDA FDC',
        upcCode: upcCode,
        fdcId: product.fdcId,
        productName: productName,
        brandOwner: brandOwner,
        brandName: brandName,
        servingSize: servingSize,
        servingCount: servingCount,
        servingUnit: servingUnit,
        householdServingFullText: product.householdServingFullText,
        calcium: calcium,
        calciumValue: calciumValue,
        calciumPercentDV: calciumPercentDV,
        calciumFromPercentDV: calciumFromPercentDV,
        calciumPerServing: calciumPerServing,
        ingredients: ingredients,
        confidence: 'high', // UPC lookups are always high confidence
        rawData: product // Include raw data for debugging
      };

      console.log('FDC: Parse result:', result);
      return result;

    } catch (error) {
      console.error('FDC: Error parsing product data:', error);
      throw new Error('Failed to parse product data from USDA database');
    }
  }

  /**
   * Check if a unit represents volume (ml) or mass (g) that can be used for per-serving calculation
   * Handles various API unit format variations
   * @param {string} unit - The unit string to check
   * @returns {boolean} True if unit represents grams or milliliters
   */
  isVolumeOrMassUnit(unit) {
    console.log(`FDC: Checking unit "${unit}" for volume/mass compatibility`);

    if (!unit || typeof unit !== 'string') {
      console.log(`FDC: Unit check failed - invalid input: ${unit} (type: ${typeof unit})`);
      return false;
    }

    // Enhanced unit cleaning - handle multiple formats and edge cases
    let cleanedUnit = unit.toString().trim();

    // Remove common prefixes/suffixes and normalize
    cleanedUnit = cleanedUnit.replace(/^[\s\d\.\-]+/, ''); // Remove leading numbers/spaces/dots/dashes
    cleanedUnit = cleanedUnit.replace(/[\s\.\-]+$/, '');   // Remove trailing spaces/dots/dashes
    cleanedUnit = cleanedUnit.toLowerCase();

    console.log(`FDC: Original unit: "${unit}" → Cleaned: "${cleanedUnit}"`);

    // Explicit handling for problematic USDA formats
    const unitMappings = {
      'grm': 'g',
      'gm': 'g',
      'gms': 'g',
      'gram': 'g',
      'grams': 'g',
      'gr': 'g',
      'mlt': 'ml',
      'milliliter': 'ml',
      'milliliters': 'ml',
      'millilitre': 'ml',
      'millilitres': 'ml',
      'mls': 'ml'
    };

    // Apply mapping if exists
    if (unitMappings[cleanedUnit]) {
      console.log(`FDC: Mapped "${cleanedUnit}" → "${unitMappings[cleanedUnit]}"`);
      cleanedUnit = unitMappings[cleanedUnit];
    }

    // Core valid units (simplified after mapping)
    const validUnits = ['g', 'ml', 'oz', 'fl oz', 'fluid ounce', 'ounce'];

    const isValidUnit = validUnits.includes(cleanedUnit);
    console.log(`FDC: Final unit "${cleanedUnit}" is ${isValidUnit ? 'VALID' : 'INVALID'} for calculation`);

    if (!isValidUnit) {
      console.log(`FDC: Valid units after mapping: [${validUnits.join(', ')}]`);
      console.log(`FDC: Available mappings:`, unitMappings);
    }

    return isValidUnit;
  }

  /**
   * Validate that a string looks like a UPC code
   * @param {string} code - The code to validate
   * @returns {boolean} True if it looks like a valid UPC
   */
  static isValidUPCFormat(code) {
    if (!code || typeof code !== 'string') return false;

    const cleanCode = code.replace(/\D/g, '');
    return cleanCode.length >= 8 && cleanCode.length <= 14;
  }

  /**
   * Format UPC code for display
   * @param {string} upcCode - Raw UPC code
   * @returns {string} Formatted UPC code
   */
  static formatUPC(upcCode) {
    const clean = upcCode.replace(/\D/g, '');

    // Format common UPC lengths
    if (clean.length === 12) {
      // UPC-A: 123456 789012
      return clean.replace(/(\d{6})(\d{6})/, '$1 $2');
    } else if (clean.length === 13) {
      // EAN-13: 123 4567 890123
      return clean.replace(/(\d{3})(\d{4})(\d{6})/, '$1 $2 $3');
    }

    return clean;
  }
}