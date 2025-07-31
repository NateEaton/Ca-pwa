/**
 * UnitConverter - A comprehensive unit conversion system for calcium tracking app
 * Handles volume, weight, and count-based measurements with USDA measure parsing
 * Ported from vanilla JS version for Svelte integration
 */
export class UnitConverter {
    constructor() {
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
                'ounce': 28.3495,      // 28.3495 g = 1 oz
                'ounces': 28.3495,
                'oz': 28.3495,
                'pound': 0.00220462,   // 0.00220462 lb = 1 g
                'pounds': 0.00220462,
                'lb': 0.00220462,
                'lbs': 0.00220462
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
     * Parse USDA measure string to extract quantity and unit
     * @param {string} measureString - The USDA measure string to parse
     * @returns {Object} Parsed measure information
     */
    parseUSDAMeasure(measureString) {
        // Clean the string
        let cleaned = measureString.toLowerCase().trim();

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
                    innerMeasure: innerMeasure
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
            unitType: simpleParsed.unitType
        };
    }

    /**
     * Helper method for parsing simple measures
     * @param {string} unitString - The unit string to parse
     * @returns {Object} Parsed unit information
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
     * Detect the actual unit from a string
     * @param {string} unitString - The unit string to analyze
     * @returns {string} The detected unit
     */
    detectUnitType(unitString) {
        // Check all conversion tables for matches
        for (const [category, units] of Object.entries(this.conversions)) {
            for (const unit of Object.keys(units)) {
                if (unitString.includes(unit)) {
                    return unit;
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
     * @param {number} fromQuantity - The quantity to convert
     * @param {string} fromUnit - The source unit
     * @param {string} toUnit - The target unit
     * @returns {number} The converted quantity
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
     * Smart unit detection for better UX
     * @param {string} originalUnit - The original unit
     * @param {number} originalQuantity - The original quantity
     * @returns {Array} Array of alternative units with conversion info
     */
    detectBestAlternativeUnits(originalUnit, originalQuantity) {
        const unitType = this.getUnitType(originalUnit);
        const suggestions = this.getUnitSuggestions(unitType);

        return suggestions
            .filter(unit => unit !== originalUnit)
            .map(unit => {
                try {
                    const convertedQuantity = this.convertUnits(originalQuantity, originalUnit, unit);
                    return {
                        unit,
                        quantity: convertedQuantity,
                        display: this.unitDisplayNames[unit] || unit,
                        practical: this.isPracticalQuantity(convertedQuantity)
                    };
                } catch (error) {
                    return null;
                }
            })
            .filter(item => item !== null)
            .sort((a, b) => {
                // Prioritize practical quantities
                if (a.practical && !b.practical) return -1;
                if (!a.practical && b.practical) return 1;
                return 0;
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