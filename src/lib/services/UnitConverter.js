/**
 * UnitConverter - A comprehensive unit conversion system for calcium tracking app
 * Handles volume, weight, and count-based measurements with food database measure parsing
 * Ported from vanilla JS version for Svelte integration
 */
export class UnitConverter {
    constructor() {
        // Patterns that indicate non-convertible descriptive measures
        this.nonConvertiblePatterns = [
            /extra\s+(small|large|big)/i,
            /less\s+than/i,
            /more\s+than/i,
            /about\s+\d/i,
            /approximately/i,
            /\d+\s*inch/i,           // size descriptions
            /\d+\s*dia/i,            // diameter descriptions
            /\d+-\d+/i,              // ranges like "2-1/2"
            /\(.*\d.*\)/i,           // parenthetical with numbers
            /medium|large|small|big/i, // size descriptors without measurements
        ];

        // Base conversion tables - all conversions to base units
        this.conversions = {
            // Volume conversions (to cups as base)
            volume: {
                'cup': 1,
                'cups': 1,
                'c': 1,
                'tablespoon': 1/16,    // 1 tbsp = 1/16 cup
                'tablespoons': 1/16,
                'tbsp': 1/16,
                'tbs': 1/16,
                'teaspoon': 1/48,      // 1 tsp = 1/48 cup
                'teaspoons': 1/48,
                'tsp': 1/48,
                'fluid ounce': 1/8,    // 1 fl oz = 1/8 cup
                'fluid ounces': 1/8,
                'fl oz': 1/8,
                'floz': 1/8,
                'milliliter': 1/236.588, // 1 ml = 1/236.588 cup
                'milliliters': 1/236.588,
                'ml': 1/236.588,
                'liter': 4.227,        // 1 L = 4.227 cups
                'liters': 4.227,
                'l': 4.227,
                'pint': 2,             // 2 pints = 1 cup
                'pints': 2,
                'pt': 2,
                'quart': 4,            // 1 qt = 4 cups  
                'quarts': 4,
                'qt': 4,
                'gallon': 16,          // 1 gal = 16 cups
                'gallons': 16,
                'gal': 16
            },

            // Weight conversions (to grams as base)
            weight: {
                'gram': 1,
                'grams': 1,
                'g': 1,
                'kilogram': 1000,      // 1000 g = 1 kg
                'kilograms': 1000,
                'kg': 1000,
                'ounce': 28.3495,      // 28.3495 g = 1 oz
                'ounces': 28.3495,
                'oz': 28.3495,
                'pound': 453.592,      // 453.592 g = 1 lb
                'pounds': 453.592,
                'lb': 453.592,
                'lbs': 453.592
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
     * Extract quantity from a measure string
     * @param {string} measureString - The measure string
     * @returns {number} The extracted quantity
     */
    extractQuantity(measureString) {
        const numericMatch = measureString.match(/^(\d+\.?\d*)\s*/);
        return numericMatch ? parseFloat(numericMatch[1]) : 1;
    }

    /**
     * Check if parenthetical content contains useful measurement information
     * @param {string} parentheticalContent - The content inside parentheses
     * @returns {boolean} True if the content is useful to keep
     */
    isUsefulParentheticalContent(parentheticalContent) {
        const content = parentheticalContent.toLowerCase();
        
        // Useful patterns: contains convertible units or specific measurements
        const usefulPatterns = [
            /\d+\s*(oz|fl\s*oz|g|kg|lb|ml|l|cup|tbsp|tsp)/i, // measurements with units
            /\d+\s*inch/i,                                    // size measurements
            /\d+\s*dia/i,                                     // diameter measurements  
            /\d+-\d+/i,                                       // ranges like "2-1/4"
            /\d+\/\d+/i,                                      // fractions like "1/8"
        ];
        
        // Non-useful patterns: vague descriptions
        const nonUsefulPatterns = [
            /less\s+than/i,
            /more\s+than/i,
            /about/i,
            /approximately/i,
            /cooked|raw|fresh|frozen|canned|dried/i,
            /with|without/i,
            /boneless|with\s+skin/i,
        ];
        
        // If it contains non-useful patterns, it's not useful
        if (nonUsefulPatterns.some(pattern => pattern.test(content))) {
            return false;
        }
        
        // If it contains useful patterns, keep it
        return usefulPatterns.some(pattern => pattern.test(content));
    }

    /**
     * Smart clean unit string for display - keeps useful parenthetical info
     * @param {string} unitString - The unit string to clean
     * @returns {string} Cleaned unit string
     */
    cleanUnitForDisplay(unitString) {
        // Find all parenthetical content
        return unitString.replace(/\s*\(([^)]+)\)/g, (match, content) => {
            // Keep useful parenthetical content, remove non-useful
            return this.isUsefulParentheticalContent(content) ? match : '';
        }).replace(/\s+/g, ' ').trim();
    }

    /**
     * Parse food database measure string to extract quantity and unit
     * @param {string} measureString - The food database measure string to parse
     * @returns {Object} Parsed measure information
     */
    parseUSDAMeasure(measureString) {
        // Clean the string
        let cleaned = measureString.toLowerCase().trim();

        // First check if this is a non-convertible descriptive measure
        if (this.isNonConvertible(measureString)) {
            const quantity = this.extractQuantity(measureString);
            const unitPortion = measureString.replace(/^\d+\.?\d*\s*/, '').trim();
            
            return {
                originalQuantity: quantity,
                originalUnit: unitPortion,
                detectedUnit: unitPortion,
                unitType: 'unknown', // Forces no conversion attempts
                isDescriptive: true,
                cleanedUnit: this.cleanUnitForDisplay(unitPortion)
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
                    cleanedUnit: this.cleanUnitForDisplay(unitPortion) // Keep useful parenthetical info
                };
            }

            // If inner measure isn't convertible, fall back to no conversion
            return {
                originalQuantity: quantity,
                originalUnit: unitPortion,
                detectedUnit: unitPortion,
                unitType: 'unknown',
                isCompound: true,
                cleanedUnit: this.cleanUnitForDisplay(unitPortion) // Keep useful parenthetical info
            };
        }

        // Handle simple measurements
        const simpleParsed = this.parseSimpleMeasure(unitPortion);
        return {
            originalQuantity: quantity,
            originalUnit: unitPortion,
            detectedUnit: simpleParsed.detectedUnit,
            unitType: simpleParsed.unitType,
            cleanedUnit: this.cleanUnitForDisplay(unitPortion)
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
     * Check if a measure string contains non-convertible descriptive patterns
     * @param {string} measureString - The measure string to check
     * @returns {boolean} True if the measure is non-convertible
     */
    isNonConvertible(measureString) {
        return this.nonConvertiblePatterns.some(pattern => 
            pattern.test(measureString)
        );
    }

    /**
     * Check if a word is an exact match for a known unit
     * @param {string} word - The word to check
     * @param {string} unit - The unit to match against
     * @returns {boolean} True if it's an exact match
     */
    isExactUnitMatch(word, unit) {
        // Clean word of punctuation and normalize
        const cleanWord = word.replace(/[.,;:()]/g, '').toLowerCase();
        const cleanUnit = unit.toLowerCase();
        
        // Exact match or plural form
        return cleanWord === cleanUnit || 
               cleanWord === cleanUnit + 's' ||
               (cleanUnit.endsWith('s') && cleanWord === cleanUnit.slice(0, -1));
    }

    /**
     * Detect the actual unit from a string using word boundary matching
     * @param {string} unitString - The unit string to analyze
     * @returns {string} The detected unit
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
        const baseQuantity = fromQuantity * conversions[fromUnit];

        // Convert from base unit to target unit
        const targetQuantity = baseQuantity / conversions[toUnit];

        return parseFloat(targetQuantity.toFixed(2));
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

            return parseFloat((originalCalcium * ratio).toFixed(2));
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
     * Smart unit detection for better UX
     * @param {string} originalUnit - The original unit
     * @param {number} originalQuantity - The original quantity
     * @returns {Array} Array of alternative units with conversion info
     */
    detectBestAlternativeUnits(originalUnit, originalQuantity) {
        const unitType = this.getUnitType(originalUnit);
        const suggestions = this.getUnitSuggestions(unitType);

        return suggestions
            .filter(unit => unit !== originalUnit && !this.areUnitsEquivalent(unit, originalUnit))
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