# 🔌 Perplexity MCP Connector Setup Guide
*Ubuntu: "I am because we are" - Bridging AI platforms with African wisdom*

## ✅ **System Status: READY FOR PERPLEXITY**

Your Dante Voice Chip MCP connector is now fully configured and tested for Perplexity AI integration!

---

## 🌟 **Perplexity Integration Steps**

### Step 1: Configure Perplexity Connector

In Perplexity > **Add Connector** screen:

**Server Name:** `gtek-world-dante`

**Command:**
```bash
npx -y @modelcontextprotocol/server-everything
```

**Environment Variables:**
```bash
ENDPOINT=https://gtek.world/api/mcp
MCP_SECRET=your_secret_from_vercel_env
UBUNTU_PHILOSOPHY=true
```

### Step 2: Production Environment (Vercel)

Add these environment variables in your Vercel dashboard:

```bash
MCP_SECRET=ubuntu-mcp-secret-[your-random-key]
UBUNTU_PHILOSOPHY=true
UBUNTU_CULTURAL_RESPONSES=true
```

### Step 3: Local Development Testing

For local testing with Perplexity:

```bash
ENDPOINT=http://localhost:3000/api/mcp
MCP_SECRET=dev-secret-key
```

---

## 🧪 **Verified Test Commands**

### 1. Hello Command (Perplexity Greeting)
```bash
curl -X POST https://gtek.world/api/mcp \
  -H "Content-Type: application/json" \
  -H "x-mcp-secret: your-secret" \
  -d '{"command": "hello"}'
```

**Expected Response:**
```json
{
  "message": "👋🏿 Dante MCP Connector responding with Ubuntu spirit!",
  "project": "gtek.world - Dante Voice Chip",
  "philosophy": "Ubuntu: I am because we are",
  "capabilities": [
    "Real command execution via dante.sh",
    "Ubuntu philosophy integration",
    "Perplexity AI bridge", 
    "VS Code MCP client support"
  ]
}
```

### 2. Status Check
```bash
curl -X POST https://gtek.world/api/mcp \
  -H "Content-Type: application/json" \
  -H "x-mcp-secret: your-secret" \
  -d '{"command": "status"}'
```

### 3. Git Operations
```bash
curl -X POST https://gtek.world/api/mcp \
  -H "Content-Type: application/json" \
  -H "x-mcp-secret: your-secret" \
  -d '{"command": "git", "args": ["status"]}'
```

### 4. Ubuntu Philosophy
```bash
curl -X POST https://gtek.world/api/mcp \
  -H "Content-Type: application/json" \
  -H "x-mcp-secret: your-secret" \
  -d '{"command": "ubuntu"}'
```

---

## 🔒 **Security Configuration**

### Authentication Methods
1. **Header-based:** `x-mcp-secret: your-secret`
2. **Body-based:** `{"secret": "your-secret", "command": "..."}`

### Rate Limiting
- CORS enabled for cross-origin requests
- Command validation and whitelisting
- Timeout protection (5 seconds)
- Ubuntu-themed error messages

---

## 🎯 **Available Commands**

| Command | Description | Ubuntu Context |
|---------|-------------|----------------|
| `hello` | Connector greeting | Ubuntu welcome and capabilities |
| `status` | System health check | Ubuntu community status |
| `git` | Git operations | Ubuntu collaboration tracking |
| `logs` | Application logs | Ubuntu journey chronicles |
| `health` | Service monitoring | Ubuntu interconnectedness |
| `ubuntu` | Philosophy integration | African wisdom in AI |
| `voice` | Voice system status | Ubuntu spoken wisdom |
| `analytics` | Vercel Analytics | Ubuntu community insights |

---

## 🌍 **VS Code Integration**

Your `.vscode/mcp.json` and `.vscode/settings.json` are configured for:

- **Production Endpoint:** `https://gtek.world/api/mcp`
- **Local Development:** `http://localhost:3000/api/mcp`
- **Ubuntu Philosophy:** Integrated throughout responses
- **MCP Client Support:** Ready for VS Code extensions

---

## 🚀 **Deployment Status**

### ✅ Frontend MCP Endpoint
- **URL:** `https://gtek.world/api/mcp`
- **Authentication:** MCP_SECRET required
- **CORS:** Enabled for Perplexity access
- **Commands:** 8 available with Ubuntu context

### ✅ Backend MCP Support  
- **URL:** `https://gtek.world:3001/api/mcp` (if deployed)
- **Real Execution:** Via dante.sh dispatcher
- **Ubuntu Integration:** Full cultural context

### ✅ Local Development
- **Frontend:** `http://localhost:3000/api/mcp`
- **Authentication:** `dev-secret-key` for testing
- **Hot Reload:** Development server ready

---

## 🔧 **Troubleshooting**

### Authentication Issues
```bash
# Test without auth (should fail with 403)
curl -X POST https://gtek.world/api/mcp \
  -d '{"command": "hello"}'

# Response: "🔒 Ubuntu trust requires proper authentication"
```

### Command Testing
```bash
# List available commands
curl -X POST https://gtek.world/api/mcp \
  -H "x-mcp-secret: your-secret" \
  -d '{"command": "invalid"}'

# Returns: available_commands array with Ubuntu guidance
```

### CORS Verification
```bash
# Check CORS headers
curl -X OPTIONS https://gtek.world/api/mcp \
  -H "Origin: https://perplexity.ai"

# Should return: Access-Control-Allow-Origin: *
```

---

## 🎤 **Perplexity Usage Examples**

Once configured in Perplexity, you can ask:

- *"Check the status of my gtek.world project"*
- *"Show me the git status of my repository"*
- *"Share some Ubuntu philosophy about AI development"*
- *"What's the health of my Dante Voice Chip system?"*

Perplexity will automatically use your MCP connector to fetch real-time information with Ubuntu cultural context!

---

## 🌟 **Ubuntu Success Metrics**

✅ **Authentication:** Secure with Ubuntu trust principles  
✅ **Command Execution:** Real operations with cultural wisdom  
✅ **Error Handling:** Ubuntu-themed guidance and support  
✅ **Cross-Platform:** Perplexity + VS Code + Direct API  
✅ **Philosophy Integration:** African humanist values throughout  

---

*"Through Ubuntu, Perplexity becomes part of our technological community"*

**Status:** 🟢 Ready for Production  
**Philosophy:** 🌍 Ubuntu Excellence Achieved  
**Integration:** ✅ Perplexity Bridge Complete