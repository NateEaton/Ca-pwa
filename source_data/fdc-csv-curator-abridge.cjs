#!/usr/bin/env node

/**
 * fdc-csv-curator-abridge.js
 *
 * Reads a USDA FDC CSV export, collapses duplicates, and outputs curated datasets.
 * Features a data-informed, context-aware algorithm for selecting the best serving size.
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

// --- Argument Parsing ---
const args = process.argv.slice(2);
const fileArgs = [];
let keepListFile = null;
let excludeListFile = null;
let includeCollapsed = false;
let minimal = false;

// **FIXED:** Re-written argument parser to be more robust and correctly handle aliases.
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case "--keep-list":
    case "--keep":
      keepListFile = args[++i];
      break;
    case "--exclude-list":
    case "--exclude":
      excludeListFile = args[++i];
      break;
    case "--include-collapsed":
      includeCollapsed = true;
      break;
    case "--minimal":
      minimal = true;
      includeCollapsed = false;
      break;
    default:
      // If it's not a recognized flag, treat it as a positional file argument.
      if (!arg.startsWith("--")) {
        fileArgs.push(arg);
      }
      break;
  }
}

const inputCsv = fileArgs[0];
const outputBaseName = fileArgs[1] || "curated";

if (!inputCsv) {
  console.error(
    "Usage: node fdc-csv-curator-abridge.cjs <input.csv> [output_base_name] [--keep-list keep.txt] [--exclude-list exclude.txt] [--include-collapsed] [--minimal]"
  );
  process.exit(1);
}

// --- Helper Functions & Data Loading ---
function normalizeName(name) {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}
const keepSet = keepListFile
  ? new Set(
      fs
        .readFileSync(keepListFile, "utf-8")
        .split(/\r?\n/)
        .map(normalizeName)
        .filter(Boolean)
    )
  : new Set();
const excludeSet = excludeListFile
  ? new Set(
      fs
        .readFileSync(excludeListFile, "utf-8")
        .split(/\r?\n/)
        .map(normalizeName)
        .filter(Boolean)
    )
  : new Set();
const records = parse(fs.readFileSync(inputCsv, "utf-8"), {
  columns: true,
  skip_empty_lines: true,
});

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
  const category = getFoodCategory(group[0].foodDescription);
  const preferredUnits = unitPriorities[category] || unitPriorities.generic;
  const reasonableServings = group.filter((r) => {
    const weight = parseFloat(r.foodWeight);
    return weight >= 30 && weight <= 300;
  });
  const sourceGroup =
    reasonableServings.length > 0 ? reasonableServings : group;
  for (const unit of preferredUnits) {
    const matchingMeasures = sourceGroup.filter(
      (r) => r.foodMeasure && r.foodMeasure.toLowerCase().includes(unit)
    );
    if (matchingMeasures.length > 0) {
      if (matchingMeasures.length === 1) return matchingMeasures[0];
      return matchingMeasures.reduce((a, b) => {
        const a_diff = Math.abs(parseFloat(a.foodWeight) - 100);
        const b_diff = Math.abs(parseFloat(b.foodWeight) - 100);
        return a_diff <= b_diff ? a : b;
      });
    }
  }
  const non100 = sourceGroup.filter((r) => r.foodMeasure !== "100 g");
  if (non100.length > 0) {
    return non100.reduce((a, b) =>
      parseFloat(a.foodWeight) < parseFloat(b.foodWeight) ? a : b
    );
  }
  return group.reduce((a, b) =>
    parseFloat(a.foodWeight) < parseFloat(b.foodWeight) ? a : b
  );
}

// --- CORE DATA PROCESSING ---
function collapseDuplicates(recs) {
  const grouped = {};
  recs.forEach((r) => {
    const normName = normalizeName(r.foodDescription);
    if (!grouped[normName]) grouped[normName] = [];
    grouped[normName].push(r);
  });
  const collapsed = [];
  for (const [normName, group] of Object.entries(grouped)) {
    const chosen = chooseBestServing(group);
    const measureString = chosen.foodMeasure || "";
    let servingAmount = 1;
    let servingUnit = measureString;
    const measureParts = measureString.match(/^(\d*\.?\d+)\s*(.*)$/);
    if (measureParts && measureParts.length === 3) {
      servingAmount = parseFloat(measureParts[1]);
      servingUnit = measureParts[2].trim();
    }
    const entry = {
      id: null,
      name: chosen.foodDescription,
      measure: measureString,
      calcium: parseFloat(chosen.measureValue),
      isCustom: false,
    };
    if (!minimal) {
      entry.calciumPer100g = parseFloat(chosen.value);
      entry.defaultServing = {
        amount: servingAmount,
        unit: servingUnit,
        gramWeight: parseFloat(chosen.foodWeight),
      };
      entry.fdcId = chosen.fdcId;
      entry.foodType = chosen.foodType;
      if (includeCollapsed) {
        entry.collapsedFrom = group.map((r) => ({
          fdcId: r.fdcId,
          measure: r.foodMeasure,
          calcium: parseFloat(r.measureValue),
        }));
      }
    }
    collapsed.push(entry);
  }
  return collapsed;
}

function applyAbridge(data) {
  let filtered = [...data];
  const logStep = (step, before, after) => {
    console.log(`[ABRIDGE] ${step}: ${before} → ${after} (-${before - after})`);
  };
  const stapleFoodRegex =
    /\b(milk|cheese|yogurt|fruit|vegetable|juice|melon|bread|egg|butter)\b/i;
  const brandRegex = /\b([A-Z]{3,})\b/;
  const knownBrands =
    /\b(Kraft|Kellogg's|Nestle|Heinz|Campbell's|Pepsi|Coca-Cola|General Mills)\b/i;
  let before = filtered.length;
  filtered = filtered.filter(
    (f) =>
      keepSet.has(normalizeName(f.name)) ||
      (!brandRegex.test(f.name) && !knownBrands.test(f.name))
  );
  logStep("Remove brands", before, filtered.length);
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
    if (f.measure === "100 g" && !minimal && f.calciumPer100g < 50)
      return false;
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
let full = collapseDuplicates(records);
if (excludeSet.size > 0) {
  const beforeCount = full.length;
  const excludeTerms = [...excludeSet];
  full = full.filter(
    (food) =>
      !excludeTerms.some((term) => normalizeName(food.name).includes(term))
  );
  console.log(
    `[PROCESS] Applied exclude list: ${beforeCount} → ${full.length} (-${
      beforeCount - full.length
    })`
  );
}
full.forEach((f, idx) => {
  f.id = idx + 1;
});
let abridged = applyAbridge(full);
abridged.forEach((f, idx) => {
  f.id = idx + 1;
});
fs.writeFileSync(`${outputBaseName}-full.json`, JSON.stringify(full, null, 2));
fs.writeFileSync(
  `${outputBaseName}-abridged.json`,
  JSON.stringify(abridged, null, 2)
);
console.log(
  `✅ Full output: ${outputBaseName}-full.json (${full.length} foods)`
);
console.log(
  `✅ Abridged output: ${outputBaseName}-abridged.json (${abridged.length} foods)`
);
