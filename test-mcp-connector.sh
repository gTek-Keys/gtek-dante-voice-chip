#!/bin/bash
# 🧪 Dante MCP Connector Test Script
# Ubuntu: "I am because we are" - Testing our AI bridge

echo "🌍 Testing Dante MCP Connector with Ubuntu Spirit"
echo "=================================================="

# Configuration
MCP_SECRET="dev-secret-key"
ENDPOINT="http://localhost:3000/api/mcp"

echo
echo "🔒 Testing Authentication (should fail)..."
curl -s -X POST $ENDPOINT \
  -H "Content-Type: application/json" \
  -d '{"command": "hello"}' | jq -r '.ubuntu_message // .error'

echo
echo "👋 Testing Hello Command..."
curl -s -X POST $ENDPOINT \
  -H "Content-Type: application/json" \
  -H "x-mcp-secret: $MCP_SECRET" \
  -d '{"command": "hello"}' | jq -r '.message'

echo  
echo "📊 Testing Status Command..."
curl -s -X POST $ENDPOINT \
  -H "Content-Type: application/json" \
  -H "x-mcp-secret: $MCP_SECRET" \
  -d '{"command": "status"}' | jq -r '.status'

echo
echo "🌱 Testing Git Command..."
curl -s -X POST $ENDPOINT \
  -H "Content-Type: application/json" \
  -H "x-mcp-secret: $MCP_SECRET" \
  -d '{"command": "git", "args": ["branch"]}' | jq -r '.command'

echo
echo "🌍 Testing Ubuntu Philosophy..."
curl -s -X POST $ENDPOINT \
  -H "Content-Type: application/json" \
  -H "x-mcp-secret: $MCP_SECRET" \
  -d '{"command": "ubuntu"}' | jq -r '.philosophy'

echo
echo "❌ Testing Unknown Command..."
curl -s -X POST $ENDPOINT \
  -H "Content-Type: application/json" \
  -H "x-mcp-secret: $MCP_SECRET" \
  -d '{"command": "unknown"}' | jq -r '.ubuntu_guidance'

echo
echo "✅ MCP Connector Tests Complete!"
echo "🌍 Ubuntu spirit flows through our technology"
echo
echo "📋 Ready for Perplexity Integration:"
echo "   - Server Name: gtek-world-dante"
echo "   - Endpoint: https://gtek.world/api/mcp"
echo "   - Secret: Set MCP_SECRET in Vercel environment"
echo "   - Philosophy: Ubuntu excellence achieved!"