// ocr/run_tests.ts - Enhanced test harness with error pattern detection

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { OCRService } from '../src/lib/services/OCRService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_FILE = path.join(__dirname, 'ocr_dataset.json');
const EXCLUSION_FILE = path.join(__dirname, 'ocr_scan_failures.txt');

// Type definitions for FULL API format
interface OCRApiResponse {
  ParsedResults: Array<{
    ParsedText: string;
    ErrorMessage: string;
    ErrorDetails: string;
    TextOverlay?: {
      HasOverlay: boolean;
      Lines: Array<{
        LineText: string;
        MinTop: number;
        MaxHeight: number;
        Words: Array<{
          WordText: string;
          Left: number;
          Top: number;
          Width: number;
          Height: number;
        }>;
      }>;
    };
  }>;
  IsErroredOnProcessing: boolean;
}

interface GroundTruth {
  product_name?: string;
  brands?: string;
  serving_size: string | null;
  calcium_per_serving: number | null;
  calcium_per_100g?: number | null;
  calcium_unit: string | null;
}

interface DatasetEntry {
  groundTruth: GroundTruth;
  ocr: {
    original: OCRApiResponse;
  };
}

interface Dataset {
  metadata: {
    generated: string;
    total_upcs: number;
    format?: string;
    description?: string;
  };
  data: {
    [upc: string]: DatasetEntry;
  };
}

interface ParsedResult {
  servingQuantity: number | null;
  servingMeasure: string | null;
  standardMeasureValue: number | null;
  standardMeasureUnit: string | null;
  calcium: number | null;
  confidence: 'low' | 'medium' | 'high';
  servingSize?: string;
  calciumValue?: number;
}

interface ValidationResult {
  serving: boolean;
  calcium: boolean;
}

interface ErrorPattern {
  count: number;
  upcs: string[];
  examples: string[];
}

interface ErrorPatterns {
  serving_parse_failures: {
    fraction_recognition: ErrorPattern;
    unit_extraction: ErrorPattern;
    multi_word_measures: ErrorPattern;
    missing_quantity: ErrorPattern;
    missing_measure: ErrorPattern;
    parenthetical_format: ErrorPattern;
  };
  calcium_parse_failures: {
    percent_only_no_mg: ErrorPattern;
    inline_format: ErrorPattern;
    missing_calcium: ErrorPattern;
    percent_dv_confusion: ErrorPattern;
    unit_confusion: ErrorPattern;
  };
}

// Parse OCR data using OCRService
async function parseOCRData(
  ocrData: OCRApiResponse,
  upc: string
): Promise<ParsedResult | null> {
  const ocrService = new OCRService('MOCK_KEY');

  try {
    // Use parseFromFullAPIResponse to maintain data fidelity
    // This method uses the complete API response with pre-grouped Lines
    // matching the exact data flow used by the live app
    const result = ocrService.parseFromFullAPIResponse(ocrData);

    return result;
  } catch (error) {
    console.error(`    Parse error for ${upc}:`, (error as Error).message);
    return null;
  }
}

// Validate parsed results against ground truth
function validateResults(
  parsed: ParsedResult | null,
  groundTruth: GroundTruth
): ValidationResult {
  const validation: ValidationResult = {
    serving: false,
    calcium: false
  };
  
  if (!parsed || !groundTruth) return validation;
  
  // SERVING VALIDATION
  if (parsed.servingQuantity && parsed.servingMeasure && groundTruth.serving_size) {
    const servingStr = groundTruth.serving_size.toLowerCase();
    
    const truthQtyMatch = servingStr.match(
      /([\d\.\/\s]+)\s*(cup|tbsp|tsp|bottle|slice|oz|g|ml|bar|package|packet|crackers|chips|portion|container)/
    );
    
    if (truthQtyMatch) {
      const truthQtyStr = truthQtyMatch[1].trim();
      
      let truthQty = parseFloat(truthQtyStr);
      if (truthQtyStr.includes('/')) {
        const parts = truthQtyStr.split('/');
        if (parts.length === 2) {
          truthQty = parseFloat(parts[0]) / parseFloat(parts[1]);
        }
      }
      
      const tolerance = 0.01;
      const quantityMatch = Math.abs(parsed.servingQuantity - truthQty) <= tolerance;
      const measureMatch = servingStr.includes(parsed.servingMeasure.toLowerCase());
      validation.serving = quantityMatch && measureMatch;
    }
  }
  
  // CALCIUM VALIDATION
  if (parsed.calcium !== null && groundTruth.calcium_per_serving !== null) {
    let truthMg: number;
    const value = groundTruth.calcium_per_serving;
    const unit = groundTruth.calcium_unit;
    
    if (unit === 'mg' && value < 0.1) {
      truthMg = value * 1000;
    } else if (unit === 'g' || unit === 'G') {
      truthMg = value * 1000;
    } else {
      truthMg = value;
    }
    
    const tolerance = Math.max(1, truthMg * 0.15);
    const diff = Math.abs(parsed.calcium - truthMg);
    validation.calcium = diff <= tolerance;
  }
  
  return validation;
}

// Detect error patterns
function detectErrorPatterns(
  upc: string,
  parsed: ParsedResult | null,
  validation: ValidationResult,
  groundTruth: GroundTruth,
  rawText: string,
  patterns: ErrorPatterns
): void {
  const serving = groundTruth.serving_size?.toLowerCase() || '';
  const calciumText = rawText.toLowerCase();
  
  // SERVING ERROR PATTERNS
  if (!validation.serving && groundTruth.serving_size) {
    // Fraction recognition issues
    if (serving.match(/\d+\/\d+/) && !parsed?.servingQuantity) {
      patterns.serving_parse_failures.fraction_recognition.count++;
      patterns.serving_parse_failures.fraction_recognition.upcs.push(upc);
      if (patterns.serving_parse_failures.fraction_recognition.examples.length < 3) {
        patterns.serving_parse_failures.fraction_recognition.examples.push(
          `${upc}: "${groundTruth.serving_size}"`
        );
      }
    }
    
    // Unit extraction failures
    if (parsed?.servingQuantity && !parsed?.servingMeasure) {
      patterns.serving_parse_failures.unit_extraction.count++;
      patterns.serving_parse_failures.unit_extraction.upcs.push(upc);
      if (patterns.serving_parse_failures.unit_extraction.examples.length < 3) {
        patterns.serving_parse_failures.unit_extraction.examples.push(
          `${upc}: "${groundTruth.serving_size}" → qty=${parsed.servingQuantity}`
        );
      }
    }
    
    // Multi-word measure units
    if (serving.match(/(tbsp|tsp|bottle|slice|package|packet|crackers|container)/)) {
      patterns.serving_parse_failures.multi_word_measures.count++;
      patterns.serving_parse_failures.multi_word_measures.upcs.push(upc);
      if (patterns.serving_parse_failures.multi_word_measures.examples.length < 3) {
        patterns.serving_parse_failures.multi_word_measures.examples.push(
          `${upc}: "${groundTruth.serving_size}"`
        );
      }
    }
    
    // Missing quantity
    if (!parsed?.servingQuantity && parsed?.servingMeasure) {
      patterns.serving_parse_failures.missing_quantity.count++;
      patterns.serving_parse_failures.missing_quantity.upcs.push(upc);
      if (patterns.serving_parse_failures.missing_quantity.examples.length < 3) {
        patterns.serving_parse_failures.missing_quantity.examples.push(
          `${upc}: "${groundTruth.serving_size}" → measure=${parsed.servingMeasure}`
        );
      }
    }
    
    // Missing measure
    if (parsed?.servingQuantity && !parsed?.servingMeasure) {
      patterns.serving_parse_failures.missing_measure.count++;
      patterns.serving_parse_failures.missing_measure.upcs.push(upc);
      if (patterns.serving_parse_failures.missing_measure.examples.length < 3) {
        patterns.serving_parse_failures.missing_measure.examples.push(
          `${upc}: "${groundTruth.serving_size}" → qty=${parsed.servingQuantity}`
        );
      }
    }
    
    // Parenthetical format (e.g., "1 cup (240mL)")
    if (serving.match(/\([^)]+\)/)) {
      patterns.serving_parse_failures.parenthetical_format.count++;
      patterns.serving_parse_failures.parenthetical_format.upcs.push(upc);
      if (patterns.serving_parse_failures.parenthetical_format.examples.length < 3) {
        patterns.serving_parse_failures.parenthetical_format.examples.push(
          `${upc}: "${groundTruth.serving_size}"`
        );
      }
    }
  }
  
  // CALCIUM ERROR PATTERNS
  if (!validation.calcium && groundTruth.calcium_per_serving !== null) {
    // Percent only, no mg value
    if (calciumText.match(/calcium\s*\d+%/) && !calciumText.match(/calcium\s*\d+\s*mg/i)) {
      patterns.calcium_parse_failures.percent_only_no_mg.count++;
      patterns.calcium_parse_failures.percent_only_no_mg.upcs.push(upc);
      if (patterns.calcium_parse_failures.percent_only_no_mg.examples.length < 3) {
        const match = calciumText.match(/calcium[^\n]{0,30}/i);
        patterns.calcium_parse_failures.percent_only_no_mg.examples.push(
          `${upc}: "${match?.[0] || 'n/a'}"`
        );
      }
    }
    
    // Inline format (e.g., "Calcium 450mg 35%")
    if (calciumText.match(/calcium\s*\d+mg\s*\d+%/i)) {
      patterns.calcium_parse_failures.inline_format.count++;
      patterns.calcium_parse_failures.inline_format.upcs.push(upc);
      if (patterns.calcium_parse_failures.inline_format.examples.length < 3) {
        const match = calciumText.match(/calcium[^\n]{0,40}/i);
        patterns.calcium_parse_failures.inline_format.examples.push(
          `${upc}: "${match?.[0] || 'n/a'}"`
        );
      }
    }
    
    // Missing calcium entirely
    if (!calciumText.match(/calcium/i)) {
      patterns.calcium_parse_failures.missing_calcium.count++;
      patterns.calcium_parse_failures.missing_calcium.upcs.push(upc);
      if (patterns.calcium_parse_failures.missing_calcium.examples.length < 3) {
        patterns.calcium_parse_failures.missing_calcium.examples.push(
          `${upc}: No "calcium" found in OCR text`
        );
      }
    }
    
    // Percent DV confusion
    if (!parsed?.calcium && calciumText.match(/calcium.*(\d+)%/i)) {
      patterns.calcium_parse_failures.percent_dv_confusion.count++;
      patterns.calcium_parse_failures.percent_dv_confusion.upcs.push(upc);
      if (patterns.calcium_parse_failures.percent_dv_confusion.examples.length < 3) {
        const match = calciumText.match(/calcium[^\n]{0,40}/i);
        patterns.calcium_parse_failures.percent_dv_confusion.examples.push(
          `${upc}: "${match?.[0] || 'n/a'}"`
        );
      }
    }
    
    // Unit confusion (mcg, IU, etc.)
    if (calciumText.match(/calcium.*\d+\s*(mcg|iu|µg)/i)) {
      patterns.calcium_parse_failures.unit_confusion.count++;
      patterns.calcium_parse_failures.unit_confusion.upcs.push(upc);
      if (patterns.calcium_parse_failures.unit_confusion.examples.length < 3) {
        const match = calciumText.match(/calcium[^\n]{0,40}/i);
        patterns.calcium_parse_failures.unit_confusion.examples.push(
          `${upc}: "${match?.[0] || 'n/a'}"`
        );
      }
    }
  }
}

// Initialize error patterns
function initErrorPatterns(): ErrorPatterns {
  const createPattern = (): ErrorPattern => ({ count: 0, upcs: [], examples: [] });
  
  return {
    serving_parse_failures: {
      fraction_recognition: createPattern(),
      unit_extraction: createPattern(),
      multi_word_measures: createPattern(),
      missing_quantity: createPattern(),
      missing_measure: createPattern(),
      parenthetical_format: createPattern()
    },
    calcium_parse_failures: {
      percent_only_no_mg: createPattern(),
      inline_format: createPattern(),
      missing_calcium: createPattern(),
      percent_dv_confusion: createPattern(),
      unit_confusion: createPattern()
    }
  };
}

// Extract lean parsed result
function extractLeanParsed(parsed: ParsedResult | null): ParsedResult | null {
  if (!parsed) return null;
  
  return {
    servingQuantity: parsed.servingQuantity,
    servingMeasure: parsed.servingMeasure,
    standardMeasureValue: parsed.standardMeasureValue,
    standardMeasureUnit: parsed.standardMeasureUnit,
    calcium: parsed.calcium,
    confidence: parsed.confidence,
    servingSize: parsed.servingSize,
    calciumValue: parsed.calciumValue
  };
}

// Update field accuracy
function updateFieldAccuracy(
  fieldAccuracy: any,
  parsed: ParsedResult | null,
  validation: ValidationResult,
  groundTruth: GroundTruth
): void {
  // Serving Quantity
  if (!parsed?.servingQuantity) {
    fieldAccuracy.serving_quantity.missing++;
  } else if (validation?.serving) {
    fieldAccuracy.serving_quantity.correct++;
  } else {
    fieldAccuracy.serving_quantity.incorrect++;
  }
  
  // Serving Measure
  if (!parsed?.servingMeasure) {
    fieldAccuracy.serving_measure.missing++;
  } else if (validation?.serving) {
    fieldAccuracy.serving_measure.correct++;
  } else {
    fieldAccuracy.serving_measure.incorrect++;
  }
  
  // Standard Measure
  if (!parsed?.standardMeasureValue) {
    fieldAccuracy.standard_measure.missing++;
  } else if (
    groundTruth?.serving_size &&
    groundTruth.serving_size.includes(String(parsed.standardMeasureValue))
  ) {
    fieldAccuracy.standard_measure.correct++;
  } else {
    fieldAccuracy.standard_measure.incorrect++;
  }
  
  // Calcium
  if (!parsed?.calcium) {
    fieldAccuracy.calcium.missing++;
  } else if (validation?.calcium) {
    fieldAccuracy.calcium.correct++;
  } else {
    fieldAccuracy.calcium.incorrect++;
  }
}

/**
 * Gets parser version identifier (last 8 chars of build ID)
 * Format matches app build ID from vite.config.js
 */
function getParserVersion(): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-T:.]/g, '')
    .slice(0, 14);

  try {
    const gitHash = execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
    }).trim();

    const status = execSync('git status --porcelain', {
      encoding: 'utf8',
    }).trim();
    const isDirty = status.length > 0;

    const buildId = `${gitHash}${isDirty ? '-dirty' : ''}-${timestamp}`;
    return buildId.slice(-8);
  } catch (error) {
    return timestamp.slice(-8);
  }
}

/**
 * Gets dataset version from metadata
 */
function getDatasetVersion(dataset: Dataset): string {
  return dataset.metadata.version || 'v1.0';
}

/**
 * Generates output filename based on parser and dataset versions
 */
function getOutputFilename(parserVersion: string, datasetVersion: string): string {
  return path.join(__dirname, `parse_results_${parserVersion}_${datasetVersion}.json`);
}

async function loadExclusionList(): Promise<Set<string>> {
  const exclusions = new Set<string>();

  try {
    const content = await fs.readFile(EXCLUSION_FILE, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      // Skip empty lines and comments
      if (trimmed && !trimmed.startsWith('#')) {
        exclusions.add(trimmed);
      }
    }

    console.log(`Loaded ${exclusions.size} UPCs from exclusion list`);
  } catch (error) {
    console.log('No exclusion list found - processing all UPCs');
  }

  return exclusions;
}

async function main() {
  console.log('='.repeat(60));
  console.log('OCR Parse Test (Full API Format with Error Patterns)');
  console.log('='.repeat(60));

  // Load dataset
  console.log('\nLoading dataset...');
  const datasetContent = await fs.readFile(DATASET_FILE, 'utf-8');
  const dataset: Dataset = JSON.parse(datasetContent);

  // Get version identifiers
  const parserVersion = getParserVersion();
  const datasetVersion = getDatasetVersion(dataset);
  const outputFile = getOutputFilename(parserVersion, datasetVersion);

  // Load exclusion list
  const excludedUpcs = await loadExclusionList();

  const allUpcs = Object.keys(dataset.data).sort();
  const upcs = allUpcs.filter(upc => !excludedUpcs.has(upc));
  const totalUpcs = upcs.length;
  const excludedCount = excludedUpcs.size;

  console.log(`Found ${allUpcs.length} UPCs in dataset`);
  console.log(`Dataset version: ${datasetVersion}`);
  console.log(`Parser version: ${parserVersion}`);
  console.log(`OCR scan failures (excluded): ${excludedCount}`);
  console.log(`Testable UPCs: ${totalUpcs}`);
  console.log(`Format: ${dataset.metadata.format || 'unknown'}`);
  console.log(`Output file: ${path.basename(outputFile)}\n`);
  
  // Initialize results with error patterns
  const errorPatterns = initErrorPatterns();
  
  const results = {
    run_metadata: {
      timestamp: new Date().toISOString(),
      parser_version: parserVersion,
      dataset_version: datasetVersion,
      dataset_file: path.basename(DATASET_FILE),
      output_file: path.basename(outputFile),
      total_upcs: totalUpcs,
      excluded_upcs: excludedCount,
      dataset_total: allUpcs.length,
      test_mode: 'typescript',
      dataset_format: dataset.metadata.format || 'full_api_response'
    },
    summary: {
      confidence: { high: 0, medium: 0, low: 0 },
      field_accuracy: {
        serving_quantity: { correct: 0, incorrect: 0, missing: 0, percentage: '0.0' },
        serving_measure: { correct: 0, incorrect: 0, missing: 0, percentage: '0.0' },
        standard_measure: { correct: 0, incorrect: 0, missing: 0, percentage: '0.0' },
        calcium: { correct: 0, incorrect: 0, missing: 0, percentage: '0.0' }
      },
      error_patterns: errorPatterns
    },
    results: {} as Record<string, any>
  };
  
  let processed = 0;
  
  for (const upc of upcs) {
    processed++;
    console.log(`[${processed}/${totalUpcs}] Processing UPC: ${upc}`);
    
    const entry = dataset.data[upc];
    const groundTruth = entry.groundTruth;
    const rawText = entry.ocr.original.ParsedResults?.[0]?.ParsedText || '';
    
    // Parse original OCR
    console.log('  → Parsing OCR...');
    const parsed = await parseOCRData(entry.ocr.original, upc);
    const validation = validateResults(parsed, groundTruth);
    
    // Update statistics
    if (parsed) {
      results.summary.confidence[parsed.confidence]++;
    }
    
    // Field accuracy
    updateFieldAccuracy(
      results.summary.field_accuracy,
      parsed,
      validation,
      groundTruth
    );
    
    // Detect error patterns
    detectErrorPatterns(
      upc,
      parsed,
      validation,
      groundTruth,
      rawText,
      errorPatterns
    );
    
    // Store lean results
    results.results[upc] = {
      groundTruth,
      parsed: extractLeanParsed(parsed),
      validation
    };
    
    console.log(`  ✓ Confidence: ${parsed?.confidence || 'failed'}\n`);
  }
  
  // Calculate percentages
  const accuracy = results.summary.field_accuracy;
  for (const field of Object.keys(accuracy)) {
    const fieldData = accuracy[field as keyof typeof accuracy];
    const total = fieldData.correct + fieldData.incorrect + fieldData.missing;
    (fieldData as any).percentage = 
      total > 0 ? ((fieldData.correct / total) * 100).toFixed(1) : '0.0';
  }
  
  // Save results
  await fs.writeFile(outputFile, JSON.stringify(results, null, 2));

  const outputStats = await fs.stat(outputFile);
  const outputSizeMB = (outputStats.size / (1024 * 1024)).toFixed(2);
  
  // Display summary
  console.log('='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  console.log(`\nDataset Overview:`);
  console.log(`  Total UPCs in dataset: ${allUpcs.length}`);
  console.log(`  OCR scan failures (excluded): ${excludedCount}`);
  console.log(`  Testable UPCs: ${totalUpcs}`);

  const highMedium = results.summary.confidence.high + results.summary.confidence.medium;

  console.log(`\nConfidence Distribution (of testable):`);
  console.log(`  High:   ${results.summary.confidence.high} (${((results.summary.confidence.high/totalUpcs)*100).toFixed(1)}%)`);
  console.log(`  Medium: ${results.summary.confidence.medium} (${((results.summary.confidence.medium/totalUpcs)*100).toFixed(1)}%)`);
  console.log(`  Low:    ${results.summary.confidence.low} (${((results.summary.confidence.low/totalUpcs)*100).toFixed(1)}%)`);
  console.log(`  High + Medium: ${highMedium} (${((highMedium/totalUpcs)*100).toFixed(1)}%)`);

  console.log(`\nField Accuracy:`);
  console.log(`  Serving Quantity: ${accuracy.serving_quantity.correct}/${totalUpcs} (${accuracy.serving_quantity.percentage}%)`);
  console.log(`  Serving Measure:  ${accuracy.serving_measure.correct}/${totalUpcs} (${accuracy.serving_measure.percentage}%)`);
  console.log(`  Standard Measure: ${accuracy.standard_measure.correct}/${totalUpcs} (${accuracy.standard_measure.percentage}%)`);
  console.log(`  Calcium:          ${accuracy.calcium.correct}/${totalUpcs} (${accuracy.calcium.percentage}%)`);
  
  console.log(`\nTop Error Patterns:`);
  
  // Serving errors
  const servingErrors = Object.entries(errorPatterns.serving_parse_failures)
    .filter(([_, p]) => p.count > 0)
    .sort((a, b) => b[1].count - a[1].count);
  
  if (servingErrors.length > 0) {
    console.log(`\n  Serving Parse Failures:`);
    servingErrors.forEach(([name, pattern]) => {
      console.log(`    ${name}: ${pattern.count} UPCs`);
    });
  }
  
  // Calcium errors
  const calciumErrors = Object.entries(errorPatterns.calcium_parse_failures)
    .filter(([_, p]) => p.count > 0)
    .sort((a, b) => b[1].count - a[1].count);
  
  if (calciumErrors.length > 0) {
    console.log(`\n  Calcium Parse Failures:`);
    calciumErrors.forEach(([name, pattern]) => {
      console.log(`    ${name}: ${pattern.count} UPCs`);
    });
  }
  
  console.log(`\nOutput: ${path.basename(outputFile)} (${outputSizeMB} MB)`);
  console.log('='.repeat(60));
  console.log(`\nResults saved to: ${path.basename(outputFile)}`);
  console.log(`Parser version: ${parserVersion}`);
  console.log(`Dataset version: ${datasetVersion}`);
  console.log('\nError pattern details and UPC lists are in the results file');
  console.log('Use extract_upcs.js to extract specific UPC subsets for analysis');
  console.log('='.repeat(60));
}

main().catch(console.error);