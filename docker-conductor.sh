#!/bin/bash

# 🎼 Dante Voice Chip Orchestra - Docker Conductor Script
# One command to rule all containers with Afrocentric excellence

set -e

# 🎨 Colors for beautiful output
RED='\033[0;31m'
GOLD='\033[0;33m' 
GREEN='\033[0;32m'
RESET='\033[0m'
BOLD='\033[1m'

echo -e "${BOLD}${GOLD}"
echo "🎼 ══════════════════════════════════════════════════════════════"
echo "   DANTE VOICE CHIP ORCHESTRA - DOCKER CONDUCTOR"
echo "   🐳 Containerized Excellence with Cultural Flair"
echo "══════════════════════════════════════════════════════════════"
echo -e "${RESET}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop first.${RESET}"
    exit 1
fi

# Check for docker compose command
DOCKER_COMPOSE="docker compose"
if ! command -v docker > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker not found. Please install Docker first.${RESET}"
    exit 1
fi

# Parse command line arguments
COMMAND=${1:-"up"}

case $COMMAND in
    "up"|"start")
        echo -e "${GREEN}🚀 Starting the Orchestra...${RESET}"
        docker-compose up --build -d
        echo -e "${GREEN}✅ Orchestra is playing!${RESET}"
        echo -e "${GOLD}🌐 Dashboard: http://localhost:3000${RESET}"
        echo -e "${GOLD}📊 Database Tools: http://localhost:8080 (with --profile tools)${RESET}"
        ;;
        
    "dev")
        echo -e "${GREEN}🛠️ Starting development environment...${RESET}"
        docker-compose up --build
        ;;
        
    "stop")
        echo -e "${GOLD}⏹️ Stopping the Orchestra...${RESET}"
        docker compose stop
        echo -e "${GREEN}✅ Orchestra stopped gracefully${RESET}"
        ;;
        
    "down")
        echo -e "${GOLD}🧹 Shutting down and cleaning up...${RESET}"
        docker-compose down
        echo -e "${GREEN}✅ Orchestra shutdown complete${RESET}"
        ;;
        
    "reset")
        echo -e "${GOLD}🔄 Full reset - removing all containers and volumes...${RESET}"
        docker compose down -v
        docker compose up --build -d
        echo -e "${GREEN}✅ Orchestra reset and restarted!${RESET}"
        ;;
        
    "logs")
        SERVICE=${2:-"dante-frontend"}
        echo -e "${GREEN}📜 Showing logs for ${SERVICE}...${RESET}"
        docker compose logs -f $SERVICE
        ;;
        
    "shell")
        SERVICE=${2:-"dante-frontend"}
        echo -e "${GREEN}🐚 Opening shell in ${SERVICE}...${RESET}"
        docker compose exec $SERVICE sh
        ;;
        
    "tools")
        echo -e "${GREEN}🔧 Starting with database tools...${RESET}"
        docker compose --profile tools up --build -d
        echo -e "${GREEN}✅ Orchestra with tools is playing!${RESET}"
        echo -e "${GOLD}🌐 Dashboard: http://localhost:3000${RESET}"
        echo -e "${GOLD}📊 Database Viewer: http://localhost:8080${RESET}"
        ;;
        
    "status")
        echo -e "${GREEN}📊 Orchestra Status:${RESET}"
        docker compose ps
        echo ""
        echo -e "${GREEN}🔍 Container Health:${RESET}"
        docker compose exec dante-frontend curl -s http://localhost:3000/api/logs | jq '.success' 2>/dev/null || echo "Health check failed"
        ;;
        
    "build")
        echo -e "${GREEN}🏗️ Building all images...${RESET}"
        docker compose build --no-cache
        echo -e "${GREEN}✅ Build complete!${RESET}"
        ;;
        
    *)
        echo -e "${GOLD}🎼 Dante Voice Chip Orchestra - Docker Commands:${RESET}"
        echo ""
        echo -e "${GREEN}Basic Commands:${RESET}"
        echo "  ./docker-conductor.sh up       - Start the orchestra (detached)"
        echo "  ./docker-conductor.sh dev      - Start in development mode (attached)"
        echo "  ./docker-conductor.sh stop     - Stop all services"
        echo "  ./docker-conductor.sh down     - Stop and remove containers"
        echo "  ./docker-conductor.sh reset    - Full reset and restart"
        echo ""
        echo -e "${GREEN}Development Commands:${RESET}"
        echo "  ./docker-conductor.sh logs [service]  - View logs (default: frontend)"
        echo "  ./docker-conductor.sh shell [service] - Open shell in container"
        echo "  ./docker-conductor.sh tools           - Start with database tools"
        echo "  ./docker-conductor.sh status          - Show orchestra status"
        echo "  ./docker-conductor.sh build           - Rebuild all images"
        echo ""
        echo -e "${GREEN}Examples:${RESET}"
        echo "  ./docker-conductor.sh logs dante-agent"
        echo "  ./docker-conductor.sh shell dante-frontend"
        echo ""
        echo -e "${GOLD}🌐 URLs when running:${RESET}"
        echo "  Frontend Dashboard: http://localhost:3000"
        echo "  Database Viewer:    http://localhost:8080 (with tools)"
        ;;
esac

echo -e "\n${GOLD}🎵 The symphony continues with Docker excellence! 🐳${RESET}"