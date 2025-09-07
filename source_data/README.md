# Calcium Database Source Data

This folder contains the data processing pipeline used to curate the calcium-rich foods database for the My Calcium Tracker PWA.

## Overview

The project uses USDA Food Data Central (FDC) data to build a curated, size-optimized database of calcium-rich foods. The current database includes Foundation Foods, SR Legacy Foods, and additional foods parsed from USDA publications. The pipeline processes this data through multiple stages to create both an optimized app database and comprehensive public documentation with stable `appId` management.

An older API-based approach exists for reference but is not used in the main workflow since CSV downloads contain detailed serving size information whereas the API data only provides calcium per 100g values.

## Data Sources

The current database is built from multiple USDA sources:
- **Foundation Foods** (CSV format)
- **SR Legacy Foods** (CSV format)  
- **Additional foods** parsed from USDA abridged publication PDFs

For new database updates, download the Foundation Foods and SR Legacy Foods datasets from the [USDA Food Data Central Download Page](https://fdc.nal.usda.gov/download-datasets.html) as primary input sources.

### Sample Data (Included)
This repository includes sample files for testing the scripts:
- `sr_legacy_foundation_download_sample.csv` - Combined sample of the main data sources

## Detailed End-to-End Workflow

Follow these steps to process raw USDA data into an updated application database with stable appIds.

### Step 0: Prerequisites

1.  Ensure you have Node.js installed.
2.  Navigate to this `source_data` folder in your terminal.
3.  Install the necessary dependencies:
    ```bash
    npm install fs-extra csv-parse
    ```

### Step 1: Data Acquisition and Preparation

1.  **Download Data:** Download Foundation Foods and SR Legacy Foods datasets in CSV format from the USDA FDC website.
2.  **Combine CSVs:** Merge the datasets into a single input file.

    *For macOS or Linux:*
    ```bash
    # This merges the two files and removes duplicate headers
    cat "Foundation_Foods.csv" "SR_Legacy_Foods.csv" | grep -v '"Data Type"' > combined_input.csv
    ```
    *For Windows:*
    ```bash
    # Use type command to combine files
    type "Foundation_Foods.csv" "SR_Legacy_Foods.csv" | findstr /v /c:"\"Data Type\"" > combined_input.csv
    ```

### Step 2: Stable appId Assignment

Assign stable `appId`s to ensure consistent food references across database updates.

1.  **Review Configuration:** Edit `usda-fdc-config.json` to configure data source metadata and processing parameters.

2.  **Run the Key Assignment Script:** Process the combined data to assign stable appIds.

    ```bash
    node master-key-assigner.cjs combined_input.csv mastered-data --config usda-fdc-config.json
    ```

    **Command Options:**
    - `--config <file>`: Configuration file with source metadata and processing rules
    - `--map-file <file>`: Existing appId mapping file to preserve stable IDs across updates
    - `--output-map <file>`: Output updated mapping file for future runs

3.  **Output Generated:**
    - **`mastered-data.json`**: Combined data with stable appIds assigned (`{metadata, foods}` structure)
    - **`appid-mapping.json`**: Updated mapping file for future database updates

### Step 3: Data Curation

Process the mastered data to create curated, filtered datasets.

1.  **Review Configuration:** Edit filtering lists:
    - `keep-list.txt`: Foods to protect from filtering (always included)
    - `exclude-list.txt`: Terms to exclude from the dataset

2.  **Run the Curation Script:** Process the mastered data to create curated output.

    ```bash
    node food-curator.cjs mastered-data.json curated-data
    ```

    **Command Options:**
    - `--keep-list <file>` or `--keep <file>`: File with foods to always include
    - `--exclude-list <file>` or `--exclude <file>`: File with terms to exclude

3.  **Output Generated:**
    - **`curated-data-abridged.json`**: Size-optimized data for app use (`{metadata, foods}` structure)
    - **`curated-data-full.json`**: Complete data with full metadata for documentation

### Step 4: Generate Application Module

Convert the curated database into an optimized JavaScript module for the application.

1.  **Generate App Module:** Create the production-ready module with optimization options.

    ```bash
    node data-module-generator.cjs curated-data-abridged.json foodDatabaseData.js --module --minify --minimal
    ```

    **Command Options:**
    - `--module`: Generate JavaScript module exports instead of JSON array
    - `--minify`: Compress object keys for smaller bundle size  
    - `--minimal`: Strip non-essential metadata for production

2.  **Output Generated:** 
    - **`foodDatabaseData.js`**: Production JavaScript module automatically loaded by the application

### Step 5: Generate Documentation (Optional)

Create comprehensive HTML documentation showing the complete food database with source traceability.

```bash
node html-docs-generator.cjs curated-data-abridged.json static/database-docs.html
```

**Output Generated:**
- **`static/database-docs.html`**: Complete HTML documentation
- **`static/database-docs.css`**: Styling for the documentation (included in repository)

**Documentation Features:**
- Complete list of all foods in the database with stable appIds
- Source information and direct links to USDA FDC database entries
- Hierarchical view showing which foods were collapsed together
- Deep-linking support for individual foods (`#food-{appId}`)
- Search functionality and responsive design

### Step 6: Integration and Deployment

The generated files are automatically integrated into the application:

1.  **App Integration:** The `foodDatabase.js` module automatically detects and loads `foodDatabaseData.js`
2.  **Documentation Deployment:** The HTML documentation is deployed to `/database-docs.html` 
3.  **No Manual Steps:** All existing services continue to work unchanged

## Data Migration Utility

For migrating user backup files from old database versions to the current stable appId system.

### Migration Script Usage

The migration utility handles the one-time conversion of backup files from sequential IDs to stable appIds when the database structure changes.

```bash
# Basic migration
node migrate-backup.cjs \
  --old-backup calcium-tracker-backup-2025-08-20-lme.json \
  --old-database foodDatabaseData-old.js \
  --curated-database curated-data-abridged.json \
  --output calcium-tracker-backup-converted.json

# Preview mode (see what would happen)
node migrate-backup.cjs \
  --old-backup calcium-tracker-backup-2025-08-20-lme.json \
  --old-database foodDatabaseData-old.js \
  --curated-database curated-data-abridged.json \
  --dry-run

# Force mode (proceed with partial matches)
node migrate-backup.cjs \
  --old-backup calcium-tracker-backup-2025-08-20-lme.json \
  --old-database foodDatabaseData-old.js \
  --curated-database curated-data-abridged.json \
  --output calcium-tracker-backup-converted.json \
  --force
```

### Required Files for Migration
- **Old backup file**: The user's backup file to be migrated
- **Old database version**: Database version that matches the backup file's IDs
- **Curated database**: The `curated-data-abridged.json` file containing collapsed food information

### Migration Match Types
- **EXACT**: Perfect match on name, measure, and calcium values
- **COLLAPSED**: Food found in collapsed foods under a representative
- **PARTIAL**: Name match with different measure or calcium (requires `--force`)
- **NONE**: No suitable match found

The migration utility ensures that foods which were collapsed during database curation can still be properly mapped to their representative foods.

## Files Description

### Core Processing Scripts
- **`master-key-assigner.cjs`** - **Key Management.** Assigns stable appIds to foods using configurable mapping rules. Preserves existing appIds across database updates using mapping files.
- **`food-curator.cjs`** - **Data Curation.** Processes mastered data to collapse duplicates, select optimal serving sizes, and apply intelligent filtering. Generates both app-ready and documentation datasets.
- **`data-module-generator.cjs`** - **Module Generator.** Converts curated JSON into production-ready JavaScript modules with optional minification and metadata stripping.
- **`html-docs-generator.cjs`** - **Documentation Generator.** Creates comprehensive HTML documentation with source traceability and hierarchical food groupings.
- **`migrate-backup.cjs`** - **Migration Utility.** Migrates user backup files from old database versions to current stable appId system with comprehensive match reporting.

### Configuration Files
- **`usda-fdc-config.json`** - Configuration for data sources, metadata, and processing rules
- **`keep-list.txt`** - Foods protected from filtering (always included regardless of criteria)
- **`exclude-list.txt`** - Terms used to remove matching foods from the dataset
- **`appid-mapping.json`** - Stable appId mappings (generated/updated by master-key-assigner)

### Data Files
- **`sr_legacy_foundation_download_sample.csv`** - Sample combined dataset for testing
- **Static Assets:**
  - **`static/database-docs.css`** - Styling for HTML documentation
  - **`static/database-docs.html`** - Generated comprehensive documentation (deployed)

## Output Files

### Generated Data
- **`mastered-data.json`** - Combined data with stable appIds assigned (`{metadata, foods}` structure)
- **`curated-data-abridged.json`** - Size-optimized curated database for production use
- **`curated-data-full.json`** - Complete curated database with full metadata for documentation
- **`foodDatabaseData.js`** - Production JavaScript module (created in project root)
- **`appid-mapping.json`** - Updated stable appId mappings

### Generated Documentation
- **`static/database-docs.html`** - Public HTML documentation of the complete database

## Architecture Benefits

### Stable appId System
- **Consistent References:** Foods maintain the same appId across database updates
- **Migration Support:** Old backup files can be migrated to new database structures
- **Traceability:** Complete audit trail from source data to final app IDs

### Automated Pipeline
- **No Manual Steps:** Entire process from CSV to production module is automated
- **Format Detection:** App automatically handles minified vs. standard data formats
- **Backward Compatibility:** Existing app code works unchanged with new data structure

### Optimizations
- **Bundle Size Management:** Minification reduces production bundle size significantly
- **Metadata Preservation:** Full metadata retained for documentation while stripped from production
- **Modular Architecture:** Each processing step is independent and can be run separately

### Transparency & Traceability
- **Public Documentation:** Complete source information available to users via HTML docs
- **Development Debugging:** Full metadata preserved for troubleshooting
- **Version Tracking:** Database metadata includes generation timestamps and source information

## Quick Reference Commands

**Full Pipeline (with sample data):**
```bash
# Use sample data for testing
node master-key-assigner.cjs sr_legacy_foundation_download_sample.csv test-mastered --config usda-fdc-config.json
node food-curator.cjs test-mastered.json test-curated
node data-module-generator.cjs test-curated-abridged.json test-module.js --module --minify --minimal
```

**Production Pipeline (with full data):**
```bash
# Combine downloaded CSV files first
cat "Foundation_Foods.csv" "SR_Legacy_Foods.csv" | grep -v '"Data Type"' > combined_input.csv

# Run full pipeline with stable appId management
node master-key-assigner.cjs combined_input.csv mastered-data --config usda-fdc-config.json --map-file appid-mapping.json --output-map appid-mapping-updated.json
node food-curator.cjs mastered-data.json curated-data --keep-list keep-list.txt --exclude-list exclude-list.txt
node data-module-generator.cjs curated-data-abridged.json foodDatabaseData.js --module --minify --minimal
node html-docs-generator.cjs curated-data-abridged.json static/database-docs.html
```

**Migration (when needed):**
```bash
# Migrate user backup to new database structure
node migrate-backup.cjs \
  --old-backup user-backup.json \
  --old-database old-foodDatabaseData.js \
  --curated-database curated-data-abridged.json \
  --output migrated-backup.json
```