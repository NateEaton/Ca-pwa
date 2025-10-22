/**
 * OpenFoodFacts Nutrition Label Image Scraper with Metadata & OCR
 *
 * Usage:
 * 1. With custom UPC list: node script.js --upcs "12345,67890,11111"
 * 2. With UPC file: node script.js --file upcs.txt
 * 3. Random from API: node script.js --random 10
 * 4. Add --ocr flag to run OCR processing (requires VITE_OCR_API_KEY in .env)
 * 5. Add --folder <name> to specify output directory (default: nutrition_labels)
 *
 * Example with OCR: node script.js --file upcs.txt --ocr
 * Example with custom folder: node script.js --random 5 --folder test_samples
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DELAY_MS = 200; // Delay between requests to be respectful
const OCR_API_KEY = process.env.VITE_OCR_API_KEY;
const OCR_ENDPOINT = 'https://api.ocr.space/parse/image';
const MAX_OCR_FILE_SIZE = 1024 * 1024; // 1MB limit for OCR.space

// OUTPUT_DIR will be set in main() based on --folder parameter

// Helper: Check if URL exists using HEAD request
function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.statusCode === 200 ? url : null);
    });
    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(null);
    });
    req.end();
  });
}

// Helper: Download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    const req = https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    });
    req.on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
    req.setTimeout(10000, () => {
      req.destroy();
      fs.unlink(filepath, () => {});
      reject(new Error('Download timeout'));
    });
  });
}

// Helper: Get random products from OFF API v2 (US English only, diverse categories)
async function getRandomUpcs(count, existingUpcs = new Set()) {
    const upcs = new Set();
    const categories = [
        'breakfast-cereals', 'dairy', 'beverages', 'snacks', 'meals', 'breads',
        'yogurts', 'cheeses', 'plant-based-foods', 'desserts', 'sauces', 'frozen-foods',
        'soups', 'seafood', 'meat', 'fruits', 'vegetables'
    ];
    // Fetch from a random starting page to get more variety
    const randomPage = Math.floor(Math.random() * 20) + 1;
    const perCategory = Math.ceil(count / categories.length);

    console.log(`Sampling ~${perCategory} products from each of ${categories.length} categories...`);

    for (const category of categories) {
        if (upcs.size >= count) break;

        // Fetch extra to account for filtering and duplicates
        const fetchCount = Math.min(count * 2, perCategory * 3);
        console.log(`  Fetching from category: ${category}`);

        // More robust URL with explicit country and language filters
        const url = `https://us.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1&page_size=${fetchCount}&page=${randomPage}&sort_by=unique_scans_n&tagtype_0=categories&tag_contains_0=contains&tag_0=${category}&tagtype_1=countries&tag_contains_1=contains&tag_1=en:united-states&tagtype_2=languages&tag_contains_2=contains&tag_2=en:english`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.products) {
                data.products.forEach(p => {
                    if (upcs.size >= count) return;
                    // Ensure we don't add a UPC that's already been processed
                    if (p.code && !existingUpcs.has(p.code)) {
                        upcs.add(p.code);
                    }
                });
            }
            await delay(DELAY_MS);
        } catch (err) {
            console.error(`  Error fetching category ${category}:`, err.message);
        }
    }

    console.log(`Found ${upcs.size} new potential UPCs`);
    return Array.from(upcs);
}


// Helper: Get product metadata from V3 API
async function getProductMetadata(upc) {
  try {
    const url = `https://us.openfoodfacts.org/api/v3/product/${upc}`;
    const response = await fetch(url);
    if (!response.ok) {
        console.log(`  ✗ API returned status ${response.status} for ${upc}`);
        return null;
    }
    const data = await response.json();
    
    if (!data.product) return null;
    
    const product = data.product;
    const nutriments = product.nutriments || {};
    
    // Strict validation for calcium: must exist and not be null. 0 is a valid value.
    const calciumPer100g = nutriments['calcium_100g'];
    const calciumPerServing = nutriments.calcium_serving;

    if ((calciumPer100g === null || typeof calciumPer100g === 'undefined') &&
        (calciumPerServing === null || typeof calciumPerServing === 'undefined')) {
        console.log(`  ✗ Rejected ${upc}: No calcium data`);
        return { rejectionReason: 'no_calcium_data' };
    }
    
    // Extract nutrition image info and revision number
    let nutritionImageUrl = null;
    
    if (product.images) {
      // Find the best available nutrition image key, preferring English
      const imageKeys = Object.keys(product.images);
      const nutritionKey = imageKeys.find(k => k.startsWith('nutrition_en')) 
          || imageKeys.find(k => k.startsWith('nutrition'));

      if (nutritionKey && product.images[nutritionKey]?.rev) {
        const rev = product.images[nutritionKey].rev;
        const padded = upc.toString().padStart(13, '0');
        const pathParts = [ padded.slice(0, 3), padded.slice(3, 6), padded.slice(6, 9), padded.slice(9) ];
        const basePath = pathParts.join('/');
        // Use a generic full-size URL structure that is more reliable
        nutritionImageUrl = `https://images.openfoodfacts.org/images/products/${basePath}/${nutritionKey}.${rev}.full.jpg`;
      }
    }

    if (!nutritionImageUrl) {
        console.log(`  ✗ Rejected ${upc}: No nutrition image URL found in metadata`);
        return { rejectionReason: 'no_image_url' };
    }
    
    // Build metadata object
    const metadata = {
      upc: upc,
      product_name: product.product_name || null,
      brands: product.brands || null,
      serving_size: product.serving_size || null,
      calcium: {
        per_100g: calciumPer100g,
        per_serving: calciumPerServing,
        unit: nutriments.calcium_unit || null
      },
      source_url: `https://world.openfoodfacts.org/product/${upc}`,
      fetched_at: new Date().toISOString()
    };
    
    return { metadata, nutritionImageUrl, rejectionReason: null };
    
  } catch (err) {
    console.error(`  Error fetching metadata for ${upc}:`, err.message);
    return null;
  }
}

// Helper: Preprocess image for OCR with aggressive size reduction
async function preprocessImage(inputPath, outputPath) {
  try {
    let image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`    Original: ${metadata.width}x${metadata.height}, ${(fs.statSync(inputPath).size / 1024).toFixed(1)}KB`);
    
    image = image.grayscale().normalize().sharpen();
    
    let targetWidth = metadata.width;
    let targetHeight = metadata.height;
    
    const minWidth = 1200;
    if (metadata.width > 3000) {
      const scale = 2400 / metadata.width;
      targetWidth = Math.floor(metadata.width * scale);
      targetHeight = Math.floor(metadata.height * scale);
    } else if (metadata.width < minWidth && metadata.width > 0) {
      const scale = minWidth / metadata.width;
      targetWidth = Math.floor(metadata.width * scale);
      targetHeight = Math.floor(metadata.height * scale);
    }
    
    if (targetWidth !== metadata.width) {
      image = image.resize(targetWidth, targetHeight, { fit: 'inside', withoutEnlargement: false });
    }
    
    let quality = 90;
    const maxAttempts = 5;
    const targetSize = MAX_OCR_FILE_SIZE * 0.95;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await image.jpeg({ quality }).toFile(outputPath);
      const stats = fs.statSync(outputPath);
      
      console.log(`    Attempt ${attempt + 1}: ${(stats.size / 1024).toFixed(1)}KB (quality: ${quality})`);
      
      if (stats.size <= targetSize) {
        console.log(`    ✓ Optimized: ${targetWidth}x${targetHeight}, ${(stats.size / 1024).toFixed(1)}KB`);
        return outputPath;
      }
      
      quality = Math.max(60, quality - 10);

      if (attempt > 1 && stats.size > targetSize) {
        const reductionFactor = 0.9;
        targetWidth = Math.floor(targetWidth * reductionFactor);
        targetHeight = Math.floor(targetHeight * reductionFactor);
        image = image.resize(targetWidth, targetHeight);
        console.log(`    Reducing dimensions to: ${targetWidth}x${targetHeight}`);
      }
    }
    
    const finalStats = fs.statSync(outputPath);
    console.log(`    ⚠ Warning: Final size ${(finalStats.size / 1024).toFixed(1)}KB may exceed limit`);
    return outputPath;
    
  } catch (error) {
    console.error(`    Error preprocessing: ${error.message}`);
    throw error;
  }
}

// Helper: Call OCR.space API
async function callOCRAPI(imagePath) {
  try {
    const formData = new FormData();
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng');
    
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('file', imageBlob, path.basename(imagePath));
    
    formData.append('isTable', 'true');
    formData.append('isOverlayRequired', 'true');
    
    const response = await fetch(OCR_ENDPOINT, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.IsErroredOnProcessing) {
      const errorMessage = result.ErrorMessage?.join(', ') || 'Unknown error';
      throw new Error(`OCR processing failed: ${errorMessage}`);
    }
    
    return result;

  } catch (error) { // This is the corrected line
    console.error(`    Error calling OCR API: ${error.message}`);
    throw error;
  }
}

// Helper: Create optimized OCR JSON
function createOCRJSON(ocrResult, upc) {
  const parsed = ocrResult.ParsedResults?.[0];
  if (!parsed) return null;

  const words = [];
  parsed.TextOverlay?.Lines?.forEach(line => 
      line.Words?.forEach(word => 
          words.push({
              text: word.WordText,
              x: word.Left,
              y: word.Top,
              w: word.Width,
              h: word.Height
          })
      )
  );

  const lines = [];
  parsed.TextOverlay?.Lines?.forEach(line =>
      lines.push({
          text: line.LineText,
          y: line.MinTop,
          h: line.MaxHeight,
          words: line.Words?.length || 0
      })
  );

  return {
    upc: upc,
    timestamp: new Date().toISOString(),
    rawText: parsed.ParsedText,
    words: words,
    lines: lines,
    meta: {
      exitCode: parsed.FileParseExitCode,
      hasError: ocrResult.IsErroredOnProcessing,
      processingTime: ocrResult.ProcessingTimeInMilliseconds
    }
  };
}

// Main function to find and download nutrition label
async function getNutritionLabel(upc, runOCR = false, outputDir) {
  console.log(`\nProcessing UPC: ${upc}`);

  const productData = await getProductMetadata(upc);

  if (!productData || productData.rejectionReason) {
    return { upc, success: false, reason: productData?.rejectionReason || 'no_metadata' };
  }

  const { metadata, nutritionImageUrl } = productData;
  console.log(`  Found image URL: ${nutritionImageUrl}`);

  const validUrl = await checkUrl(nutritionImageUrl);
  if (!validUrl) {
    console.log(`  ✗ Image URL not accessible`);
    return { upc, success: false, reason: 'image_not_accessible' };
  }

  const imagePath = path.join(outputDir, `${upc}_nutrition.jpg`);
  const metadataPath = path.join(outputDir, `${upc}_metadata.json`);
  const ocrPath = path.join(outputDir, `${upc}_ocr.json`);
  
  try {
    await downloadImage(validUrl, imagePath);
    console.log(`  ✓ Downloaded: ${upc}_nutrition.jpg`);
    
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`  ✓ Saved: ${upc}_metadata.json`);
    
    if (runOCR) {
      if (!OCR_API_KEY) {
        console.log(`  ⚠ Skipping OCR: VITE_OCR_API_KEY not set in .env`);
      } else {
        console.log(`  Processing OCR...`);
        const ocrImagePath = path.join(outputDir, `${upc}_nutrition_ocr.jpg`);
        await preprocessImage(imagePath, ocrImagePath);

        const ocrResult = await callOCRAPI(ocrImagePath);
        const ocrData = createOCRJSON(ocrResult, upc);
        if (ocrData) {
          fs.writeFileSync(ocrPath, JSON.stringify(ocrData, null, 2));
          console.log(`  ✓ Saved: ${upc}_ocr.json`);
        }
      }
    }
    
    return { upc, success: true };
    
  } catch (err) {
    console.error(`  ✗ Failed: ${err.message}`);
    return { upc, success: false, reason: err.message };
  }
}

// Delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  let initialUpcs = [];
  const runOCR = args.includes('--ocr');
  const isRandom = args.includes('--random');
  let requestedCount = 0;

  // Parse --folder parameter
  let folderName = 'nutrition_labels';
  if (args.includes('--folder')) {
    const idx = args.indexOf('--folder');
    folderName = args[idx + 1] || 'nutrition_labels';
  }

  const OUTPUT_DIR = path.join(__dirname, folderName);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  }

  if (args.includes('--upcs')) {
    const idx = args.indexOf('--upcs');
    initialUpcs = args[idx + 1].split(',').map(u => u.trim());
  } else if (args.includes('--file')) {
    const idx = args.indexOf('--file');
    const filename = args[idx + 1];
    const content = fs.readFileSync(filename, 'utf-8');
    initialUpcs = content.split('\n').map(u => u.trim()).filter(u => u);
  } else if (isRandom) {
    const idx = args.indexOf('--random');
    requestedCount = parseInt(args[idx + 1], 10) || 100;
  } else {
    console.log('Usage:\n  node script.js --upcs "123,..."\n  node script.js --file upcs.txt\n  node script.js --random 10\n\nOptions:\n  --ocr         Run OCR processing\n  --folder <name>  Output directory (default: nutrition_labels)');
    process.exit(1);
  }
  
  if (runOCR && !OCR_API_KEY) {
    console.log('⚠ Warning: --ocr flag is set, but VITE_OCR_API_KEY not found. OCR will be skipped.\n');
  }

  const allProcessedUpcs = new Set();
  const finalResults = [];
  let successfulCount = 0;
  let upcQueue = [...initialUpcs];

  if (isRandom) {
      console.log(`Fetching an initial batch of ${requestedCount} random UPCs...`);
      const randomUpcs = await getRandomUpcs(requestedCount, allProcessedUpcs);
      upcQueue.push(...randomUpcs);
  }

  while ((isRandom && successfulCount < requestedCount) || (!isRandom && upcQueue.length > 0)) {
      if (upcQueue.length === 0) {
          if (isRandom) {
              console.log("\nQueue is empty. Fetching more UPCs to meet the target...");
              const needed = requestedCount - successfulCount;
              const moreUpcs = await getRandomUpcs(needed, allProcessedUpcs);
              if (moreUpcs.length === 0) {
                  console.log("Could not fetch any more unique UPCs. Ending process.");
                  break;
              }
              upcQueue.push(...moreUpcs);
          } else {
              break; // No more UPCs to process for file/custom list
          }
      }

      const upc = upcQueue.shift();
      if (allProcessedUpcs.has(upc)) continue;

      allProcessedUpcs.add(upc);
      const result = await getNutritionLabel(upc, runOCR, OUTPUT_DIR);
      finalResults.push(result);

      if (result.success) {
          successfulCount++;
      }
      
      await delay(DELAY_MS);
  }
  
  console.log('\n' + '='.repeat(50));
  const totalAttempted = isRandom ? successfulCount + finalResults.filter(r => !r.success).length : initialUpcs.length;
  console.log(`Summary: ${successfulCount} / ${isRandom ? requestedCount : initialUpcs.length} labels successfully downloaded.`);
  console.log(`Total UPCs processed: ${allProcessedUpcs.size}`);
  
  const resultsFile = path.join(OUTPUT_DIR, '_results_summary.json');
  fs.writeFileSync(resultsFile, JSON.stringify(finalResults, null, 2));
  console.log(`Results summary saved to: ${resultsFile}`);
  console.log('='.repeat(50));
}

main().catch((err) => {
  console.error("\nAn unexpected error occurred:", err);
  process.exit(1);
});