#!/usr/bin/env bash
echo "🖥️  dev: start a local web server for docs (http://localhost:8080)"
python3 -m http.server 8080 -d docs
