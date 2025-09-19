#!/bin/bash

# Dante Voice Chip - Quick Start Script
# This script helps you get the entire system running quickly

set -e

echo "🚀 Starting Dante Voice Chip Control Tower..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_warning "This system is optimized for macOS. Some features may not work on other platforms."
fi

# Check dependencies
print_status "Checking dependencies..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is required but not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the root of the gtek-dante-voice-chip directory"
    exit 1
fi

print_success "Dependencies check passed"

# Install main dependencies
print_status "Installing main dependencies..."
npm install

# Install agent (if not already installed)
if [ ! -d "$HOME/.dante-voice-chip" ]; then
    print_status "Installing terminal monitoring agent..."
    cd agent
    chmod +x *.sh
    ./install.sh
    cd ..
    print_success "Agent installed successfully"
else
    print_status "Agent already installed, skipping..."
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install voice service dependencies
print_status "Installing voice service dependencies..."
cd voice
npm install
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
cd ..

print_success "All dependencies installed"

# Create environment file template
if [ ! -f ".env.template" ]; then
    print_status "Creating environment template..."
    cat > .env.template << EOF
# Dante Voice Chip Environment Configuration
# Copy this to .env files in each module and fill in your values

# OpenAI API Key (required for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Backend Configuration
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# Voice Service Configuration
VOICE_PORT=3002

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_VOICE_URL=http://localhost:3002
EOF
    print_success "Environment template created at .env.template"
    print_warning "Please configure your OpenAI API key in each module's .env file"
fi

# Start services
print_status "Starting all services..."

# Function to start service in background
start_service() {
    local service_name=$1
    local service_dir=$2
    local start_command=$3
    local port=$4
    
    print_status "Starting $service_name..."
    cd $service_dir
    
    # Kill existing process on port if any
    if lsof -Pi :$port -sTCP:LISTEN -t &> /dev/null; then
        print_warning "Port $port is already in use. Killing existing process..."
        kill $(lsof -ti:$port) 2>/dev/null || true
        sleep 2
    fi
    
    # Start service in background
    nohup $start_command > ../logs/$service_name.log 2>&1 &
    local pid=$!
    echo $pid > ../logs/$service_name.pid
    
    # Wait a moment and check if it's still running
    sleep 3
    if kill -0 $pid 2>/dev/null; then
        print_success "$service_name started (PID: $pid)"
    else
        print_error "$service_name failed to start. Check logs/$service_name.log"
        return 1
    fi
    
    cd ..
}

# Create logs directory
mkdir -p logs

# Start backend
start_service "backend" "backend" "npm start" "3001"

# Start voice service
start_service "voice" "voice" "npm start" "3002"

# Start agent
print_status "Starting terminal monitoring agent..."
cd agent
./start.sh
cd ..

# Start frontend (this will block)
print_status "Starting frontend dashboard..."
print_success "All background services started successfully!"

echo ""
echo "🎛️ Dante Voice Chip Control Tower is now running!"
echo "================================================"
echo ""
echo "📊 Dashboard:        http://localhost:3000"
echo "🔧 Backend API:      http://localhost:3001"
echo "🎤 Voice Service:    http://localhost:3002"
echo "📝 Logs Directory:   ./logs/"
echo ""
echo "🎙️ Try saying: 'Summarize my terminal activity'"
echo "📋 Check tasks:   'Show my tasks'"
echo "🔍 Search logs:    'Search for git commands'"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Start frontend in foreground
cd frontend
npm run dev

# Cleanup function
cleanup() {
    echo ""
    print_status "Shutting down Dante Voice Chip..."
    
    # Stop frontend (already stopped by Ctrl+C)
    
    # Stop backend
    if [ -f "../logs/backend.pid" ]; then
        kill $(cat ../logs/backend.pid) 2>/dev/null || true
        rm ../logs/backend.pid
    fi
    
    # Stop voice service
    if [ -f "../logs/voice.pid" ]; then
        kill $(cat ../logs/voice.pid) 2>/dev/null || true
        rm ../logs/voice.pid
    fi
    
    # Stop agent
    cd ../agent
    ./stop.sh
    cd ..
    
    print_success "All services stopped. Goodbye!"
    exit 0
}

# Set up cleanup on script exit
trap cleanup SIGINT SIGTERM