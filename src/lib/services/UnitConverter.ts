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
 * A comprehensive unit conversion system for calcium tracking app.
 * Handles volume, weight, and count-based measurements with USDA measure parsing.
 */

import { logger } from '$lib/utils/logger';

export type UnitType = 'volume' | 'weight' | 'count' | 'unknown';

export interface ParsedMeasure {
  originalQuantity: number;
  originalUnit: string;
  detectedUnit: string;
  unitType: UnitType;
  isDescriptive?: boolean;
  isCompound?: boolean;
  containerType?: string;
  innerMeasure?: string;
  cleanedUnit?: string;
}

export interface AlternativeUnit {
  unit: string;
  quantity: number;
  display: string;
  practical: boolean;
  sizeOrder: number;
}

export interface ConversionTable {
  [unit: string]: number;
}

export interface ConversionTables {
  volume: ConversionTable;
  weight: ConversionTable;
  count: ConversionTable;
}

export class UnitConverter {
  private nonConvertiblePatterns: RegExp[];
  private conversions: ConversionTables;
  private unitDisplayNames: Record<string, string>;

  constructor() {
    // Patterns for non-convertible measurements
    this.nonConvertiblePatterns = [
      /\b(extra\s+)?(small|medium|large|big)\b/i, // size descriptors
      /\b(less|more|about|approximately)\b/i, // vague quantities
      /\([^)]*\d+[^)]*\)/i, // parenthetical with numbers
      /medium|large|small|big/i, // size descriptors without measurements
    ];

    // Base conversion tables - all conversions to base units
    // FIXED: Using original working ratios from attached UnitConverter.js
    this.conversions = {
      // Volume conversions (to cups as base)
      volume: {
        cup: 1,
        cups: 1,
        c: 1,
        tablespoon: 16, // 16 tbsp = 1 cup
        tablespoons: 16,
        tbsp: 16,
        tbs: 16,
        teaspoon: 48, // 48 tsp = 1 cup
        teaspoons: 48,
        tsp: 48,
        "fluid ounce": 8, // 8 fl oz = 1 cup
        "fluid ounces": 8,
        "fl oz": 8,
        floz: 8,
        milliliter: 236.588, // 236.588 ml = 1 cup
        milliliters: 236.588,
        ml: 236.588,
        liter: 0.236588, // 0.236588 L = 1 cup
        liters: 0.236588,
        l: 0.236588,
        pint: 2, // 2 pints = 1 cup
        pints: 2,
        pt: 2,
        quart: 0.25, // 0.25 qt = 1 cup
        quarts: 0.25,
        qt: 0.25,
        gallon: 0.0625, // 0.0625 gal = 1 cup
        gallons: 0.0625,
        gal: 0.0625,
      },

      // Weight conversions (to grams as base)
      weight: {
        gram: 1,
        grams: 1,
        g: 1,
        kilogram: 0.001, // 0.001 kg = 1 g
        kilograms: 0.001,
        kg: 0.001,
        ounce: 1 / 28.3495, // 1/28.3495 oz = 1 g
        ounces: 1 / 28.3495,
        oz: 1 / 28.3495,
        pound: 1 / 453.592, // 1/453.592 lb = 1 g
        pounds: 1 / 453.592,
        lb: 1 / 453.592,
        lbs: 1 / 453.592,
      },

      // Count-based units (to pieces as base)
      count: {
        piece: 1,
        pieces: 1,
        slice: 1,
        slices: 1,
        serving: 1,
        servings: 1,
        item: 1,
        items: 1,
        each: 1,
        whole: 1,
        container: 1,
        containers: 1,
        package: 1,
        packages: 1,
        bag: 1,
        bags: 1,
      },
    };

    // Unit display names for UI
    this.unitDisplayNames = {
      // Volume
      cup: "Cup",
      cups: "Cups",
      tablespoon: "Tablespoon",
      tablespoons: "Tablespoons",
      tbsp: "Tbsp",
      teaspoon: "Teaspoon",
      teaspoons: "Teaspoons",
      tsp: "Tsp",
      "fluid ounce": "Fluid Ounce",
      "fluid ounces": "Fluid Ounces",
      "fl oz": "Fl Oz",
      milliliter: "Milliliter",
      milliliters: "Milliliters",
      ml: "mL",
      liter: "Liter",
      liters: "Liters",

      // Weight
      gram: "Gram",
      grams: "Grams",
      g: "g",
      kilogram: "Kilogram",
      kilograms: "Kilograms",
      kg: "kg",
      ounce: "Ounce",
      ounces: "Ounces",
      oz: "oz",
      pound: "Pound",
      pounds: "Pounds",
      lb: "lb",

      // Count
      piece: "Piece",
      pieces: "Pieces",
      slice: "Slice",
      slices: "Slices",
      serving: "Serving",
      servings: "Servings",
      each: "Each",
      whole: "Whole",
    };
  }

  /**
   * Checks if a measure string contains non-convertible descriptors.
   */
  isNonConvertible(measureString: string): boolean {
    return this.nonConvertiblePatterns.some((pattern) =>
      pattern.test(measureString)
    );
  }

  /**
   * Parses a USDA measure string into components for unit conversion.
   */
  parseUSDAMeasure(measureString: string): ParsedMeasure {
    // Clean the string
    let cleaned = measureString.toLowerCase().trim();

    // Extract the numeric part (handles "1.0", "0.5", etc.)
    const numericMatch = cleaned.match(/^(\d+\.?\d*)\s*/);
    const quantity = numericMatch ? parseFloat(numericMatch[1]) : 1;

    // Remove the numeric part to get the unit portion
    let unitPortion = cleaned.replace(/^(\d+\.?\d*)\s*/, "").trim();

    // Check for compound measurements like "package (10 oz)" or "container (6 fl oz)"
    const compoundMatch = unitPortion.match(/^(\w+)\s*\(([^)]+)\)/);
    if (compoundMatch) {
      const containerType = compoundMatch[1]; // "package"
      const innerMeasure = compoundMatch[2]; // "10 oz"

      logger.debug('UNIT CONVERTER', `Detected compound measure: ${containerType} (${innerMeasure})`);

      // If the inner measure has a convertible unit, use that instead
      const innerParsed = this.parseSimpleMeasure(innerMeasure);
      if (innerParsed.unitType !== "unknown") {
        logger.debug('UNIT CONVERTER', `Parsed compound measure to: ${innerParsed.detectedUnit} (${innerParsed.unitType})`);
        return {
          originalQuantity: quantity,
          originalUnit: unitPortion,
          detectedUnit: innerParsed.detectedUnit,
          unitType: innerParsed.unitType,
          isCompound: true,
          containerType: containerType,
          innerMeasure: innerMeasure,
          cleanedUnit: innerParsed.detectedUnit,
        };
      }

      logger.debug('UNIT CONVERTER', `Inner measure not convertible, using original: ${unitPortion}`);
      // If inner measure isn't convertible, fall back to no conversion
      return {
        originalQuantity: quantity,
        originalUnit: unitPortion,
        detectedUnit: unitPortion,  // ✓ FIXED - was referencing undefined cleanUnit
        unitType: "unknown",
        isCompound: true,
        cleanedUnit: unitPortion,  // ✓ This is the key fix
      };
    }

    // Check if this is a non-convertible measure
    if (this.isNonConvertible(cleaned)) {
      return {
        originalQuantity: 1,
        originalUnit: measureString,
        detectedUnit: measureString,
        unitType: "unknown",
        isDescriptive: true,
      };
    }

    // Handle simple measurements
    const simpleParsed = this.parseSimpleMeasure(unitPortion);

    return {
      originalQuantity: quantity,
      originalUnit: unitPortion,
      detectedUnit: simpleParsed.detectedUnit,
      unitType: simpleParsed.unitType,
      cleanedUnit: simpleParsed.detectedUnit,
    };
  }

  /**
   * Parses a simple measure string for basic unit detection.
   */
  parseSimpleMeasure(unitString: string): Pick<ParsedMeasure, 'detectedUnit' | 'unitType'> {
    let cleaned = unitString.toLowerCase().trim();

    // Remove common measurement prefixes/suffixes
    cleaned = cleaned.replace(/^(of\s+)/, ""); // "of cups" -> "cups"

    // Detect unit type and clean unit
    const unitType = this.getUnitType(cleaned);
    let detectedUnit = cleaned;

    if (unitType !== "unknown") {
      // For known units, use the canonical form
      detectedUnit = this.getCanonicalUnit(cleaned, unitType);
    }

    return {
      detectedUnit,
      unitType,
    };
  }

  /**
   * Determines the unit type (volume, weight, count, or unknown).
   */
  getUnitType(unit: string): UnitType {
    const cleanUnit = unit.toLowerCase().trim();

    if (this.conversions.volume[cleanUnit] !== undefined) {
      return "volume";
    }
    if (this.conversions.weight[cleanUnit] !== undefined) {
      return "weight";
    }
    if (this.conversions.count[cleanUnit] !== undefined) {
      return "count";
    }

    return "unknown";
  }

  /**
   * Gets the canonical unit name for a given unit within its type.
   */
  getCanonicalUnit(unit: string, unitType: UnitType): string {
    const cleanUnit = unit.toLowerCase().trim();

    if (unitType === "unknown") {
      return cleanUnit;
    }

    // Check if the unit exists in the conversion table for this type
    if (this.conversions[unitType][cleanUnit] !== undefined) {
      return cleanUnit;
    }

    // Return as-is if not found
    return cleanUnit;
  }

  /**
   * Converts a quantity from one unit to another.
   */
  convertUnits(quantity: number, fromUnit: string, toUnit: string): number {
    const fromType = this.getUnitType(fromUnit);
    const toType = this.getUnitType(toUnit);

    // Can't convert between different unit types
    if (fromType !== toType || fromType === "unknown") {
      throw new Error(`Cannot convert from ${fromUnit} to ${toUnit}`);
    }

    const fromConversion = this.conversions[fromType][fromUnit.toLowerCase()];
    const toConversion = this.conversions[toType][toUnit.toLowerCase()];

    if (!fromConversion || !toConversion) {
      throw new Error(`Conversion not found for ${fromUnit} or ${toUnit}`);
    }

    // Convert to base unit, then to target unit
    const baseQuantity = quantity / fromConversion;
    return baseQuantity * toConversion;
  }

  /**
   * Checks if two units are equivalent (same unit, different forms).
   */
  areUnitsEquivalent(unit1: string, unit2: string): boolean {
    const clean1 = unit1.toLowerCase().trim();
    const clean2 = unit2.toLowerCase().trim();

    if (clean1 === clean2) return true;

    // Check for equivalent forms
    const equivalents: Record<string, string[]> = {
      cup: ["cups", "c"],
      tablespoon: ["tablespoons", "tbsp", "tbs"],
      teaspoon: ["teaspoons", "tsp"],
      "fluid ounce": ["fluid ounces", "fl oz", "floz"],
      milliliter: ["milliliters", "ml"],
      liter: ["liters", "l"],
      gram: ["grams", "g"],
      kilogram: ["kilograms", "kg"],
      ounce: ["ounces", "oz"],
      pound: ["pounds", "lb", "lbs"],
      piece: ["pieces"],
      slice: ["slices"],
      serving: ["servings"],
    };

    for (const [base, variants] of Object.entries(equivalents)) {
      const allForms = [base, ...variants];
      if (allForms.includes(clean1) && allForms.includes(clean2)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Gets suggested units for a given unit type.
   */
  getUnitSuggestions(unitType: UnitType): string[] {
    const suggestions: Record<UnitType, string[]> = {
      volume: ["tsp", "tbsp", "fl oz", "cup", "ml", "l"],
      weight: ["g", "oz", "lb", "kg"],
      count: ["piece", "slice", "serving", "whole", "each"],
      unknown: [],
    };

    return suggestions[unitType] || [];
  }

  /**
   * Gets a size order for units (for sorting suggestions).
   */
  getUnitSizeOrder(unit: string): number {
    const sizeOrders: Record<string, number> = {
      // Volume (smallest to largest)
      tsp: 1,
      teaspoon: 1,
      teaspoons: 1,
      tbsp: 2,
      tablespoon: 2,
      tablespoons: 2,
      tbs: 2,
      "fl oz": 3,
      "fluid ounce": 3,
      "fluid ounces": 3,
      floz: 3,
      ml: 4,
      milliliter: 4,
      milliliters: 4,
      cup: 5,
      cups: 5,
      c: 5,
      pt: 6,
      pint: 6,
      pints: 6,
      qt: 7,
      quart: 7,
      quarts: 7,
      l: 8,
      liter: 8,
      liters: 8,
      gal: 9,
      gallon: 9,
      gallons: 9,

      // Weight (smallest to largest)
      g: 1,
      gram: 1,
      grams: 1,
      oz: 2,
      ounce: 2,
      ounces: 2,
      lb: 3,
      pound: 3,
      pounds: 3,
      lbs: 3,
      kg: 4,
      kilogram: 4,
      kilograms: 4,

      // Count (no particular order)
      piece: 1,
      pieces: 1,
      slice: 1,
      slices: 1,
      serving: 2,
      servings: 2,
      each: 3,
      whole: 4,
    };

    return sizeOrders[unit] || 999;
  }

  /**
   * Detects the best alternative units for a given quantity and unit.
   */
  detectBestAlternativeUnits(originalUnit: string, currentQuantity: number): AlternativeUnit[] {
    const unitType = this.getUnitType(originalUnit);
    const suggestions = this.getUnitSuggestions(unitType);

    return suggestions
      .filter(
        (unit) =>
          unit !== originalUnit && !this.areUnitsEquivalent(unit, originalUnit)
      )
      .map((unit) => {
        try {
          const convertedQuantity = this.convertUnits(
            currentQuantity,
            originalUnit,
            unit
          );
          return {
            unit,
            quantity: convertedQuantity,
            display: this.unitDisplayNames[unit] || unit,
            practical: this.isPracticalQuantity(convertedQuantity),
            sizeOrder: this.getUnitSizeOrder(unit),
          };
        } catch (error) {
          return null;
        }
      })
      .filter((item): item is AlternativeUnit => item !== null)
      .sort((a, b) => {
        // First, prioritize practical quantities
        if (a.practical && !b.practical) return -1;
        if (!a.practical && b.practical) return 1;

        // Within the same practicality, sort by unit size (largest to smallest)
        return b.sizeOrder - a.sizeOrder;
      });
  }

  /**
   * Determine if a quantity is practical for everyday use
   */
  isPracticalQuantity(quantity: number): boolean {
    return quantity >= 0.1 && quantity <= 100;
  }

  /**
   * Format quantity for display
   */
  formatQuantity(quantity: number): string {
    if (quantity % 1 === 0) {
      return quantity.toString();
    } else if (quantity >= 1) {
      return quantity.toFixed(2).replace(/\.?0+$/, "");
    } else {
      return quantity.toFixed(3).replace(/\.?0+$/, "");
    }
  }

  /**
   * Calculate calcium for converted units.
   * When a user changes serving size with unit conversion (e.g., oz to g),
   * this ensures calcium is calculated correctly by converting the new quantity
   * back to the original unit system before calculating the ratio.
   *
   * @param originalCalcium - The base calcium amount in the original serving
   * @param originalQuantity - The original serving quantity
   * @param originalUnit - The original unit (e.g., "oz")
   * @param newQuantity - The new serving quantity
   * @param newUnit - The new unit (e.g., "g")
   * @returns The correctly calculated calcium amount
   */
  calculateCalciumForConvertedUnits(
    originalCalcium: number,
    originalQuantity: number,
    originalUnit: string,
    newQuantity: number,
    newUnit: string
  ): number {
    try {
      // Convert the new quantity back to the original unit system
      const equivalentOriginalQuantity = this.convertUnits(
        newQuantity,
        newUnit,
        originalUnit
      );

      // Calculate the ratio and apply it to calcium
      const ratio = equivalentOriginalQuantity / originalQuantity;

      return parseFloat((originalCalcium * ratio).toFixed(2));
    } catch (error) {
      logger.error('Calcium calculation error:', error);
      // Fallback: return original calcium unchanged
      return originalCalcium;
    }
  }
}

// Export as default for backward compatibility
export default UnitConverter;