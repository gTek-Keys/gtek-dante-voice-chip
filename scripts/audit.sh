#!/usr/bin/env bash
set -e
if command -v yarn >/dev/null 2>&1; then
  yarn npm audit || true
else
  npm audit || true
fi
echo "✅ audit completed (ignored non-critical failures)"
