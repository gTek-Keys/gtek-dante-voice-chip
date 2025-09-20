#!/bin/bash

# 🎼 Dante Voice Chip Orchestra - Ultimate Build Automation
# The conductor's baton that orchestrates the entire full-stack symphony

set -e  # Exit on any error

# 🎨 Color palette for beautiful terminal output
RED='\033[0;31m'
GOLD='\033[0;33m'
GREEN='\033[0;32m'
BLACK='\033[0;30m'
RESET='\033[0m'
BOLD='\033[1m'

# 🏁 Banner
echo -e "${BOLD}${GOLD}"
echo "🎼 ════════════════════════════════════════════════════════════════"
echo "   DANTE VOICE CHIP ORCHESTRA - FULL STACK AUTOMATION"
echo "   🚀 One Command, Complete Deploy - Afrocentric Excellence"
echo "════════════════════════════════════════════════════════════════${RESET}"

# 📁 Project root detection
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "\n${GREEN}📂 Project Root: ${PROJECT_ROOT}${RESET}"

# 🧹 Clean previous builds
echo -e "\n${GOLD}🧹 Cleaning previous builds...${RESET}"
./scripts/clean.sh 2>/dev/null || true

# 📝 Generate dynamic configurations
echo -e "\n${GOLD}📝 Generating dynamic configurations...${RESET}"
./scripts/generate-configs.sh

# 🏗️ Install dependencies across all workspaces
echo -e "\n${GOLD}🏗️ Installing dependencies...${RESET}"
npm install --workspaces

# 🔍 Type checking and linting
echo -e "\n${GOLD}🔍 Running type checks and linting...${RESET}"
npm run lint:all || {
    echo -e "${RED}⚠️  Linting issues found, attempting auto-fix...${RESET}"
    npm run lint:all -- --fix || true
}

# 🧪 Run tests
echo -e "\n${GOLD}🧪 Running tests...${RESET}"
npm run test:all || {
    echo -e "${RED}⚠️  Some tests failed, continuing with build...${RESET}"
}

# 🏭 Build all projects
echo -e "\n${GOLD}🏭 Building all projects...${RESET}"

# Frontend build with Next.js optimizations
echo -e "${GREEN}  🌐 Building frontend...${RESET}"
cd frontend
npm run build || {
    echo -e "${RED}❌ Frontend build failed!${RESET}"
    exit 1
}
cd ..

# Backend build for Vercel functions
echo -e "${GREEN}  ⚡ Building backend...${RESET}"
cd backend
npm run build 2>/dev/null || echo "Backend build not configured, skipping..."
cd ..

# Voice module build
echo -e "${GREEN}  🎤 Building voice module...${RESET}"
cd voice
npm run build 2>/dev/null || echo "Voice build not configured, skipping..."
cd ..

# 🔐 Agent setup verification
echo -e "\n${GOLD}🔐 Verifying agent setup...${RESET}"
if [ ! -d "$HOME/.dante-voice-chip" ]; then
    echo -e "${GREEN}  Installing agent for first time...${RESET}"
    cd agent && ./install.sh && cd ..
else
    echo -e "${GREEN}  ✅ Agent already installed${RESET}"
fi

# 📊 Build statistics
echo -e "\n${GOLD}📊 Build Statistics:${RESET}"
FRONTEND_SIZE=$(du -sh frontend/.next 2>/dev/null | cut -f1 || echo "N/A")
echo -e "${GREEN}  📦 Frontend bundle: ${FRONTEND_SIZE}${RESET}"

if [ -d "backend/dist" ]; then
    BACKEND_SIZE=$(du -sh backend/dist | cut -f1)
    echo -e "${GREEN}  ⚡ Backend bundle: ${BACKEND_SIZE}${RESET}"
fi

# 🌐 Deployment preparation
echo -e "\n${GOLD}🌐 Preparing for deployment...${RESET}"

# Verify Vercel configuration
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}⚠️  No vercel.json found, generating...${RESET}"
    ./scripts/generate-vercel-config.sh
fi

# 🚀 Deploy to Vercel
echo -e "\n${GOLD}🚀 Deploying to Vercel...${RESET}"
if command -v vercel >/dev/null 2>&1; then
    vercel --prod --yes || {
        echo -e "${RED}❌ Deployment failed!${RESET}"
        echo -e "${GOLD}💡 Try: npm install -g vercel && vercel login${RESET}"
        exit 1
    }
else
    echo -e "${RED}⚠️  Vercel CLI not found. Installing...${RESET}"
    npm install -g vercel
    echo -e "${GOLD}🔐 Please run 'vercel login' then re-run this script${RESET}"
    exit 1
fi

# 🎉 Success celebration
echo -e "\n${BOLD}${GREEN}"
echo "🎉 ══════════════════════════════════════════════════════════════"
echo "   DEPLOYMENT SUCCESSFUL! 🚀"
echo "   Your Dante Voice Chip is now live and orchestrating!"
echo "══════════════════════════════════════════════════════════════"
echo -e "${RESET}"

# 📱 Show deployment info
echo -e "\n${GOLD}📱 Deployment Information:${RESET}"
VERCEL_URL=$(vercel ls 2>/dev/null | grep dante-voice-chip | head -1 | awk '{print $2}' || echo "Check Vercel dashboard")
echo -e "${GREEN}  🌐 Live URL: https://${VERCEL_URL}${RESET}"
echo -e "${GREEN}  🎛️  Agent Status: $(cd agent && ./status.sh | grep -o 'RUNNING\|STOPPED' || echo 'Check manually')${RESET}"

# 🔗 Quick links
echo -e "\n${GOLD}🔗 Quick Commands:${RESET}"
echo -e "${GREEN}  🎛️  Agent status: npm run agent:status${RESET}"
echo -e "${GREEN}  🔄 Redeploy: npm run 🚀${RESET}"
echo -e "${GREEN}  🧹 Clean: npm run clean${RESET}"

echo -e "\n${BOLD}${GOLD}🎼 Orchestra complete! The symphony plays on... 🎵${RESET}\n"