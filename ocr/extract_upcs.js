#!/usr/bin/env node
// ocr/extract_upcs.js - Extract subset of UPCs from full dataset
// Usage: node extract_upcs.js upc_list.txt > subset.json
//   or:  node extract_upcs.js 0012345678901 0023456789012 > subset.json

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_FILE = path.join(__dirname, 'ocr_dataset.json');

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    console.error('Usage: node extract_upcs.js <upc_list_file>');
    console.error('   or: node extract_upcs.js <upc1> <upc2> ...');
    console.error('');
    console.error('Examples:');
    console.error(`  node extract_upcs.js upcs_to_review.txt > missing_calcium_${today}.json`);
    console.error(`  node extract_upcs.js 0012345678901 0023456789012 > subset_${today}.json`);
    console.error('');
    console.error('Recommended naming: {purpose}_{YYYYMMDD}.json');
    console.error('  - Purpose: missing_calcium, high_conf_failures, parenthetical, etc.');
    console.error('  - Date: YYYYMMDD format for chronological sorting');
    console.error('');
    console.error('UPC list file format: one UPC per line');
    process.exit(1);
  }
  
  // Load full dataset
  console.error('Loading full dataset...');
  const datasetContent = await fs.readFile(DATASET_FILE, 'utf-8');
  const fullDataset = JSON.parse(datasetContent);
  
  // Get UPC list
  let upcList = [];
  
  // Check if first arg is a file
  const firstArg = args[0];
  try {
    const fileContent = await fs.readFile(firstArg, 'utf-8');
    // File exists - parse UPCs from file (one per line)
    upcList = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'));
    console.error(`Loaded ${upcList.length} UPCs from file: ${firstArg}`);
  } catch {
    // Not a file - treat all args as UPCs
    upcList = args;
    console.error(`Using ${upcList.length} UPCs from command line arguments`);
  }
  
  // Extract subset with priority sorting
  const extracted = {
    metadata: {
      ...fullDataset.metadata,
      extracted_at: new Date().toISOString(),
      total_upcs: upcList.length,
      source_dataset: DATASET_FILE,
      note: 'Subset extracted for targeted analysis'
    },
    data: {}
  };

  const found = [];
  const missing = [];
  const bySource = {};
  const byPriority = {};

  // Define priority order (high > medium > normal)
  const priorityOrder = { high: 1, medium: 2, normal: 3 };

  for (const upc of upcList) {
    if (fullDataset.data[upc]) {
      const entry = fullDataset.data[upc];
      extracted.data[upc] = entry;
      found.push({ upc, entry });

      // Track source and priority breakdown
      const source = entry.source || 'unknown';
      const priority = entry.priority || 'unknown';

      bySource[source] = (bySource[source] || 0) + 1;
      byPriority[priority] = (byPriority[priority] || 0) + 1;
    } else {
      missing.push(upc);
    }
  }

  // Sort found UPCs by priority (high → medium → normal), then by UPC
  found.sort((a, b) => {
    const priorityA = priorityOrder[a.entry.priority] || 999;
    const priorityB = priorityOrder[b.entry.priority] || 999;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return a.upc.localeCompare(b.upc);
  });

  // Update metadata with extraction statistics
  extracted.metadata.sources_breakdown = bySource;
  extracted.metadata.priority_breakdown = byPriority;
  
  // Report to stderr with source and priority breakdown
  console.error(`\nExtraction complete:`);
  console.error(`  Found:   ${found.length} UPCs`);
  console.error(`  Missing: ${missing.length} UPCs`);

  // Source breakdown
  if (Object.keys(bySource).length > 0) {
    console.error(`\nBy Source:`);
    for (const [source, count] of Object.entries(bySource).sort((a, b) => b[1] - a[1])) {
      const pct = ((count / found.length) * 100).toFixed(1);
      console.error(`  ${source.padEnd(15)} ${count.toString().padStart(3)} (${pct}%)`);
    }
  }

  // Priority breakdown
  if (Object.keys(byPriority).length > 0) {
    console.error(`\nBy Priority:`);
    // Sort by priority order
    const priorityEntries = Object.entries(byPriority).sort((a, b) => {
      const orderA = priorityOrder[a[0]] || 999;
      const orderB = priorityOrder[b[0]] || 999;
      return orderA - orderB;
    });

    for (const [priority, count] of priorityEntries) {
      const pct = ((count / found.length) * 100).toFixed(1);
      const icon = priority === 'high' ? '⭐' : priority === 'medium' ? '◆' : '○';
      console.error(`  ${icon} ${priority.padEnd(10)} ${count.toString().padStart(3)} (${pct}%)`);
    }
  }

  if (missing.length > 0) {
    console.error(`\nMissing UPCs:`);
    missing.forEach(upc => console.error(`  - ${upc}`));
  }
  
  // Calculate output size
  const jsonOutput = JSON.stringify(extracted, null, 2);
  const sizeMB = (jsonOutput.length / (1024 * 1024)).toFixed(2);
  console.error(`\nOutput size: ${sizeMB} MB`);
  console.error(`Writing JSON to stdout...\n`);
  
  // Write to stdout
  console.log(jsonOutput);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
