// ocr/merge_test_data.js
// Merge manually captured test data into existing dataset
// Updated to handle full OCR.space API response format

import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';

const DATASET_FILE = path.join(process.cwd(), 'ocr_dataset.json');
const NEW_DATA_DIR = path.join(process.cwd(), 'new_test_data');

// Parse command line arguments
const args = process.argv.slice(2);
const forceOverwrite = args.includes('--force');
const skipExisting = args.includes('--skip-existing');

// Version management helpers
function parseVersion(versionString) {
  const match = versionString?.match(/v?(\d+)\.(\d+)/);
  return match ? { major: parseInt(match[1]), minor: parseInt(match[2]) } : null;
}

function incrementMinorVersion(version) {
  if (!version) return 'v1.0';

  const parsed = parseVersion(version);
  if (parsed) {
    return `v${parsed.major}.${parsed.minor + 1}`;
  }

  return 'v1.1'; // Fallback if parse fails
}

async function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log('Merging new test data into dataset...');
  if (forceOverwrite) console.log('Mode: Force overwrite existing entries');
  if (skipExisting) console.log('Mode: Skip existing entries');
  console.log();

  // Load existing dataset
  let dataset;
  let currentVersion;
  let newVersion;

  try {
    const content = await fs.readFile(DATASET_FILE, 'utf-8');
    dataset = JSON.parse(content);

    // Get current version and calculate new version
    currentVersion = dataset.metadata?.version || 'v1.0';
    newVersion = incrementMinorVersion(currentVersion);

    console.log('Version Management:');
    console.log(`  Current version: ${currentVersion}`);
    console.log(`  New version will be: ${newVersion} (after merge)\n`);

    // Create backup before any modifications
    const backupFile = DATASET_FILE.replace('.json', '_backup.json');
    await fs.writeFile(backupFile, content);
    console.log(`✓ Backup created: ${path.basename(backupFile)}\n`);
  } catch {
    console.log('No existing dataset found, creating new one');
    currentVersion = null;
    newVersion = 'v1.0';

    console.log(`Version: ${newVersion} (new dataset)\n`);

    dataset = {
      metadata: {
        version: newVersion,
        generated: new Date().toISOString(),
        total_upcs: 0,
        format: 'full_api_response',
        description: 'Complete OCR.space API responses for accurate testing'
      },
      data: {}
    };
  }
  
  // Find all new metadata files
  const files = await fs.readdir(NEW_DATA_DIR);
  const metadataFiles = files.filter(f => f.endsWith('_metadata.json'));
  
  console.log(`Found ${metadataFiles.length} new entries to merge\n`);
  
  let added = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const metadataFile of metadataFiles) {
    const upc = metadataFile.replace('_metadata.json', '');
    console.log(`Processing UPC: ${upc}`);
    
    try {
      // Load metadata
      const metadataPath = path.join(NEW_DATA_DIR, metadataFile);
      const metadataJson = await fs.readFile(metadataPath, 'utf-8');
      const metadata = JSON.parse(metadataJson);

      // Try to load OCR data (optional - may not exist if OCR timed out)
      const ocrPath = path.join(NEW_DATA_DIR, `${upc}_ocr.json`);
      let ocrData = null;
      let hasOcrData = false;

      try {
        const ocrJson = await fs.readFile(ocrPath, 'utf-8');
        ocrData = JSON.parse(ocrJson);
        hasOcrData = true;
      } catch (error) {
        console.log(`  ⚠ No OCR data found (will need API processing)`);
      }

      // Validate OCR data format (if present)
      let ocrResponse = null;
      let ocrSource = null;

      if (hasOcrData) {
        // Check if it's already full API format or needs conversion
        if (ocrData.ParsedResults) {
          // Already full API format
          ocrResponse = ocrData;
          ocrSource = 'app_capture';
          console.log(`  ✓ Using full API format OCR data`);
        } else if (ocrData.rawText && ocrData.words) {
        // Legacy simplified format - needs conversion
        console.log(`  ⚠ Converting legacy format to full API format`);
        
        // Group words into lines by Y coordinate
        const lineMap = new Map();
        const yTolerance = 15;
        
        for (const word of ocrData.words) {
          let foundLine = false;
          
          for (const [lineY, lineWords] of lineMap.entries()) {
            if (Math.abs(word.y - lineY) <= yTolerance) {
              lineWords.push(word);
              foundLine = true;
              break;
            }
          }
          
          if (!foundLine) {
            lineMap.set(word.y, [word]);
          }
        }
        
        // Convert to API Lines format
        const lines = [];
        for (const [y, lineWords] of lineMap.entries()) {
          lineWords.sort((a, b) => a.x - b.x);
          
          const minTop = Math.min(...lineWords.map(w => w.y));
          const maxHeight = Math.max(...lineWords.map(w => w.h));
          const lineText = lineWords.map(w => w.t).join(' ');
          
          lines.push({
            LineText: lineText,
            MinTop: minTop,
            MaxHeight: maxHeight,
            Words: lineWords.map(w => ({
              WordText: w.t,
              Left: w.x,
              Top: w.y,
              Width: w.w,
              Height: w.h
            }))
          });
        }
        
        lines.sort((a, b) => a.MinTop - b.MinTop);
        
        // Build full API response structure
        ocrResponse = {
          ParsedResults: [{
            ParsedText: ocrData.rawText,
            ErrorMessage: '',
            ErrorDetails: '',
            TextOverlay: {
              HasOverlay: true,
              Lines: lines
            }
          }],
          IsErroredOnProcessing: false
        };

        ocrSource = 'app_capture';
        console.log(`  ✓ Converted ${ocrData.words.length} words to ${lines.length} lines`);
        } else {
          throw new Error('Invalid OCR data format - missing required fields');
        }
      } else {
        // No OCR data - will be processed by generate_ocr_dataset.js
        console.log(`  → OCR will be generated via API`);
      }
      
      // Check if image exists (optional)
      const imagePath = path.join(NEW_DATA_DIR, `${upc}_nutrition.jpg`);
      const hasImage = await fs.access(imagePath).then(() => true).catch(() => false);
      
      if (hasImage) {
        // Copy image to nutrition_labels directory
        const destDir = path.join(process.cwd(), 'nutrition_labels');
        await fs.mkdir(destDir, { recursive: true });
        const destPath = path.join(destDir, `${upc}_nutrition.jpg`);
        await fs.copyFile(imagePath, destPath);
        console.log(`  ✓ Copied image`);
      }
      
      // Extract source tracking info from metadata (if present)
      const groundTruthSource = metadata.source || 'manual';
      const priority = metadata.priority || (groundTruthSource === 'app_capture' ? 'high' : 'normal');
      const collectionMethod = metadata.collection_method || { type: 'manual', note: 'Imported without collection details' };
      const capturedAt = metadata.captured_at || new Date().toISOString();

      // Build dataset entry in full API format with split source tracking
      const entry = {
        priority: priority,
        collection_method: collectionMethod,
        captured_at: capturedAt,
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
          source: ocrSource,        // Where OCR came from ('app_capture' or null if needs API)
          original: ocrResponse     // Full OCR.space API response (null if needs API)
        }
      };
      
      // Add or update with confirmation
      if (dataset.data[upc]) {
        if (skipExisting) {
          console.log(`  ⊘ Skipped (already exists)`);
          skipped++;
          continue;
        }
        
        console.log(`  ⚠ UPC already exists in dataset`);
        console.log(`    Old: ${dataset.data[upc].groundTruth.product_name}`);
        console.log(`         [GT: ${dataset.data[upc].groundTruth?.source || 'unknown'}, OCR: ${dataset.data[upc].ocr?.source || 'unknown'}]`);
        console.log(`    New: ${entry.groundTruth.product_name}`);
        console.log(`         [GT: ${entry.groundTruth.source}, OCR: ${entry.ocr.source || 'pending'}]`);
        
        let shouldReplace = forceOverwrite;
        
        if (!forceOverwrite) {
          const answer = await promptUser('    Replace? (y/n/s=skip all): ');
          
          if (answer.toLowerCase() === 's') {
            console.log(`  ✗ Cancelled merge process`);
            process.exit(0);
          }
          
          shouldReplace = answer.toLowerCase() === 'y';
        }
        
        if (shouldReplace) {
          dataset.data[upc] = entry;
          console.log(`  ✓ Updated existing entry`);
          updated++;
        } else {
          console.log(`  ⊘ Skipped (kept existing)`);
          skipped++;
        }
      } else {
        dataset.data[upc] = entry;
        console.log(`  ✓ Added new entry`);
        added++;
      }
      
      console.log();
      
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      errors++;
      console.log();
    }
  }
  
  // Conditionally bump version based on operations
  if (added > 0 || updated > 0) {
    dataset.metadata.version = newVersion;
    console.log(`\n✓ Version bumped: ${currentVersion || 'none'} → ${newVersion}`);
  } else {
    // No changes, keep current version
    if (currentVersion) {
      console.log(`\n✓ Version unchanged: ${currentVersion} (no additions or updates)`);
    }
  }

  // Update metadata with source and priority breakdown
  dataset.metadata.total_upcs = Object.keys(dataset.data).length;
  dataset.metadata.last_updated = new Date().toISOString();
  if (!dataset.metadata.format) {
    dataset.metadata.format = 'full_api_response';
  }

  // Calculate source and priority breakdown
  const groundTruthSources = {};
  const ocrSources = {};
  const priorities = {};

  for (const entry of Object.values(dataset.data)) {
    const gtSource = entry.groundTruth?.source || 'unknown';
    const ocrSource = entry.ocr?.source || 'pending';
    const priority = entry.priority || 'unknown';

    groundTruthSources[gtSource] = (groundTruthSources[gtSource] || 0) + 1;
    ocrSources[ocrSource] = (ocrSources[ocrSource] || 0) + 1;
    priorities[priority] = (priorities[priority] || 0) + 1;
  }

  dataset.metadata.groundTruth_sources = groundTruthSources;
  dataset.metadata.ocr_sources = ocrSources;
  dataset.metadata.priority_breakdown = priorities;
  
  // Save updated dataset
  await fs.writeFile(DATASET_FILE, JSON.stringify(dataset, null, 2));
  
  // Calculate file size
  const stats = await fs.stat(DATASET_FILE);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  // Report
  console.log('='.repeat(60));
  console.log('Merge Summary:');
  console.log(`  Added:   ${added}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors:  ${errors}`);
  console.log(`  Total UPCs in dataset: ${dataset.metadata.total_upcs}`);
  console.log(`  Dataset size: ${sizeMB} MB`);
  console.log('='.repeat(60));
  
  if (!forceOverwrite && !skipExisting) {
    console.log('\nUsage flags:');
    console.log('  --force           Overwrite all existing entries without prompting');
    console.log('  --skip-existing   Skip all existing entries (add new only)');
  }
}

main().catch(console.error);