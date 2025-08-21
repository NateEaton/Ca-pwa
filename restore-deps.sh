#!/bin/bash
set -e

PROJECT_DIR=$(pwd)
BACKUP_DIR="$PROJECT_DIR/backup"

if [ ! -f "$BACKUP_DIR/package-lock.json.bak" ]; then
  echo "❌ No backup lockfile found in $BACKUP_DIR"
  echo "Run ./backup-deps.sh first!"
  exit 1
fi

echo "Restoring dependencies from backup..."

# Remove current modules and lockfile
rm -rf node_modules package-lock.json

# Restore the lockfile
cp "$BACKUP_DIR/package-lock.json.bak" package-lock.json

# Reinstall exactly as before
npm ci

echo "✅ Restore complete!"
