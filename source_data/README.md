# Calcium Database Source Data

This folder contains the data processing pipeline used to curate the calcium-rich foods database for the My Calcium Tracker PWA.

## Overview

The project uses USDA Food Data Central (FDC) data to build a curated, size-optimized database of calcium-rich foods. The primary method is a CSV processing pipeline that ensures the final database is both user-friendly and small enough for a high-performance web application.

An older API-based approach (`fdc-curator.cjs`) exists for reference but is not used in the main workflow.

**Why CSV over API?** The CSV exports from USDA FDC contain detailed serving size information that isn't available through the API, making them essential for creating a database with realistic portion sizes.

## Data Sources

### Full Datasets (Download Required)
To run the complete processing pipeline, download the following datasets from the [USDA Food Data Central Download Page](https://fdc.nal.usda.gov/download-datasets.html):

1.  **Foundation Foods** (CSV format)
2.  **SR Legacy Foods** (CSV format)

These two sources provide the best balance of high-quality, non-branded data and detailed serving information.

### Sample Data (Included)
This repository includes sample files for testing the scripts, including a combined sample of the two main data sources:
- `sr_legacy_foundation_download_sample.csv`

## Detailed End-to-End Workflow

Follow these steps to go from raw USDA data to an updated application database file (`foodDatabase.js`).

### Step 0: Prerequisites

1.  Ensure you have Node.js installed.
2.  Navigate to this `source_data` folder in your terminal.
3.  Install the necessary dependencies:
    ```bash
    npm install fs-extra csv-parse
    ```

### Step 1: Data Acquisition and Preparation

1.  **Download Data:** Download the full **Foundation Foods** and **SR Legacy Foods** datasets in CSV format from the USDA FDC website.
2.  **Combine CSVs:** The curator script works best with a single input file. Place both downloaded CSVs in this folder and combine them using a terminal command.

    *For macOS or Linux:*
    ```bash
    # This merges the two files and removes the header from the second file
    cat "SR_Legacy_Foods.csv" "Foundation_Foods.csv" | grep -v '"Data Type"' > sr_legacy_foundation_download.csv
    ```
    *For Windows:*
    ```bash
    # The 'type' command achieves the same result
    type "SR_Legacy_Foods.csv" "Foundation_Foods.csv" | findstr /v /c:"\"Data Type\"" > sr_legacy_foundation_download.csv
    ```    This creates the final input file: `sr_legacy_foundation_download.csv`.

### Step 2: Curate and Abridge the Data

1.  **Review Configuration:** Open `exclude-list.txt` and `keep-list.txt` to add or remove any foods you want to specifically exclude or protect from the filtering logic.
2.  **Run the Curator Script:** Execute the script. **The `--minimal` flag is crucial**; it strips extra metadata to ensure the final database is small enough for the web application.

    ```bash
    node fdc-csv-curator-abridge.cjs sr_legacy_foundation_download.csv curated-data --minimal --exclude-list exclude-list.txt
    ```3.  **Review Outputs:** This generates two files:
    - **`curated-data-abridged.json`**: This is the primary, filtered file you will use in the next step. It contains only the essential data for the app.
    - **`curated-data-full.json`**: A reference file with complete metadata, useful for debugging or future enhancements but too large for the current app.

### Step 3: Merge with Existing App Data

1.  **Run the Merge Script:** Combine the newly curated data with your app's existing database. This preserves custom-added foods and updates USDA entries.

    **Note:** The `--minimal` flag is required here as well. It tells the merge script to expect the simplified data structure produced in the previous step.

    ```bash
    # Use the '-abridged.json' file as the input.
    node merge-calcium-db.cjs --minimal existing-usda-data.js curated-data-abridged.json merged-food-database.json
    ```
2.  **Final Output:** This command generates the final, clean database file:
    - **`merged-food-database.json`**: This file contains the complete, merged, and re-indexed array of all food data, ready for the application.

### Step 4: Update the Svelte Application

This final manual step integrates the new data into your Svelte application.

1.  **Open the Merged File:** Open `merged-food-database.json` in a code editor.
2.  **Copy the Array:** Select and copy the entire content of the file, from the opening bracket `[` to the final closing bracket `]`.
3.  **Open Svelte Database File:** In your Svelte project, navigate to the file that exports your food database (e.g., `src/lib/foodDatabase.js` or a similar file).
4.  **Paste and Replace:** The file will contain a line like `export const foodDatabase = [ ...old data... ];`. Delete the entire old array and paste the new array content you copied.
5.  **Save and Verify:** Save the file. Your Svelte application will now use the fully updated database. Restart your development server to see the changes.

## Files Description

### Processing Scripts
- **`fdc-csv-curator-abridge.cjs`** - **Primary Script.** Processes a combined USDA CSV. It collapses duplicates, selects the most intuitive serving size, and applies intelligent filters. With the `--minimal` flag, it produces a size-optimized JSON output for the app.
- **`merge-calcium-db.cjs`** - **Second Script.** Merges the curated JSON with `existing-usda-data.js`. The `--minimal` flag is essential for handling the optimized data structure. It preserves custom foods, updates existing USDA foods, adds new ones, and re-indexes all IDs sequentially.
- `fdc-curator.cjs` - API-based data collection (older, reference implementation).

### Configuration Files
- **`keep-list.txt`** - A list of food names to protect from being filtered out by the abridgement logic.
- **`exclude-list.txt`** - A list of terms used to remove any matching foods from the dataset.

### Data Files
- **`existing-usda-data.js`** - A snapshot of the app's database structure, used as the base for the merge script.
- **`sr_legacy_foundation_download.csv`** - The combined input file you create in Step 1 of the workflow.
- `*_sample.csv` - Small data samples for quick testing of the scripts.

## Algorithm Details

### Serving Size Intelligence
The `fdc-csv-curator-abridge.cjs` script uses a context-aware algorithm to select the most intuitive serving size:
- **Food Categorization**: Foods are categorized (Liquid, Dairy, Produce, etc.) based on keywords.
- **Unit Prioritization**: Each category has a unique, prioritized list of preferred units (e.g., `cup` for liquids, `oz` for meat).
- **Weight Filtering**: The algorithm prefers servings within a reasonable gram weight range (30g-300g) to avoid unrealistic portions.
- **Fallback Logic**: If no ideal unit is found, it uses sensible fallbacks to ensure a good choice is always made.

### Data Abridgement & Minimization
The script applies several filtering passes to reduce the dataset size while preserving nutritional value:
- **Brand Removal**: Filters commercial brands.
- **Cooking Method Collapse**: Consolidates raw/cooked variants.
- **Meat Cut Simplification**: Reduces redundant cuts for certain meats.
- **Preparation Filtering**: Removes industrial preparations (e.g., "frozen," "canned").
- **Low-Calcium Filtering**: Intelligently removes low-calcium foods.
- **Minimal Flag**: The `--minimal` option performs the final and most important optimization by stripping all non-essential metadata fields, resulting in a significantly smaller file for the final application.