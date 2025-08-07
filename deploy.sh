#!/bin/bash

# Daily Calcium Tracker PWA - Multi-Environment Build & Deploy Script
set -e # Exit on any error

# --- Configuration ---
PROJECT_ROOT=$(pwd)
BUILD_OUTPUT_DIR="${PROJECT_ROOT}/build"
PROD_DEPLOY_DIR="/volume1/web/Ca-pwa-deploy"
DEV_DEPLOY_DIR="/volume1/web/Ca-pwa-dev"

# --- Environment Handling ---
ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
    echo "❌ Error: No environment specified."
    echo "Usage: ./deploy.sh [dev|prod]"
    exit 1
fi

echo "🔨 Building Daily Calcium Tracker PWA for '$ENVIRONMENT' environment..."

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
else
    echo "❌ Error: Invalid environment '$ENVIRONMENT'."
    echo "Usage: ./deploy.sh [dev|prod]"
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
    
    # --- Deployment ---
    # --- NEW: Check if the build output directory actually exists ---
    if [ ! -d "$BUILD_OUTPUT_DIR" ]; then
        echo "❌ Error: Build output directory '$BUILD_OUTPUT_DIR' not found after build."
        echo "Check your svelte.config.js to ensure the adapter output is set correctly."
        exit 1
    fi

    if [ -d "$DEPLOY_DIR" ]; then
        echo "📁 Deploying to $DEPLOY_DIR..."
        
        echo "🧹 Removing existing files from $DEPLOY_DIR..."
        rm -rf "${DEPLOY_DIR:?}"/* # Use :? for safety
        
        echo "📦 Copying build artifacts from $BUILD_OUTPUT_DIR..."
        cp -r "${BUILD_OUTPUT_DIR:?}"/* "$DEPLOY_DIR/" # Use :? for safety
        
        echo "🚀 Deployment to $DEPLOY_DIR completed successfully!"
        echo "📊 Build size:"
        du -sh "$DEPLOY_DIR"
    else
        echo "⚠️ Deployment directory $DEPLOY_DIR does not exist."
        echo "Please create it manually or adjust the DEPLOY_DIR path."
        echo "📦 Built files are available in $BUILD_OUTPUT_DIR/"
    fi
else
    echo "❌ Build failed."
    exit 1
fi