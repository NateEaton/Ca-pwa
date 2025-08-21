# My Calcium Tracker PWA

> **⚠️ DRAFT DOCUMENTATION** - This documentation is currently being finalized and may contain incomplete or outdated information.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-4.x-orange.svg)](https://kit.svelte.dev/)
[![Node.js: >=18.0.0](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

A Progressive Web App (PWA) designed to be a simple, privacy-focused tool for tracking daily calcium intake. Search a comprehensive food database, add custom foods, and monitor your progress towards your nutritional goals. All data is stored locally on your device and can be seamlessly synchronized across multiple devices using a secure, lightweight cloud backend.

**[Live Demo]()** | **[In-App User Guide](./src/routes/guide/+page.svelte)**

### ⚠️ Note on Sync Functionality

This application is designed with a "local-first" approach but uses a cloud backend for its cross-device sync feature. The backend is a serverless Cloudflare Worker that you can deploy yourself. The sync is end-to-end encrypted, meaning the server only stores encrypted data that it cannot read.

## App Screenshots

*(Note: Screenshots to be added)*

## Core Features

-   **Curated Food Database**: Log entries from a comprehensive food database sourced from USDA FoodData Central, intelligently curated for relevance and usability. Hide unwanted foods from search results.
-   **Custom Foods**: Add and manage your own custom food items with specific calcium values.
-   **Personalized Goals**: Set and adjust your personal daily calcium intake target.
-   **Data Visualization**: View your progress with daily, weekly, monthly, and yearly charts on the Statistics page.
-   **Favorites & Serving Memory**: Mark foods as favorites for quick access and the app remembers your preferred serving sizes.
-   **Printable Reports**: Generate a health report to share with healthcare professionals.
-   **Cross-Device Sync**: Keep your data synchronized across all your devices automatically and securely.
-   **PWA Features**: Fully offline-capable and can be installed to your device's home screen.
-   **Privacy-Focused**: Your data is stored locally on your device and is end-to-end encrypted during sync.

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
-   **Framework**: SvelteKit
-   **Build System**: Vite
-   **Data Storage**: IndexedDB for all user data (journal entries, custom foods, settings).
-   **PWA Features**: `vite-plugin-pwa` for Service Workers, caching, and manifest generation.
-   **Cryptography**: Web Crypto API for end-to-end encryption (AES-GCM).

### Server Component (Sync)
-   **Runtime**: Cloudflare Workers
-   **Data Storage**: Cloudflare KV
-   **Language**: TypeScript

## Food Database Curation

The food database is a core feature, curated from the **USDA FoodData Central** using a custom data processing pipeline located in the `source_data/` directory. This pipeline transforms raw USDA data into a user-friendly database optimized for practical tracking.

Key curation steps include:
-   **Intelligent Serving Selection**: A context-aware algorithm analyzes food descriptions to select the most realistic and user-friendly default serving size (e.g., "1 cup" for milk, "1 slice" for bread) instead of the standard "100g".
-   **Duplicate Consolidation**: Multiple entries for the same food are collapsed into a single, representative entry.
-   **Data Abridgement**: The dataset is filtered to improve relevance by removing branded products, simplifying meat cuts, and collapsing different cooking methods (e.g., raw, boiled, fried) into a single entry.
-   **Merging**: The newly curated data is merged with the app's existing JavaScript database, preserving any legacy data or custom food definitions.

This process ensures the in-app database is both comprehensive and practical for everyday use.

## Installation & Deployment

The application supports two build modes:
- **Standalone Mode**: Local-only operation without sync functionality 
- **Cloud Sync Mode**: Includes cross-device synchronization capabilities

Build mode is automatically determined by the presence of `VITE_WORKER_URL` in your `.env` file. If no worker URL is provided, the app builds in standalone mode.

Deploying the application involves two main steps: setting up the sync worker (optional) and deploying the SvelteKit frontend. See `.env.example` for required environment variables.

#### 1. Deploy the Cloudflare Worker (Optional - for sync functionality)

1.  Navigate to the `worker/` directory: `cd worker`
2.  Authenticate with Cloudflare: `npx wrangler login`
3.  Create a KV namespace: `npx wrangler kv:namespace create "SYNC_KV"`
4.  Copy `wrangler.toml.example` to `wrangler.toml` and add your KV namespace ID.
5.  Deploy the worker: `npx wrangler deploy`
6.  After deployment, note the URL of your worker.

#### 2. Deploy the SvelteKit PWA

1.  Create a `.env` file in the project root and set `VITE_WORKER_URL` to your worker's URL (or omit for standalone mode).
2.  Build the application using the included `deploy.sh` script:
    ```bash
    # Example for production build
    ./deploy.sh prod
    ```
3.  Deploy the contents of the `build/` directory to any static hosting provider (e.g., Vercel, Netlify, or a personal web server).

## Data Privacy & Security

-   **Local-First**: Your data lives on your device. The app is fully functional without an internet connection (except for sync).
-   **End-to-End Encryption**: Before data is sent for synchronization, it is encrypted on your device using a key that only you have. The server stores an unreadable encrypted blob.
-   **No Third-Party Tracking**: The application does not include any analytics, ads, or third-party tracking services.
-   **Full Data Control**: You can export a complete backup of your data at any time from the Settings menu.

## Development

This project is built with SvelteKit and Vite, enabling a fast and modern development workflow.

```bash
# Clone the repository
git clone https://github.com/NateEaton/Ca-pwa.git
cd Ca-pwa

# Install dependencies
npm install

# Start the development server
npm run dev
```

## License

This project is licensed under the GNU General Public License v3.0.
