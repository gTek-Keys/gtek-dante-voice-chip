#!/usr/bin/env bash
msg="${1:-"Stack online ✅"}"
echo "🧪 slack:test -> $msg (stub). Wire your webhook URL here."
# Example:
# curl -X POST -H 'Content-type: application/json' \
#   --data "{\"text\":\"$msg\"}" "$SLACK_WEBHOOK_URL"
