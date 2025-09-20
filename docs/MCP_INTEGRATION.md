# 🎼 Dante Voice Chip MCP Integration Guide
# Model Context Protocol for AI-Powered Development

## 🚀 MCP Setup Instructions

### Prerequisites
1. Docker Desktop with MCP support (28.4.0+)
2. MCP CLI tools
3. Node.js 18+ for API integration

### MCP Gateway Installation

```bash
# Check if MCP is available
docker mcp --help

# If not available, install MCP CLI
npm install -g @modelcontextprotocol/cli

# Or use Docker extension (if available)
docker extension install mcp-gateway
```

### Enable MCP Gateway

```bash
# Start MCP gateway
docker mcp gateway run --transport streaming

# Enable Docker control server
docker mcp server enable docker-control

# Enable filesystem server
docker mcp server enable filesystem

# Enable terminal server  
docker mcp server enable terminal

# Set required secrets
docker mcp secret set DOCKER_SOCKET_PATH=/var/run/docker.sock
docker mcp secret set WORKSPACE_PATH=/Users/bfh/gtek-dante-voice-chip
```

### Test MCP Tools

```bash
# Test Docker commands
docker mcp tools call docker-control "containers list"

# Test filesystem queries
docker mcp tools call filesystem "read /Users/bfh/gtek-dante-voice-chip/package.json"

# Test terminal commands
docker mcp tools call terminal "echo 'Hello from MCP!'"
```

## 🎯 Voice Commands We'll Support

### Docker Orchestra Commands
- "Dante, rebuild the frontend"
- "Dante, show container status"  
- "Dante, start the orchestra"
- "Dante, stop all containers"

### Development Commands
- "Dante, show recent logs"
- "Dante, run tests"
- "Dante, deploy to Vercel"
- "Dante, check agent status"

### File Operations
- "Dante, read the config file"
- "Dante, show git status"
- "Dante, list recent changes"

## 🔐 Security Configuration

### Allowed Commands (Whitelist)
```javascript
const ALLOWED_MCP_COMMANDS = {
  'docker-control': [
    'containers list',
    'images list', 
    'compose up',
    'compose down',
    'compose build'
  ],
  'filesystem': [
    'read package.json',
    'read docker-compose.yml',
    'list logs/',
    'stat .'
  ],
  'terminal': [
    'npm run build',
    'npm test',
    'git status',
    'agent status'
  ]
}
```

### Restricted Paths
```javascript
const RESTRICTED_PATHS = [
  '/etc/',
  '/usr/',
  '/var/run/',
  '~/.ssh/',
  '/System/'
]
```

## 🎨 Afrocentric Voice Responses

### Success Messages
- "🎼 Orchestra command executed with excellence!"
- "✅ Task completed in the spirit of Ubuntu!"
- "🌍 Command successful - moving forward together!"

### Error Messages  
- "🚨 Command failed - let's troubleshoot with wisdom"
- "⚠️ Access denied - protecting our sacred workspace"
- "🔄 Retrying with patience and persistence"

## 📊 Command Logging

All voice commands will be logged to:
- `~/.dante-voice-chip/logs/voice-commands.log`
- Dashboard UI under "Voice Activity"
- MCP audit trail for security

## 🌐 Production Considerations

### Local Development
- Full MCP integration with Docker
- All commands available
- Real-time feedback

### Vercel Production
- MCP commands disabled (no Docker)
- Read-only operations only
- Graceful fallback messages

## 🎵 Integration Flow

```
Voice Input → Speech Recognition → Command Parser → MCP Gateway → Docker/Tools → Response → Voice Output
```

This creates a complete **AI-powered development assistant** that speaks with cultural pride and technical excellence!