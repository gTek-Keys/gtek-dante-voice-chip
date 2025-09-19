#!/bin/bash

# Dante Voice Chip - Stop monitoring agent

PLIST_PATH="$HOME/Library/LaunchAgents/com.gtek.dante-voice-chip.plist"

echo "🛑 Stopping Dante Voice Chip monitoring agent..."

# Unload the launch agent
launchctl unload "$PLIST_PATH" 2>/dev/null || true

# Wait a moment
sleep 2

# Check if process is still running
if launchctl list | grep -q "com.gtek.dante-voice-chip"; then
    echo "❌ Agent still running, forcing stop..."
    # Force kill if necessary
    pkill -f "dante-voice-chip"
else
    echo "✅ Monitoring agent stopped successfully"
fi