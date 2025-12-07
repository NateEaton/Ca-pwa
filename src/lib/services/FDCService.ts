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

// USDA FoodData Central API Service for UPC lookup
import { FDC_CONFIG } from '$lib/config/fdc.js';
import { HouseholdMeasureService } from './HouseholdMeasureService';
import { logger } from '$lib/utils/logger';

interface FDCProduct {
  fdcId: number;
  description: string;
  brandOwner?: string;
  brandName?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  ingredients?: string;
  labelNutrients?: any;
  foodNutrients?: any[];
  publishedDate?: string;
}

interface ParsedProduct {
  source: string;
  upcCode: string;
  fdcId: number;
  productName: string;
  brandOwner: string;
  brandName: string;

  // Clean final data for AddFoodModal (centralized decision result)
  finalServingQuantity: number;
  finalServingUnit: string;
  servingDisplayText: string;
  servingSource: 'enhanced' | 'standard';

  // Legacy fields (for backward compatibility)
  servingSize: string;
  servingCount: number;
  servingUnit: string;
  householdServingFullText?: string;
  smartServing?: any;

  calcium: string;
  calciumValue: number | null;
  calciumPercentDV?: number | null;
  calciumFromPercentDV?: number | null;
  calciumPerServing?: number | null;
  ingredients: string;
  confidence: string;
  rawData: FDCProduct;
}

export class FDCService {
  private apiKey: string;
  private baseUrl: string;
  private searchEndpoint: string;
  private householdMeasureService: HouseholdMeasureService;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = FDC_CONFIG.API_BASE_URL;
    this.searchEndpoint = FDC_CONFIG.SEARCH_ENDPOINT;
    this.householdMeasureService = new HouseholdMeasureService();
  }

  /**
   * Search for a product by UPC/GTIN code
   * @param upcCode - The UPC/GTIN code to search for
   * @returns Product data or null if not found
   */
  async searchByUPC(upcCode: string): Promise<ParsedProduct | null> {
    logger.debug('FDC', 'Starting UPC lookup for:', upcCode);

    try {
      // Validate UPC code
      if (!upcCode || typeof upcCode !== 'string') {
        throw new Error('Invalid UPC code provided');
      }

      // Clean UPC code (remove spaces and non-digits, standardize format)
      const originalUPC = upcCode;
      const cleanUPC = upcCode.replace(/\D/g, '');
      logger.debug('FDC', `UPC format - original: "${originalUPC}" → cleaned: "${cleanUPC}"`);

      if (cleanUPC.length < 8 || cleanUPC.length > 14) {
        throw new Error(`UPC code must be between 8-14 digits. Got ${cleanUPC.length} digits: "${cleanUPC}"`);
      }

      // Validate API key
      logger.debug('FDC', 'Current API key:', this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'undefined');
      if (!this.apiKey || this.apiKey === 'DEMO_KEY') {
        logger.debug('FDC', 'Using DEMO_KEY with rate limits. Configure VITE_FDC_API_KEY for production.');
      }

      const searchParams = {
        query: cleanUPC,
        dataType: FDC_CONFIG.DATA_TYPE,
        pageSize: FDC_CONFIG.DEFAULT_PAGE_SIZE
      };

      const url = `${this.baseUrl}${this.searchEndpoint}?api_key=${this.apiKey}`;
      logger.debug('FDC', 'Making API request to:', url.replace(this.apiKey, 'HIDDEN_KEY'));
      logger.debug('FDC', 'Request payload:', JSON.stringify(searchParams, null, 2));

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams)
      });

      logger.debug('FDC', 'API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        logger.debug('FDC', 'API error response:', errorText);
        throw new Error(`FDC API error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      logger.debug('FDC', 'API response data:', result);

      // Check if we got results
      if (!result.foods || result.foods.length === 0) {
        logger.debug('FDC', 'No products found for UPC:', cleanUPC);
        return null;
      }

      // Handle multiple records - select the one with most recent publishedDate
      let product;
      if (result.foods.length > 1) {
        logger.debug('FDC', `Found ${result.foods.length} records for UPC ${cleanUPC}, selecting most recent`);

        // Sort by publishedDate (most recent first)
        const sortedFoods = result.foods.sort((a, b) => {
          const dateA = new Date(a.publishedDate || '1900-01-01');
          const dateB = new Date(b.publishedDate || '1900-01-01');
          return dateB.getTime() - dateA.getTime();
        });

        product = sortedFoods[0];
        logger.debug('FDC', `Selected record with publishedDate: ${product.publishedDate}`);
      } else {
        product = result.foods[0];
        logger.debug('FDC', `Single record found for UPC ${cleanUPC}`);
      }

      return this.parseProductData(product, cleanUPC);

    } catch (error) {
      logger.debug('FDC', 'lookup failed:', error);

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
   * @param product - Raw product data from FDC API
   * @param upcCode - The original UPC code searched
   * @returns Parsed product data
   */
  parseProductData(product: FDCProduct, upcCode: string): ParsedProduct {
    logger.debug('FDC', 'Parsing product data...');

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
      let smartServingResult = null;

      if (product.servingSize && product.servingSizeUnit) {
        servingCount = product.servingSize;
        // Standardize the unit from USDA API (MLT → ml, GRM → g, etc.)
        servingUnit = this.householdMeasureService.standardizeUnit(product.servingSizeUnit);

        // Generate smart serving size using household measure if available
        smartServingResult = this.householdMeasureService.generateSmartServingSize(
          product.servingSize,
          servingUnit, // Use standardized unit
          product.householdServingFullText,
          productName
        );

        // Set servingSize based on whether smart serving was enhanced or not
        if (smartServingResult.isEnhanced) {
          servingSize = smartServingResult.text; // e.g., "cup (240ml)"
        } else {
          // Use standardized format for fallback, omit count if it's 1
          if (servingCount === 1) {
            servingSize = servingUnit; // e.g., "ml" instead of "1 ml"
          } else {
            servingSize = `${servingCount} ${servingUnit}`; // e.g., "240 ml"
          }
        }

        logger.debug('FDC', 'Smart serving size result:', smartServingResult);
        logger.debug('FDC', `Unit standardization: "${product.servingSizeUnit}" → "${servingUnit}"`);

      } else if (product.householdServingFullText) {
        servingSize = product.householdServingFullText;
        // Try to parse count and unit from text like "11 g" or "1 cup"
        const match = servingSize.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
        if (match) {
          servingCount = parseFloat(match[1]);
          servingUnit = match[2].trim();
        }
      }

      logger.debug('FDC', 'Serving info - count:', servingCount, 'unit:', servingUnit, 'full:', servingSize);
      logger.debug('FDC', 'Raw serving data from API:', {
        servingSize: product.servingSize,
        servingSizeUnit: product.servingSizeUnit,
        householdServingFullText: product.householdServingFullText
      });

      // Extract calcium from labelNutrients and foodNutrients
      let calcium = '';
      let calciumValue = null;

      logger.debug('FDC', 'Raw product data for calcium analysis:', {
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
          logger.debug('FDC', 'Found calcium in labelNutrients:', calcium);
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
          logger.debug('FDC', 'Found calcium in foodNutrients:', calcium);
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
      logger.debug('FDC', 'Per-serving calcium calculation check:');
      logger.debug('FDC', `  - calciumValue: ${calciumValue} (type: ${typeof calciumValue})`);
      logger.debug('FDC', `  - servingCount: ${servingCount} (type: ${typeof servingCount})`);
      logger.debug('FDC', `  - servingUnit: "${servingUnit}" (type: ${typeof servingUnit})`);
      logger.debug('FDC', `  - isVolumeOrMassUnit: ${this.householdMeasureService.isVolumeOrMassUnit(servingUnit)}`);

      if (calciumValue && servingCount && this.householdMeasureService.isVolumeOrMassUnit(servingUnit)) {
        // API calcium is per 100g, calculate for actual serving size
        // Treating grams and milliliters as equivalent (1:1 density)
        calciumPerServing = Math.round((calciumValue * servingCount) / 100);
        logger.debug('FDC', `✅ Calculated per-serving calcium: ${calciumValue}mg/100g × ${servingCount}${servingUnit} / 100 = ${calciumPerServing}mg`);
      } else {
        logger.debug('FDC', '❌ Cannot calculate per-serving calcium - missing required data');
        if (!calciumValue) logger.debug('FDC', '    Missing calciumValue');
        if (!servingCount) logger.debug('FDC', '    Missing servingCount');
        if (!this.householdMeasureService.isVolumeOrMassUnit(servingUnit)) logger.debug('FDC', `    Invalid servingUnit: "${servingUnit}"`);

        // If we can't calculate per-serving, use the raw value as fallback
        if (calciumValue) {
          logger.debug('FDC', `Using raw calciumValue as fallback: ${calciumValue}mg`);
        }
      }

      // ============================================================================
      // CENTRALIZED SERVING DECISION LOGIC
      // Determine final serving format for AddFoodModal (single source of truth)
      // ============================================================================
      let finalServingQuantity: number;
      let finalServingUnit: string;
      let servingDisplayText: string;
      let servingSource: 'enhanced' | 'standard';

      logger.debug('FDC', 'Making centralized serving decision...');
      logger.debug('FDC', `  - smartServingResult.isEnhanced: ${smartServingResult?.isEnhanced}`);
      logger.debug('FDC', `  - smartServingResult.householdAmount: ${smartServingResult?.householdAmount}`);

      if (smartServingResult && smartServingResult.isEnhanced) {
        // ENHANCED: Use household measure format
        // Example: "2 tbsp" → quantity=2, unit="tbsp (11g)"
        finalServingQuantity = smartServingResult.householdAmount || 1;

        // Extract just the unit part from parsed household measure
        const parsedMeasure = this.householdMeasureService.parseHouseholdMeasure(product.householdServingFullText || '');
        const householdUnit = parsedMeasure?.unit || 'serving';
        finalServingUnit = `${householdUnit} (${servingCount}${servingUnit})`;

        servingDisplayText = smartServingResult.text; // e.g., "2 tbsp (11g)"
        servingSource = 'enhanced';

        logger.debug('FDC', `✅ Enhanced serving - quantity: ${finalServingQuantity}, unit: "${finalServingUnit}"`);
      } else {
        // STANDARD: Use raw API serving format
        // Example: "170 g" → quantity=170, unit="g"
        finalServingQuantity = servingCount;
        finalServingUnit = servingUnit;
        servingDisplayText = servingSize; // Already formatted above
        servingSource = 'standard';

        logger.debug('FDC', `⚡ Standard serving - quantity: ${finalServingQuantity}, unit: "${finalServingUnit}"`);
      }

      logger.debug('FDC', 'Final serving decision:');
      logger.debug('FDC', `  - finalServingQuantity: ${finalServingQuantity}`);
      logger.debug('FDC', `  - finalServingUnit: "${finalServingUnit}"`);
      logger.debug('FDC', `  - servingDisplayText: "${servingDisplayText}"`);
      logger.debug('FDC', `  - servingSource: "${servingSource}"`);

      const result = {
        source: 'USDA FDC',
        upcCode: upcCode,
        fdcId: product.fdcId,
        productName: productName,
        brandOwner: brandOwner,
        brandName: brandName,

        // Clean final data for AddFoodModal (centralized decision result)
        finalServingQuantity: finalServingQuantity,
        finalServingUnit: finalServingUnit,
        servingDisplayText: servingDisplayText,
        servingSource: servingSource,

        // Legacy fields (for backward compatibility)
        servingSize: servingSize,
        servingCount: servingCount,
        servingUnit: servingUnit,
        householdServingFullText: product.householdServingFullText,
        smartServing: smartServingResult, // Include smart serving analysis

        calcium: calcium,
        calciumValue: calciumValue,
        calciumPercentDV: calciumPercentDV,
        calciumFromPercentDV: calciumFromPercentDV,
        calciumPerServing: calciumPerServing,
        ingredients: ingredients,
        confidence: 'high', // UPC lookups are always high confidence
        rawData: product // Include raw data for debugging
      };

      logger.debug('FDC', 'Parse result:', result);
      return result;

    } catch (error) {
      logger.debug('FDC', 'Error parsing product data:', error);
      throw new Error('Failed to parse product data from USDA database');
    }
  }


  /**
   * Validate that a string looks like a UPC code
   * @param code - The code to validate
   * @returns True if it looks like a valid UPC
   */
  static isValidUPCFormat(code: string): boolean {
    if (!code || typeof code !== 'string') return false;

    const cleanCode = code.replace(/\D/g, '');
    return cleanCode.length >= 8 && cleanCode.length <= 14;
  }

  /**
   * Format UPC code for display
   * @param upcCode - Raw UPC code
   * @returns Formatted UPC code
   */
  static formatUPC(upcCode: string): string {
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