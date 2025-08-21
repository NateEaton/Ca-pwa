#!/bin/bash

# My Calcium PWA - Multi-Environment Build & Deploy Script
set -e # Exit on any error

# --- Load environment variables if .env exists ---
if [ -f .env ]; then
    echo "📄 Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
fi

# --- Configuration ---
PROJECT_ROOT=$(pwd)
BUILD_OUTPUT_DIR="${PROJECT_ROOT}/build"

# Use environment variables with fallback to empty strings
PROD_DEPLOY_DIR="${PROD_DEPLOY_DIR:-}"
DEV_DEPLOY_DIR="${DEV_DEPLOY_DIR:-}"

# --- Environment Handling ---
ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
    echo "❌ Error: No environment specified."
    echo "Usage: ./deploy.sh [dev|prod|test]"
    exit 1
fi

if [ "$ENVIRONMENT" = "test" ]; then
    echo "🧪 Building My Calcium PWA for testing with preview server..."
else
    echo "🔨 Building My Calcium PWA for '$ENVIRONMENT' environment..."
fi

# --- Build ID Generation ---
echo "🔢 Generating build ID..."
BUILD_ID=$(node -e "
const { execSync } = require('child_process');
const timestamp = new Date().toISOString().replace(/[-T:.]/g, '').slice(0, 14);
try {
  const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  const isDirty = status.length > 0;
  console.log(\`\${gitHash}\${isDirty ? '-dirty' : ''}-\${timestamp}\`);
} catch (error) {
  console.log(timestamp);
}
")
echo "📋 Build ID: $BUILD_ID"

# --- Build Process ---
echo "📦 Installing dependencies..."
npm install

# Set deployment directory AND base path based on environment
DEPLOY_DIR=""
export BASE_PATH="" # Export the variable so npm scripts can see it

if [ "$ENVIRONMENT" = "prod" ]; then
    DEPLOY_DIR="$PROD_DEPLOY_DIR"
    export BASE_PATH="" # Production serves at root path
elif [ "$ENVIRONMENT" = "dev" ]; then
    DEPLOY_DIR="$DEV_DEPLOY_DIR"
    export BASE_PATH="/Ca-pwa-dev" # Set for development
elif [ "$ENVIRONMENT" = "test" ]; then
    # Test mode - no deployment directory needed
    export BASE_PATH="" # Test serves at root path
else
    echo "❌ Error: Invalid environment '$ENVIRONMENT'."
    echo "Usage: ./deploy.sh [dev|prod|test]"
    exit 1
fi

# --- NEW: Clean the old build directory before starting a new build ---
echo "🧹 Cleaning previous build artifacts..."
rm -rf "$BUILD_OUTPUT_DIR"

# --- CORRECTED: Execute the build command and then check its status ---
echo "🚀 Running the SvelteKit build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully"
    
    if [ "$ENVIRONMENT" = "test" ]; then
        # --- Test Mode - Start Preview Server ---
        echo "🧪 Starting test preview server..."
        echo "📡 Running preview with host access enabled"
        echo "🔗 The preview server will be accessible from other devices on your network"
        echo "⏹️  Press Ctrl+C to stop the server"
        echo ""
        npm run preview -- --host
    else
        # --- Deployment for dev/prod ---
        # --- Check if the build output directory actually exists ---
        if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
            echo "❌ Error: Build output directory '$BUILD_OUTPUT_DIR' not found after build."
            echo "Check your svelte.config.js to ensure the adapter output is set correctly."
            exit 1
        fi

        if [ -n "$DEPLOY_DIR" ] && [ -d "$DEPLOY_DIR" ]; then
            echo "📁 Deploying to $DEPLOY_DIR..."
            
            echo "🧹 Removing existing files from $DEPLOY_DIR..."
            rm -rf "${DEPLOY_DIR:?}"/* # Use :? for safety
            
            echo "📦 Copying build artifacts from $BUILD_OUTPUT_DIR..."
            cp -r "${BUILD_OUTPUT_DIR:?}"/* "$DEPLOY_DIR/" # Use :? for safety
            
            echo "🚀 Deployment to $DEPLOY_DIR completed successfully!"
            echo "📋 Deployed Build ID: $BUILD_ID"
            echo "📊 Build size:"
            du -sh "$DEPLOY_DIR"
        else
            echo "⚠️ Deployment directory not configured or does not exist."
            echo "Please set PROD_DEPLOY_DIR or DEV_DEPLOY_DIR in your .env file."
            echo "📦 Built files are available in $BUILD_OUTPUT_DIR/"
            echo "📋 Build ID: $BUILD_ID"
        fi
    fi
else
    echo "❌ Build failed."
    exit 1
fi