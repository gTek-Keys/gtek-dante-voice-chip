#!/bin/bash

# Dante Voice Chip - Start monitoring agent

AGENT_DIR="$HOME/.dante-voice-chip"
PLIST_PATH="$HOME/Library/LaunchAgents/com.gtek.dante-voice-chip.plist"

echo "🚀 Starting Dante Voice Chip monitoring agent..."

# Check if plist exists
if [ ! -f "$PLIST_PATH" ]; then
    echo "❌ Agent not installed. Please run ./install.sh first"
    exit 1
fi

# Load the launch agent
launchctl load "$PLIST_PATH" 2>/dev/null || true

# Wait a moment for startup
sleep 2

# Check if process is running
if launchctl list | grep -q "com.gtek.dante-voice-chip"; then
    echo "✅ Monitoring agent started successfully"
    echo "📊 Monitoring all terminal activity..."
    echo "📝 Logs: $AGENT_DIR/logs/monitor.log"
    echo "🔒 Vault: $AGENT_DIR/vault/"
else
    echo "❌ Failed to start monitoring agent"
    echo "Check logs: $AGENT_DIR/logs/agent.error.log"
    exit 1
fi