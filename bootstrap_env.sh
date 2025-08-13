#!/usr/bin/env bash
set -euo pipefail

# ---- Paths ----
ROOT="$(pwd)"
echo "Project: $ROOT"

# ---- Tooling (Mac) ----
if ! command -v brew >/dev/null 2>&1; then
  echo "Homebrew not found. Install from https://brew.sh and re-run."; exit 1
fi

brew bundle --no-lock --file=- <<'B'
brew "node"
brew "jq"
brew "git"
brew "gh"
# optional
# brew "direnv"
# brew "docker"
B

# ---- Yarn (Berry) but using node_modules to avoid PnP friction ----
printf "nodeLinker: node-modules\n" > .yarnrc.yml
corepack enable || true
corepack prepare yarn@4.6.0 --activate

# ---- Minimal package.json with useful scripts (merge if exists) ----
if [ ! -f package.json ]; then
cat > package.json <<'JSON'
{
  "name": "gtek-sovereign-cidex",
  "private": true,
  "version": "0.1.0",
  "packageManager": "yarn@4.6.0",
  "type": "module",
  "scripts": {
    "bootstrap": "bash scripts/bootstrap.sh",
    "dev": "bash scripts/dev.sh",
    "audit": "bash scripts/audit.sh",
    "canvas:zip": "bash scripts/canvas_zip.sh",
    "slack:test": "bash scripts/slack_test.sh",
    "dc:up": "bash scripts/dc_up.sh",
    "doctor": "node -e \"console.log('Node:',process.version);console.log('Yarn:',require('child_process').execSync('yarn -v').toString().trim())\""
  },
  "dependencies": {},
  "devDependencies": {}
}
JSON
fi

# ---- Scripts ----
mkdir -p scripts docs dist

cat > scripts/bootstrap.sh <<'SB'
#!/usr/bin/env bash
set -euo pipefail
echo "🔧 bootstrap: installing deps"
yarn install
echo "✅ bootstrap done"
SB
chmod +x scripts/bootstrap.sh

cat > scripts/dev.sh <<'SD'
#!/usr/bin/env bash
set -euo pipefail
echo "🖥️  Serving docs on http://localhost:8080"
python3 -m http.server 8080 -d docs
SD
chmod +x scripts/dev.sh

cat > scripts/audit.sh <<'SA'
#!/usr/bin/env bash
set -euo pipefail
yarn npm audit || true
echo "✅ audit finished (non-zero ignored)"
SA
chmod +x scripts/audit.sh

cat > scripts/canvas_zip.sh <<'SC'
#!/usr/bin/env bash
set -euo pipefail
mkdir -p dist
TS=$(date +%Y%m%d_%H%M%S)
ZIP="dist/canvas_${TS}.zip"
zip -r "$ZIP" docs >/dev/null
echo "$ZIP"
SC
chmod +x scripts/canvas_zip.sh

cat > scripts/slack_test.sh <<'SS'
#!/usr/bin/env bash
set -euo pipefail
MSG="${1:-Stack online ✅}"
if [ -z "${SLACK_WEBHOOK_URL:-}" ]; then
  echo "Set SLACK_WEBHOOK_URL to actually send. Message would be: $MSG"
  exit 0
fi
curl -sS -X POST -H 'Content-type: application/json' --data "{\"text\":\"$MSG\"}" "$SLACK_WEBHOOK_URL"
SS
chmod +x scripts/slack_test.sh

cat > scripts/dc_up.sh <<'SDC'
#!/usr/bin/env bash
set -euo pipefail
[ -f docker-compose.yml ] && docker compose up -d || echo "No docker-compose.yml; skipped."
SDC
chmod +x scripts/dc_up.sh

# ---- Docs scaffolding (won't overwrite existing) ----
[ -f docs/README.md ] || cat > docs/README.md <<'MD'
# gTek Sovereign Governance AI
Live "AI Research" provides governance insights backed by CIDEX registry and DAO signals.
MD

[ -f docs/API_KEYS.md ] || cat > docs/API_KEYS.md <<'MD'
# API Keys
20-char brief: AI Dante Control Chip
200-char brief: Blockchain-verified sovereign governance platform integrating CIDEX registry, IP protection, and DAO frameworks for secure, transparent, and culturally aligned organizational management.
MD

# ---- Env files ----
[ -f .env.example ] || cat > .env.example <<'ENV'
# Fill and copy to .env
CLAUDE_API_KEY=
PERPLEXITY_API_KEY=
CIDEX_API_KEY=
SLACK_WEBHOOK_URL=
IPFS_ENDPOINT=https://ipfs.infura.io:5001
IPFS_PROJECT_ID=
IPFS_PROJECT_SECRET=
ENV

[ -f .env ] || cp .env.example .env

# ---- Install ----
yarn install
yarn doctor

echo "✅ Bootstrap complete.
Next:
  yarn dev         # serve docs at http://localhost:8080
  yarn canvas:zip  # create docs zip in ./dist
  yarn audit
"
