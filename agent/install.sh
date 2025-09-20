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
# Copy the main monitor script
cp ./monitor.py "$AGENT_DIR/scripts/" 2>/dev/null || echo "monitor.py already in place"

# Create additional scripts if they don't exist
if [ ! -f "./session_tracker.sh" ]; then
    cat > "$AGENT_DIR/scripts/session_tracker.sh" << 'EOF'
#!/bin/bash
# Session tracker for terminal monitoring
export HISTTIMEFORMAT="%Y-%m-%d %H:%M:%S "
export PROMPT_COMMAND="history -a; history -n"
EOF
fi

if [ ! -f "./log_rotator.py" ]; then
    cat > "$AGENT_DIR/scripts/log_rotator.py" << 'EOF'
#!/usr/bin/env python3
# Log rotation utility
import os
import gzip
from datetime import datetime, timedelta

def rotate_logs():
    """Rotate and compress old log files"""
    log_dir = os.path.expanduser("~/.dante-voice-chip/logs")
    for file in os.listdir(log_dir):
        if file.endswith('.log') and os.path.getmtime(os.path.join(log_dir, file)) < time.time() - 86400:
            # Compress files older than 1 day
            with open(os.path.join(log_dir, file), 'rb') as f_in:
                with gzip.open(os.path.join(log_dir, file + '.gz'), 'wb') as f_out:
                    f_out.writelines(f_in)
            os.remove(os.path.join(log_dir, file))

if __name__ == "__main__":
    rotate_logs()
EOF
fi

if [ ! -f "./vault_manager.py" ]; then
    cat > "$AGENT_DIR/scripts/vault_manager.py" << 'EOF'
#!/usr/bin/env python3
# Vault management utility
import sqlite3
import os
from cryptography.fernet import Fernet

class VaultManager:
    def __init__(self):
        self.vault_dir = os.path.expanduser("~/.dante-voice-chip/vault")
        self.db_path = os.path.join(self.vault_dir, "sessions.db")
        
    def get_stats(self):
        """Get vault statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute("SELECT COUNT(*) FROM commands")
        command_count = cursor.fetchone()[0]
        conn.close()
        return {"total_commands": command_count}

if __name__ == "__main__":
    vm = VaultManager()
    print(vm.get_stats())
EOF
fi

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
# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip3 install --user cryptography psutil watchdog || {
    print_warning "Some Python packages failed to install. Agent may have limited functionality."
}

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