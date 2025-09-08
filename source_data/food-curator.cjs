#!/usr/bin/env node

/**
 * food-curator.cjs
 *
 * **VERSION 5 - Multi-Measure Implementation**
 * Enhanced version supporting multiple serving sizes per food item.
 * - Collects all unique measures instead of selecting single "best" serving
 * - Groups by sourceKey to preserve measure variations per food
 * - Asterisk (*) only added for collapsed foods, not multi-measure foods
 * - Maintains backward compatibility with existing pipeline
 */

const fs = require("fs");

// --- Argument Parsing ---
const args = process.argv.slice(2);
const fileArgs = [];
let keepListFile = null;
let excludeListFile = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case "--keep-list":
    case "--keep":
      if (i + 1 >= args.length) {
        console.error(`❌ Error: ${arg} requires a file path`);
        process.exit(1);
      }
      keepListFile = args[++i];
      break;
    case "--exclude-list":
    case "--exclude":
      if (i + 1 >= args.length) {
        console.error(`❌ Error: ${arg} requires a file path`);
        process.exit(1);
      }
      excludeListFile = args[++i];
      break;
    default:
      if (arg.startsWith("--") || arg.startsWith("-")) {
        console.error(`❌ Error: Unknown parameter '${arg}'`);
        console.error(`Valid parameters: --keep-list <file>, --exclude-list <file>`);
        process.exit(1);
      } else {
        fileArgs.push(arg);
      }
      break;
  }
}

const inputJson = fileArgs[0];
const outputBaseName = fileArgs[1] || "curated";

if (!inputJson) {
  console.error(
    "Usage: node food-curator.cjs <mastered.json> [output_base_name] [--keep-list keep.txt] [--exclude-list exclude.txt]"
  );
  process.exit(1);
}

// --- Helper Functions & Data Loading ---
// **Heavily revised, multi-stage normalization function from original script**
function normalizeName(originalName) {
  if (!originalName) return ""; // Added safety check for null/undefined names
  let norm = originalName.toLowerCase();

  // Stage 1: Handle alcoholic beverages FIRST, before removing parentheses
  norm = norm.replace(
    /\b(gin|rum|vodka|whiskey|liqueur)\b/g,
    "distilled spirit"
  );
  norm = norm.replace(
    /,?\s*all \(distilled spirit, distilled spirit, distilled spirit, distilled spirit\)/g,
    ""
  );
  norm = norm.replace(/,?\s*distilled, all/g, ", distilled");
  norm = norm.replace(
    /alcoholic beverage, distilled, distilled spirit/g,
    "alcoholic beverage, distilled spirit"
  );
  norm = norm.replace(
    /alcoholic beverage, distilled$/g,
    "alcoholic beverage, distilled spirit"
  );

  // Stage 2: Remove parenthetical and other bracketed content
  norm = norm.replace(/\s*\[[^\]]*\]/g, "");
  norm = norm.replace(/\s*\([^)]*\)/g, "");

  // Stage 3: Other broad replacements
  norm = norm.replace(
    /beer, (light|regular|higher alcohol|low carb|non-alcoholic)/g,
    "beer"
  );

  // Stage 4: Remove nutritional/preparation details irrelevant to a calcium search.
  norm = norm.replace(/\b(\d+(\.\d+)?\s*proof)\b/g, ""); // Remove proof numbers
  norm = norm.replace(
    /,?\s*(all commercial varieties|all types|mixed species|all areas|includes crisphead types|regular pack|includes from concentrate)/g,
    ""
  );
  norm = norm.replace(
    /,?\s*(with added vitamin a and vitamin d|vitamin d fortified|with added ca|with added calcium|calcium-fortified|protein fortified)/g,
    ""
  );
  norm = norm.replace(
    /,?\s*(solids and liquids|drained solids|with bone|without bone)/g,
    ""
  );
  norm = norm.replace(
    /,?\s*(with salt|without salt|salted|unsalted|low sodium|reduced sodium|no salt added)/gi,
    ""
  );
  norm = norm.replace(
    /\b(enriched|unenriched|fortified|sweetened|unsweetened|ready-to-drink|from concentrate|chilled)\b/gi,
    ""
  );
  norm = norm.replace(
    /\b(canned|frozen|raw|unprepared|prepared|cooked|boiled|steamed|baked|roasted|drained|fried)\b/gi,
    ""
  );
  norm = norm.replace(
    /\b(low fat|reduced fat|fat free|nonfat|part-skim|whole milk|low moisture|lean only|lean and fat|commercial)\b/gi,
    ""
  );

  // Stage 5: Final syntax cleanup.
  norm = norm
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/,+/g, ",")
    .replace(/,\s*$/g, "")
    .replace(/\s\s+/g, " ")
    .trim();

  return norm;
}

const keepSet = keepListFile
  ? new Set(
      fs
        .readFileSync(keepListFile, "utf-8")
        .split(/\r?\n/)
        .map(normalizeName) // Use the same normalization for the keep-list
        .filter(Boolean)
    )
  : new Set();

const excludeSet = excludeListFile
  ? new Set(
      fs
        .readFileSync(excludeListFile, "utf-8")
        .split(/\r?\n/)
        .map((n) => n.toLowerCase().trim()) // Exclude list should be simpler matching
        .filter(Boolean)
    )
  : new Set();

if (!fs.existsSync(inputJson)) {
  console.error(`❌ Input file not found: ${inputJson}`);
  process.exit(1);
}

const inputData = JSON.parse(fs.readFileSync(inputJson, "utf-8"));

// Handle different input formats
let records, metadata;
if (Array.isArray(inputData)) {
  // Legacy direct array format
  records = inputData;
  metadata = null;
  console.log(
    `📖 Loaded ${records.length} mastered records from ${inputJson} (legacy format)`
  );
} else if (inputData.foods && Array.isArray(inputData.foods)) {
  // New format with metadata and foods
  records = inputData.foods;
  metadata = inputData.metadata;
  console.log(`📖 Loaded ${records.length} mastered records from ${inputJson}`);
  if (metadata) {
    console.log(`📋 Source metadata: ${metadata.name}`);
  }
} else {
  console.error(
    `❌ Invalid input format: Expected array or object with 'foods' property`
  );
  console.error(`   Input type: ${typeof inputData}`);
  console.error(`   Input keys: ${Object.keys(inputData || {}).join(", ")}`);
  console.error(`   Has foods property: ${!!inputData.foods}`);
  console.error(`   Foods is array: ${Array.isArray(inputData.foods)}`);
  process.exit(1);
}

// Validate that records is an array
if (!Array.isArray(records)) {
  console.error(`❌ Records is not an array: ${typeof records}`);
  console.error(`   Records value: ${records}`);
  process.exit(1);
}

console.log(`📊 Records validation passed: ${records.length} items`);

// --- CONTEXT-AWARE SERVING SELECTION (DATA-DRIVEN) ---

const unitPriorities = {
  liquid: ["cup", "fl oz", "bottle", "can", "tablespoon", "tbsp"],
  dairy: ["oz", "slice", "cup", "container", "stick"],
  produce: ["fruit", "cup", "piece", "spear", "slice", "oz"],
  bakery: ["slice", "oz", "piece", "roll", "bun"],
  meat_fish: [
    "oz",
    "fillet",
    "piece",
    "drumstick",
    "wing",
    "thigh",
    "slice",
    "patty",
    "link",
  ],
  generic: ["oz", "serving", "piece", "slice", "tablespoon", "tbsp", "cup"],
};

const liquidRegex = /\b(milk|juice|water|tea|coffee|soda|drink|beverage)\b/i;
const dairyRegex = /\b(cheese|yogurt|butter|cream|sour cream)\b/i;
const produceRegex =
  /\b(fruit|apple|orange|banana|berry|melon|lettuce|carrot|broccoli|vegetable|tomato|potato|onion|peas|beans|corn)\b/i;
const bakeryRegex =
  /\b(bread|cake|muffin|biscuit|roll|bun|cracker|pancake|waffle|pastry)\b/i;
const meatFishRegex =
  /\b(beef|pork|veal|lamb|goat|chicken|turkey|bison|game|meat|fish)\b/i;

function getFoodCategory(name) {
  if (liquidRegex.test(name)) return "liquid";
  if (dairyRegex.test(name)) return "dairy";
  if (meatFishRegex.test(name)) return "meat_fish";
  if (bakeryRegex.test(name)) return "bakery";
  if (produceRegex.test(name)) return "produce";
  return "generic";
}

function chooseBestServing(group) {
  group.sort((a, b) => {
    const order = { Foundation: 1, "SR Legacy": 2, "abridged pub": 3 };
    return (order[a.subset] || 99) - (order[b.subset] || 99);
  });
  const category = getFoodCategory(group[0].name);
  const preferredUnits = unitPriorities[category] || unitPriorities.generic;
  const reasonableServings = group.filter((r) => {
    const weight = r.defaultServing?.gramWeight || 100;
    return weight >= 30 && weight <= 300;
  });
  const sourceGroup =
    reasonableServings.length > 0 ? reasonableServings : group;
  for (const unit of preferredUnits) {
    const matchingMeasures = sourceGroup.filter(
      (r) => r.measure && r.measure.toLowerCase().includes(unit)
    );
    if (matchingMeasures.length > 0) {
      if (matchingMeasures.length === 1) return matchingMeasures[0];
      return matchingMeasures.reduce((a, b) => {
        const a_weight = a.defaultServing?.gramWeight || 100;
        const b_weight = b.defaultServing?.gramWeight || 100;
        const a_diff = Math.abs(a_weight - 100);
        const b_diff = Math.abs(b_weight - 100);
        return a_diff <= b_diff ? a : b;
      });
    }
  }
  const non100 = sourceGroup.filter((r) => r.measure !== "100 g");
  if (non100.length > 0) {
    return non100.reduce((a, b) => {
      const a_weight = a.defaultServing?.gramWeight || 100;
      const b_weight = b.defaultServing?.gramWeight || 100;
      return a_weight < b_weight ? a : b;
    });
  }
  return group.reduce((a, b) => {
    const a_weight = a.defaultServing?.gramWeight || 100;
    const b_weight = b.defaultServing?.gramWeight || 100;
    return a_weight < b_weight ? a : b;
  });
}

// --- ENHANCED BRAND FILTERING ---
function containsBrand(foodName, keepSet) {
  // The normalized name is now ONLY used for the keep set check.
  if (keepSet.has(normalizeName(foodName))) {
    return false; // Always keep if it's on the explicit keep list.
  }

  // Expanded list of known brands identified from names.txt
  const knownBrandBases = new Set([
    "Vitasoy",
    "Nabisco",
    "Archway",
    "Mission Foods",
    "Kraft",
    "Pillsbury",
    "Hormel",
    "Lean Pockets",
    "Hot Pockets",
    "Campbell's",
    "DiGiorno",
    "KFC",
    "McDonald's",
    "Burger King",
    "Taco Bell",
    "Pizza Hut",
    "Arby's",
    "Denny's",
    "Subway",
    "Domino's",
    "Papa John's",
    "Little Caesars",
    "Wendy's",
    "Olive Garden",
    "Cracker Barrel",
    "Applebee's",
    "Chick-fil-A",
    "Oscar Mayer",
    "Pepperidge Farm",
    "Martha White",
    "Silk",
    "Nestle",
    "Snackwell",
    "York",
    "Reddi Wip",
    "Schar",
    "Rudi's",
    "Heinz",
    "Clif Z",
  ]);

  // A powerful, direct check against the known brand list.
  // This will catch brands regardless of their capitalization.
  for (const brand of knownBrandBases) {
    // Use regex with word boundaries (\b) to match whole words only.
    // This prevents "ham" from matching in "chamomile".
    // The 'i' flag makes it case-insensitive.
    const brandRegex = new RegExp(`\\b${brand}\\b`, "i");
    if (brandRegex.test(foodName)) {
      return true;
    }
  }

  // All-caps check now runs on the ORIGINAL food name, not the normalized one.
  const allCapsRegex = /\b([A-Z]{3,})\b/;
  const nonBrandAllCaps = new Set([
    "NEW",
    "YORK",
    "USA",
    "US",
    "UK",
    "GRADE",
    "PRIME",
    "CHOICE",
    "SELECT",
    "ORGANIC",
    "NATURAL",
    "FRESH",
    "FROZEN",
    "RAW",
    "COOKED",
    "LARGE",
    "SMALL",
    "MEDIUM",
    "EXTRA",
    "SUPER",
    "LIGHT",
    "HEAVY",
    "LEAN",
    "FAT",
  ]);

  const allCapsMatches = foodName.match(allCapsRegex);
  if (allCapsMatches) {
    for (const match of allCapsMatches) {
      if (!nonBrandAllCaps.has(match)) {
        return true;
      }
    }
  }

  // Keep other checks for corporate suffixes and possessives as they are still useful.
  const corporateRegex = /\b(Inc|Corp|LLC|Ltd|GmbH|Co\.|& Co\.|Pty)\b/i;
  if (corporateRegex.test(foodName)) return true;

  return false;
}

// --- CORE DATA PROCESSING ---
// **Step 1: Group by sourceKey to collect all measures per food**
function groupBySourceKey(recs) {
  console.log(
    `[GROUP] Starting sourceKey grouping with ${
      recs?.length || "undefined"
    } records`
  );

  // Add safety check
  if (!recs || !Array.isArray(recs)) {
    console.error(
      `❌ [GROUP] Invalid input: recs is ${typeof recs}, expected array`
    );
    process.exit(1);
  }

  const groupedBySourceKey = {};
  recs.forEach((r) => {
    // Use sourceId as the primary key for grouping
    const key = r.sourceId || r.appId; // fallback to appId if no sourceId
    if (!groupedBySourceKey[key]) groupedBySourceKey[key] = [];
    groupedBySourceKey[key].push(r);
  });

  const groupedRecords = [];
  let measuresCollected = 0;

  for (const [sourceKey, variations] of Object.entries(groupedBySourceKey)) {
    // Deduplicate identical measure/calcium pairs within the group
    const uniqueMeasures = deduplicateMeasures(variations);
    
    if (variations.length > 1) {
      console.log(
        `[GROUP] SourceKey ${sourceKey}: ${variations.length} variations → ${uniqueMeasures.length} unique measures`
      );
      measuresCollected += uniqueMeasures.length - 1;
    }

    // Create food entry with measures array
    const baseFood = variations[0]; // Use first variation as template
    const processedFood = {
      ...baseFood,
      measures: uniqueMeasures.map(variation => ({
        measure: variation.measure,
        calcium: parseFloat(variation.calcium)
      }))
    };

    groupedRecords.push(processedFood);
  }

  console.log(
    `[GROUP] Collected ${measuresCollected} additional measures, ${groupedRecords.length} unique foods`
  );
  return groupedRecords;
}

// Helper function to deduplicate identical measure/calcium pairs
function deduplicateMeasures(variations) {
  const uniqueMeasures = [];
  const seen = new Set();
  
  for (const variation of variations) {
    const key = `${variation.measure}:${variation.calcium}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueMeasures.push(variation);
    }
  }
  
  return uniqueMeasures;
}

// **Step 1B: Handle duplicate appIds with different sourceIds (merge measures arrays)**
function deduplicateByAppId(recs) {
  console.log(
    `[DEDUPE] Starting appId deduplication with ${recs.length} records`
  );

  const groupedByAppId = {};
  recs.forEach((r) => {
    if (!groupedByAppId[r.appId]) groupedByAppId[r.appId] = [];
    groupedByAppId[r.appId].push(r);
  });

  const deduplicatedRecords = [];
  let duplicatesFound = 0;

  for (const [appId, foodVariations] of Object.entries(groupedByAppId)) {
    if (foodVariations.length > 1) {
      console.log(
        `[DEDUPE] AppId ${appId}: ${foodVariations.length} food variations`
      );
      duplicatesFound += foodVariations.length - 1;
    }

    if (foodVariations.length === 1) {
      // Single food, use as-is
      deduplicatedRecords.push(foodVariations[0]);
    } else {
      // Multiple foods with same appId - merge their measures arrays
      const primaryFood = chooseBestServing(foodVariations);
      const allMeasures = [];
      
      // Collect all measures from all variations
      for (const food of foodVariations) {
        if (food.measures && Array.isArray(food.measures)) {
          allMeasures.push(...food.measures);
        }
      }
      
      // Deduplicate measures and create merged food
      const uniqueMeasures = deduplicateMeasures(allMeasures.map(m => ({
        measure: m.measure,
        calcium: m.calcium
      })));
      
      const mergedFood = {
        ...primaryFood,
        measures: uniqueMeasures
      };
      
      deduplicatedRecords.push(mergedFood);
    }
  }

  console.log(
    `[DEDUPE] Removed ${duplicatesFound} duplicate appIds, ${deduplicatedRecords.length} unique foods remaining`
  );
  return deduplicatedRecords;
}

// **Step 2: Group by normalized name and apply nutritional bucketing**
function collapseDuplicates(recs) {
  const groupedByName = {};
  recs.forEach((r) => {
    const normName = normalizeName(r.name);
    if (!groupedByName[normName]) groupedByName[normName] = [];
    groupedByName[normName].push(r);
  });

  const finalResult = [];
  const CALCIUM_TOLERANCE = 0.0; // Require exact calcium match for grouping

  for (const [normName, group] of Object.entries(groupedByName)) {
    if (group.length > 1) {
      console.log(`[COLLAPSE] Grouping "${normName}": ${group.length} foods`);
    }
    const buckets = [];

    for (const food of group) {
      const calciumPer100g =
        food.calciumPer100g !== null && food.calciumPer100g !== undefined
          ? parseFloat(food.calciumPer100g)
          : null;

      // Skip calcium-based bucketing if no calciumPer100g data available
      if (calciumPer100g === null) {
        // For data without calciumPer100g, try to find existing bucket with null calcium
        let nullBucket = buckets.find(
          (b) =>
            b[0].calciumPer100g === null || b[0].calciumPer100g === undefined
        );
        if (nullBucket) {
          nullBucket.push(food);
        } else {
          buckets.push([food]);
        }
        continue;
      }

      let foundBucket = false;
      for (const bucket of buckets) {
        const bucketAnchorCalcium =
          bucket[0].calciumPer100g !== null &&
          bucket[0].calciumPer100g !== undefined
            ? parseFloat(bucket[0].calciumPer100g)
            : null;

        // Can only bucket together foods that both have calciumPer100g data
        if (bucketAnchorCalcium === null) continue;

        const divisor = Math.max(bucketAnchorCalcium, calciumPer100g, 1);
        const variance =
          Math.abs(bucketAnchorCalcium - calciumPer100g) / divisor;

        if (variance <= CALCIUM_TOLERANCE) {
          bucket.push(food);
          foundBucket = true;
          break;
        }
      }

      if (!foundBucket) {
        buckets.push([food]);
      }
    }

    for (const bucket of buckets) {
      const chosen = chooseBestServing(bucket);
      
      // Determine if this bucket represents collapsed foods (multiple different sourceIds)
      const uniqueSourceIds = new Set(bucket.map(item => item.sourceId));
      const hasCollapsedFoods = uniqueSourceIds.size > 1;
      
      let appName = chosen.name; // Start with the chosen representative name
      if (hasCollapsedFoods) {
        // 1. Find the common starting substring from all names in the bucket
        const names = bucket.map((f) => f.name);
        let commonPrefix = names.reduce((a, b) => {
          let i = 0;
          while (i < a.length && a[i] === b[i]) i++;
          return a.substring(0, i);
        });

        // 2. Clean up the prefix (remove trailing spaces, commas)
        commonPrefix = commonPrefix.replace(/[\s,]+$/, "").trim();

        // 3. Title Case the result for a clean look
        appName = commonPrefix
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

        // 4. Add an asterisk ONLY for collapsed foods (different names)
        appName += "*";
      }

      // Use ONLY measures from the chosen representative food (not from collapsed foods)
      let measures = [];
      if (chosen.measures && Array.isArray(chosen.measures)) {
        // Food already has measures array - use as-is
        measures = [...chosen.measures];
      } else {
        // Food has single measure format - convert to array
        measures = [{
          measure: chosen.measure || "",
          calcium: parseFloat(chosen.calcium)
        }];
      }

      // Parse serving info from first measure for backward compatibility
      const primaryMeasure = measures[0];
      const measureString = primaryMeasure.measure || "";
      let servingAmount = 1;
      let servingUnit = measureString;
      const measureParts = measureString.match(/^(\d*\.?\d+)\s*(.*)$/);
      if (measureParts && measureParts.length === 3) {
        servingAmount = parseFloat(measureParts[1]);
        servingUnit = measureParts[2].trim();
      }

      // Create base entry structure with measures array
      const entry = {
        appId: chosen.appId,
        name: chosen.name,
        appName: appName,
        measures: measures, // New measures array structure
        calciumPer100g: chosen.calciumPer100g
          ? parseFloat(chosen.calciumPer100g)
          : null,
        defaultServing: {
          amount: servingAmount,
          unit: servingUnit,
          gramWeight: chosen.defaultServing?.gramWeight || 100,
        },
        sourceId: chosen.sourceId,
        sourceName: chosen.sourceName,
        subset: chosen.subset,
      };

      // Include collapsed food metadata ONLY when foods were actually collapsed (different names)
      if (hasCollapsedFoods) {
        const collapsed = bucket.filter((r) => r.sourceId !== chosen.sourceId);
        if (collapsed.length > 0) {
          entry.collapsedFrom = collapsed.map((r) => {
            // Preserve measures array format in collapsedFrom
            let collapsedMeasures;
            if (r.measures && Array.isArray(r.measures)) {
              collapsedMeasures = r.measures;
            } else {
              // Convert single measure format to array
              collapsedMeasures = [{
                measure: r.measure || "",
                calcium: parseFloat(r.calcium)
              }];
            }
            
            return {
              sourceId: r.sourceId,
              name: r.name,
              measures: collapsedMeasures, // Use measures array instead of single measure/calcium
              calciumPer100g: r.calciumPer100g
                ? parseFloat(r.calciumPer100g)
                : null,
              defaultServing: r.defaultServing
                ? {
                    amount: r.defaultServing.amount,
                    unit: r.defaultServing.unit,
                    gramWeight: r.defaultServing.gramWeight,
                  }
                : null,
              subset: r.subset,
            };
          });
        }
      }

      finalResult.push(entry);
    }
  }

  return finalResult;
}

function applyAbridge(data) {
  let filtered = [...data];
  const logStep = (step, before, after) => {
    console.log(`[ABRIDGE] ${step}: ${before} → ${after} (-${before - after})`);
  };
  const stapleFoodRegex =
    /\b(milk|cheese|yogurt|fruit|vegetable|juice|melon|bread|egg|butter)\b/i;

  // Brand filtering moved to main process flow to run *before* abridgement.
  const methodWords =
    /\b(roasted|boiled|fried|grilled|braised|steamed|baked|cooked|broiled|raw|pan-fried|not breaded|breaded)\b/gi;
  before = filtered.length;
  const groupedByCooking = {};
  filtered.forEach((f) => {
    const baseName = f.name
      .replace(methodWords, "")
      .replace(/\(\)/g, "")
      .replace(/, ,/g, ",")
      .replace(/,+/g, ",")
      .replace(/,\s*$/g, "")
      .replace(/\s\s+/g, " ")
      .trim();
    const norm = normalizeName(baseName);
    if (!groupedByCooking[norm]) groupedByCooking[norm] = [];
    groupedByCooking[norm].push(f);
  });
  filtered = Object.values(groupedByCooking).map(
    (g) => g.find((f) => /raw/i.test(f.name)) || g[0]
  );
  logStep("Collapse cooking methods", before, filtered.length);
  const meatFoods = filtered.filter((f) => meatFishRegex.test(f.name));
  const otherFoods = filtered.filter((f) => !meatFishRegex.test(f.name));
  const cutWords =
    /\b(blade|bone-in|boneless|picnic|trimmed|shoulder|arm|sirloin|leg|rib|loin|round|cubed for stew|separable lean only|separable lean and fat|whole|composite of trimmed retail cuts|separable fat|top round|ground)\b/gi;
  before = meatFoods.length;
  const groupedCuts = {};
  meatFoods.forEach((f) => {
    const simplerName = f.name
      .replace(cutWords, "")
      .replace(/\(\)/g, "")
      .replace(/,+/g, ",")
      .replace(/,\s*$/g, "")
      .replace(/\s\s+/g, " ")
      .trim();
    const norm = normalizeName(simplerName);
    if (!groupedCuts[norm]) groupedCuts[norm] = [];
    groupedCuts[norm].push(f);
  });
  const simplifiedMeat = Object.values(groupedCuts).map((g) => {
    if (g.length === 1) return g[0];
    const groundRaw = g.find(
      (f) => /ground/i.test(f.name) && /raw/i.test(f.name)
    );
    const groundCooked = g.find((f) => /ground/i.test(f.name));
    const raw = g.find((f) => /raw/i.test(f.name));
    return (
      groundRaw ||
      groundCooked ||
      raw ||
      g.sort((a, b) => a.name.length - b.name.length)[0]
    );
  });
  logStep("Simplify meat cuts", before, simplifiedMeat.length);
  filtered = [...otherFoods, ...simplifiedMeat];
  const prepWords = /\b(frozen|canned|prepared|rehydrated|packaged)\b/i;
  before = filtered.length;
  filtered = filtered.filter((f) => {
    const normName = normalizeName(f.name);
    if (keepSet.has(normName) || stapleFoodRegex.test(normName)) return true;
    return !prepWords.test(f.name);
  });
  logStep("Remove industrial preps", before, filtered.length);
  before = filtered.length;
  filtered = filtered.filter((f) => {
    const normName = normalizeName(f.name);
    if (keepSet.has(normName) || stapleFoodRegex.test(normName)) return true;
    if (f.measure === "100 g" && f.calciumPer100g < 50) return false;
    return true;
  });
  logStep("Drop low-calcium 100g-only", before, filtered.length);
  const disallowed = /\b(infant formula|restaurant|snack|pet food)\b/i;
  before = filtered.length;
  filtered = filtered.filter((f) => {
    const normName = normalizeName(f.name);
    if (keepSet.has(normName)) return true;
    return !disallowed.test(f.name) || stapleFoodRegex.test(normName);
  });
  logStep("Category whitelist", before, filtered.length);
  return filtered;
}

// --- Main Execution ---
console.log(`[PROCESS] Starting with ${records.length} mastered records`);

// Step 1A: Group by sourceKey to collect all measures per food
const groupedRecords = groupBySourceKey(records);

// Step 1B: Handle duplicate appIds with different sourceIds
const dedupedRecords = deduplicateByAppId(groupedRecords);

// Step 2: Apply name-based collapsing and nutritional bucketing
let full = collapseDuplicates(dedupedRecords);
console.log(`[PROCESS] After name-based collapsing: ${full.length} foods`);

if (excludeSet.size > 0) {
  const beforeCount = full.length;
  const excludeTerms = [...excludeSet];
  // Use original food description for exclude list matching
  full = full.filter(
    (food) =>
      !excludeTerms.some((term) => food.name.toLowerCase().includes(term))
  );
  console.log(
    `[PROCESS] Applied exclude list: ${beforeCount} → ${full.length} (-${
      beforeCount - full.length
    })`
  );
}

// Apply enhanced brand filtering before abridgement for better effectiveness
const beforeBrandFilter = full.length;
full = full.filter((food) => !containsBrand(food.name, keepSet));
console.log(
  `[PROCESS] Applied brand filter: ${beforeBrandFilter} → ${full.length} (-${
    beforeBrandFilter - full.length
  })`
);

console.log(`[PROCESS] Starting abridgement process with ${full.length} foods`);
let abridged = applyAbridge(full);
console.log(`[PROCESS] After abridgement: ${abridged.length} foods`);

// Sort final lists by appId for consistent output
full.sort((a, b) => a.appId - b.appId);
abridged.sort((a, b) => a.appId - b.appId);

// Add asterisk to abridged output names where foods were collapsed.
// Note: 'name' remains original, 'appName' gets the asterisk to prevent duplicates
abridged = abridged.map((food) => {
  if (
    food.collapsedFrom &&
    food.collapsedFrom.length > 0 &&
    !food.appName.endsWith("*")
  ) {
    return { ...food, appName: food.appName + "*" };
  }
  return food;
});

// We no longer assign IDs here; the data-module-generator script will handle it.
full.forEach((f) => delete f.id);
abridged.forEach((f) => delete f.id);

// Generate standardized processing notes for both outputs
let curatedNotes = "This database was curated from USDA FoodData Central, combining multiple raw data files into a simplified format optimized for calcium tracking. The curation process assigned unique identifiers to each food, selected the most practical serving sizes, and merged nutritionally similar foods (those with identical calcium content) under single representative entries. To optimize app performance, branded foods were filtered out (except essential staples), cooking method variations were simplified, and foods with very low calcium content that only had technical 100-gram measurements (rather than practical serving sizes) were removed, while preserving nutritional accuracy through developer-maintained keep and exclusion lists.";

// Add keep and exclude list information if provided
if (keepListFile || excludeListFile) {
  curatedNotes += "\n\nCustom curation lists applied:";
  if (keepListFile && keepSet.size > 0) {
    const keepList = Array.from(keepSet).sort().join(", ");
    curatedNotes += `\n• Foods explicitly preserved: ${keepList}`;
  }
  if (excludeListFile && excludeSet.size > 0) {
    const excludeList = Array.from(excludeSet).sort().join(", ");
    curatedNotes += `\n• Foods explicitly excluded: ${excludeList}`;
  }
}

// Create output objects with updated metadata
const updatedMetadata = metadata ? {
  ...metadata,
  notes: curatedNotes
} : {
  source: "USDA-FDC",
  name: "Curated Food Database",
  description: "Curated food database optimized for calcium tracking",
  notes: curatedNotes
};

const fullOutput = {
  metadata: updatedMetadata,
  foods: full,
};

const abridgedOutput = {
  metadata: updatedMetadata,
  foods: abridged,
};

fs.writeFileSync(
  `${outputBaseName}-full.json`,
  JSON.stringify(fullOutput, null, 2)
);
fs.writeFileSync(
  `${outputBaseName}-abridged.json`,
  JSON.stringify(abridgedOutput, null, 2)
);
console.log(
  `✅ Full output: ${outputBaseName}-full.json (${full.length} foods)`
);
console.log(
  `✅ Abridged output: ${outputBaseName}-abridged.json (${abridged.length} foods)`
);
if (metadata) {
  console.log(`📋 Metadata preserved in both outputs: ${metadata.name}`);
}
