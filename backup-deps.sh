#!/bin/bash
set -e

# Ensure we're in the project root
PROJECT_DIR=$(pwd)
BACKUP_DIR="$PROJECT_DIR/backup"

echo "Creating backup folder at $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Save top-level dependency list
echo "Saving top-level npm list..."
npm list --depth=0 > "$BACKUP_DIR/npm-list-top.txt" 2>&1
echo "  ✓ Saved npm-list-top.txt"

# Save full dependency tree
echo "Saving full npm dependency tree..."
npm list > "$BACKUP_DIR/npm-list-full.txt" 2>&1
echo "  ✓ Saved npm-list-full.txt"

# Generate a package-lock.json if it doesn’t exist
if [ ! -f package-lock.json ]; then
  echo "Generating package-lock.json..."
  npm install --package-lock-only
fi

# Copy package-lock.json immediately
if [ -f package-lock.json ]; then
  cp package-lock.json "$BACKUP_DIR/package-lock.json.bak"
  echo "  ✓ Backed up package-lock.json"
else
  echo "  ⚠ No package-lock.json found"
fi

# Always copy package.json
if [ -f package.json ]; then
  cp package.json "$BACKUP_DIR/package.json.bak"
  echo "  ✓ Backed up package.json"
else
  echo "  ⚠ No package.json found"
fi

# Create a shrinkwrap snapshot (exact current state of node_modules)
echo "Creating npm-shrinkwrap.json..."
npm shrinkwrap

# Copy shrinkwrap immediately
if [ -f npm-shrinkwrap.json ]; then
  mv npm-shrinkwrap.json "$BACKUP_DIR/npm-shrinkwrap.json.bak"
  echo "  ✓ Backed up npm-shrinkwrap.json"
else
  echo "  ⚠ No npm-shrinkwrap.json found"
fi

echo "✅ Backup complete!"
echo "Files saved in: $BACKUP_DIR"
