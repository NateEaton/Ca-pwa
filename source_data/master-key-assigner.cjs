#!/usr/bin/env node

/**
 * master-key-assigner.cjs
 *
 * **Enhanced with Metadata Flow**
 * Assigns permanent, stable app IDs to food records from external data sources.
 * Now includes metadata from config file in output for downstream processing.
 * This is Step 1 of the mastered hybrid pipeline.
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

// --- Argument Parsing ---
const args = process.argv.slice(2);
let inputFile = null;
let configFile = null;
let mapFile = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case "--input":
      inputFile = args[++i];
      break;
    case "--config":
      configFile = args[++i];
      break;
    case "--map":
      mapFile = args[++i];
      break;
    default:
      if (!arg.startsWith("--")) {
        if (!inputFile) inputFile = arg;
        else if (!configFile) configFile = arg;
        else if (!mapFile) mapFile = arg;
      }
      break;
  }
}

// Set default map file if not provided
if (!mapFile) {
  mapFile = "master-key-map.json";
  console.log(`📁 Using default map file: ${mapFile}`);
}

if (!inputFile || !configFile) {
  console.error(
    "Usage: node master-key-assigner.cjs --input <file.csv> --config <config.json> [--map <master-key-map.json>]"
  );
  console.error("   or: node master-key-assigner.cjs <file.csv> <config.json> [master-key-map.json]");
  console.error("   Map file defaults to 'master-key-map.json' if not specified");
  process.exit(1);
}

// --- Helper Functions ---

function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config file not found: ${configPath}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  // Validate required config fields
  const required = ['sourceName', 'sourceIdColumn', 'columnMapping'];
  const missing = required.filter(field => !config[field]);

  if (missing.length > 0) {
    console.error(`❌ Config file missing required fields: ${missing.join(', ')}`);
    console.error(`   Required: sourceName, sourceIdColumn, columnMapping`);
    console.error(`   Optional: subsetColumn, subsetName, dataTypeMapping, metadata`);
    process.exit(1);
  }

  return config;
}

function loadMasterKeyMap(mapPath) {
  if (!fs.existsSync(mapPath)) {
    console.log(`📁 Creating new master key map: ${mapPath}`);
    return { nextAppId: 1, mappings: {} };
  }
  return JSON.parse(fs.readFileSync(mapPath, "utf8"));
}

function saveMasterKeyMap(mapPath, keyMap) {
  fs.writeFileSync(mapPath, JSON.stringify(keyMap, null, 2));
}

function createExternalKey(sourceName, sourceId) {
  return `${sourceName}_${sourceId}`;
}

function convertDataType(value, type) {
  switch (type) {
    case "integer":
      return parseInt(value, 10);
    case "float":
      return parseFloat(value);
    case "string":
    default:
      return String(value);
  }
}

// --- Main Processing Function ---

function assignMasterKeys(inputFile, config, keyMap) {
  console.log(`📖 Reading CSV file: ${inputFile}`);

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(inputFile, "utf-8");
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`📊 Processing ${records.length} records...`);

  const masteredData = [];
  let newKeysAssigned = 0;

  for (const record of records) {
    // Extract source ID and create external key
    const sourceId = record[config.sourceIdColumn];
    if (!sourceId) {
      console.warn(`⚠️ Missing source ID for record, skipping:`, record);
      continue;
    }

    const externalKey = createExternalKey(config.sourceName, sourceId);

    // Get or assign app ID
    let appId;
    if (keyMap.mappings[externalKey]) {
      appId = keyMap.mappings[externalKey];
    } else {
      appId = keyMap.nextAppId++;
      keyMap.mappings[externalKey] = appId;
      newKeysAssigned++;
    }

    // Create mastered record using column mapping
    const masteredRecord = { appId, sourceId: parseInt(sourceId, 10) };

    // Map columns according to config
    for (const [sourceColumn, targetField] of Object.entries(config.columnMapping)) {
      if (record[sourceColumn] !== undefined) {
        const dataType = config.dataTypeMapping?.[targetField] || "string";
        masteredRecord[targetField] = convertDataType(record[sourceColumn], dataType);
      }
    }

    // Add subset information - prioritize subsetName over subsetColumn
    if (config.subsetName) {
      masteredRecord.subset = config.subsetName;
    } else if (config.subsetColumn && record[config.subsetColumn]) {
      masteredRecord.subset = record[config.subsetColumn];
    }

    // Add source name for downstream processing
    masteredRecord.sourceName = config.sourceName;

    masteredData.push(masteredRecord);
  }

  console.log(`🔑 Assigned ${newKeysAssigned} new app IDs`);
  console.log(`📈 Total mappings: ${Object.keys(keyMap.mappings).length}`);
  console.log(`🎯 Next available app ID: ${keyMap.nextAppId}`);

  return masteredData;
}

// --- Main Execution ---

(async () => {
  try {
    console.log("🚀 Master Key Assigner - Starting...");

    const config = loadConfig(configFile);
    console.log(`📋 Loaded config for source: ${config.sourceName}`);

    const keyMap = loadMasterKeyMap(mapFile);

    const masteredData = assignMasterKeys(inputFile, config, keyMap);

    // Save updated key map
    saveMasterKeyMap(mapFile, keyMap);
    console.log(`💾 Updated master key map: ${mapFile}`);

    // Generate output filename
    const baseName = path.basename(inputFile, path.extname(inputFile));
    const outputFile = `mastered-${baseName}.json`;

    // Create output object with metadata and data
    const output = {
      metadata: config.metadata || null,
      foods: masteredData
    };

    // Save mastered data with metadata
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));

    console.log(`✅ Mastered data saved: ${outputFile}`);
    console.log(`📊 Total records: ${masteredData.length}`);
    if (config.metadata) {
      console.log(`📋 Metadata included: ${config.metadata.name}`);
    }
    console.log("🎉 Master key assignment complete!");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
})();