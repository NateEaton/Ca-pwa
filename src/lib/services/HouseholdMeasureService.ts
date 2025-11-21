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

import { logger } from '$lib/utils/logger';

// Household Measure Service for smart UPC serving size validation
// Helps validate household measures against weight/volume and generate smart serving sizes

interface ParsedMeasure {
  amount: number;
  unit: string;
  original: string;
}

interface ValidationResult {
  isValid: boolean;
  confidence: 'high' | 'medium' | 'low' | 'very-low';
  reason: string;
  estimatedGrams: number | null;
  category?: string;
  density?: number;
}

interface SmartServingResult {
  text: string;
  householdAmount?: number;
  isEnhanced: boolean;
  validation: ValidationResult | null;
}

interface UnitConversions {
  [key: string]: number;
}

interface CategoryKeywords {
  [key: string]: string[];
}

export class HouseholdMeasureService {
  private unitStandardization: UnitConversions;
  private categoryDensities: UnitConversions;
  private volumeConversions: UnitConversions;
  private weightConversions: UnitConversions;
  private categoryKeywords: CategoryKeywords;

  constructor() {
    // USDA unit standardization mapping - normalize inconsistent API units
    this.unitStandardization = {
      // Weight units
      'GRM': 'g',
      'grm': 'g',
      'GR': 'g',
      'gr': 'g',
      'GM': 'g',
      'gm': 'g',
      'GRAM': 'g',
      'gram': 'g',
      'GRAMS': 'g',
      'grams': 'g',

      // Volume units
      'MLT': 'ml',
      'mlt': 'ml',
      'ML': 'ml',
      'MILLILITER': 'ml',
      'milliliter': 'ml',
      'MILLILITERS': 'ml',
      'milliliters': 'ml',
      'MLS': 'ml',
      'mls': 'ml',

      // Common volume measures
      'TSP': 'tsp',
      'TEASPOON': 'tsp',
      'teaspoon': 'tsp',
      'TEASPOONS': 'tsp',
      'teaspoons': 'tsp',
      'TBSP': 'tbsp',
      'TABLESPOON': 'tbsp',
      'tablespoon': 'tbsp',
      'TABLESPOONS': 'tbsp',
      'tablespoons': 'tbsp',
      'CUP': 'cup',
      'CUPS': 'cup',
      'cups': 'cup',
      'FL OZ': 'fl oz',
      'FLUID OUNCE': 'fl oz',
      'fluid ounce': 'fl oz',
      'FLUID OUNCES': 'fl oz',
      'fluid ounces': 'fl oz',

      // Weight measures
      'OZ': 'oz',
      'OUNCE': 'oz',
      'ounce': 'oz',
      'OUNCES': 'oz',
      'ounces': 'oz',
      'LB': 'lb',
      'LBS': 'lb',
      'lbs': 'lb',
      'POUND': 'lb',
      'pound': 'lb',
      'POUNDS': 'lb',
      'pounds': 'lb'
    };

    // Generalized density factors by product category (grams per tablespoon)
    // Using conservative middle-range values to maximize compatibility
    this.categoryDensities = {
      'powder': 6.0,          // General powder products (range: 4-8g/tbsp)
      'liquid': 15.0,         // Water-based liquids (standard: 15ml = 15g)
      'syrup': 20.0,          // Thick liquids like honey, maple syrup
      'oil': 14.0,            // Cooking oils (slightly less dense than water)
      'solid': null           // Too variable - no general factor applicable
    };

    // Standard volume conversions (all to milliliters)
    this.volumeConversions = {
      'tsp': 5,              // teaspoon
      'teaspoon': 5,
      'teaspoons': 5,
      'tbsp': 15,            // tablespoon
      'tablespoon': 15,
      'tablespoons': 15,
      'tbsps': 15,
      'fl oz': 30,           // fluid ounce
      'fluid ounce': 30,
      'fluid ounces': 30,
      'oz': 30,              // assume fluid ounce in food context
      'cup': 240,            // US cup
      'cups': 240,
      'ml': 1,               // milliliter
      'milliliter': 1,
      'milliliters': 1,
      'mls': 1,
      'l': 1000,             // liter
      'liter': 1000,
      'liters': 1000
    };

    // Weight conversions (all to grams)
    this.weightConversions = {
      'g': 1,                // gram
      'gram': 1,
      'grams': 1,
      'gr': 1,               // alternative gram notation
      'grm': 1,              // USDA notation
      'gm': 1,
      'kg': 1000,            // kilogram
      'kilogram': 1000,
      'kilograms': 1000,
      'oz': 28.35,           // ounce (weight)
      'ounce': 28.35,
      'ounces': 28.35,
      'lb': 453.6,           // pound
      'lbs': 453.6,
      'pound': 453.6,
      'pounds': 453.6
    };

    // Product category keywords for classification
    this.categoryKeywords = {
      powder: ['powder', 'cocoa', 'malt', 'protein', 'flour', 'sugar', 'baking', 'spice', 'coffee', 'mix', 'instant', 'dried'],
      liquid: ['juice', 'milk', 'water', 'sauce', 'dressing', 'vinegar', 'broth', 'stock', 'beverage', 'drink'],
      syrup: ['syrup', 'honey', 'molasses', 'agave'],
      oil: ['oil', 'butter', 'margarine', 'shortening'],
      solid: ['cheese', 'meat', 'bread', 'cereal', 'nuts', 'fruit', 'vegetable', 'crackers', 'cookies']
    };
  }

  /**
   * Parse household serving text to extract number and unit
   * @param householdText - Text like "2 tbsp", "1 cup", "1/2 tsp"
   * @returns ParsedMeasure object or null if parsing fails
   */
  parseHouseholdMeasure(householdText: string): ParsedMeasure | null {
    if (!householdText || typeof householdText !== 'string') {
      return null;
    }

    const text = householdText.trim().toLowerCase();

    // Pattern to match: number + optional fraction + unit
    // Examples: "2 tbsp", "1.5 cups", "1/2 tsp", "0.5 fl oz"
    const patterns = [
      /^(\d+(?:\.\d+)?)\s*(.+)$/,           // "2.5 tbsp"
      /^(\d+)\s*\/\s*(\d+)\s*(.+)$/,       // "1/2 tsp"
      /^(\d+)\s+(\d+)\s*\/\s*(\d+)\s*(.+)$/ // "1 1/2 cups"
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        let amount;
        let unit;

        if (pattern === patterns[1]) {
          // Fraction: "1/2 tsp"
          amount = parseFloat(match[1]) / parseFloat(match[2]);
          unit = match[3].trim();
        } else if (pattern === patterns[2]) {
          // Mixed number: "1 1/2 cups"
          amount = parseFloat(match[1]) + (parseFloat(match[2]) / parseFloat(match[3]));
          unit = match[4].trim();
        } else {
          // Decimal: "2.5 tbsp"
          amount = parseFloat(match[1]);
          unit = match[2].trim();
        }

        return {
          amount: amount,
          unit: unit,
          original: householdText
        };
      }
    }

    return null;
  }

  /**
   * Classify product into category based on name/description
   * @param {string} productName - Product name or description
   * @returns {string} 'powder', 'liquid', 'solid', or 'unknown'
   */
  classifyProduct(productName) {
    if (!productName) return 'unknown';

    const name = productName.toLowerCase();

    // Check each category
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      for (const keyword of keywords) {
        if (name.includes(keyword)) {
          return category;
        }
      }
    }

    return 'unknown';
  }

  /**
   * Get density estimate for a product based on category
   * @param {string} productName - Product name (for additional classification)
   * @param {string} category - Product category ('powder', 'liquid', 'syrup', 'oil', 'solid')
   * @returns {number|null} Grams per tablespoon, or null if unknown
   */
  getProductDensity(productName, category) {
    if (!category) return null;

    // Use generalized category density
    return this.categoryDensities[category] || null;
  }

  /**
   * Convert household measure to grams using estimated density
   * @param {Object} parsedMeasure - Result from parseHouseholdMeasure
   * @param {number} density - Grams per tablespoon
   * @returns {number|null} Weight in grams, or null if conversion not possible
   */
  convertToGrams(parsedMeasure, density) {
    if (!parsedMeasure || !density) return null;

    const { amount, unit } = parsedMeasure;

    // Convert unit to milliliters first
    const mlPerUnit = this.volumeConversions[unit];
    if (!mlPerUnit) return null;

    const totalMl = amount * mlPerUnit;

    // Convert ml to tablespoons (15ml per tbsp)
    const tablespoons = totalMl / 15;

    // Convert to grams using density
    return Math.round(tablespoons * density * 10) / 10; // Round to 1 decimal
  }

  /**
   * Validate if household measure is reasonable for given weight
   * @param {number} actualGrams - Actual serving weight from API
   * @param {Object} parsedMeasure - Parsed household measure
   * @param {string} productName - Product name for classification
   * @returns {Object} {isValid: boolean, confidence: string, reason: string, estimatedGrams: number}
   */
  validateHouseholdMeasure(actualGrams, parsedMeasure, productName) {
    if (!actualGrams || !parsedMeasure || !productName) {
      return {
        isValid: false,
        confidence: 'low',
        reason: 'Missing required data',
        estimatedGrams: null
      };
    }

    const category = this.classifyProduct(productName);
    const density = this.getProductDensity(productName, category);

    if (!density) {
      return {
        isValid: false,
        confidence: 'low',
        reason: 'Cannot estimate product density',
        estimatedGrams: null
      };
    }

    const estimatedGrams = this.convertToGrams(parsedMeasure, density);
    if (!estimatedGrams) {
      return {
        isValid: false,
        confidence: 'low',
        reason: 'Cannot convert household measure to weight',
        estimatedGrams: null
      };
    }

    // Calculate percentage difference
    const percentDiff = Math.abs(actualGrams - estimatedGrams) / actualGrams * 100;

    // Determine confidence based on how close the estimates are
    // More forgiving thresholds since we're using generalized category factors
    let confidence, isValid;
    if (percentDiff <= 20) {
      confidence = 'high';
      isValid = true;
    } else if (percentDiff <= 40) {
      confidence = 'medium';
      isValid = true;
    } else if (percentDiff <= 70) {
      confidence = 'low';
      isValid = false;
    } else {
      confidence = 'very-low';
      isValid = false;
    }

    return {
      isValid,
      confidence,
      reason: `${percentDiff.toFixed(1)}% difference (actual: ${actualGrams}g, estimated: ${estimatedGrams}g)`,
      estimatedGrams,
      category,
      density
    };
  }

  /**
   * Generate smart serving size text combining household measure with weight/volume
   * @param {number} servingCount - Numeric serving size from API
   * @param {string} servingUnit - Unit from API (g, ml, etc.)
   * @param {string} householdText - Household serving text from API
   * @param {string} productName - Product name for validation
   * @returns {Object} {text: string, isEnhanced: boolean, validation: Object}
   */
  generateSmartServingSize(servingCount, servingUnit, householdText, productName) {
    logger.debug('UnitConversion', 'Generating smart serving size:', {
      servingCount,
      servingUnit,
      householdText,
      productName
    });

    // Default fallback
    const fallbackText = servingUnit ? `${servingCount} ${servingUnit}` : `${servingCount}g`;

    if (!householdText) {
      return {
        text: fallbackText,
        isEnhanced: false,
        validation: null
      };
    }

    const parsedMeasure = this.parseHouseholdMeasure(householdText);
    if (!parsedMeasure) {
      logger.debug('UnitConversion', 'Could not parse household measure:', householdText);
      return {
        text: fallbackText,
        isEnhanced: false,
        validation: null
      };
    }

    const validation = this.validateHouseholdMeasure(servingCount, parsedMeasure, productName);
    logger.debug('UnitConversion', 'Validation result:', validation);

    // Only use household measure if validation passes
    if (validation.isValid && validation.confidence !== 'very-low') {
      // Include full household measure for display, store amount separately for separation
      const enhancedText = `${parsedMeasure.original} (${servingCount}${servingUnit || 'g'})`;

      logger.debug('UnitConversion', 'Using enhanced text:', enhancedText);
      logger.debug('UnitConversion', `Household amount: ${parsedMeasure.amount}, unit: ${parsedMeasure.unit}`);

      return {
        text: enhancedText,
        householdAmount: parsedMeasure.amount, // Return the amount separately for Add Food dialog
        isEnhanced: true,
        validation
      };
    } else {
      logger.debug('UnitConversion', 'Validation failed, using fallback:', validation.reason);
      return {
        text: fallbackText,
        isEnhanced: false,
        validation
      };
    }
  }

  /**
   * Check if a unit represents volume (ml, cups, tbsp, etc.)
   * @param {string} unit - Unit to check
   * @returns {boolean} True if unit is volume-based
   */
  isVolumeUnit(unit) {
    if (!unit) return false;
    return this.volumeConversions.hasOwnProperty(unit.toLowerCase().trim());
  }

  /**
   * Check if a unit represents weight (g, kg, oz, lb, etc.)
   * @param {string} unit - Unit to check
   * @returns {boolean} True if unit is weight-based
   */
  isWeightUnit(unit) {
    if (!unit) return false;
    return this.weightConversions.hasOwnProperty(unit.toLowerCase().trim());
  }

  /**
   * Standardize USDA API units to consistent, user-friendly format
   * @param {string} unit - Raw unit from USDA API (e.g., "MLT", "GRM")
   * @returns {string} Standardized unit (e.g., "ml", "g")
   */
  standardizeUnit(unit) {
    if (!unit || typeof unit !== 'string') {
      return unit;
    }

    const cleaned = unit.trim();

    // Check for direct mapping first
    if (this.unitStandardization.hasOwnProperty(cleaned)) {
      return this.unitStandardization[cleaned];
    }

    // If no mapping found, return lowercase version
    return cleaned.toLowerCase();
  }

  /**
   * Check if a unit represents volume (ml) or mass (g) that can be used for per-serving calculation
   * Handles various API unit format variations
   * @param {string} unit - The unit string to check
   * @returns {boolean} True if unit represents grams or milliliters
   */
  isVolumeOrMassUnit(unit) {
    if (!unit || typeof unit !== 'string') {
      return false;
    }

    // Standardize the unit first
    const standardizedUnit = this.standardizeUnit(unit);

    // Check if it's a weight or volume unit
    return this.isWeightUnit(standardizedUnit) || this.isVolumeUnit(standardizedUnit);
  }

  /**
   * Extract unit portion from smart serving text for Add Food dialog
   * @param smartText - Enhanced text like "2 tbsp (11g)" or "1 cup (240ml)"
   * @returns Unit portion like "tbsp (11g)" or "cup (240ml)"
   */
  extractUnitFromSmartText(smartText: string): string {
    if (!smartText || typeof smartText !== 'string') {
      return smartText;
    }

    // Remove leading number and optional whitespace: "2 tbsp (11g)" → "tbsp (11g)"
    return smartText.replace(/^\d+(\.\d+)?\s*/, '');
  }
}