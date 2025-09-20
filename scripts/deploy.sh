#!/bin/bash

# 🚀 Deploy Script - Streamlined deployment to Vercel

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 Deploying Dante Voice Chip to Vercel..."

# Ensure we're built first
if [ ! -d "frontend/.next" ]; then
    echo "📦 No build found, building first..."
    ./scripts/build.sh
    exit 0
fi

# Deploy to Vercel
echo "🌐 Deploying to production..."
vercel --prod --yes

echo "✅ Deployment complete!"