#!/usr/bin/env node
/**
 * Analyze OCR quality directly from ocr_dataset.json
 *
 * Identifies UPCs where the OCR scan quality is too poor to support parsing:
 * 1. No text extracted (empty or very short ParsedText < 20 chars)
 * 2. Missing "calcium" keyword in OCR output
 * 3. Missing "serving" or "size" keywords in OCR output
 *
 * This script runs independently of parse_results.json and analyzes all
 * UPCs in the dataset to identify complete OCR scan failures.
 *
 * Usage:
 *   node analyze_ocr_failures.js
 *   node analyze_ocr_failures.js path/to/ocr_dataset.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_DATASET = path.join(__dirname, 'ocr_dataset.json');
const OUTPUT_FILE = path.join(__dirname, 'ocr_scan_failures.json');

/**
 * Extract all OCR text for a UPC
 */
function getOcrText(entry) {
  if (!entry?.ocr?.original?.ParsedResults) {
    return { text: null, error: 'No ParsedResults' };
  }

  let allText = '';
  for (const result of entry.ocr.original.ParsedResults) {
    allText += (result.ParsedText || '') + ' ';
  }

  const text = allText.trim();
  return { text: text || null, error: text ? null : 'No text extracted' };
}

/**
 * Analyze OCR quality for a single UPC
 * Returns: { isFailure: boolean, reason: string }
 */
function analyzeOcrQuality(entry) {
  const { text, error } = getOcrText(entry);

  if (error || !text) {
    return { isFailure: true, reason: error || 'No text extracted' };
  }

  // Check text length (remove whitespace)
  const cleanText = text.replace(/\s+/g, '');
  if (cleanText.length < 20) {
    return { isFailure: true, reason: 'Text too short (< 20 chars)' };
  }

  // Check for key nutrition label keywords
  const hasCalcium = /calcium/i.test(text);
  const hasServing = /serving|size/i.test(text);

  if (!hasCalcium && !hasServing) {
    return { isFailure: true, reason: 'No calcium or serving keywords' };
  }
  if (!hasCalcium) {
    return { isFailure: true, reason: 'Missing calcium keyword' };
  }
  if (!hasServing) {
    return { isFailure: true, reason: 'Missing serving keyword' };
  }

  return { isFailure: false, reason: 'Parseable (has both keywords)' };
}

/**
 * Main analysis function
 */
async function analyzeDataset(datasetPath) {
  console.log('='.repeat(80));
  console.log('OCR SCAN QUALITY ANALYSIS');
  console.log('='.repeat(80));
  console.log(`\nDataset: ${path.basename(datasetPath)}`);

  // Load dataset
  const content = await fs.readFile(datasetPath, 'utf-8');
  const dataset = JSON.parse(content);

  const datasetVersion = dataset.metadata?.version || 'v1.0';
  const allUpcs = Object.keys(dataset.data).sort();
  const total = allUpcs.length;

  console.log(`Dataset version: ${datasetVersion}`);
  console.log(`Total UPCs: ${total}\n`);

  // Analyze all UPCs
  const failures = [];
  const parseable = [];
  const failureReasons = {};

  for (const upc of allUpcs) {
    const entry = dataset.data[upc];
    const analysis = analyzeOcrQuality(entry);

    if (analysis.isFailure) {
      failures.push(upc);
      failureReasons[analysis.reason] = failureReasons[analysis.reason] || [];
      failureReasons[analysis.reason].push(upc);
    } else {
      parseable.push(upc);
    }
  }

  // Display results
  console.log('-'.repeat(80));
  console.log('COMPLETE OCR SCAN FAILURES');
  console.log('-'.repeat(80));
  console.log(`\nTotal: ${failures.length} (${(failures.length/total*100).toFixed(1)}%)`);

  console.log(`\nBreakdown by failure reason:`);
  const sortedReasons = Object.entries(failureReasons)
    .sort((a, b) => b[1].length - a[1].length);

  for (const [reason, upcs] of sortedReasons) {
    console.log(`  ${reason}: ${upcs.length}`);
  }

  console.log('\n' + '-'.repeat(80));
  console.log('PARSEABLE UPCS (usable OCR data)');
  console.log('-'.repeat(80));
  console.log(`\nTotal: ${parseable.length} (${(parseable.length/total*100).toFixed(1)}%)`);

  // Generate versioned output
  const timestamp = new Date().toISOString();

  // Load existing exclusion file to preserve other versions
  let existingData = { datasets: {} };
  try {
    const existingContent = await fs.readFile(OUTPUT_FILE, 'utf-8');
    existingData = JSON.parse(existingContent);
  } catch (error) {
    // File doesn't exist yet, will create new
  }

  // Update this version's data
  existingData.datasets = existingData.datasets || {};
  existingData.datasets[datasetVersion] = {
    metadata: {
      generated: timestamp,
      dataset_file: path.basename(datasetPath),
      total_upcs: total,
      total_failures: failures.length,
      failure_rate: (failures.length/total*100).toFixed(1),
      parseable_upcs: parseable.length,
      parseable_rate: (parseable.length/total*100).toFixed(1)
    },
    failure_breakdown: Object.fromEntries(
      Object.entries(failureReasons).map(([reason, upcs]) => [reason, upcs.length])
    ),
    excluded_upcs: failures
  };

  // Save updated file
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(existingData, null, 2));

  console.log('\n' + '='.repeat(80));
  console.log('OUTPUT');
  console.log('='.repeat(80));
  console.log(`\nExclusion file updated: ${path.basename(OUTPUT_FILE)}`);
  console.log(`Dataset version: ${datasetVersion}`);
  console.log(`Excluded UPCs: ${failures.length}`);
  console.log(`Parseable UPCs: ${parseable.length}`);
  console.log('\nThis exclusion list can be used by run_tests.ts to filter out');
  console.log('UPCs with poor OCR quality before parser testing.');
  console.log('='.repeat(80));

  return {
    total,
    failures: failures.length,
    parseable: parseable.length,
    failureRate: (failures.length/total*100).toFixed(1)
  };
}

// Main execution
async function main() {
  const datasetPath = process.argv[2] || DEFAULT_DATASET;

  try {
    const stats = await analyzeDataset(datasetPath);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
