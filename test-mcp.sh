#!/bin/bash

# 🔌 MCP Connector Test Script
# Test the Model Context Protocol endpoints with Ubuntu spirit

echo "🎤 Testing MCP (Model Context Protocol) Endpoints"
echo "================================================="
echo ""

# Color codes for Ubuntu-style output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backend and Frontend URLs
BACKEND_URL="http://localhost:3001"
FRONTEND_URL="http://localhost:3000"

echo -e "${BLUE}🌍 Ubuntu Philosophy: I am because we are${NC}"
echo -e "${BLUE}Testing MCP connectors with cultural wisdom...${NC}"
echo ""

# Function to test an endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local data="$3"
    
    echo -e "${YELLOW}Testing: $name${NC}"
    echo "URL: $url"
    echo "Data: $data"
    echo ""
    
    response=$(curl -s -X POST "$url" \
        -H "Content-Type: application/json" \
        -d "$data" \
        --max-time 10)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Response received${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
    else
        echo -e "${RED}❌ Request failed${NC}"
    fi
    
    echo ""
    echo "---"
    echo ""
}

# Test Backend MCP Endpoint
echo -e "${BLUE}🔧 Testing Backend MCP Endpoint${NC}"
test_endpoint "Status Command" "$BACKEND_URL/api/mcp" '{"command": "status"}'
test_endpoint "Ubuntu Wisdom" "$BACKEND_URL/api/mcp" '{"command": "ubuntu"}'
test_endpoint "Health Check" "$BACKEND_URL/api/mcp" '{"command": "health"}'
test_endpoint "Git Status" "$BACKEND_URL/api/mcp" '{"command": "git", "args": ["status"]}'

# Test Frontend MCP Endpoint  
echo -e "${BLUE}🎨 Testing Frontend MCP Endpoint${NC}"
test_endpoint "Voice Command" "$FRONTEND_URL/api/mcp" '{"command": "voice"}'
test_endpoint "Analytics Info" "$FRONTEND_URL/api/mcp" '{"command": "analytics"}'
test_endpoint "Deployment Status" "$FRONTEND_URL/api/mcp" '{"command": "deploy"}'
test_endpoint "Unknown Command" "$FRONTEND_URL/api/mcp" '{"command": "unknown_test"}'

# Test GET endpoints
echo -e "${BLUE}📋 Testing GET Endpoints${NC}"
echo -e "${YELLOW}Backend MCP Info:${NC}"
curl -s "$BACKEND_URL/api/mcp" | jq '.' 2>/dev/null || curl -s "$BACKEND_URL/api/mcp"
echo ""
echo ""

echo -e "${YELLOW}Frontend MCP Info:${NC}"
curl -s "$FRONTEND_URL/api/mcp" | jq '.' 2>/dev/null || curl -s "$FRONTEND_URL/api/mcp"
echo ""
echo ""

# Test error handling
echo -e "${BLUE}🚨 Testing Error Handling${NC}"
test_endpoint "Invalid JSON" "$BACKEND_URL/api/mcp" '{"invalid": json}'
test_endpoint "Missing Command" "$FRONTEND_URL/api/mcp" '{}'

echo -e "${GREEN}🎉 MCP Testing Complete!${NC}"
echo ""
echo -e "${BLUE}Ubuntu Wisdom: Every test strengthens our technological community${NC}"
echo -e "${BLUE}Voice commands now bridge human intention with Ubuntu excellence${NC}"