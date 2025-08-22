#!/usr/bin/env node
/**
 * Merge existing JS DB with curated JSON from CSV
 * Keeps custom foods, updates USDA foods, and adds new ones.
 * **Crucially, it preserves existing IDs to maintain user data stability.**
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
  
  // **NEW:** Find the highest existing ID to start new IDs from.
  let maxId = Math.max(0, ...existingDb.map(f => f.id || 0));

  // Process foods from the existing database, preserving their IDs
  for (const oldFood of existingDb) {
    if (oldFood.isCustom) {
      merged.push(oldFood); // Custom foods are always kept as-is
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
        updatedFood = { ...oldFood, calcium: match.calcium, measure: match.measure, isCustom: false };
        delete updatedFood.calciumPer100g;
        delete updatedFood.defaultServing;
        delete updatedFood.fdcId;
        delete updatedFood.foodType;
        delete updatedFood.collapsedFrom;
      } else {
        let serving = match.defaultServing;
        if (serving && serving.unit && serving.unit.toLowerCase() === "g" && oldFood.measure && match.calciumPer100g > 0) {
          const parsed = parseMeasure(oldFood.measure);
          const gw = (oldFood.calcium / match.calciumPer100g) * 100;
          serving = { amount: parsed.amount, unit: parsed.unit, gramWeight: Math.round(gw) };
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
      // If no match, it means the food was filtered out from the new curation. Keep the old one.
      merged.push(oldFood);
      seen.add(normalizeName(oldFood.name));
    }
  }

  // Add new foods from the curated database that weren't in the existing one
  for (const newFood of curatedDb) {
    const key = normalizeName(newFood.name);
    if (!seen.has(key)) {
      // **NEW:** Assign a new, unique ID that doesn't conflict with existing ones.
      newFood.id = ++maxId;
      merged.push(newFood);
      seen.add(key);
    }
  }

  // **CHANGED:** Remove the old re-indexing loop and instead sort by ID for consistency.
  merged.sort((a, b) => a.id - b.id);

  await fs.writeJson(outputPath, merged, { spaces: 2 });
  console.log(`✅ Merged database saved to ${outputPath}`);
  console.log(`   Mode: ${isMinimal ? 'Minimal' : 'Full'}`);
  console.log(`   Preserved existing IDs and assigned new sequential IDs starting from ${maxId + 1}.`);
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