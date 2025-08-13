#!/usr/bin/env bash
set -euo pipefail
OUTDIR="${1:-$HOME/gtek_bundle}"
TS=$(date +%Y%m%d)
ZIP="$OUTDIR/gtek_docs_bundle_${TS}.zip"
mkdir -p "$OUTDIR"
zip -r "$ZIP" ./docs >/dev/null
echo "ZIP=$ZIP"
