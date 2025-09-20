#!/bin/bash

# 🎤 Test Dante Voice Control MCP Integration
# Tests voice command API with various commands

echo "🎼 Testing Dante Voice Control with Ubuntu Excellence"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API endpoint
API_URL="http://localhost:3000/api/mcp/command"

# Test function
test_command() {
    local command="$1"
    local description="$2"
    
    echo -e "\n${BLUE}🧪 Testing:${NC} $description"
    echo -e "${YELLOW}Command:${NC} \"$command\""
    
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{\"command\":\"$command\"}" \
        "$API_URL" 2>/dev/null)
    
    if [ $? -eq 0 ] && [ -n "$response" ]; then
        success=$(echo "$response" | jq -r '.success' 2>/dev/null)
        message=$(echo "$response" | jq -r '.message' 2>/dev/null)
        mcp_used=$(echo "$response" | jq -r '.mcp_used' 2>/dev/null)
        
        if [ "$success" = "true" ]; then
            echo -e "${GREEN}✅ Success:${NC} $message"
            echo -e "${BLUE}📡 MCP Used:${NC} $mcp_used"
        else
            echo -e "${RED}❌ Failed:${NC} $message"
        fi
    else
        echo -e "${RED}❌ Network Error:${NC} Could not reach API"
    fi
}

# Check if server is running
echo -e "${BLUE}🔍 Checking if Next.js server is running...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Server is running${NC}"
else
    echo -e "${RED}❌ Server not running. Start with: npm run dev${NC}"
    exit 1
fi

# Get available commands first
echo -e "\n${BLUE}📋 Getting available commands...${NC}"
available_response=$(curl -s -X GET "$API_URL" 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "$available_response" | jq '.available_commands' 2>/dev/null
fi

# Test various voice commands
echo -e "\n${YELLOW}🎯 Testing Voice Commands${NC}"
echo "=========================="

test_command "rebuild frontend" "Frontend rebuild command"
test_command "show containers" "Docker container listing"
test_command "start orchestra" "Start all services"
test_command "run tests" "Execute test suite"
test_command "git status" "Git repository status"
test_command "dante, rebuild backend" "Natural language backend rebuild"
test_command "show me the logs" "Log file viewing"
test_command "invalid command that should fail" "Invalid command handling"

# Test MCP availability
echo -e "\n${BLUE}🔧 Testing MCP Availability${NC}"
echo "============================"

if command -v docker >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker is installed${NC}"
    
    # Test if MCP is available
    if docker mcp --help >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Docker MCP is available${NC}"
    else
        echo -e "${YELLOW}⚠️  Docker MCP not available - using fallback commands${NC}"
        echo -e "${BLUE}💡 Install MCP with: npm install -g @modelcontextprotocol/cli${NC}"
    fi
else
    echo -e "${RED}❌ Docker not found${NC}"
fi

echo -e "\n${GREEN}🎼 Voice Control Testing Complete!${NC}"
echo -e "${BLUE}💡 Open dashboard at: http://localhost:3000/dashboard${NC}"
echo -e "${YELLOW}🎤 Try voice commands with cultural Ubuntu spirit!${NC}"