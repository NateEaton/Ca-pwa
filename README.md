# My Calcium Tracker PWA

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-orange.svg)](https://kit.svelte.dev/)
[![Node.js: >=18.0.0](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

A Progressive Web App (PWA) designed to be a simple, privacy-focused tool for tracking daily calcium intake. Search a comprehensive food database, add custom foods, and monitor your progress towards your nutritional goals. All data is stored locally on your device and can be seamlessly synchronized across multiple devices using a secure, lightweight cloud backend.

[**Live Demo**](https://ca-pwa.vercel.app/)

### ⚠️ Note on Sync Functionality

This application is designed with a "local-first" approach but uses a cloud backend for its cross-device sync feature. The backend is a serverless Cloudflare Worker that you can deploy yourself. The sync is end-to-end encrypted, meaning the server only stores encrypted data that it cannot read.

## App Screenshots

*(Note: Screenshots to be added)*

## Core Features

### Tracking & Data Entry
-   **Curated Food Database**: Log entries from a comprehensive database of 3,876+ USDA-sourced foods, intelligently curated for relevance and usability. [Browse the public database documentation](https://ca-pwa.vercel.app/database-docs.html) to explore available foods.
-   **Smart Scan**: Add foods quickly using your device's camera to scan UPC/EAN barcodes. Supports both USDA FoodData Central and OpenFoodFacts databases, with manual barcode entry option for quick lookup.
-   **Nutrition Label OCR** *(Optional)*: Capture calcium content directly from food packaging using optical character recognition. Requires API key configuration.
-   **Custom Foods**: Add and manage your own food items with specific calcium values. Custom foods support the same features as database foods, including serving memory and favorites.
-   **Multi-Measure Support**: Many foods offer multiple serving options (cups, ounces, pieces, etc.). The app remembers both your preferred serving size and measurement unit for each food.
-   **Favorites & Serving Memory**: Mark foods as favorites for quick access. The app remembers your preferred serving sizes and measure selections, making repeat entries effortless.
-   **Database Management**: Hide unwanted foods from search results, filter by calcium ranges (preset or custom), and sort by name, calcium content, or food type.

### Analysis & Reporting
-   **Personalized Goals**: Set and adjust your personal daily calcium intake target.
-   **Data Visualization**: View your progress with interactive daily, weekly, monthly, and yearly charts on the Statistics page.
-   **Printable Reports**: Generate comprehensive health reports to share with healthcare professionals.
-   **CSV Export**: Export your complete journal history to CSV format for analysis in spreadsheet applications.

### Synchronization & Data Management
-   **Cross-Device Sync** *(Optional)*: Keep your data synchronized across all your devices automatically and securely. Requires Cloudflare Worker deployment.
-   **Backup & Restore**: Create complete backups of your data (journal entries, custom foods, settings, serving preferences) and restore from backup files.
-   **Data Privacy**: Your data is stored locally on your device and is end-to-end encrypted during sync. No third-party tracking or analytics.

### Progressive Web App
-   **Offline-First**: Fully functional without an internet connection (except for sync and Smart Scan features).
-   **Installable**: Add to your device's home screen for a native app-like experience.
-   **Responsive Design**: Optimized for mobile, tablet, and desktop devices with light and dark theme support.

## Quick Start

1.  **Open the app** in any modern web browser or install it to your home screen.
2.  Use the **"+" button** on the main Tracking screen to add food entries.
3.  Use the **date navigator** or swipe on the summary card to view and log entries for different days.
4.  Visit the **Settings** page to configure your daily goal, theme, and set up cross-device sync.

## Architecture Overview

The My Calcium Tracker is a modern, local-first Progressive Web App with a serverless backend for synchronization.

-   **Frontend (PWA)**: A SvelteKit application that handles all UI and stores data locally in the browser's IndexedDB. This allows the app to be fully functional offline.
-   **Backend (Sync Service)**: A lightweight Cloudflare Worker that stores encrypted data blobs in Cloudflare's KV store. The worker acts as a simple relay, ensuring that the service itself cannot access user data.
-   **Synchronization**: When a user makes a change, the app encrypts the entire dataset and sends it to the worker. Other paired devices periodically check with the worker for new versions, download the encrypted data, and decrypt it locally.

## Technology Stack

### Client Application (PWA)
-   **Framework**: SvelteKit 2.37.0
-   **Language**: TypeScript with JSDoc type checking
-   **Build System**: Vite 5.x
-   **Data Storage**: IndexedDB for all user data (journal entries, custom foods, settings, serving preferences)
-   **PWA Features**: `vite-plugin-pwa` for Service Workers, caching strategies, and manifest generation
-   **Cryptography**: Web Crypto API for end-to-end encryption (AES-GCM)
-   **UI Components**: Custom Svelte components with Material Icons

### Server Component (Sync)
-   **Runtime**: Cloudflare Workers (serverless edge computing)
-   **Data Storage**: Cloudflare KV (key-value store)
-   **Language**: TypeScript

### Architecture Pattern
-   **Local-First Design**: All data stored locally with optional cloud sync
-   **Modular Design**: Clear separation between UI components, services, and data layer
-   **State Management**: Svelte stores for reactive state with IndexedDB persistence
-   **Security**: End-to-end encryption for sync, Web Crypto API implementation

### External API Integrations

#### Smart Scan - UPC Barcode Lookup
-   **USDA FoodData Central API**: Primary source for barcode lookups, providing detailed nutritional information from the USDA database
    -   Requires: `VITE_FDC_API_KEY` environment variable
    -   Free API key available at [FoodData Central](https://fdc.nal.usda.gov/api-guide.html)
    -   Falls back to rate-limited DEMO_KEY if not configured
-   **OpenFoodFacts API**: Community-driven food database providing international product coverage
    -   Requires: No API key needed (public API)
    -   Fallback option when USDA data is unavailable

#### Nutrition Label OCR (Optional)
-   **OCR.space API**: Optical character recognition for extracting calcium values from nutrition label photos
    -   Requires: `VITE_OCR_API_KEY` environment variable
    -   Free and paid tiers available at [OCR.space](https://ocr.space/ocrapi)
    -   When enabled, adds OCR tab to Smart Scan modal

## Food Database Curation

The food database is a core feature containing **3,876+ curated foods** from **USDA FoodData Central**, processed through a custom data pipeline located in the `source_data/` directory. This pipeline transforms raw USDA data into a user-friendly database optimized for practical calcium tracking.

### Curation Pipeline

The data processing pipeline implements several intelligent transformations:

1. **Intelligent Serving Selection**: A context-aware algorithm analyzes food descriptions to select the most realistic and user-friendly default serving size (e.g., "1 cup" for milk, "1 slice" for bread) instead of the standard "100g".

2. **Multi-Measure Support**: Foods are enriched with multiple serving options when available. For example, cheese might offer "1 cup shredded," "1 oz," and "1 slice" alternatives, giving users flexibility in how they track their intake.

3. **Duplicate Consolidation**: Multiple USDA entries for the same food are intelligently collapsed into a single, representative entry to reduce clutter and confusion.

4. **Data Abridgement**: The dataset is filtered to improve relevance by:
   - Removing branded products that may become outdated
   - Simplifying meat cuts to common preparations
   - Collapsing different cooking methods (raw, boiled, fried, baked) into representative entries
   - Focusing on foods with significant calcium content

5. **Database Merging**: The newly curated data is merged with the app's existing JavaScript database, preserving any legacy data or custom food definitions.

### Browse the Database

The complete curated database is publicly available at [https://ca-pwa.vercel.app/database-docs.html](https://ca-pwa.vercel.app/database-docs.html), allowing users to explore available foods before using the app. Each food entry includes its calcium content, serving sizes, food group classification, and USDA FDC ID for reference.

This comprehensive curation process ensures the in-app database is both extensive and practical for everyday calcium tracking.

## Installation & Deployment

### Which Deployment Should I Choose?

**Choose Standalone Mode if:**
- You don't need cross-device synchronization
- You prefer simpler deployment without backend configuration
- You want to avoid Cloudflare Worker setup

**Choose Sync Mode if:**
- You want to access your data across multiple devices
- You're comfortable with Cloudflare Worker deployment
- You need automatic data synchronization

**API Key Configuration:**
- Smart Scan works with free DEMO_KEY but has rate limits
- OCR feature is entirely optional and requires separate API key

### Build Modes & Feature Flags

The application supports flexible deployment with optional features controlled by environment variables:

**Build Modes:**
- **Standalone Mode** (default): Local-only operation, no sync functionality, smaller bundle size
- **Sync Mode**: Full cross-device synchronization with Cloudflare Worker backend

**Optional Features:**
- **Smart Scan UPC Lookup**: Enabled by default with DEMO_KEY, enhanced with `VITE_FDC_API_KEY`
- **OCR Nutrition Label Scanning**: Enabled when `VITE_OCR_API_KEY` is configured

### Environment Variables

Create a `.env` file in the project root (see `.env.example` for template):

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_WORKER_URL` | No | Cloudflare Worker URL for sync. Omit for standalone mode. |
| `VITE_FDC_API_KEY` | No | USDA FoodData Central API key. Falls back to rate-limited DEMO_KEY. |
| `VITE_OCR_API_KEY` | No | OCR.space API key. Enables nutrition label scanning feature. |

**Getting API Keys:**
- **USDA FoodData Central**: Free key at [fdc.nal.usda.gov/api-guide.html](https://fdc.nal.usda.gov/api-guide.html)
- **OCR.space**: Free and paid tiers at [ocr.space/ocrapi](https://ocr.space/ocrapi)

### Deployment Steps

Deploying involves two main steps: setting up the sync worker (optional) and deploying the SvelteKit frontend.

#### 1. Deploy the Cloudflare Worker (Optional - for sync functionality)

1.  Navigate to the `worker/` directory: `cd worker`
2.  Authenticate with Cloudflare: `npx wrangler login`
3.  Create a KV namespace: `npx wrangler kv:namespace create "SYNC_KV"`
4.  Copy `wrangler.toml.example` to `wrangler.toml` and add your KV namespace ID.
5.  Deploy the worker: `npx wrangler deploy`
6.  After deployment, note the URL of your worker.

#### 2. Deploy the SvelteKit PWA

1.  **Configure Environment Variables**: Create a `.env` file in the project root:
    ```bash
    # Copy template and edit
    cp .env.example .env
    ```
    Configure the variables based on your deployment needs:
    - `VITE_WORKER_URL`: Your Cloudflare Worker URL (if using sync)
    - `VITE_FDC_API_KEY`: Your USDA FoodData Central API key (optional)
    - `VITE_OCR_API_KEY`: Your OCR.space API key (optional)

2.  **Build the Application**: Use the included `deploy.sh` script or build manually:
    ```bash
    # Using deploy.sh (recommended)
    ./deploy.sh prod          # Production build
    ./deploy.sh dev           # Development build

    # Manual build
    npm run build             # Creates static site in build/ directory
    ```

    The build process:
    - Compiles SvelteKit application to static HTML/CSS/JS
    - Generates PWA service worker and manifest
    - Bundles and optimizes all assets
    - Feature flags determine which functionality is included

3.  **Deploy to Hosting**: Deploy the `build/` directory to any static hosting provider:
    - **Vercel/Netlify**: Connect your repository for automatic deployments
    - **Static Web Server**: Copy `build/` contents to your web root
    - **CDN**: Upload to S3, Cloudflare Pages, or similar

    The built application is a fully static site requiring no server-side processing.

## Data Privacy & Security

-   **Local-First**: Your data lives on your device. The app is fully functional without an internet connection (except for sync and Smart Scan features).
-   **End-to-End Encryption**: Before data is sent for synchronization, it is encrypted on your device using a key that only you have. The server stores an unreadable encrypted blob.
-   **No Third-Party Tracking**: The application does not include any analytics, ads, or third-party tracking services.
-   **Secure API Usage**: External API keys are stored in environment variables and never exposed to end users.
-   **Open Source**: Complete source code is available for review under GPL v3.
-   **Full Data Control**: You can export a complete backup of your data at any time from the Settings menu.

## Development

This project follows modern web development practices with a focus on maintainability and user privacy:

- **Component-Based Architecture**: Reusable Svelte components with clear separation of concerns
- **TypeScript Integration**: Type-safe development with checkJs configuration
- **Local-First Design**: IndexedDB for persistence, optional cloud synchronization
- **Progressive Enhancement**: Core functionality works offline with optional network features
- **Comprehensive Data Pipeline**: Custom USDA database curation with intelligent serving selection

### Getting Started

```bash
# Clone the repository
git clone https://github.com/NateEaton/Ca-pwa.git
cd Ca-pwa

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Contributing

This project is open source and welcomes contributions. Development setup instructions and coding guidelines can be found in the repository's documentation.

### Development Acknowledgments

This project was developed with assistance from AI tools following best practices in modern web development. The underlying concept, architecture decisions, implementation and testing were performed by the developer.

## License

This project is licensed under the GNU General Public License v3.0 - ensuring the software remains free and open for all users.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
