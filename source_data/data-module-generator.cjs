#!/usr/bin/env node

/**
 * data-module-generator.cjs
 *
 * **NEW SCRIPT - Data Module Generator**
 * Generates app-ready database modules from curated JSON data.
 * Replaces the merge functionality with clean module generation.
 *
 * Features:
 * - Accepts single curated JSON input (no merging)
 * - Generates ready-to-use JS modules with exports
 * - Optional name minification with rehydration mapping
 * - Minimal output option (strips metadata for app bundle)
 * - Clean, stable appId-based data structure
 */

const fs = require("fs-extra");
const path = require("path");

// --- Argument Parsing ---
const args = process.argv.slice(2);
const fileArgs = [];
let moduleOutput = false;
let minify = false;
let minimal = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case "--module":
      moduleOutput = true;
      break;
    case "--minify":
      minify = true;
      break;
    case "--minimal":
      minimal = true;
      break;
    default:
      if (!arg.startsWith("--")) {
        fileArgs.push(arg);
      }
      break;
  }
}

const inputFile = fileArgs[0];
const outputFile = fileArgs[1] || "foodDatabaseData.js";

if (!inputFile) {
  console.error(
    "Usage: node data-module-generator.cjs <curated.json> [output.js] [--module] [--minify] [--minimal]"
  );
  console.error("  --module: Generate JS module with exports (vs. JSON array)");
  console.error("  --minify: Compress object keys to reduce bundle size");
  console.error("  --minimal: Strip metadata fields for smaller app bundle");
  process.exit(1);
}

// --- Key Minification Mapping ---
const KEY_MAPPINGS = {
  // Essential fields always present
  id: "i",
  name: "n",
  measure: "m",
  calcium: "c",
  // Metadata fields (present unless --minimal)
  calciumPer100g: "c100",
  defaultServing: "ds",
  sourceId: "si",
  sourceName: "sn",
  subset: "sub",
  collapsedFrom: "cf",
};

// --- Utility Functions ---
function loadInputData(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Input file not found: ${filePath}`);
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".json") {
    console.error(`❌ Unsupported input format: ${ext}. Expected .json`);
    process.exit(1);
  }

  console.log(`📖 Loading: ${filePath}`);
  const rawData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Handle new metadata format {metadata, foods} or legacy direct array
  if (rawData.metadata && rawData.foods) {
    console.log(
      `📋 Found metadata: ${rawData.metadata.name || "Unknown source"}`
    );
    return {
      metadata: rawData.metadata,
      foods: rawData.foods,
    };
  } else if (Array.isArray(rawData)) {
    console.log(`⚠️  Legacy format detected - no metadata available`);
    return {
      metadata: null,
      foods: rawData,
    };
  } else {
    console.error(
      `❌ Invalid input format - expected {metadata, foods} or array`
    );
    process.exit(1);
  }
}

function processDataForOutput(foods, isMinimal) {
  return foods.map((food) => {
    // Use appId from curated data instead of sequential ID
    let processedFood = {
      id: food.appId,
      name: food.appName || food.name,
      measure: food.measure,
      calcium: parseFloat(food.calcium),
    };

    // Include metadata unless minimal mode
    if (!isMinimal) {
      if (food.calciumPer100g !== undefined && food.calciumPer100g !== null) {
        processedFood.calciumPer100g = parseFloat(food.calciumPer100g);
      }
      if (food.defaultServing) {
        processedFood.defaultServing = food.defaultServing;
      }
      if (food.sourceId !== undefined) {
        processedFood.sourceId = food.sourceId;
      }
      if (food.sourceName) {
        processedFood.sourceName = food.sourceName;
      }
      if (food.subset) {
        processedFood.subset = food.subset;
      }
      if (food.collapsedFrom && food.collapsedFrom.length > 0) {
        processedFood.collapsedFrom = food.collapsedFrom;
      }
    }

    return processedFood;
  });
}

function minifyData(data) {
  return data.map((item) => {
    const minified = {};
    for (const [originalKey, minifiedKey] of Object.entries(KEY_MAPPINGS)) {
      if (item[originalKey] !== undefined) {
        minified[minifiedKey] = item[originalKey];
      }
    }
    return minified;
  });
}

function generateDatabaseMetadata(data, inputFile, sourceMetadata) {
  const now = new Date();

  // Use source metadata if available, otherwise create default
  if (sourceMetadata) {
    return {
      ...sourceMetadata,
      version: sourceMetadata.version || "4.0",
      created: now.toISOString().split("T")[0],
      recordCount: data.length,
      notes: `Generated from ${path.basename(
        inputFile
      )} using data-module-generator.cjs`,
    };
  }

  // Fallback metadata when none provided
  return {
    source: "unknown",
    label: "Generated Database",
    name: "Generated Food Database",
    description: `Generated from ${path.basename(inputFile)}`,
    version: "4.0",
    created: now.toISOString().split("T")[0],
    recordCount: data.length,
    author: "Ca PWA Data Pipeline",
    notes: `Generated from ${path.basename(
      inputFile
    )} using data-module-generator.cjs`,
    sourceUrls: [
      {
        name: "USDA Food Data Central",
        url: "https://fdc.nal.usda.gov",
      },
    ],
  };
}

function generateModuleOutput(data, metadata, isMinified) {
  let output = "";

  if (isMinified) {
    // Validate minified format
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid minified data: expected non-empty array");
    }

    // Check that data actually contains minified keys
    const firstRecord = data[0];
    const hasMinifiedKeys = Object.keys(firstRecord).some(
      (key) => key.length <= 3
    );
    if (!hasMinifiedKeys) {
      console.warn(
        "⚠️ Warning: Data doesn't appear to be minified but --minify flag was used"
      );
    }

    // Generate minified output with rehydration keys
    const keyMappingReverse = {};
    for (const [original, minified] of Object.entries(KEY_MAPPINGS)) {
      keyMappingReverse[minified] = original;
    }

    output += "// Key mappings for rehydration\n";
    output += `export const KEYS = ${JSON.stringify(
      keyMappingReverse,
      null,
      2
    )};\n\n`;
    output += "// Minified food database\n";
    output += `export const DB = ${JSON.stringify(data, null, 2)};\n\n`;
    output += "// Format flag\n";
    output += `export const __minified__ = true;\n\n`;
  } else {
    // Validate standard format
    if (!Array.isArray(data)) {
      throw new Error("Invalid standard data: expected array");
    }

    // Generate standard output
    output += "// Food database\n";
    output += `export const DEFAULT_FOOD_DATABASE = ${JSON.stringify(
      data,
      null,
      2
    )};\n\n`;
    output += "// Format flag\n";
    output += `export const __minified__ = false;\n\n`;
  }

  // Always include metadata
  output += "// Database metadata\n";
  output += `export const DATABASE_METADATA = ${JSON.stringify(
    metadata,
    null,
    2
  )};\n`;

  return output;
}

function generateJsonOutput(data) {
  return JSON.stringify(data, null, 2);
}

// --- Main Processing ---
async function main() {
  console.log(`🚀 Data Module Generator - Starting...`);
  console.log(`📖 Loading input: ${inputFile}`);

  // Load and validate input data with proper structure handling
  const inputData = loadInputData(inputFile);
  const { metadata: sourceMetadata, foods } = inputData;

  console.log(`📊 Loaded ${foods.length} food records`);

  // Process data according to options
  let processedData = processDataForOutput(foods, minimal);
  console.log(
    `🔧 Processed ${processedData.length} foods (minimal: ${minimal})`
  );

  // Apply minification if requested
  if (minify) {
    processedData = minifyData(processedData);
    console.log(`🗜️ Applied key minification`);
  }

  // Generate metadata using source metadata if available
  const metadata = generateDatabaseMetadata(
    processedData,
    inputFile,
    sourceMetadata
  );

  // Generate appropriate output
  let output;
  let actualOutputFile = outputFile;

  if (moduleOutput) {
    // Generate JS module
    output = generateModuleOutput(processedData, metadata, minify);
    if (!outputFile.endsWith(".js")) {
      actualOutputFile =
        outputFile.replace(/\.[^.]*$/, ".js") || outputFile + ".js";
    }
  } else {
    // Generate JSON array
    output = generateJsonOutput(processedData);
    if (!outputFile.endsWith(".json")) {
      actualOutputFile =
        outputFile.replace(/\.[^.]*$/, ".json") || outputFile + ".json";
    }
  }

  // Write output file
  await fs.writeFile(actualOutputFile, output, "utf8");

  // Log completion
  console.log(`✅ Generated: ${actualOutputFile}`);
  console.log(
    `📄 Output size: ${(Buffer.byteLength(output, "utf8") / 1024).toFixed(
      1
    )} KB`
  );
  console.log(`📊 Records: ${processedData.length}`);
  console.log(
    `⚙️  Options: module=${moduleOutput}, minify=${minify}, minimal=${minimal}`
  );
  if (sourceMetadata) {
    console.log(`📋 Source: ${sourceMetadata.name || "Unknown"}`);
  }
  console.log(`🎉 Data module generation complete!`);
}

// --- CLI Execution ---
if (require.main === module) {
  main().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
  });
}
