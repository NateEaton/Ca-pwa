# Calcium Database Source Data

This folder contains the data processing pipeline used to curate the calcium-rich foods database for the My Calcium Tracker PWA.

## Overview

The project uses USDA Food Data Central (FDC) data to build a curated database of calcium-rich foods. Two approaches were explored:

1. **FDC API approach** (`fdc-curator.cjs`) - Initial attempt using the USDA API
2. **CSV processing approach** (`fdc-csv-curator-abridge.cjs`) - **Primary method used**

**Why CSV over API?** The CSV exports from USDA FDC contain detailed serving size information that isn't available through the API, making them essential for creating a user-friendly food database with realistic portion sizes.

## Data Sources

### Full Datasets (Download Required)
To run the complete processing pipeline, download these files from [USDA Food Data Central](https://fdc.nal.usda.gov/):

1. **Search and download** calcium-containing foods by data type:
   - Foundation Foods
   - SR Legacy Foods  
   - Survey (FNDDS) Foods
   - Branded Foods

2. **Export format**: Choose "CSV" when downloading search results
3. **Nutrient filter**: Calcium (nutrient ID: 1087), minimum 50mg per 100g

### Sample Data (Included)
This repository includes sample files (first 50 rows) of each large dataset:
- `nutrientsearchresults_1087_Branded_sample.csv` (from 39MB original)
- `nutrientsearchresults_1087_SR Legacy_sample.csv` (from 1.7MB original)
- `nutrientsearchresults_1087_Survey (FNDDS)_sample.csv` (from 2.4MB original) 
- `sr_legacy_foundation_download_sample.csv` (from 1.6MB original)
- `nutrientsearchresults_1087_Foundation.csv` (full file, 35KB)

## Processing Pipeline

### 1. Data Collection
```bash
# For API approach (reference only):
node fdc-curator.cjs --min-calcium=50

# For CSV approach (primary method):
# Download CSV exports from USDA FDC website manually
```

### 2. Data Curation
```bash
# Process downloaded CSV files with intelligent serving size selection
node fdc-csv-curator-abridge.cjs input.csv output_name [--options]

# Options:
# --keep-list keep-list.txt     # Force include specific foods
# --exclude-list exclude-list.txt  # Force exclude specific foods  
# --include-collapsed           # Include duplicate consolidation info
# --minimal                     # Minimal output format
```

### 3. Database Merging
```bash
# Merge curated data with existing JavaScript database
node merge-calcium-db.cjs [--minimal] existing-db.js curated.json output.json
```

## Files Description

### Processing Scripts
- **`fdc-curator.cjs`** - API-based data collection (reference implementation)
- **`fdc-csv-curator-abridge.cjs`** - Primary CSV processing with intelligent serving selection
- **`merge-calcium-db.cjs`** - Merges curated data with existing database
- **`get_usda_data.sh`** - Automation wrapper for API approach

### Configuration Files
- **`keep-list.txt`** - Foods to always include despite filters
- **`exclude-list.txt`** - Terms to exclude from results
- **`.env.example`** - Template for FDC API key (if using API approach)

### Data Files
- **`existing-usda-data.js`** - Base JavaScript database format
- **CSV samples** - Representative data samples for testing scripts

## Dependencies

```bash
npm install fs-extra csv-parse dotenv node-fetch
```

## API Setup (Optional)

1. Register for a free API key at [USDA FDC API Guide](https://fdc.nal.usda.gov/api-guide.html)
2. Copy `.env.example` to `.env`  
3. Add your API key: `FDC_API_KEY=your_actual_key`

**Note**: API approach is maintained for reference but CSV processing is recommended.

## Algorithm Details

### Serving Size Intelligence
The CSV curator uses context-aware serving selection:
- **Food categorization**: Liquid, dairy, produce, bakery, meat/fish
- **Unit prioritization**: Category-specific preferred units (cup, slice, oz, etc.)
- **Weight filtering**: Reasonable serving sizes (30g-300g range)
- **Fallback logic**: Systematic preferences when ideal units unavailable

### Data Abridgement  
Reduces dataset size while preserving nutrition value:
- **Brand removal**: Filters commercial brands, keeps staple foods
- **Cooking method collapse**: Consolidates raw/cooked variants (prefers raw)
- **Meat cut simplification**: Reduces redundant cuts, prefers ground meat
- **Preparation filtering**: Removes frozen/canned variants of fresh foods
- **Low-calcium filtering**: Removes foods <50mg calcium when only 100g serving available

## Workflow Summary

1. **Download** full CSV datasets from USDA FDC
2. **Configure** keep/exclude lists as needed
3. **Process** CSV files through curator pipeline
4. **Merge** results with existing database
5. **Update** main application's `foodDatabase.js`

This pipeline transforms raw USDA data into a curated, user-friendly calcium foods database optimized for practical meal planning.