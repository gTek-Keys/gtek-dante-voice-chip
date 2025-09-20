#!/bin/bash

# 🚀 Quick Launch Script for Dante Voice Chip
# This script provides quick access to common deployment and development tasks

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🎼 Dante Voice Chip - Quick Launcher"
echo "==================================="
echo ""

if [ $# -eq 0 ]; then
    echo -e "${BLUE}Available commands:${NC}"
    echo "  deploy     - Full one-hour deployment to production"
    echo "  dev        - Start development environment"
    echo "  build      - Build for production"
    echo "  test       - Run all tests"
    echo "  health     - Check system health"
    echo "  clean      - Clean build artifacts"
    echo "  logs       - View application logs"
    echo ""
    echo -e "${YELLOW}Usage: $0 <command>${NC}"
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo "  $0 deploy    # Deploy to production"
    echo "  $0 dev       # Start development servers"
    echo "  $0 health    # Check if everything is running"
    exit 0
fi

cd "$PROJECT_ROOT"

case "$1" in
    "deploy")
        echo "🚀 Starting full deployment..."
        if [ -f "scripts/deploy.sh" ]; then
            exec ./scripts/deploy.sh
        else
            echo "❌ Deploy script not found at scripts/deploy.sh"
            exit 1
        fi
        ;;
    
    "dev")
        echo "💻 Starting development environment..."
        
        # Kill any existing processes
        pkill -f "node index.js" 2>/dev/null || true
        pkill -f "next dev" 2>/dev/null || true
        
        # Start backend
        if [ -d "backend" ]; then
            echo "🔧 Starting backend..."
            (
                cd backend
                if [ -f "index.js" ]; then
                    # Check if node_modules exists, install if not
                    if [ ! -d "node_modules" ]; then
                        echo "📦 Installing backend dependencies..."
                        npm install
                    fi
                    echo "🚀 Starting Express server..."
                    node index.js &
                    BACKEND_PID=$!
                    echo "Backend started with PID: $BACKEND_PID"
                else
                    echo "❌ Backend index.js not found"
                fi
            )
        else
            echo "❌ Backend directory not found"
        fi
        
        sleep 2  # Give backend time to start
        
        # Start frontend
        if [ -d "frontend" ]; then
            echo "🎨 Starting frontend..."
            (
                cd frontend
                if [ -f "package.json" ]; then
                    # Check if node_modules exists, install if not
                    if [ ! -d "node_modules" ]; then
                        echo "📦 Installing frontend dependencies..."
                        npm install
                    fi
                    echo "🚀 Starting Next.js dev server..."
                    npm run dev &
                    FRONTEND_PID=$!
                    echo "Frontend started with PID: $FRONTEND_PID"
                else
                    echo "❌ Frontend package.json not found"
                fi
            )
        else
            echo "❌ Frontend directory not found"
        fi
        
        echo ""
        echo -e "${GREEN}✅ Development environment started!${NC}"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:3001"
        echo ""
        echo "Press Ctrl+C to stop all services"
        
        # Wait for interrupt
        trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
        wait
        ;;
    
    "build")
        echo "📦 Building for production..."
        if [ -d "frontend" ]; then
            cd frontend
            npm install
            npm run build
            echo -e "${GREEN}✅ Build completed!${NC}"
            cd ..
        fi
        ;;
    
    "test")
        echo "🧪 Running tests..."
        if [ -d "frontend" ]; then
            cd frontend && npm test
            cd ..
        fi
        if [ -d "backend" ]; then
            cd backend && npm test
            cd ..
        fi
        ;;
    
    "health")
        echo "🏥 Checking system health..."
        
        # Check backend
        if curl -s http://localhost:3001/health >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend: Running${NC}"
        else
            echo -e "${YELLOW}⚠️  Backend: Not running${NC}"
        fi
        
        # Check frontend
        if curl -s http://localhost:3000/ >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend: Running${NC}"
        else
            echo -e "${YELLOW}⚠️  Frontend: Not running${NC}"
        fi
        
        # Check production
        if curl -s https://gtek.world/ >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Production: Accessible${NC}"
        else
            echo -e "${YELLOW}⚠️  Production: Not accessible${NC}"
        fi
        
        # Check webhook
        if curl -s https://gtek.world/api/webhooks/vercel >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Webhook: Active${NC}"
        else
            echo -e "${YELLOW}⚠️  Webhook: Not accessible${NC}"
        fi
        ;;
    
    "clean")
        echo "🧹 Cleaning build artifacts..."
        rm -rf frontend/.next
        rm -rf frontend/node_modules/.cache
        rm -rf backend/node_modules/.cache
        rm -f *.log
        echo -e "${GREEN}✅ Cleanup completed!${NC}"
        ;;
    
    "logs")
        echo "📋 Viewing application logs..."
        if [ -f "backend.log" ]; then
            echo "=== Backend Logs ==="
            tail -20 backend.log
        fi
        if [ -f "agent.log" ]; then
            echo "=== Agent Logs ==="
            tail -20 agent.log
        fi
        echo "Use 'tail -f *.log' to follow logs in real-time"
        ;;
    
    *)
        echo "❌ Unknown command: $1"
        echo "Run '$0' without arguments to see available commands"
        exit 1
        ;;
esac