#!/bin/bash

# 🧹 Clean Script - Reset the entire workspace for fresh builds

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🧹 Cleaning Dante Voice Chip workspace..."

# Clean Node modules and build artifacts
echo "  📦 Removing node_modules..."
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

echo "  🗑️ Removing build artifacts..."
rm -rf frontend/.next
rm -rf frontend/dist
rm -rf backend/dist
rm -rf voice/dist
rm -rf .vercel
rm -rf dist

# Clean logs but preserve structure
echo "  📝 Cleaning logs..."
if [ -d "$HOME/.dante-voice-chip/logs" ]; then
    rm -f $HOME/.dante-voice-chip/logs/*.log
fi

# Clean temporary files
echo "  🗂️ Removing temporary files..."
find . -name "*.log" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "*.tmp" -delete 2>/dev/null || true

echo "✅ Workspace cleaned successfully!"