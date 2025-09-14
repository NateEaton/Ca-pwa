#!/usr/bin/env node

/**
 * migrate-backup.mjs
 *
 * Enhanced migration utility for calcium tracker backup files
 * Converts old backup files from sequential IDs to stable appIds with comprehensive matching
 *
 * Usage:
 * node migrate-backup.mjs <old-backup> <old-database> <curated-data> <output> [options]
 * node migrate-backup.mjs --old-backup <file> --old-database <file> --curated-data <file> --output <file> [options]
 */

import fs from "fs";
import path from "path";

// Match confidence levels
const MATCH_TYPES = {
  EXACT: "EXACT",
  COLLAPSED: "COLLAPSED",
  PARTIAL: "PARTIAL",
  NONE: "NONE",
};

// Multi-measure data access helpers (compatible with both legacy and new formats)
function getPrimaryMeasure(food) {
  if (food.measures && Array.isArray(food.measures) && food.measures.length > 0) {
    // New multi-measure format - return first measure
    return {
      measure: food.measures[0].measure,
      calcium: food.measures[0].calcium
    };
  } else if (food.m && food.c !== undefined) {
    // Legacy minified format
    return {
      measure: food.m,
      calcium: parseFloat(food.c)
    };
  } else if (food.measure && food.calcium !== undefined) {
    // Legacy full format
    return {
      measure: food.measure,
      calcium: parseFloat(food.calcium)
    };
  } else {
    // Fallback
    return {
      measure: "",
      calcium: 0
    };
  }
}

function getAllMeasures(food) {
  if (food.measures && Array.isArray(food.measures)) {
    // New multi-measure format
    return food.measures.map(m => ({
      measure: m.measure,
      calcium: parseFloat(m.calcium)
    }));
  } else {
    // Legacy format - return single measure as array
    const primary = getPrimaryMeasure(food);
    return [primary];
  }
}

function hasMultipleMeasures(food) {
  return food.measures && Array.isArray(food.measures) && food.measures.length > 1;
}

// Fuzzy string matching for food names
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;

  // Levenshtein distance
  const matrix = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= s2.length; j += 1) {
    matrix[j][0] = j;
  }
  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const maxLength = Math.max(s1.length, s2.length);
  if (maxLength === 0) return 1.0;

  return (maxLength - matrix[s2.length][s1.length]) / maxLength;
}

// Normalize strings for comparison
function normalizeString(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Replace punctuation with spaces
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();
}

// Parse JavaScript file content (fallback method)
function parseJavaScriptFile(content, filePath) {
  if (content.includes("export")) {
    // Handle ES6 module exports
    let foodData = null;

    // Try to extract DEFAULT_FOOD_DATABASE array using regex
    const defaultDbMatch = content.match(
      /export\s+const\s+DEFAULT_FOOD_DATABASE\s*=\s*(\[[\s\S]*?\]);/
    );
    if (defaultDbMatch) {
      try {
        // Use a safer approach - write to temp file and import
        const tempFilePath = filePath + '.temp.mjs';
        const tempContent = `export const data = ${defaultDbMatch[1]};`;
        fs.writeFileSync(tempFilePath, tempContent);
        
        try {
          const tempModule = require(tempFilePath);
          foodData = tempModule.data;
          fs.unlinkSync(tempFilePath);
        } catch (tempError) {
          fs.unlinkSync(tempFilePath);
          throw tempError;
        }
      } catch (parseError) {
        throw new Error(`Could not parse DEFAULT_FOOD_DATABASE array: ${parseError.message}`);
      }
    }

    // Try to extract foodDatabase export as fallback
    if (!foodData) {
      const foodDbMatch = content.match(
        /export\s+const\s+foodDatabase\s*=\s*(\[[\s\S]*?\]);/
      );
      if (foodDbMatch) {
        const tempFilePath = filePath + '.temp.mjs';
        const tempContent = `export const data = ${foodDbMatch[1]};`;
        try {
          fs.writeFileSync(tempFilePath, tempContent);
          const tempModule = require(tempFilePath);
          foodData = tempModule.data;
          fs.unlinkSync(tempFilePath);
        } catch (parseError) {
          fs.unlinkSync(tempFilePath);
          throw new Error(`Could not parse foodDatabase array: ${parseError.message}`);
        }
      }
    }

    if (foodData && Array.isArray(foodData)) {
      return foodData;
    } else {
      throw new Error(
        "Could not extract food database array from ES6 module"
      );
    }
  } else {
    // Handle CommonJS format - look for specific patterns
    let foodData = null;

    // Try to extract DEFAULT_FOOD_DATABASE using safer parsing
    const defaultDbMatch = content.match(/(?:module\.exports\.DEFAULT_FOOD_DATABASE|exports\.DEFAULT_FOOD_DATABASE)\s*=\s*(\[[\s\S]*?\]);/);
    if (defaultDbMatch) {
      const tempFilePath = filePath + '.temp.js';
      const tempContent = `module.exports = ${defaultDbMatch[1]};`;
      try {
        fs.writeFileSync(tempFilePath, tempContent);
        delete require.cache[require.resolve(tempFilePath)];
        foodData = require(tempFilePath);
        fs.unlinkSync(tempFilePath);
      } catch (parseError) {
        if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        console.log("Failed to parse DEFAULT_FOOD_DATABASE, trying alternative extraction...");
      }
    }

    // Try other patterns...
    if (!foodData) {
      const foodDbMatch = content.match(/(?:module\.exports\.foodDatabase|exports\.foodDatabase)\s*=\s*(\[[\s\S]*?\]);/);
      if (foodDbMatch) {
        const tempFilePath = filePath + '.temp.js';
        const tempContent = `module.exports = ${foodDbMatch[1]};`;
        try {
          fs.writeFileSync(tempFilePath, tempContent);
          delete require.cache[require.resolve(tempFilePath)];
          foodData = require(tempFilePath);
          fs.unlinkSync(tempFilePath);
        } catch (parseError) {
          if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
          console.log("Failed to parse foodDatabase export");
        }
      }
    }

    if (foodData && Array.isArray(foodData)) {
      return foodData;
    } else {
      throw new Error("Could not extract food database from CommonJS module using safe parsing methods");
    }
  }
}

// Normalize measure strings for comparison
function normalizeMeasure(measure) {
  return normalizeString(measure)
    .replace(/\b(cups?|cup)\b/g, "cup")
    .replace(/\b(tablespoons?|tbsp|tbs)\b/g, "tablespoon")
    .replace(/\b(teaspoons?|tsp)\b/g, "teaspoon")
    .replace(/\b(ounces?|oz)\b/g, "ounce")
    .replace(/\b(grams?|g)\b/g, "gram")
    .replace(/\b(slices?)\b/g, "slice");
}

// Compare calcium values with tolerance
function calciumMatches(cal1, cal2, tolerance = 0.05) {
  const diff = Math.abs(cal1 - cal2);
  const avg = (cal1 + cal2) / 2;
  return diff / avg <= tolerance;
}

// Enhanced food matching with multiple strategies
function findFoodMatch(targetFood, curatedFoods, options = {}) {
  const { allowPartial = false, nameThreshold = 0.8, nameOnlyMatch = false } = options;

  const targetName = normalizeString(targetFood.name);
  const targetMeasure = normalizeMeasure(targetFood.measure || "");
  const targetCalcium = parseFloat(targetFood.calcium || 0);

  let bestMatch = null;

  // For serving preferences, only match on name (different measures/calcium expected)
  if (nameOnlyMatch) {
    for (const food of curatedFoods) {
      const foodName = normalizeString(food.n || food.name || "");
      
      if (foodName === targetName) {
        return {
          food: food,
          appId: food.i || food.id || food.appId,
          matchType: MATCH_TYPES.EXACT,
          score: 1.0,
          details: "Name match for serving preference (measure/calcium differences expected)",
        };
      }
    }
    
    // Check collapsed foods for name-only match
    for (const food of curatedFoods) {
      if (food.collapsedFrom && Array.isArray(food.collapsedFrom)) {
        for (const collapsed of food.collapsedFrom) {
          const collapsedName = normalizeString(collapsed.name || "");
          
          if (collapsedName === targetName) {
            return {
              food: food,
              appId: food.i || food.id || food.appId,
              matchType: MATCH_TYPES.COLLAPSED,
              score: 1.0,
              details: `Name match found in collapsed foods under "${food.n || food.name}" (serving preference)`,
              originalFood: collapsed,
            };
          }
        }
      }
    }
  } else {
    // Strategy 1: Exact match (name + measure + calcium) - for favorites and hidden foods
    for (const food of curatedFoods) {
      const foodName = normalizeString(food.n || food.name || "");
      
      // Check all measures for exact match (supports both legacy and multi-measure)
      const allMeasures = getAllMeasures(food);
      for (const measureInfo of allMeasures) {
        const foodMeasure = normalizeMeasure(measureInfo.measure || "");
        const foodCalcium = parseFloat(measureInfo.calcium || 0);

        if (
          foodName === targetName &&
          foodMeasure === targetMeasure &&
          calciumMatches(targetCalcium, foodCalcium)
        ) {
          return {
            food: food,
            appId: food.i || food.id || food.appId,
            matchType: MATCH_TYPES.EXACT,
            score: 1.0,
            details: hasMultipleMeasures(food) 
              ? `Perfect match on name, measure, and calcium (${allMeasures.length} measures available)`
              : "Perfect match on name, measure, and calcium",
          };
        }
      }
    }
  }

  // Strategy 2: Check collapsed foods
  for (const food of curatedFoods) {
    if (food.collapsedFrom && Array.isArray(food.collapsedFrom)) {
      for (const collapsed of food.collapsedFrom) {
        const collapsedName = normalizeString(collapsed.name || "");
        
        // Handle collapsed foods with measures arrays
        const allCollapsedMeasures = getAllMeasures(collapsed);
        for (const measureInfo of allCollapsedMeasures) {
          const collapsedMeasure = normalizeMeasure(measureInfo.measure || "");
          const collapsedCalcium = parseFloat(measureInfo.calcium || 0);

          if (
            collapsedName === targetName &&
            collapsedMeasure === targetMeasure &&
            calciumMatches(targetCalcium, collapsedCalcium)
          ) {
            return {
              food: food,
              appId: food.i || food.id || food.appId,
              matchType: MATCH_TYPES.COLLAPSED,
              score: 1.0,
              details: `Found in collapsed foods under "${food.n || food.name}"`,
              originalFood: collapsed,
            };
          }
        }
      }
    }
  }

  // Strategy 3: Partial match (name only) - only if allowed
  if (allowPartial) {
    let bestScore = 0;

    for (const food of curatedFoods) {
      const foodName = normalizeString(food.n || food.name || "");
      const score = calculateSimilarity(targetName, foodName);

      if (score > bestScore && score >= nameThreshold) {
        // Use primary measure for partial matching
        const primaryMeasure = getPrimaryMeasure(food);
        const foodMeasure = normalizeMeasure(primaryMeasure.measure || "");
        const foodCalcium = parseFloat(primaryMeasure.calcium || 0);

        const measureMatch = foodMeasure === targetMeasure;
        const calciumMatch = calciumMatches(targetCalcium, foodCalcium);

        bestScore = score;
        bestMatch = {
          food: food,
          appId: food.i || food.id || food.appId,
          matchType: MATCH_TYPES.PARTIAL,
          score: score,
          details: `Name match (${Math.round(score * 100)}%) with ${
            measureMatch ? "same" : "different"
          } measure, ${calciumMatch ? "same" : "different"} calcium${
            hasMultipleMeasures(food) ? ` (${getAllMeasures(food).length} measures available)` : ""
          }`,
          measureMatch: measureMatch,
          calciumMatch: calciumMatch,
          measureDiff: `"${targetFood.measure}" → "${primaryMeasure.measure}"`,
          calciumDiff: `${targetCalcium}mg → ${foodCalcium}mg`,
        };
      }
    }
  }

  return (
    bestMatch || {
      matchType: MATCH_TYPES.NONE,
      details: "No suitable match found",
    }
  );
}

// Validate and analyze database structure
function analyzeDatabase(database, filePath) {
  if (!Array.isArray(database) || database.length === 0) {
    throw new Error(`Invalid database structure in ${filePath}: not an array or empty`);
  }

  const sample = database[0];
  const hasLegacyFormat = (sample.m || sample.measure) && (sample.c !== undefined || sample.calcium !== undefined);
  const hasMultiMeasureFormat = sample.measures && Array.isArray(sample.measures);
  
  let multiMeasureFoods = 0;
  let legacyFoods = 0;
  
  for (const food of database.slice(0, Math.min(100, database.length))) {
    if (food.measures && Array.isArray(food.measures)) {
      multiMeasureFoods++;
    } else if ((food.m || food.measure) && (food.c !== undefined || food.calcium !== undefined)) {
      legacyFoods++;
    }
  }

  const analysisInfo = {
    totalFoods: database.length,
    hasLegacyFormat,
    hasMultiMeasureFormat,
    multiMeasureFoods,
    legacyFoods,
    isPrimarylyMultiMeasure: multiMeasureFoods > legacyFoods,
    isMixedFormat: multiMeasureFoods > 0 && legacyFoods > 0
  };

  console.log(`📊 Database analysis (${path.basename(filePath)}):`);
  console.log(`   • Total foods: ${analysisInfo.totalFoods}`);
  if (analysisInfo.hasMultiMeasureFormat) {
    console.log(`   • Multi-measure foods: ${analysisInfo.multiMeasureFoods} (${Math.round(multiMeasureFoods/analysisInfo.totalFoods*100)}%)`);
  }
  if (analysisInfo.hasLegacyFormat) {
    console.log(`   • Legacy format foods: ${analysisInfo.legacyFoods} (${Math.round(legacyFoods/analysisInfo.totalFoods*100)}%)`);
  }
  if (analysisInfo.isMixedFormat) {
    console.log(`   • Mixed format detected - using compatibility mode`);
  }
  
  return analysisInfo;
}

// Load and parse database files
async function loadDatabase(filePath) {
  // Validate file exists first
  if (!fs.existsSync(filePath)) {
    throw new Error(`Database file does not exist: ${filePath}`);
  }

  try {
    if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) {
      // Try to import the module directly if it's an ES module
      if (filePath.endsWith(".js")) {
        // Check if it's an ES module
        const content = fs.readFileSync(filePath, "utf8");
        if (content.includes("export")) {
          // Convert file path to file URL for dynamic import
          const absolutePath = path.resolve(filePath);
          const fileUrl = `file://${absolutePath}`;
          try {
            const module = await import(fileUrl + '?t=' + Date.now()); // Add cache busting
            if (module.DEFAULT_FOOD_DATABASE) {
              console.log(`✅ Loaded ${module.DEFAULT_FOOD_DATABASE.length} items via ES module import`);
              analyzeDatabase(module.DEFAULT_FOOD_DATABASE, filePath);
              return module.DEFAULT_FOOD_DATABASE;
            } else if (module.foodDatabase) {
              console.log(`✅ Loaded ${module.foodDatabase.length} items via ES module import`);
              analyzeDatabase(module.foodDatabase, filePath);
              return module.foodDatabase;
            } else if (module.default && Array.isArray(module.default)) {
              console.log(`✅ Loaded ${module.default.length} items via ES module import`);
              analyzeDatabase(module.default, filePath);
              return module.default;
            } else {
              throw new Error("Could not find exported food database in ES module");
            }
          } catch (importError) {
            console.log(`ES module import failed (${importError.message}), falling back to text parsing...`);
            // Fall back to text parsing
            const parsed = parseJavaScriptFile(content, filePath);
            analyzeDatabase(parsed, filePath);
            return parsed;
          }
        } else {
          // Handle CommonJS format
          const content = fs.readFileSync(filePath, "utf8");
          const parsed = parseJavaScriptFile(content, filePath);
          analyzeDatabase(parsed, filePath);
          return parsed;
        }
      }
    } else if (filePath.endsWith(".json")) {
      // Handle JSON format with better error handling for large files
      console.log(`Loading JSON file: ${filePath}`);

      let content;
      try {
        content = fs.readFileSync(filePath, "utf8");
      } catch (readError) {
        throw new Error(`Failed to read JSON file ${filePath}: ${readError.message}`);
      }

      try {
        const data = JSON.parse(content);

        // Handle both direct array and {metadata, foods} structure
        if (Array.isArray(data)) {
          console.log(`Loaded ${data.length} items from JSON array`);
          analyzeDatabase(data, filePath);
          return data;
        } else if (data.foods && Array.isArray(data.foods)) {
          console.log(
            `Loaded ${data.foods.length} items from {metadata, foods} structure`
          );
          analyzeDatabase(data.foods, filePath);
          return data.foods;
        } else if (data.metadata && data.foods && Array.isArray(data.foods)) {
          console.log(
            `Loaded ${data.foods.length} items from {metadata, foods} structure with metadata`
          );
          analyzeDatabase(data.foods, filePath);
          return data.foods;
        } else {
          throw new Error(
            "JSON file does not contain a recognizable food database structure"
          );
        }
      } catch (jsonError) {
        if (
          jsonError.message.includes("Unexpected token") ||
          jsonError.message.includes("JSON")
        ) {
          throw new Error(
            `Invalid JSON format in ${filePath}: ${jsonError.message}`
          );
        } else {
          throw jsonError;
        }
      }
    } else {
      throw new Error(`Unsupported file format: ${path.extname(filePath)}. Must be .js, .mjs, or .json`);
    }
  } catch (error) {
    if (error.message.includes("Failed to load database from")) {
      throw error; // Re-throw our own errors
    }
    throw new Error(`Failed to load database from ${filePath}: ${error.message}`);
  }
}

// Create comprehensive ID mapping with detailed match reporting
function createIdMapping(
  oldBackup,
  oldDatabase,
  curatedDatabase,
  options = {}
) {
  const { allowPartial = false, fullCuratedDatabase = null } = options;

  const mapping = new Map();
  const matchReport = {
    exact: [],
    collapsed: [],
    partial: [],
    unmatched: [],
    hiddenUnmatched: [],
    droppedByCuration: [],
    stats: {
      totalFoods: 0,
      exactMatches: 0,
      collapsedMatches: 0,
      partialMatches: 0,
      unmatched: 0,
      hiddenUnmatched: 0,
      droppedByCuration: 0,
    },
  };

  // Create lookup map for old database
  const oldFoodLookup = new Map();
  for (const food of oldDatabase) {
    const id = food.id || food.i;
    if (id !== undefined) {
      oldFoodLookup.set(id, food);
    }
  }

  // Extract all food IDs referenced in favorites, hidden foods, and serving preferences
  const referencedIds = new Set();
  const hiddenFoodIds = new Set();
  const servingPreferenceIds = new Set();
  
  (oldBackup.favorites || []).forEach((id) => referencedIds.add(id));
  (oldBackup.hiddenFoods || []).forEach((id) => {
    referencedIds.add(id);
    hiddenFoodIds.add(id);
  });
  (oldBackup.servingPreferences || []).forEach((pref) => {
    if (pref.foodId) {
      referencedIds.add(pref.foodId);
      servingPreferenceIds.add(pref.foodId);
    }
  });

  console.log(
    `\n🔍 Processing ${referencedIds.size} food references from favorites, hidden foods, and serving preferences...\n`
  );

  // Process each referenced food ID
  for (const oldId of referencedIds) {
    matchReport.stats.totalFoods++;

    // Step 1: Look up old ID in old database
    const oldFood = oldFoodLookup.get(oldId);
    if (!oldFood) {
      const unmatchedItem = {
        id: oldId,
        reason: "Not found in old database",
        matchType: MATCH_TYPES.NONE,
      };
      matchReport.unmatched.push(unmatchedItem);
      matchReport.stats.unmatched++;
      console.log(`❌ Food ID ${oldId}: Not found in old database`);
      continue;
    }

    // Step 2: Extract food details for matching
    const foodDetails = {
      name: oldFood.name || "",
      measure: oldFood.measure || "",
      calcium: oldFood.calcium || 0,
    };

    // Step 3: Try to find match in curated database
    // Use name-only matching for serving preferences, full matching for others
    const isServingPreference = servingPreferenceIds.has(oldId);
    const match = findFoodMatch(foodDetails, curatedDatabase, { 
      allowPartial,
      nameOnlyMatch: isServingPreference 
    });

    // Step 4: Process match result and update mapping
    if (match.matchType === MATCH_TYPES.EXACT) {
      mapping.set(oldId, match.appId);
      matchReport.exact.push({
        oldId,
        newId: match.appId,
        name: oldFood.name,
        details: match.details,
        isServingPreference,
      });
      matchReport.stats.exactMatches++;
      const typePrefix = isServingPreference ? "📏 SERVING" : "✅";
      console.log(`${typePrefix} EXACT: "${oldFood.name}" (${oldId}) → ${match.appId}`);
    } else if (match.matchType === MATCH_TYPES.COLLAPSED) {
      mapping.set(oldId, match.appId);
      matchReport.collapsed.push({
        oldId,
        newId: match.appId,
        name: oldFood.name,
        representativeName: match.food.n || match.food.name,
        details: match.details,
        isServingPreference,
      });
      matchReport.stats.collapsedMatches++;
      const typePrefix = isServingPreference ? "📏 SERVING" : "🔗";
      console.log(
        `${typePrefix} COLLAPSED: "${oldFood.name}" (${oldId}) → ${match.appId} (${match.details})`
      );
    } else if (match.matchType === MATCH_TYPES.PARTIAL && allowPartial) {
      mapping.set(oldId, match.appId);
      matchReport.partial.push({
        oldId,
        newId: match.appId,
        name: oldFood.name,
        matchedName: match.food.n || match.food.name,
        score: match.score,
        measureMatch: match.measureMatch,
        calciumMatch: match.calciumMatch,
        measureDiff: match.measureDiff,
        calciumDiff: match.calciumDiff,
        details: match.details,
      });
      matchReport.stats.partialMatches++;
      console.log(
        `⚠️  PARTIAL: "${oldFood.name}" (${oldId}) → ${match.appId} (${match.details})`
      );
    } else {
      // Check if this is a hidden food
      if (hiddenFoodIds.has(oldId)) {
        // Hidden foods that don't match are tracked separately and don't block migration
        matchReport.hiddenUnmatched.push({
          oldId,
          name: oldFood.name,
          measure: oldFood.measure,
          calcium: oldFood.calcium,
          reason: match.details,
          matchType: match.matchType,
        });
        matchReport.stats.hiddenUnmatched++;
        console.log(
          `🙈 HIDDEN UNMATCHED: "${oldFood.name}" (${oldId}) - ${match.details} (will be dropped)`
        );
      } else {
        // Phase 2: For non-hidden foods, try matching against full database if available
        let foundInFull = false;
        if (fullCuratedDatabase) {
          const fullMatch = findFoodMatch(foodDetails, fullCuratedDatabase, { 
            allowPartial: false,
            nameOnlyMatch: isServingPreference 
          });
          if (fullMatch.matchType !== "NONE") {
            // Found in full database but not in abridged - dropped by curation
            matchReport.droppedByCuration.push({
              oldId,
              name: oldFood.name,
              measure: oldFood.measure,
              calcium: oldFood.calcium,
              reason: `Found in full database but dropped during curation`,
              fullMatch: fullMatch,
            });
            matchReport.stats.droppedByCuration++;
            console.log(
              `📋 DROPPED BY CURATION: "${oldFood.name}" (${oldId}) - Found in full database (${fullMatch.matchType}: ${fullMatch.appId})`
            );
            foundInFull = true;
          }
        }

        if (!foundInFull) {
          // Truly missing - not found in either database
          matchReport.unmatched.push({
            oldId,
            name: oldFood.name,
            measure: oldFood.measure,
            calcium: oldFood.calcium,
            reason: fullCuratedDatabase ? "Not found in either abridged or full database" : match.details,
            matchType: match.matchType,
          });
          matchReport.stats.unmatched++;
          const statusText = fullCuratedDatabase ? "TRULY MISSING" : "UNMATCHED";
          console.log(
            `❌ ${statusText}: "${oldFood.name}" (${oldId}) - ${match.details}`
          );
        }
      }
    }
  }

  return { mapping, matchReport };
}

// Migrate custom foods to negative IDs
function migrateCustomFoods(customFoods) {
  let nextNegativeId = -1;
  const customFoodMapping = new Map();
  const migratedCustomFoods = [];

  for (const customFood of customFoods) {
    const oldId = customFood.id;
    const newId = nextNegativeId--;

    customFoodMapping.set(oldId, newId);

    migratedCustomFoods.push({
      ...customFood,
      id: newId,
    });

    console.log(`✅ Custom food: "${customFood.name}" (${oldId}) → ${newId}`);
  }

  return { migratedCustomFoods, customFoodMapping };
}

// Apply ID mappings to arrays (favorites, hidden foods)
function migrateIdArrays(array, idMapping, arrayName) {
  if (!Array.isArray(array)) return { migrated: [], failed: [] };

  const migrated = [];
  const failed = [];

  for (const oldId of array) {
    const newId = idMapping.get(oldId);
    if (newId !== undefined) {
      migrated.push(newId);
    } else {
      failed.push(oldId);
    }
  }

  console.log(
    `✅ ${arrayName}: ${migrated.length}/${array.length} items migrated`
  );
  if (failed.length > 0) {
    console.log(`❌ ${arrayName} failed: ${failed.join(", ")}`);
  }

  return { migrated, failed };
}

// Migrate serving preferences with ID mapping
function migrateServingPreferences(servingPrefs, idMapping, customFoodMapping) {
  if (!Array.isArray(servingPrefs)) return { migrated: [], failed: [] };

  const migrated = [];
  const failed = [];

  for (const pref of servingPrefs) {
    if (!pref.foodId) {
      // Skip preferences without foodId
      migrated.push(pref);
      continue;
    }

    let newId;
    // Try main ID mapping first, then custom food mapping
    if (idMapping.has(pref.foodId)) {
      newId = idMapping.get(pref.foodId);
    } else if (customFoodMapping.has(pref.foodId)) {
      newId = customFoodMapping.get(pref.foodId);
    }

    if (newId !== undefined) {
      migrated.push({
        ...pref,
        foodId: newId
      });
    } else {
      failed.push({
        ...pref,
        originalFoodId: pref.foodId
      });
    }
  }

  console.log(
    `✅ servingPreferences: ${migrated.length}/${servingPrefs.length} items migrated`
  );
  if (failed.length > 0) {
    console.log(`❌ servingPreferences failed: ${failed.length} items`);
    failed.forEach(item => {
      console.log(`   - foodId ${item.originalFoodId}: ${item.preferredUnit || 'unknown unit'}`);
    });
  }

  return { migrated, failed };
}

// Generate detailed migration report
function generateReport(matchReport, outputPath) {
  const reportPath = outputPath.replace(/\.json$/, "-migration-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(matchReport, null, 2));
  console.log(`📊 Detailed report saved to: ${reportPath}`);
  return reportPath;
}

// Print summary statistics
function printSummary(matchReport, migratedArrays = {}) {
  const stats = matchReport.stats;

  console.log("\n" + "=".repeat(60));
  console.log("📊 MIGRATION SUMMARY");
  console.log("=".repeat(60));

  console.log(`\n🎯 MATCH RESULTS:`);
  console.log(`   ✅ Exact matches:      ${stats.exactMatches}`);
  console.log(`   🔗 Collapsed matches:  ${stats.collapsedMatches}`);
  console.log(`   ⚠️  Partial matches:    ${stats.partialMatches}`);
  console.log(`   ❌ Truly missing:      ${stats.unmatched}`);
  console.log(`   📋 Dropped by curation: ${stats.droppedByCuration}`);
  console.log(`   🙈 Hidden unmatched:   ${stats.hiddenUnmatched} (dropped)`);
  console.log(`   📊 Total processed:    ${stats.totalFoods}`);

  if (migratedArrays.favorites) {
    console.log(
      `\n💝 FAVORITES: ${migratedArrays.favorites.migrated.length} migrated, ${migratedArrays.favorites.failed.length} failed`
    );
  }
  if (migratedArrays.hiddenFoods) {
    console.log(
      `🙈 HIDDEN FOODS: ${migratedArrays.hiddenFoods.migrated.length} migrated, ${migratedArrays.hiddenFoods.failed.length} failed`
    );
  }
  if (migratedArrays.servingPreferences) {
    console.log(
      `⚖️  SERVING PREFS: ${migratedArrays.servingPreferences.migrated.length} migrated, ${migratedArrays.servingPreferences.failed.length} failed`
    );
  }

  const successRate =
    stats.totalFoods > 0
      ? Math.round(
          ((stats.exactMatches +
            stats.collapsedMatches +
            stats.partialMatches +
            stats.hiddenUnmatched +
            stats.droppedByCuration) /
            stats.totalFoods) *
            100
        )
      : 0;
  console.log(`\n🎯 SUCCESS RATE: ${successRate}%`);

  if (stats.unmatched > 0) {
    console.log(`\n⚠️  ${stats.unmatched} truly missing foods (not found in any curated data):`);
    matchReport.unmatched.forEach((item) => {
      console.log(`   - ${item.name || `ID ${item.id}`}: ${item.reason}`);
    });
  }

  if (stats.droppedByCuration > 0) {
    console.log(`\n📋 ${stats.droppedByCuration} foods dropped by curation (available in full database):`);
    matchReport.droppedByCuration.forEach((item) => {
      console.log(`   - ${item.name || `ID ${item.id}`}: ${item.fullMatch.matchType} match available (${item.fullMatch.appId})`);
    });
  }

  if (stats.hiddenUnmatched > 0) {
    console.log(`\n🙈 ${stats.hiddenUnmatched} hidden foods dropped (not found in curated data):`);
    // Only show count, not individual items to reduce noise
    console.log(`   (Individual items not listed to reduce output size)`);
  }
}

// Main migration function
async function migrateBackup(config) {
  const {
    oldBackupPath,
    oldDatabasePath,
    curatedDatabasePath,
    outputPath,
    force = false,
    dryRun = false,
    reportOnly = false,
  } = config;

  console.log("🚀 Starting enhanced backup migration...\n");

  // Load input files
  console.log("📂 Loading files...");
  
  // Validate and load backup file
  if (!fs.existsSync(oldBackupPath)) {
    throw new Error(`Backup file does not exist: ${oldBackupPath}`);
  }
  
  let oldBackup;
  try {
    const backupContent = fs.readFileSync(oldBackupPath, "utf8");
    oldBackup = JSON.parse(backupContent);
    
    // Basic validation of backup structure
    if (!oldBackup || typeof oldBackup !== 'object') {
      throw new Error("Invalid backup file structure");
    }
  } catch (parseError) {
    throw new Error(`Failed to parse backup file ${oldBackupPath}: ${parseError.message}`);
  }
  
  const oldDatabase = await loadDatabase(oldDatabasePath);
  const curatedDatabase = await loadDatabase(curatedDatabasePath);

  // Auto-detect and load full curated database if available
  let fullCuratedDatabase = null;
  if (curatedDatabasePath.includes('-abridged.')) {
    const fullCuratedPath = curatedDatabasePath.replace('-abridged.', '-full.');
    if (fs.existsSync(fullCuratedPath)) {
      try {
        fullCuratedDatabase = await loadDatabase(fullCuratedPath);
        console.log(
          `✅ Loaded full curated database: ${fullCuratedPath} (${fullCuratedDatabase.length} foods)`
        );
      } catch (error) {
        console.log(`⚠️  Failed to load full curated database: ${error.message}`);
      }
    } else {
      console.log(`ℹ️  No full curated database found at: ${fullCuratedPath}`);
    }
  }

  console.log(`✅ Loaded old backup: ${oldBackupPath}`);
  console.log(
    `✅ Loaded old database: ${oldDatabasePath} (${oldDatabase.length} foods)`
  );
  console.log(
    `✅ Loaded curated database: ${curatedDatabasePath} (${curatedDatabase.length} foods)`
  );

  // Create ID mappings with appropriate options
  console.log("\n🔗 Creating ID mappings...");
  const { mapping: idMapping, matchReport } = createIdMapping(
    oldBackup,
    oldDatabase,
    curatedDatabase,
    { allowPartial: force, fullCuratedDatabase }
  );

  // Migrate custom foods
  console.log("\n🎨 Migrating custom foods...");
  const { migratedCustomFoods, customFoodMapping } = migrateCustomFoods(
    oldBackup.customFoods || []
  );

  // Migrate ID arrays and serving preferences
  console.log("\n📋 Migrating preferences...");
  const migratedFavorites = migrateIdArrays(
    oldBackup.favorites,
    idMapping,
    "favorites"
  );
  const migratedHiddenFoods = migrateIdArrays(
    oldBackup.hiddenFoods,
    idMapping,
    "hiddenFoods"
  );
  const migratedServingPrefs = migrateServingPreferences(
    oldBackup.servingPreferences,
    idMapping,
    customFoodMapping
  );

  // Generate report
  if (outputPath && !dryRun && !reportOnly) {
    generateReport(matchReport, outputPath);
  }

  // Print summary
  printSummary(matchReport, {
    favorites: migratedFavorites,
    hiddenFoods: migratedHiddenFoods,
    servingPreferences: migratedServingPrefs,
  });

  // Check for failures in strict mode
  if (!force && matchReport.stats.unmatched > 0) {
    console.log("\n❌ MIGRATION FAILED: Unmatched foods found in strict mode");
    console.log(
      "💡 Use --force to proceed with partial matches and exclude unmatched foods"
    );
    console.log(
      "💡 Use --report-only to generate detailed match report for review"
    );
    process.exit(1);
  }

  // Handle different modes
  if (reportOnly) {
    if (outputPath) {
      generateReport(matchReport, outputPath);
    }
    console.log("\n📊 Report-only mode complete");
    return;
  }

  if (dryRun) {
    console.log("\n🔍 Dry-run mode complete - no files created");
    return;
  }

  // Create migrated backup
  console.log("\n📝 Creating migrated backup...");
  const migratedBackup = {
    metadata: {
      ...oldBackup.metadata,
      version: "2.1.0",
      createdAt: new Date().toISOString(),
      migratedFrom: oldBackupPath,
      migrationStats: matchReport.stats,
      migrationMode: force ? "forced" : "strict",
    },
    preferences: oldBackup.preferences || {},
    customFoods: migratedCustomFoods,
    favorites: migratedFavorites.migrated,
    hiddenFoods: migratedHiddenFoods.migrated,
    servingPreferences: migratedServingPrefs.migrated,
    journalEntries: oldBackup.journalEntries || {}, // Keep as-is since journal entries store names
  };

  // Write output
  fs.writeFileSync(outputPath, JSON.stringify(migratedBackup, null, 2));
  console.log(`\n✅ Migration completed successfully!`);
  console.log(`📁 Output written to: ${outputPath}`);

  if (
    force &&
    (migratedFavorites.failed.length > 0 ||
      migratedHiddenFoods.failed.length > 0 ||
      migratedServingPrefs.failed.length > 0)
  ) {
    console.log(
      `\n⚠️  Some items were excluded due to failed matches (forced mode)`
    );
  }
}

// CLI argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    force: false,
    dryRun: false,
    reportOnly: false,
    interactive: false,
  };

  // Separate positional and named arguments
  const positionalArgs = [];
  const namedArgs = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      namedArgs.push(args[i]);
      // Check if next arg is a value (not a flag)
      if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        namedArgs.push(args[++i]);
      }
    } else {
      positionalArgs.push(args[i]);
    }
  }

  // Assign positional arguments
  if (positionalArgs.length >= 1) config.oldBackupPath = positionalArgs[0];
  if (positionalArgs.length >= 2) config.oldDatabasePath = positionalArgs[1];
  if (positionalArgs.length >= 3)
    config.curatedDatabasePath = positionalArgs[2];
  if (positionalArgs.length >= 4) config.outputPath = positionalArgs[3];

  // Process named arguments
  for (let i = 0; i < namedArgs.length; i++) {
    const arg = namedArgs[i];

    switch (arg) {
      case "--old-backup":
        config.oldBackupPath = namedArgs[++i];
        break;
      case "--old-database":
        config.oldDatabasePath = namedArgs[++i];
        break;
      case "--curated-data":
        config.curatedDatabasePath = namedArgs[++i];
        break;
      case "--output":
        config.outputPath = namedArgs[++i];
        break;
      case "--force":
        config.force = true;
        break;
      case "--dry-run":
        config.dryRun = true;
        break;
      case "--report-only":
        config.reportOnly = true;
        break;
      case "--interactive":
        config.interactive = true;
        break;
      case "--help":
        showHelp();
        process.exit(0);
      default:
        console.error(`Unknown argument: ${arg}`);
        showUsage();
        process.exit(1);
    }
  }

  return config;
}

function showUsage() {
  console.log(`
Usage: node migrate-backup.mjs <old-backup> <old-database> <curated-data> <output> [options]

Example:
  node migrate-backup.mjs backup.json old-db.js curated-data-abridged.json converted.json

Options:
  --force         Proceed with partial matches, exclude unmatched foods
  --dry-run       Show migration preview without creating output file
  --report-only   Generate detailed match report without migration
  --interactive   Prompt for confirmation on partial matches
  --help          Show detailed help
`);
}

function showHelp() {
  console.log(`
Enhanced Calcium Tracker Backup Migration Tool

Usage:
  node migrate-backup.mjs <old-backup> <old-database> <curated-data> <output> [options]
  node migrate-backup.mjs --old-backup <file> --old-database <file> --curated-data <file> --output <file> [options]

Required Arguments (positional or named):
  old-backup      Path to the old backup JSON file
  old-database    Path to the old database file (foodDatabaseData.js or JSON)
  curated-data    Path to the curated database file (curated-data-abridged.json)
  output          Path for the converted backup file (or report in --report-only mode)

Options:
  --force         Proceed with partial matches, exclude unmatched foods
  --dry-run       Show migration preview without creating output file
  --report-only   Generate detailed match report without migration
  --interactive   Prompt for confirmation on partial matches
  --help          Show this help message

Examples:
  # Strict mode (default) - fails on any unmatched foods
  node migrate-backup.mjs \\
    calcium-tracker-backup-2025-08-20-lme.json \\
    foodDatabaseData-old.js \\
    curated-data-abridged.json \\
    calcium-tracker-backup-converted.json

  # Force mode - proceed with partial matches
  node migrate-backup.mjs \\
    backup.json old-db.js curated-data-abridged.json converted.json \\
    --force

  # Dry run - see what would happen
  node migrate-backup.mjs \\
    backup.json old-db.js curated-data-abridged.json converted.json \\
    --dry-run

  # Report only - analyze matches without migration
  node migrate-backup.mjs \\
    backup.json old-db.js curated-data-abridged.json report.json \\
    --report-only

Match Types:
  EXACT      - Perfect match on name, measure, and calcium
  COLLAPSED  - Food found in collapsed foods under a representative
  PARTIAL    - Name match with different measure or calcium (requires --force)
  NONE       - No suitable match found

Notes:
  - Uses curated-data-abridged.json which contains collapsed food information
  - This enables proper mapping of foods that were collapsed under representatives
  - Only processes favorites and hidden foods (journal entries store names, not IDs)
`);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const config = parseArgs();

  // Validate required arguments
  if (
    !config.oldBackupPath ||
    !config.oldDatabasePath ||
    !config.curatedDatabasePath
  ) {
    console.error("Error: Missing required arguments");
    showUsage();
    process.exit(1);
  }

  if (!config.dryRun && !config.reportOnly && !config.outputPath) {
    console.error(
      "Error: Output path required unless using --dry-run or --report-only"
    );
    showUsage();
    process.exit(1);
  }

  try {
    await migrateBackup(config);
  } catch (error) {
    console.error(`\n❌ Migration failed: ${error.message}`);
    if (error.stack) {
      console.error("\nStack trace:", error.stack);
    }
    process.exit(1);
  }
}
