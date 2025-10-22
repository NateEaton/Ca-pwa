// ocr/generate_ocr_dataset.js - Generate OCR dataset with FULL API response format
// Updated to store complete OCR.space API response for accurate testing

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command-line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    labelsDir: 'nutrition_labels',
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--labels-dir') {
      if (i + 1 < args.length) {
        options.labelsDir = args[i + 1];
        i++; // Skip next arg since we consumed it
      } else {
        console.error('Error: --labels-dir requires a path argument');
        process.exit(1);
      }
    } else {
      console.error(`Unknown argument: ${arg}`);
      console.error('Use --help for usage information');
      process.exit(1);
    }
  }

  return options;
}

function showHelp() {
  console.log(`
OCR Dataset Generator - Create test datasets from nutrition label images

Usage: node generate_ocr_dataset.js [options]

Options:
  --labels-dir <path>    Path to directory containing nutrition label images
                         (default: nutrition_labels)

  --help, -h             Show this help message

Examples:
  node generate_ocr_dataset.js
  node generate_ocr_dataset.js --labels-dir ./my_labels
  node generate_ocr_dataset.js --labels-dir /absolute/path/to/labels

The script expects image files named: <UPC>_nutrition.(jpg|png)
And metadata files named: <UPC>_metadata.json
`);
}

const cliOptions = parseArgs();

if (cliOptions.help) {
  showHelp();
  process.exit(0);
}

const LABELS_DIR = path.resolve(__dirname, cliOptions.labelsDir);
const OUTPUT_FILE = path.join(__dirname, 'ocr_dataset.json');
const CHECKPOINT_FILE = path.join(__dirname, '.ocr_checkpoint.json');
const OCR_ENDPOINT = 'https://api.ocr.space/parse/image';
const API_KEY = process.env.VITE_OCR_API_KEY;
const DELAY_MS = 2100; // 2.1 seconds between requests

// Version management helpers
function parseVersion(versionString) {
  const match = versionString?.match(/v?(\d+)\.(\d+)/);
  return match ? { major: parseInt(match[1]), minor: parseInt(match[2]) } : null;
}

function bumpMajorVersion(version) {
  const parsed = parseVersion(version);
  return parsed ? `v${parsed.major + 1}.0` : 'v1.0';
}

function getDateStamp() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

async function getExistingVersion(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const dataset = JSON.parse(content);
    return dataset.metadata?.version || 'v1.0';
  } catch {
    return null; // File doesn't exist
  }
}

async function createSnapshot(filePath, version) {
  try {
    const snapshotName = filePath.replace('.json', `_${version}_${getDateStamp()}.json`);
    await fs.copyFile(filePath, snapshotName);
    console.log(`✓ Snapshot created: ${path.basename(snapshotName)}`);
    return snapshotName;
  } catch (error) {
    console.error(`⚠ Failed to create snapshot: ${error.message}`);
    return null;
  }
}

// Find the "original" image for a UPC
async function findOriginalImage(upc, labelsDir) {
  try {
    const files = await fs.readdir(labelsDir);
    const originalFile = files.find(f => 
      f.startsWith(upc) && f.includes('_nutrition.') && 
      (f.endsWith('.jpg') || f.endsWith('.png'))
    );
    
    if (!originalFile) {
      return null;
    }
    
    const imagePath = path.join(labelsDir, originalFile);
    
    // Verify file exists and is readable
    await fs.access(imagePath);
    
    return imagePath;
  } catch (error) {
    console.error(`  ✗ Error finding image for ${upc}:`, error.message);
    return null;
  }
}

// Call OCR.space API
async function callOCRAPI(imagePath) {
  try {
    const formData = new FormData();
    formData.append('apikey', API_KEY);
    formData.append('language', 'eng');
    
    const imageBuffer = await fs.readFile(imagePath);
    formData.append('file', imageBuffer, {
      filename: path.basename(imagePath),
      contentType: 'image/jpeg'
    });
    
    formData.append('isTable', 'true');
    formData.append('isOverlayRequired', 'true');
    formData.append('scale', 'true');
    formData.append('detectOrientation', 'true');
    
    const response = await fetch(OCR_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      
      // Check for rate limit (403)
      if (response.status === 403 && errorText.includes('180')) {
        throw new Error('RATE_LIMIT: ' + errorText.substring(0, 100));
      }
      
      throw new Error(`HTTP ${response.status}: ${errorText.substring(0, 100)}`);
    }
    
    const result = await response.json();
    
    if (result.IsErroredOnProcessing) {
      // ErrorMessage and ErrorDetails are strings, not arrays
      const errorMsg = result.ErrorMessage || 'Unknown error';
      const errorDetails = result.ErrorDetails || 'No details';
      throw new Error(`OCR processing failed: ${errorMsg} | ${errorDetails}`);
    }
    
    // Check if we got actual text
    const parsedText = result.ParsedResults?.[0]?.ParsedText || '';
    const lineCount = result.ParsedResults?.[0]?.TextOverlay?.Lines?.length || 0;
    
    if (parsedText.trim().length === 0) {
      console.log(`    ⚠ OCR returned empty text (${lineCount} lines detected)`);
    }
    
    return result;
  } catch (error) {
    // Re-throw rate limit errors
    if (error.message.startsWith('RATE_LIMIT:')) {
      throw error;
    }
    console.error(`    ✗ OCR API error: ${error.message}`);
    return null;
  }
}

// Load checkpoint if exists
async function loadCheckpoint(newVersion) {
  try {
    const data = await fs.readFile(CHECKPOINT_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      completed: new Set(parsed.completed || []),
      dataset: parsed.dataset || { metadata: {}, data: {} },
      version: parsed.version || newVersion
    };
  } catch {
    return {
      completed: new Set(),
      dataset: {
        metadata: {
          version: newVersion,
          generated: new Date().toISOString(),
          total_upcs: 0,
          format: 'full_api_response',
          description: 'Complete OCR.space API responses for accurate testing'
        },
        data: {}
      },
      version: newVersion
    };
  }
}

// Save checkpoint
async function saveCheckpoint(checkpoint) {
  const data = {
    completed: Array.from(checkpoint.completed),
    dataset: checkpoint.dataset,
    version: checkpoint.version
  };
  await fs.writeFile(CHECKPOINT_FILE, JSON.stringify(data, null, 2));
}

async function main() {
  console.log('='.repeat(60));
  console.log('OCR Dataset Generator (Full API Response Format)');
  console.log('='.repeat(60));

  if (!API_KEY) {
    console.error('Error: VITE_OCR_API_KEY not found in .env');
    process.exit(1);
  }

  // Verify labels directory exists
  try {
    await fs.access(LABELS_DIR);
    console.log(`\nLabels directory: ${LABELS_DIR}`);
  } catch (error) {
    console.error(`\nError: Labels directory not found: ${LABELS_DIR}`);
    console.error('Use --labels-dir to specify a different directory');
    console.error('Use --help for more information');
    process.exit(1);
  }

  // Determine version for new dataset
  const existingVersion = await getExistingVersion(OUTPUT_FILE);
  const newVersion = existingVersion ? bumpMajorVersion(existingVersion) : 'v1.0';

  console.log('\nVersion Management:');
  if (existingVersion) {
    console.log(`  Existing dataset: ${existingVersion}`);
    console.log(`  New dataset will be: ${newVersion} (major version bump)`);

    // Create snapshot before overwriting
    await createSnapshot(OUTPUT_FILE, existingVersion);
  } else {
    console.log(`  Creating new dataset: ${newVersion}`);
  }
  console.log();

  // Load checkpoint (pass version to preserve across restarts)
  let checkpoint = await loadCheckpoint(newVersion);

  if (checkpoint.completed.size > 0) {
    console.log(`Resuming from checkpoint: ${checkpoint.completed.size} UPCs already processed`);
    console.log(`Using version: ${checkpoint.version}\n`);
  }
  
  // Find all UPCs with metadata files
  const allFiles = await fs.readdir(LABELS_DIR);
  const metadataFiles = allFiles.filter(f => f.endsWith('_metadata.json'));
  const totalUpcs = metadataFiles.length;
  
  console.log(`Found ${totalUpcs} UPCs with metadata\n`);
  
  const { dataset } = checkpoint;
  const errorLog = [];
  let processed = checkpoint.completed.size;
  
  for (const metaFile of metadataFiles) {
    const upc = metaFile.replace('_metadata.json', '');
    
    // Skip if already processed
    if (checkpoint.completed.has(upc)) {
      continue;
    }
    
    console.log(`[${processed + 1}/${totalUpcs}] Processing UPC: ${upc}`);
    
    try {
      // Load metadata
      const metaPath = path.join(LABELS_DIR, metaFile);
      const metadataContent = await fs.readFile(metaPath, 'utf-8');
      const metadata = JSON.parse(metadataContent);

      // Find image
      const imagePath = await findOriginalImage(upc, LABELS_DIR);
      if (!imagePath) {
        const warning = `No original image found for UPC ${upc}`;
        console.log(`  ⚠ ${warning}`);
        errorLog.push(warning);
        checkpoint.completed.add(upc);
        continue;
      }

      console.log(`  → Calling OCR API...`);

      // Rate limiting delay
      if (processed > 0) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }

      // Call OCR API
      const ocrResult = await callOCRAPI(imagePath);

      if (!ocrResult) {
        const warning = `OCR API call failed for UPC ${upc}`;
        console.log(`  ⚠ ${warning}`);
        errorLog.push(warning);
        checkpoint.completed.add(upc);
        continue;
      }
      
      // Store FULL API response with split source tracking
      // Preserve groundTruth.source from metadata (app_capture vs api_batch)
      // Set ocr.source to 'api_batch' since this script always calls the API
      const groundTruthSource = metadata.source || 'api_batch';
      const priority = metadata.priority || 'normal';
      const collectionMethod = metadata.collection_method || {
        type: 'api',
        script: 'generate_ocr_dataset.js',
        api_endpoint: OCR_ENDPOINT
      };

      dataset.data[upc] = {
        priority: priority,
        collection_method: collectionMethod,
        generated_at: new Date().toISOString(),
        groundTruth: {
          source: groundTruthSource,  // Where metadata came from (affects calcium units)
          product_name: metadata.product_name,
          brands: metadata.brands,
          serving_size: metadata.serving_size,
          calcium_per_serving: metadata.calcium?.per_serving,
          calcium_per_100g: metadata.calcium?.per_100g,
          calcium_unit: metadata.calcium?.unit
        },
        ocr: {
          source: 'api_batch',      // OCR from generate_ocr_dataset.js API call
          original: ocrResult       // Full OCR.space API response
        }
      };
      
      // Warn if OCR result is empty
      const parsedText = ocrResult.ParsedResults?.[0]?.ParsedText || '';
      if (parsedText.trim().length === 0) {
        const warning = `Empty OCR result for UPC ${upc}`;
        console.log(`  ⚠ ${warning}`);
        errorLog.push(warning);
      }
      
      checkpoint.completed.add(upc);
      processed++;
      
      // Save checkpoint every 5 UPCs
      if (processed % 5 === 0) {
        await saveCheckpoint(checkpoint);
        console.log(`  ✓ Checkpoint saved (${processed}/${totalUpcs})\n`);
      } else {
        console.log(`  ✓ Complete\n`);
      }
      
    } catch (error) {
      // Check for rate limit error
      if (error.message.startsWith('RATE_LIMIT:')) {
        console.error(`\n${'='.repeat(60)}`);
        console.error('⏸️  RATE LIMIT HIT');
        console.error(`${'='.repeat(60)}`);
        console.error(`OCR.space API limit reached (180 requests/hour)`);
        console.error(`Processed: ${processed}/${totalUpcs} UPCs before hitting limit`);
        console.error(`\nCheckpoint saved. Wait 1 hour and re-run to continue.\n`);
        
        await saveCheckpoint(checkpoint);
        process.exit(0);
      }
      
      const warning = `Unexpected error for UPC ${upc}: ${error.message}`;
      console.error(`  ✗ ${warning}`);
      errorLog.push(warning);
      checkpoint.completed.add(upc);
    }
  }
  
  // Update metadata with source breakdown
  dataset.metadata.version = checkpoint.version; // Ensure version is set
  dataset.metadata.generated = new Date().toISOString();
  dataset.metadata.total_upcs = Object.keys(dataset.data).length;

  // Calculate source and priority breakdown
  const sources = {};
  const priorities = {};

  for (const entry of Object.values(dataset.data)) {
    const source = entry.source || 'unknown';
    const priority = entry.priority || 'unknown';

    sources[source] = (sources[source] || 0) + 1;
    priorities[priority] = (priorities[priority] || 0) + 1;
  }

  dataset.metadata.sources_breakdown = sources;
  dataset.metadata.priority_breakdown = priorities;
  
  // Save final dataset
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(dataset, null, 2));
  
  // Clean up checkpoint
  await fs.unlink(CHECKPOINT_FILE).catch(() => {});
  
  // Report
  console.log('='.repeat(60));
  console.log('GENERATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total UPCs processed: ${processed}/${totalUpcs}`);
  console.log(`Dataset saved to: ${OUTPUT_FILE}`);
  
  const stats = await fs.stat(OUTPUT_FILE);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`Dataset size: ${sizeMB} MB`);
  
  if (errorLog.length > 0) {
    console.log(`\nWarnings/Errors: ${errorLog.length}`);
    errorLog.forEach(e => console.log(`  • ${e}`));
  }

  console.log('='.repeat(60));

  // Explicitly exit to avoid hanging on HTTP keep-alive connections
  process.exit(0);
}

main().catch(console.error);