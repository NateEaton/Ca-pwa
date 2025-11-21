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

// OpenFoodFacts API Service for UPC lookup
// Provides same interface as FDCService for seamless source switching
import { HouseholdMeasureService } from './HouseholdMeasureService';
import { OPENFOODFACTS_CONFIG } from '$lib/config/openfoodfacts.js';
import { logger } from '$lib/utils/logger';

interface OpenFoodFactsProduct {
  product_name?: string;
  brands?: string;
  serving_size?: string;
  serving_quantity?: string;
  serving_quantity_unit?: string;
  nutriments?: {
    calcium_100g?: string | number;
    calcium_serving?: string | number;
    calcium_unit?: string;
    [key: string]: any;
  };
  ingredients_text?: string;
  completeness?: number;
  [key: string]: any;
}

interface OpenFoodFactsResponse {
  status: number;
  product?: OpenFoodFactsProduct;
  status_verbose?: string;
}

// Reuse same ParsedProduct interface as FDCService
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
  rawData: any;
}

export class OpenFoodFactsService {
  private baseUrl: string;
  private householdMeasureService: HouseholdMeasureService;

  constructor() {
    this.baseUrl = OPENFOODFACTS_CONFIG.API_BASE_URL;
    this.householdMeasureService = new HouseholdMeasureService();
  }

  /**
   * Search for a product by UPC/GTIN code
   * @param upcCode - The UPC/GTIN code to search for
   * @returns Product data or null if not found
   */
  async searchByUPC(upcCode: string): Promise<ParsedProduct | null> {
    logger.debug('OFF', 'Starting UPC lookup for:', upcCode);

    try {
      // Validate UPC code
      if (!upcCode || typeof upcCode !== 'string') {
        logger.debug('OFF', 'Invalid UPC code provided (not a string)');
        throw new Error('Invalid UPC code provided');
      }

      if (!OpenFoodFactsService.isValidUPCFormat(upcCode)) {
        logger.debug('OFF', 'UPC code format is invalid:', upcCode);
        throw new Error('UPC code format is invalid');
      }

      // Clean UPC code
      const cleanedUPC = this.cleanUPCCode(upcCode);
      logger.debug('OFF', 'Cleaned UPC code:', cleanedUPC);

      // Make API request
      const apiUrl = `${this.baseUrl}${OPENFOODFACTS_CONFIG.PRODUCT_ENDPOINT}/${cleanedUPC}.json`;
      logger.debug('OFF', 'Making API request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': OPENFOODFACTS_CONFIG.USER_AGENT
        }
      });

      logger.debug('OFF', 'API response status:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 404) {
          logger.debug('OFF', 'Product not found (404) for UPC:', cleanedUPC);
          return null;
        }
        throw new Error(`OpenFoodFacts API request failed: ${response.status} ${response.statusText}`);
      }

      const data: OpenFoodFactsResponse = await response.json();
      logger.debug('OFF', 'API response data status:', data.status, 'verbose:', data.status_verbose);

      // Check if product was found
      if (data.status !== 1 || !data.product) {
        logger.debug('OFF', 'Product not found in response data for UPC:', cleanedUPC);
        return null;
      }

      logger.debug('OFF', 'Product found, parsing data...');
      return this.parseProductData(data.product, cleanedUPC);

    } catch (error) {
      console.error('OFF: Error during UPC lookup:', error);
      throw error;
    }
  }

  /**
   * Parse OpenFoodFacts product data into standard format
   * @param product - Raw product data from OpenFoodFacts API
   * @param upcCode - The original UPC code searched
   * @returns Parsed product data
   */
  parseProductData(product: OpenFoodFactsProduct, upcCode: string): ParsedProduct {
    logger.debug('OFF', 'Starting product data parsing for UPC:', upcCode);

    try {
      // Extract basic product info using config constants
      const productName = product[OPENFOODFACTS_CONFIG.PRODUCT_FIELDS.NAME] || 'Unknown Product';
      const brandOwner = product[OPENFOODFACTS_CONFIG.PRODUCT_FIELDS.BRANDS] || '';
      const brandName = product[OPENFOODFACTS_CONFIG.PRODUCT_FIELDS.BRANDS] || '';
      const ingredients = product[OPENFOODFACTS_CONFIG.PRODUCT_FIELDS.INGREDIENTS] || '';

      logger.debug('OFF', 'Product name:', productName);
      logger.debug('OFF', 'Brand:', brandName);

      // Extract serving size information
      let servingSize = '';
      let servingCount = 1;
      let servingUnit = '';
      let smartServingResult = null;

      logger.debug('OFF', 'Extracting serving size information...');

      if (product[OPENFOODFACTS_CONFIG.SERVING_FIELDS.QUANTITY] && product[OPENFOODFACTS_CONFIG.SERVING_FIELDS.UNIT]) {
        logger.debug('OFF', 'Found serving_quantity and serving_quantity_unit in product data');
        servingCount = parseFloat(product[OPENFOODFACTS_CONFIG.SERVING_FIELDS.QUANTITY]) || 1;
        // Standardize the unit from OpenFoodFacts API
        servingUnit = this.householdMeasureService.standardizeUnit(product[OPENFOODFACTS_CONFIG.SERVING_FIELDS.UNIT]);

        logger.debug('OFF', 'Parsed serving - count:', servingCount, 'unit:', servingUnit);
        logger.debug('OFF', 'Generating smart serving size with serving_size text:', product[OPENFOODFACTS_CONFIG.SERVING_FIELDS.SIZE_TEXT]);

        // Generate smart serving size using household measure if available
        smartServingResult = this.householdMeasureService.generateSmartServingSize(
          servingCount,
          servingUnit,
          product[OPENFOODFACTS_CONFIG.SERVING_FIELDS.SIZE_TEXT],
          productName
        );

        logger.debug('OFF', 'Smart serving result - isEnhanced:', smartServingResult.isEnhanced, 'text:', smartServingResult.text);

        // Set servingSize based on whether smart serving was enhanced or not
        if (smartServingResult.isEnhanced) {
          servingSize = smartServingResult.text; // e.g., "2 tbsp (11g)"
          logger.debug('OFF', 'Using enhanced serving size:', servingSize);
        } else {
          // Use standardized format for fallback, omit count if it's 1
          if (servingCount === 1) {
            servingSize = servingUnit; // e.g., "g" instead of "1 g"
          } else {
            servingSize = `${servingCount} ${servingUnit}`; // e.g., "240 ml"
          }
          logger.debug('OFF', 'Using standard serving size:', servingSize);
        }


      } else if (product.serving_size) {
        logger.debug('OFF', 'No quantity/unit fields, using serving_size text:', product.serving_size);
        servingSize = product.serving_size;
        // Try to parse count and unit from text like "11 g" or "1 cup"
        const match = servingSize.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
        if (match) {
          servingCount = parseFloat(match[1]);
          servingUnit = this.householdMeasureService.standardizeUnit(match[2].trim());
          logger.debug('OFF', 'Parsed from serving_size text - count:', servingCount, 'unit:', servingUnit);
        } else {
          logger.debug('OFF', 'Could not parse serving_size text into count and unit');
        }
      } else {
        logger.debug('OFF', 'No serving size information available in product data');
      }


      // Extract calcium from nutriments
      let calcium = '';
      let calciumValue = null;
      let calciumPerServing = null;

      logger.debug('OFF', 'Extracting calcium from nutriments...');

      if (product.nutriments) {
        // IMPORTANT: OpenFoodFacts calcium units are inconsistent!
        // calcium_unit may say "mg" but values are often fractional grams (e.g., 0.158)
        // The OpenFoodFacts website shows these as milligrams after conversion
        // Therefore, we ALWAYS apply 1000x conversion regardless of stated unit
        const calciumUnit = product.nutriments[OPENFOODFACTS_CONFIG.NUTRITION_FIELDS.CALCIUM_UNIT] || 'unknown';
        const conversionFactor = OPENFOODFACTS_CONFIG.UNIT_CONVERSION.GRAMS_TO_MG; // Always 1000x

        logger.debug('OFF', 'Calcium unit detected:', calciumUnit, 'using conversion factor:', conversionFactor);

        // Try calcium_100g first (per 100g value)
        if (product.nutriments[OPENFOODFACTS_CONFIG.NUTRITION_FIELDS.CALCIUM_100G]) {
          const rawCalciumValue = parseFloat(product.nutriments[OPENFOODFACTS_CONFIG.NUTRITION_FIELDS.CALCIUM_100G].toString()) || null;
          logger.debug('OFF', 'Raw calcium_100g value:', rawCalciumValue);
          if (rawCalciumValue !== null) {
            calciumValue = rawCalciumValue * conversionFactor; // Always convert g→mg
            calcium = `${calciumValue} mg`;
            logger.debug('OFF', 'Converted calcium value:', calciumValue, 'mg (per 100g)');
          }
        } else {
          logger.debug('OFF', 'No calcium_100g value found in nutriments');
        }

        // Try calcium_serving if available
        if (product.nutriments[OPENFOODFACTS_CONFIG.NUTRITION_FIELDS.CALCIUM_SERVING]) {
          const rawCalciumServing = parseFloat(product.nutriments[OPENFOODFACTS_CONFIG.NUTRITION_FIELDS.CALCIUM_SERVING].toString()) || null;
          logger.debug('OFF', 'Raw calcium_serving value:', rawCalciumServing);
          if (rawCalciumServing !== null) {
            calciumPerServing = rawCalciumServing * conversionFactor; // Always convert g→mg
            logger.debug('OFF', 'Converted calcium per serving:', calciumPerServing, 'mg');
          }
        } else {
          logger.debug('OFF', 'No calcium_serving value found in nutriments');
        }
      } else {
        logger.debug('OFF', 'No nutriments data available in product');
      }

      // Calculate per-serving calcium if we have the data
      if (!calciumPerServing && calciumValue && servingCount && this.householdMeasureService.isVolumeOrMassUnit(servingUnit)) {
        logger.debug('OFF', 'Calculating calcium per serving from 100g value...');
        // OpenFoodFacts calcium is per 100g, calculate for actual serving size
        calciumPerServing = Math.round((calciumValue * servingCount) / 100);
        logger.debug('OFF', 'Calculated calcium per serving:', calciumPerServing, 'mg', '(from', calciumValue, 'mg per 100g * serving of', servingCount, servingUnit, ')');
      }

      // ============================================================================
      // CENTRALIZED SERVING DECISION LOGIC (same as FDCService)
      // Determine final serving format for AddFoodModal (single source of truth)
      // ============================================================================
      let finalServingQuantity: number;
      let finalServingUnit: string;
      let servingDisplayText: string;
      let servingSource: 'enhanced' | 'standard';

      logger.debug('OFF', 'Making final serving decision...');

      if (smartServingResult && smartServingResult.isEnhanced) {
        // ENHANCED: Use household measure format
        finalServingQuantity = smartServingResult.householdAmount || 1;

        // Extract just the unit part from parsed household measure
        const parsedMeasure = this.householdMeasureService.parseHouseholdMeasure(product.serving_size || '');
        const householdUnit = parsedMeasure?.unit || 'serving';
        finalServingUnit = `${householdUnit} (${servingCount}${servingUnit})`;

        servingDisplayText = smartServingResult.text;
        servingSource = 'enhanced';

        logger.debug('OFF', 'Final serving decision - ENHANCED mode');
        logger.debug('OFF', 'Final serving - quantity:', finalServingQuantity, 'unit:', finalServingUnit);
        logger.debug('OFF', 'Display text:', servingDisplayText);

      } else {
        // STANDARD: Use raw API serving format
        finalServingQuantity = servingCount;
        finalServingUnit = servingUnit;
        servingDisplayText = servingSize;
        servingSource = 'standard';

        logger.debug('OFF', 'Final serving decision - STANDARD mode');
        logger.debug('OFF', 'Final serving - quantity:', finalServingQuantity, 'unit:', finalServingUnit);
        logger.debug('OFF', 'Display text:', servingDisplayText);
      }


      // Determine confidence based on data completeness
      const completeness = product[OPENFOODFACTS_CONFIG.PRODUCT_FIELDS.COMPLETENESS] || 0;
      let confidence: string;
      if (completeness >= 0.8 && calciumValue) {
        confidence = 'high';
      } else if (completeness >= 0.5 && calciumValue) {
        confidence = 'medium';
      } else {
        confidence = 'low';
      }

      logger.debug('OFF', 'Product completeness:', completeness, 'confidence:', confidence);

      const result = {
        source: 'OpenFoodFacts',
        upcCode: upcCode,
        fdcId: 0, // OpenFoodFacts doesn't have FDC IDs
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
        householdServingFullText: product.serving_size,
        smartServing: smartServingResult,

        calcium: calcium,
        calciumValue: calciumValue,
        calciumPercentDV: null, // OpenFoodFacts doesn't provide percent DV
        calciumFromPercentDV: null,
        calciumPerServing: calciumPerServing,
        ingredients: ingredients,
        confidence: confidence,
        rawData: product
      };

      logger.debug('OFF', 'Successfully parsed product data');
      logger.debug('OFF', 'Final result - calcium:', calcium, 'per serving:', calciumPerServing, 'mg');

      return result;

    } catch (error) {
      console.error('OFF: Error parsing product data:', error);
      throw new Error('Failed to parse product data from OpenFoodFacts database');
    }
  }

  /**
   * Clean UPC code for API request
   * @param upcCode - Raw UPC code
   * @returns Cleaned UPC code
   */
  private cleanUPCCode(upcCode: string): string {
    // Remove all non-digit characters
    return upcCode.replace(/\D/g, '');
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
      return `${clean.slice(0, 6)} ${clean.slice(6)}`;
    } else if (clean.length === 13) {
      // EAN-13: 1 234567 890123
      return `${clean.slice(0, 1)} ${clean.slice(1, 7)} ${clean.slice(7)}`;
    } else if (clean.length === 8) {
      // UPC-E: 1234 5678
      return `${clean.slice(0, 4)} ${clean.slice(4)}`;
    }

    // For other lengths, return as-is
    return clean;
  }
}