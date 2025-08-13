#!/usr/bin/env bash
set -euo pipefail
echo "🔧 bootstrap: installing deps"
if command -v yarn >/dev/null 2>&1; then
  yarn install
else
  npm install
fi
echo "✅ bootstrap done"
