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
export class UnitConverter {
    constructor() {
        // Patterns for non-convertible measurements
        this.nonConvertiblePatterns = [
            /\b(extra\s+)?(small|medium|large|big)\b/i,  // size descriptors
            /\b(less|more|about|approximately)\b/i,      // vague quantities  
            /\([^)]*\d+[^)]*\)/i,           // parenthetical with numbers
            /medium|large|small|big/i, // size descriptors without measurements
        ];

        // Base conversion tables - all conversions to base units
        this.conversions = {
            // Volume conversions (to cups as base)
            volume: {
                'cup': 1,
                'cups': 1,
                'c': 1,
                'tablespoon': 16,      // 16 tbsp = 1 cup
                'tablespoons': 16,
                'tbsp': 16,
                'tbs': 16,
                'teaspoon': 48,        // 48 tsp = 1 cup
                'teaspoons': 48,
                'tsp': 48,
                'fluid ounce': 8,      // 8 fl oz = 1 cup
                'fluid ounces': 8,
                'fl oz': 8,
                'floz': 8,
                'milliliter': 236.588, // 236.588 ml = 1 cup
                'milliliters': 236.588,
                'ml': 236.588,
                'liter': 0.236588,     // 0.236588 L = 1 cup
                'liters': 0.236588,
                'l': 0.236588,
                'pint': 2,             // 2 pints = 1 cup
                'pints': 2,
                'pt': 2,
                'quart': 0.25,         // 0.25 qt = 1 cup
                'quarts': 0.25,
                'qt': 0.25,
                'gallon': 0.0625,      // 0.0625 gal = 1 cup
                'gallons': 0.0625,
                'gal': 0.0625
            },

            // Weight conversions (to grams as base)
            weight: {
                'gram': 1,
                'grams': 1,
                'g': 1,
                'kilogram': 0.001,     // 0.001 kg = 1 g
                'kilograms': 0.001,
                'kg': 0.001,
                'ounce': 1/28.3495,    // 1/28.3495 oz = 1 g
                'ounces': 1/28.3495,
                'oz': 1/28.3495,
                'pound': 1/453.592,    // 1/453.592 lb = 1 g
                'pounds': 1/453.592,
                'lb': 1/453.592,
                'lbs': 1/453.592
            },

            // Count-based units (to pieces as base)
            count: {
                'piece': 1,
                'pieces': 1,
                'slice': 1,
                'slices': 1,
                'serving': 1,
                'servings': 1,
                'item': 1,
                'items': 1,
                'each': 1,
                'whole': 1,
                'container': 1,
                'containers': 1,
                'package': 1,
                'packages': 1,
                'bag': 1,
                'bags': 1
            }
        };

        // Unit display names for UI
        this.unitDisplayNames = {
            // Volume
            'cup': 'Cup',
            'cups': 'Cups',
            'tablespoon': 'Tablespoon',
            'tablespoons': 'Tablespoons',
            'tbsp': 'Tbsp',
            'teaspoon': 'Teaspoon',
            'teaspoons': 'Teaspoons',
            'tsp': 'Tsp',
            'fluid ounce': 'Fluid Ounce',
            'fluid ounces': 'Fluid Ounces',
            'fl oz': 'Fl Oz',
            'milliliter': 'Milliliter',
            'milliliters': 'Milliliters',
            'ml': 'mL',
            'liter': 'Liter',
            'liters': 'Liters',

            // Weight
            'gram': 'Gram',
            'grams': 'Grams',
            'g': 'g',
            'kilogram': 'Kilogram',
            'kilograms': 'Kilograms',
            'kg': 'kg',
            'ounce': 'Ounce',
            'ounces': 'Ounces',
            'oz': 'oz',
            'pound': 'Pound',
            'pounds': 'Pounds',
            'lb': 'lb',

            // Count
            'piece': 'Piece',
            'pieces': 'Pieces',
            'slice': 'Slice',
            'slices': 'Slices',
            'serving': 'Serving',
            'servings': 'Servings',
            'each': 'Each',
            'whole': 'Whole'
        };
    }

    /**
     * Check if a measure is non-convertible (descriptive)
     */
    /**
     * Checks if a measure string contains non-convertible descriptors.
     * @param {string} measureString The measure string to check
     * @returns {boolean} True if the measure is non-convertible
     */
    isNonConvertible(measureString) {
        return this.nonConvertiblePatterns.some(pattern => pattern.test(measureString));
    }

    /**
     * Parse USDA measure string to extract quantity and unit
     * @param {string} measureString - The USDA measure string to parse
     * @returns {Object} Parsed measure information
     */
    /**
     * Parses a USDA measure string into components for unit conversion.
     * @param {string} measureString The USDA measure string to parse
     * @returns {Object} Parsed measure object with quantity, unit, and type information
     */
    parseUSDAMeasure(measureString) {
        // Clean the string
        let cleaned = measureString.toLowerCase().trim();

        // Check if this is a non-convertible measure first
        if (this.isNonConvertible(cleaned)) {
            return {
                originalQuantity: 1,
                originalUnit: measureString,
                detectedUnit: measureString,
                unitType: 'unknown',
                isDescriptive: true
            };
        }

        // Extract the numeric part (handles "1.0", "0.5", etc.)
        const numericMatch = cleaned.match(/^(\d+\.?\d*)\s*/);
        const quantity = numericMatch ? parseFloat(numericMatch[1]) : 1;

        // Remove the numeric part to get the unit portion
        let unitPortion = cleaned.replace(/^(\d+\.?\d*)\s*/, '').trim();

        // Check for compound measurements like "package (10 oz)" or "container (6 fl oz)"
        const compoundMatch = unitPortion.match(/^(\w+)\s*\(([^)]+)\)/);
        if (compoundMatch) {
            const containerType = compoundMatch[1]; // "package"
            const innerMeasure = compoundMatch[2]; // "10 oz"

            // If the inner measure has a convertible unit, use that instead
            const innerParsed = this.parseSimpleMeasure(innerMeasure);
            if (innerParsed.unitType !== 'unknown') {
                return {
                    originalQuantity: quantity,
                    originalUnit: unitPortion,
                    detectedUnit: innerParsed.detectedUnit,
                    unitType: innerParsed.unitType,
                    isCompound: true,
                    containerType: containerType,
                    innerMeasure: innerMeasure,
                    cleanedUnit: innerParsed.detectedUnit
                };
            }

            // If inner measure isn't convertible, fall back to no conversion
            return {
                originalQuantity: quantity,
                originalUnit: unitPortion,
                detectedUnit: unitPortion,
                unitType: 'unknown',
                isCompound: true
            };
        }

        // Handle simple measurements
        const simpleParsed = this.parseSimpleMeasure(unitPortion);
        return {
            originalQuantity: quantity,
            originalUnit: unitPortion,
            detectedUnit: simpleParsed.detectedUnit,
            unitType: simpleParsed.unitType,
            cleanedUnit: simpleParsed.detectedUnit
        };
    }

    /**
     * Helper method for parsing simple measures
     * @param {string} unitString - The unit string to parse
     * @returns {Object} Parsed unit information
     */
    /**
     * Parses a simple measure string for basic unit detection.
     * @param {string} unitString The unit string to parse
     * @returns {Object} Parsed measure object
     */
    parseSimpleMeasure(unitString) {
        // Remove common descriptors that don't affect measurement
        const descriptorsToRemove = [
            ', diced', ', chopped', ', sliced', ', shredded', ', crumbled',
            ', whole kernels', ', sections', ', pieces', ', halves',
            'cooked', 'raw', 'fresh', 'frozen', 'canned', 'dried',
            'boneless', 'with skin', 'without skin', 'trimmed'
        ];

        let cleanUnit = unitString;
        descriptorsToRemove.forEach(descriptor => {
            cleanUnit = cleanUnit.replace(descriptor, '');
        });

        cleanUnit = cleanUnit.trim();

        // Try to match known units
        const detectedUnit = this.detectUnitType(cleanUnit);

        return {
            detectedUnit: detectedUnit,
            unitType: this.getUnitType(detectedUnit)
        };
    }

    /**
     * Check if a word exactly matches a unit (avoiding substring false positives)
     */
    isExactUnitMatch(word, unit) {
        // For single character units like 'l' or 'g', require exact match
        if (unit.length === 1) {
            return word === unit;
        }
        
        // For longer units, allow the word to contain the unit if it's at word boundaries
        const regex = new RegExp(`\\b${unit}\\b`, 'i');
        return regex.test(word);
    }

    /**
     * Detect the actual unit from a string
     * @param {string} unitString - The unit string to analyze
     * @returns {string} The detected unit
     */
    /**
     * Detects the type of unit (volume, weight, count, etc.).
     * @param {string} unitString The unit string to analyze
     * @returns {string} The detected unit type
     */
    detectUnitType(unitString) {
        // Split into words and check each one
        const words = unitString.toLowerCase().split(/\s+/);
        
        // Check all conversion tables for exact word matches
        for (const [category, units] of Object.entries(this.conversions)) {
            for (const unit of Object.keys(units)) {
                // Check if any word is an exact match for this unit
                for (const word of words) {
                    if (this.isExactUnitMatch(word, unit)) {
                        return unit;
                    }
                }
            }
        }

        // Fallback: return the original string
        return unitString;
    }

    /**
     * Get the category of a unit (volume, weight, count)
     * @param {string} unit - The unit to categorize
     * @returns {string} The unit category or 'unknown'
     */
    /**
     * Gets the unit type for a specific unit.
     * @param {string} unit The unit to get the type for
     * @returns {string} The unit type or 'unknown'
     */
    getUnitType(unit) {
        for (const [category, units] of Object.entries(this.conversions)) {
            if (units.hasOwnProperty(unit)) {
                return category;
            }
        }
        return 'unknown';
    }

    /**
     * Convert between units of the same type
     * FIXED: Using original algorithm that matches the conversion ratios
     * @param {number} fromQuantity - The quantity to convert
     * @param {string} fromUnit - The source unit
     * @param {string} toUnit - The target unit
     * @returns {number} The converted quantity
     */
    /**
     * Converts a quantity from one unit to another.
     * @param {number} fromQuantity The original quantity
     * @param {string} fromUnit The original unit
     * @param {string} toUnit The target unit
     * @returns {number} The converted quantity
     * @throws {Error} If units are incompatible or unknown
     */
    convertUnits(fromQuantity, fromUnit, toUnit) {
        const fromType = this.getUnitType(fromUnit);
        const toType = this.getUnitType(toUnit);

        if (fromType !== toType || fromType === 'unknown') {
            throw new Error(`Cannot convert between ${fromUnit} and ${toUnit}`);
        }

        const conversions = this.conversions[fromType];

        // Convert from source unit to base unit
        const baseQuantity = fromQuantity / conversions[fromUnit];

        // Convert from base unit to target unit
        const targetQuantity = baseQuantity * conversions[toUnit];

        return parseFloat(targetQuantity.toFixed(4));
    }

    /**
     * Calculate calcium for converted units
     * @param {number} originalCalcium - Original calcium amount
     * @param {number} originalQuantity - Original quantity
     * @param {string} originalUnit - Original unit
     * @param {number} newQuantity - New quantity
     * @param {string} newUnit - New unit
     * @returns {number} Calculated calcium amount
     */
    /**
     * Calculates calcium content when converting between units.
     * @param {number} originalCalcium The original calcium amount
     * @param {number} originalQuantity The original quantity
     * @param {string} originalUnit The original unit
     * @param {number} newQuantity The new quantity
     * @param {string} newUnit The new unit
     * @returns {number} The calculated calcium amount for the new units
     */
    calculateCalciumForConvertedUnits(originalCalcium, originalQuantity, originalUnit, newQuantity, newUnit) {
        try {
            // Convert the new quantity back to the original unit system
            const equivalentOriginalQuantity = this.convertUnits(newQuantity, newUnit, originalUnit);

            // Calculate the ratio and apply it to calcium
            const ratio = equivalentOriginalQuantity / originalQuantity;

            return Math.round(originalCalcium * ratio);
        } catch (error) {
            console.error('Calcium calculation error:', error);
            return originalCalcium; // Fallback to original
        }
    }

    /**
     * Check if two units are equivalent (handle aliases)
     * @param {string} unit1 - First unit
     * @param {string} unit2 - Second unit 
     * @returns {boolean} Whether the units are equivalent
     */
    /**
     * Checks if two units are equivalent (same base unit).
     * @param {string} unit1 First unit to compare
     * @param {string} unit2 Second unit to compare
     * @returns {boolean} True if units are equivalent
     */
    areUnitsEquivalent(unit1, unit2) {
        if (unit1 === unit2) return true;
        
        // Check if both units exist in the same conversion table with same ratio
        for (const [category, conversions] of Object.entries(this.conversions)) {
            if (conversions[unit1] !== undefined && conversions[unit2] !== undefined) {
                return conversions[unit1] === conversions[unit2];
            }
        }
        
        return false;
    }

    /**
     * Get suggestions for common unit alternatives
     * @param {string} unitType - The type of unit (volume, weight, count)
     * @returns {Array} Array of suggested units
     */
    getUnitSuggestions(unitType) {
        const suggestions = {
            volume: ['cup', 'tablespoon', 'teaspoon', 'fl oz', 'ml'],
            weight: ['oz', 'gram', 'lb', 'kg'],
            count: ['piece', 'slice', 'serving', 'each']
        };

        return suggestions[unitType] || [];
    }

    /**
     * Get unit size order for logical sorting (smallest to largest)
     * @param {string} unit - The unit to get size order for
     * @returns {number} Size order (lower = smaller unit)
     */
    getUnitSizeOrder(unit) {
        const sizeOrders = {
            // Volume (smallest to largest)
            'tsp': 1, 'teaspoon': 1, 'teaspoons': 1,
            'tbsp': 2, 'tablespoon': 2, 'tablespoons': 2, 'tbs': 2,
            'fl oz': 3, 'fluid ounce': 3, 'fluid ounces': 3, 'floz': 3,
            'ml': 4, 'milliliter': 4, 'milliliters': 4,
            'cup': 5, 'cups': 5, 'c': 5,
            'pt': 6, 'pint': 6, 'pints': 6,
            'qt': 7, 'quart': 7, 'quarts': 7,
            'l': 8, 'liter': 8, 'liters': 8,
            'gal': 9, 'gallon': 9, 'gallons': 9,
            
            // Weight (smallest to largest)
            'g': 1, 'gram': 1, 'grams': 1,
            'oz': 2, 'ounce': 2, 'ounces': 2,
            'lb': 3, 'pound': 3, 'pounds': 3, 'lbs': 3,
            'kg': 4, 'kilogram': 4, 'kilograms': 4,
            
            // Count (no particular order)
            'piece': 1, 'pieces': 1, 'slice': 1, 'slices': 1,
            'serving': 2, 'servings': 2, 'each': 3, 'whole': 4
        };
        
        return sizeOrders[unit] || 999;
    }

    /**
     * Smart unit detection for better UX - FIXED: Now uses current serving quantity
     * @param {string} originalUnit - The original unit
     * @param {number} currentQuantity - The CURRENT quantity (not original)
     * @returns {Array} Array of alternative units with conversion info
     */
    /**
     * Detects the best alternative units for a given quantity and unit.
     * @param {string} originalUnit The original unit
     * @param {number} currentQuantity The current quantity
     * @returns {Array} Array of alternative unit suggestions
     */
    detectBestAlternativeUnits(originalUnit, currentQuantity) {
        const unitType = this.getUnitType(originalUnit);
        const suggestions = this.getUnitSuggestions(unitType);

        return suggestions
            .filter(unit => unit !== originalUnit && !this.areUnitsEquivalent(unit, originalUnit))
            .map(unit => {
                try {
                    const convertedQuantity = this.convertUnits(currentQuantity, originalUnit, unit);
                    return {
                        unit,
                        quantity: convertedQuantity,
                        display: this.unitDisplayNames[unit] || unit,
                        practical: this.isPracticalQuantity(convertedQuantity),
                        sizeOrder: this.getUnitSizeOrder(unit)
                    };
                } catch (error) {
                    return null;
                }
            })
            .filter(item => item !== null)
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
     * @param {number} quantity - The quantity to evaluate
     * @returns {boolean} Whether the quantity is practical
     */
    isPracticalQuantity(quantity) {
        return quantity >= 0.1 && quantity <= 100;
    }

    /**
     * Format quantity for display
     * @param {number} quantity - The quantity to format
     * @returns {string} Formatted quantity string
     */
    formatQuantity(quantity) {
        if (quantity % 1 === 0) {
            return quantity.toString();
        } else if (quantity >= 1) {
            return quantity.toFixed(2).replace(/\.?0+$/, '');
        } else {
            return quantity.toFixed(3).replace(/\.?0+$/, '');
        }
    }
}

// Export as default for backward compatibility
export default UnitConverter;