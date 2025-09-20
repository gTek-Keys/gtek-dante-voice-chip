#!/bin/bash

# Dante Voice Chip - Check monitoring agent status

PLIST_PATH="$HOME/Library/LaunchAgents/com.gtek.dante-voice-chip.plist"
AGENT_DIR="$HOME/.dante-voice-chip"

echo "🔍 Dante Voice Chip Agent Status"
echo "==============================="

# Check if plist exists
if [ ! -f "$PLIST_PATH" ]; then
    echo "❌ Agent not installed (plist missing)"
    echo "Run ./install.sh to install the agent"
    exit 1
fi

# Check if process is running
if launchctl list | grep -q "com.gtek.dante-voice-chip"; then
    echo "✅ Monitoring agent is RUNNING"
    
    # Get process info
    PID=$(launchctl list | grep "com.gtek.dante-voice-chip" | awk '{print $1}')
    if [ "$PID" != "-" ]; then
        echo "📊 Process ID: $PID"
    fi
else
    echo "❌ Monitoring agent is STOPPED"
fi

# Check directories
echo ""
echo "📁 Directory Status:"
if [ -d "$AGENT_DIR" ]; then
    echo "✅ Agent directory: $AGENT_DIR"
    echo "✅ Logs directory: $AGENT_DIR/logs"
    echo "✅ Vault directory: $AGENT_DIR/vault"
else
    echo "❌ Agent directory missing: $AGENT_DIR"
fi

# Check log files
echo ""
echo "📝 Log Files:"
if [ -f "$AGENT_DIR/logs/monitor.log" ]; then
    echo "✅ Monitor log exists ($(wc -l < "$AGENT_DIR/logs/monitor.log") lines)"
    echo "📅 Last modified: $(stat -f "%Sm" "$AGENT_DIR/logs/monitor.log")"
else
    echo "❌ Monitor log missing"
fi

if [ -f "$AGENT_DIR/logs/agent.log" ]; then
    echo "✅ Agent log exists ($(wc -l < "$AGENT_DIR/logs/agent.log") lines)"
else
    echo "❌ Agent log missing"
fi

# Check database
echo ""
echo "🗄️ Database Status:"
if [ -f "$AGENT_DIR/vault/sessions.db" ]; then
    echo "✅ Sessions database exists"
    # Check if we can query it
    if command -v sqlite3 >/dev/null 2>&1; then
        COMMANDS=$(sqlite3 "$AGENT_DIR/vault/sessions.db" "SELECT COUNT(*) FROM commands;" 2>/dev/null || echo "0")
        echo "📊 Commands recorded: $COMMANDS"
    fi
else
    echo "❌ Sessions database missing"
fi

# Check encryption key
echo ""
echo "🔐 Security Status:"
if [ -f "$AGENT_DIR/encryption.key" ]; then
    echo "✅ Encryption key exists"
    echo "🔒 Key permissions: $(stat -f "%A" "$AGENT_DIR/encryption.key")"
else
    echo "❌ Encryption key missing"
fi

# Show recent activity
echo ""
echo "📈 Recent Activity:"
if [ -f "$AGENT_DIR/logs/monitor.log" ]; then
    echo "Last 3 log entries:"
    tail -n 3 "$AGENT_DIR/logs/monitor.log" 2>/dev/null || echo "No recent entries"
fi

echo ""
echo "🎛️ Control Commands:"
echo "   Start:  ./start.sh"
echo "   Stop:   ./stop.sh"
echo "   Logs:   tail -f $AGENT_DIR/logs/monitor.log"
echo ""

# Show dashboard info
echo "🌐 Dashboard URLs:"
echo "   Local:  http://localhost:3000"
echo "   Live:   https://frontend-fmdm02idr-g-tek-industries.vercel.app"