#!/bin/bash

# Dante Voice Chip - Terminal Monitor Agent Installer
# This script sets up terminal session monitoring on macOS

set -e

echo "🚀 Installing Dante Voice Chip Terminal Monitor Agent..."

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This installer is designed for macOS only"
    exit 1
fi

# Create necessary directories
AGENT_DIR="$HOME/.dante-voice-chip"
LOG_DIR="$AGENT_DIR/logs"
VAULT_DIR="$AGENT_DIR/vault"

echo "📁 Creating directories..."
mkdir -p "$LOG_DIR"
mkdir -p "$VAULT_DIR"
mkdir -p "$AGENT_DIR/scripts"

# Copy monitoring scripts
echo "📋 Installing monitoring scripts..."
cp ./monitor.py "$AGENT_DIR/scripts/"
cp ./session_tracker.sh "$AGENT_DIR/scripts/"
cp ./log_rotator.py "$AGENT_DIR/scripts/"
cp ./vault_manager.py "$AGENT_DIR/scripts/"

# Make scripts executable
chmod +x "$AGENT_DIR/scripts/"*.sh
chmod +x "$AGENT_DIR/scripts/"*.py

# Create configuration file
echo "⚙️ Creating configuration..."
cat > "$AGENT_DIR/config.json" << EOF
{
  "log_directory": "$LOG_DIR",
  "vault_directory": "$VAULT_DIR",
  "max_log_size_mb": 100,
  "retention_days": 30,
  "encryption_enabled": true,
  "session_timeout_minutes": 60,
  "commands_to_ignore": ["ls", "pwd", "cd"],
  "sensitive_patterns": ["password", "token", "key", "secret"],
  "api_endpoint": "http://localhost:3000/api"
}
EOF

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip3 install --user cryptography sqlite3 watchdog psutil

# Create launchd plist for automatic startup
echo "🔄 Setting up automatic startup..."
PLIST_PATH="$HOME/Library/LaunchAgents/com.gtek.dante-voice-chip.plist"

cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.gtek.dante-voice-chip</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>$AGENT_DIR/scripts/monitor.py</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>WorkingDirectory</key>
    <string>$AGENT_DIR</string>
    <key>StandardOutPath</key>
    <string>$LOG_DIR/agent.log</string>
    <key>StandardErrorPath</key>
    <string>$LOG_DIR/agent.error.log</string>
</dict>
</plist>
EOF

# Generate encryption key
echo "🔐 Generating encryption key..."
python3 -c "
import os
from cryptography.fernet import Fernet
key = Fernet.generate_key()
with open('$AGENT_DIR/encryption.key', 'wb') as f:
    f.write(key)
os.chmod('$AGENT_DIR/encryption.key', 0o600)
print('Encryption key generated and secured')
"

# Load the launch agent
echo "▶️ Starting monitoring agent..."
launchctl load "$PLIST_PATH"

echo "✅ Installation complete!"
echo ""
echo "📊 Monitoring agent is now running and will:"
echo "   • Record all terminal sessions"
echo "   • Encrypt logs locally"
echo "   • Rotate logs daily"
echo "   • Send data to the dashboard"
echo ""
echo "🎛️ Control commands:"
echo "   Start:  ./start.sh"
echo "   Stop:   ./stop.sh"
echo "   Status: ./status.sh"
echo "   Logs:   tail -f $LOG_DIR/agent.log"
echo ""
echo "🌐 Access your dashboard at: http://localhost:3000"