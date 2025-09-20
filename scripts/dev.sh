#!/bin/bash

# �️ Dev Script - Start development environment

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🛠️ Starting Dante Voice Chip development environment..."

# Ensure agent is running
echo "🔧 Checking agent status..."
cd agent && ./status.sh | grep -q "RUNNING" || ./start.sh
cd ..

# Start frontend in development mode
echo "🌐 Starting frontend development server..."
cd frontend && npm run dev
