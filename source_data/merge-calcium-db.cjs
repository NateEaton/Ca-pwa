#!/usr/bin/env node
/**
 * Merge existing JS DB with curated JSON from CSV
 * Keeps custom foods, updates USDA foods, and adds new ones.
 * Can operate in two modes:
 * - Default (full): Merges all fields from a detailed JSON file.
 * - Minimal: Use --minimal flag to merge only core fields from an abridged JSON.
 */

const fs = require("fs-extra");
const vm = require("vm");

// --- UTILITY FUNCTIONS ---

function normalizeName(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s*,\s*/g, ", ");
}

function parseMeasure(measure) {
  const m = String(measure).match(/^([\d.]+)\s*(.*)$/);
  if (!m) return { amount: 1, unit: String(measure).trim() };
  return { amount: parseFloat(m[1]), unit: m[2].trim() };
}

function loadJsArray(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  const sandbox = {};
  const wrappedCode = `
    let DEFAULT_FOOD_DATABASE;
    ${code.replace(
      /export\s+const\s+DEFAULT_FOOD_DATABASE/,
      "DEFAULT_FOOD_DATABASE"
    )}
    DEFAULT_FOOD_DATABASE;
  `;
  return vm.runInNewContext(wrappedCode, sandbox, { filename: filePath });
}

function preferType(a, b) {
  const order = { Foundation: 1, "SR Legacy": 2, "USDA Abridged Calcium": 3, "": 99 };
  return (order[a.foodType] || 99) - (order[b.foodType] || 99);
}

// --- CORE MERGE LOGIC ---

async function mergeDatabases(existingJsPath, curatedJsonPath, outputPath, isMinimal) {
  const existingDb = loadJsArray(existingJsPath);
  const curatedDb = await fs.readJson(curatedJsonPath);

  const merged = [];
  const seen = new Set();

  // Process foods from the existing database
  for (const oldFood of existingDb) {
    if (oldFood.isCustom) {
      merged.push(oldFood);
      seen.add(normalizeName(oldFood.name));
      continue;
    }

    const matches = curatedDb.filter(
      (nf) => normalizeName(nf.name) === normalizeName(oldFood.name)
    );

    if (matches.length > 0) {
      matches.sort((a, b) => preferType(a, b));
      const match = matches[0];
      let updatedFood;

      if (isMinimal) {
        // MINIMAL MERGE: Only update core fields that exist in minimal output
        updatedFood = {
          ...oldFood,
          calcium: match.calcium,
          measure: match.measure,
          isCustom: false,
        };
        // Ensure fields not in minimal schema are removed
        delete updatedFood.calciumPer100g;
        delete updatedFood.defaultServing;
        delete updatedFood.fdcId;
        delete updatedFood.foodType;
        delete updatedFood.collapsedFrom;

      } else {
        // FULL MERGE: Perform detailed update with all fields
        let serving = match.defaultServing;
        if (serving && serving.unit && serving.unit.toLowerCase() === "g" && oldFood.measure && match.calciumPer100g > 0) {
          const parsed = parseMeasure(oldFood.measure);
          const gw = (oldFood.calcium / match.calciumPer100g) * 100;
          serving = {
            amount: parsed.amount,
            unit: parsed.unit,
            gramWeight: Math.round(gw),
          };
        }

        updatedFood = {
          ...oldFood,
          calcium: match.calcium,
          calciumPer100g: match.calciumPer100g,
          measure: match.measure,
          defaultServing: serving,
          fdcId: match.fdcId,
          foodType: match.foodType,
          collapsedFrom: match.collapsedFrom || undefined,
          isCustom: false,
        };
      }
      merged.push(updatedFood);
      seen.add(normalizeName(oldFood.name));
    } else {
      // If no match, keep the old food (it might have been filtered out)
      merged.push(oldFood);
      seen.add(normalizeName(oldFood.name));
    }
  }

  // Add new foods from the curated database that weren't in the existing one
  for (const newFood of curatedDb) {
    const key = normalizeName(newFood.name);
    if (!seen.has(key)) {
      merged.push(newFood);
      seen.add(key);
    }
  }

  // **FIX:** Re-assign sequential IDs to ensure uniqueness across the entire dataset.
  merged.forEach((food, index) => {
    food.id = index + 1;
  });

  await fs.writeJson(outputPath, merged, { spaces: 2 });
  console.log(`✅ Merged database saved to ${outputPath}`);
  console.log(`   Mode: ${isMinimal ? 'Minimal' : 'Full'}`);
  console.log(`   Re-indexed all records with unique IDs.`);
  console.log(`   Total foods: ${merged.length}`);
  console.log(`   Custom foods: ${merged.filter((f) => f.isCustom).length}`);
  console.log(`   USDA foods: ${merged.filter((f) => !f.isCustom).length}`);
}

// --- CLI EXECUTION ---

(async () => {
  const args = process.argv.slice(2);
  const isMinimal = args.includes("--minimal");
  const fileArgs = args.filter(arg => arg !== '--minimal');

  const existingJsPath = fileArgs[0];
  const curatedJsonPath = fileArgs[1];
  const outputPath = fileArgs[2] || "./merged-food-database.json";

  if (!existingJsPath || !curatedJsonPath) {
    console.error(
      "Usage: node merge-calcium-db.js [--minimal] <existing-db.js> <curated.json> [output.json]"
    );
    process.exit(1);
  }

  for (const path of [existingJsPath, curatedJsonPath]) {
      if (!(await fs.pathExists(path))) {
          console.error(`❌ Input file not found: ${path}`);
          process.exit(1);
      }
  }

  await mergeDatabases(existingJsPath, curatedJsonPath, outputPath, isMinimal);
})();