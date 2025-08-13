#!/usr/bin/env bash
set -e
if [ -f docker-compose.yml ]; then
  docker compose up -d
else
  echo "No docker-compose.yml found. Skipping."
fi
