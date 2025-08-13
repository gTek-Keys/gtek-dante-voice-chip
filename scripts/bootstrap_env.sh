#!/usr/bin/env bash
set -euo pipefail
echo "Project: $(pwd)"

# Homebrew bits (optional; avoid unsupported flags)
if command -v brew >/dev/null 2>&1; then
  brew bundle check || brew bundle || true
fi

# Yarn install (force local project)
export YARN_IGNORE_PATH=1
yarn install

# Doctor
yarn doctor || true

# Ensure .env present
[ -f .env ] || cp .env.example .env || true

echo "✅ Bootstrap complete.
Next:
  yarn dev         # serve docs at http://localhost:8080
  yarn canvas:zip  # create docs zip in ./dist
  yarn audit
"
