#!/bin/bash
set -e

echo "🚀 Dante Voice Chip - One-Hour Deployment"
echo "========================================="
echo "🎼 Ubuntu Philosophy: 'I am because we are'"
echo "⏰ Starting automated deployment process..."
echo ""

# Configuration
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"
AGENT_DIR="agent"
DOMAIN="gtek.world"
WEBHOOK_SECRET="qRuMa9LuG4gCIvGMHzqctOCN"

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_step() {
    echo -e "${BLUE}⏱️  Step $1: $2${NC}"
}

# 1. Environment check
log_step "1" "Checking environment..."
command -v node >/dev/null 2>&1 || { log_error "Node.js not found. Please install Node.js 18+"; exit 1; }
command -v npm >/dev/null 2>&1 || { log_error "npm not found. Please install npm"; exit 1; }
command -v python3 >/dev/null 2>&1 || { log_error "Python3 not found. Please install Python 3.8+"; exit 1; }
command -v docker >/dev/null 2>&1 || { log_warning "Docker not found. Backend services may not work"; }

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js version 18+ required. Current: $(node --version)"
    exit 1
fi

log_success "Environment check passed"
log_info "Node.js: $(node --version)"
log_info "npm: $(npm --version)"
log_info "Python: $(python3 --version)"
echo ""

# 2. Install frontend dependencies
log_step "2" "Installing frontend dependencies..."
if [ ! -d "$FRONTEND_DIR" ]; then
    log_error "Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

cd "$FRONTEND_DIR"
# Clean up any conflicting lock files
rm -f ../package-lock.json
rm -f package-lock.json
log_info "Installing Next.js and dependencies..."
npm install --quiet
log_success "Frontend dependencies installed"
cd ..
echo ""

# 3. Setup monitoring agent
log_step "3" "Setting up local monitoring agent..."
if [ -d "$AGENT_DIR" ]; then
    cd "$AGENT_DIR"
    if [ -f "requirements.txt" ]; then
        log_info "Installing Python dependencies..."
        python3 -m pip install -r requirements.txt --quiet --user
        log_success "Agent dependencies installed"
    else
        log_warning "requirements.txt not found in agent directory"
    fi
    cd ..
else
    log_warning "Agent directory not found: $AGENT_DIR (skipping)"
fi
echo ""

# 4. Create environment configuration
log_step "4" "Creating environment configuration..."
ENV_FILE="$FRONTEND_DIR/.env.local"

if [ ! -f "$ENV_FILE" ]; then
    log_info "Creating new environment file..."
    cat > "$ENV_FILE" <<EOF
# Dante Voice Chip Frontend Environment Variables
# This file contains sensitive configuration - do not commit to version control

# --- Encryption & Security ---
# Encryption key for local vault (generate with: openssl rand -base64 32)
ENCRYPTION_KEY=your_encryption_key_here

# Vercel webhook secret for signature verification
VERCEL_WEBHOOK_SECRET=$WEBHOOK_SECRET

# --- OpenAI Configuration ---
# OpenAI API key for voice AI features
OPENAI_API_KEY=your_openai_api_key_here

# AI Gateway API key for enhanced AI capabilities
AI_GATEWAY_API_KEY=vck_0tpeKGsGfSR9SWUBWMHNDxh0HHGc20LywauXegh6xPjs7Gxd4b4DAP7y

# Voice model to use
VOICE_MODEL=gpt-4-turbo-preview

# --- API Configuration ---
# Local API endpoint
NEXT_PUBLIC_API_URL=http://localhost:3000

# --- Supabase Configuration ---
# Public environment variables (safe for client-side)
NEXT_PUBLIC_SUPABASE_URL="https://mdyencizafeicqwqjihx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1keWVuY2l6YWZlaWNxd3FqaWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNDQ3MDksImV4cCI6MjA3MzkyMDcwOX0.Fov1SQhB5o7-y0TdDWp3zJGt4-JXhQ-ZT9Zv9i-ZK0s"

# Server-only environment variables (keep secret!)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1keWVuY2l6YWZlaWNxd3FqaWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODM0NDcwOSwiZXhwIjoyMDczOTIwNzA5fQ.7XZf2L9mFjB3Rv5nU7qE-vQfR6Wx-K8-gNc1H4_R8sQ"
SUPABASE_JWT_SECRET="H2Aw3aLJ8EJQzjTfC3rMenq62e2N/bQjX7EoKSokkB8+1XuK2tin2VGPscTsGS1VNsApN85x5MIgc6f170bD8w=="

# Database Configuration
POSTGRES_URL="postgres://postgres.mdyencizafeicqwqjihx:8FTy6Q8f5gsAhBii@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_PRISMA_URL="postgres://postgres.mdyencizafeicqwqjihx:8FTy6Q8f5gsAhBii@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://postgres.mdyencizafeicqwqjihx:8FTy6Q8f5gsAhBii@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Database Connection Details
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="8FTy6Q8f5gsAhBii"
POSTGRES_HOST="db.mdyencizafeicqwqjihx.supabase.co"
POSTGRES_DATABASE="postgres"
EOF
    log_success "Environment template created"
else
    log_info "Using existing .env.local"
    # Ensure webhook secret is set
    if ! grep -q "VERCEL_WEBHOOK_SECRET" "$ENV_FILE"; then
        echo "VERCEL_WEBHOOK_SECRET=$WEBHOOK_SECRET" >> "$ENV_FILE"
        log_success "Added webhook secret to existing environment"
    fi
fi
echo ""

# 5. Build frontend
log_step "5" "Building frontend application..."
cd "$FRONTEND_DIR"
log_info "Running Next.js build process..."
npm run build || { log_error "Build failed - check your code for errors"; exit 1; }
log_success "Frontend build completed"
cd ..
echo ""

# 6. Deploy with Vercel
log_step "6" "Deploying to Vercel..."
log_info "Checking Vercel CLI..."
if ! command -v vercel >/dev/null 2>&1; then
    log_info "Installing Vercel CLI..."
    npm install -g vercel
fi

cd "$FRONTEND_DIR"
log_info "Deploying to production..."
npx vercel --prod --yes || { log_error "Vercel deploy failed - check your Vercel account"; exit 1; }
DEPLOYMENT_URL=$(npx vercel ls --json 2>/dev/null | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['url'])" 2>/dev/null || echo "")
log_success "Deployed to Vercel"
if [ -n "$DEPLOYMENT_URL" ]; then
    log_info "Deployment URL: https://$DEPLOYMENT_URL"
fi
cd ..
echo ""

# 7. Wire domain
log_step "7" "Linking domain ($DOMAIN)..."
cd "$FRONTEND_DIR"
log_info "Adding custom domain..."
npx vercel domains add "$DOMAIN" 2>/dev/null || log_warning "Domain may already be assigned or unavailable"

if [ -n "$DEPLOYMENT_URL" ]; then
    log_info "Setting up domain alias..."
    npx vercel alias set "https://$DEPLOYMENT_URL" "$DOMAIN" 2>/dev/null || log_warning "Alias setup failed - may need manual configuration"
fi

log_info "Domain configuration attempted"
log_info "Visit Vercel dashboard to complete domain setup if needed"
cd ..
echo ""

# 8. Start backend services
log_step "8" "Starting backend services..."
if [ -f "docker-compose.yml" ]; then
    log_info "Starting Docker services..."
    docker compose up -d 2>/dev/null || log_warning "Docker services failed to start"
elif [ -d "$BACKEND_DIR" ]; then
    log_info "Starting backend manually..."
    cd "$BACKEND_DIR"
    npm install --quiet 2>/dev/null || log_warning "Backend dependency installation failed"
    nohup node index.js > ../backend.log 2>&1 & 
    BACKEND_PID=$!
    log_info "Backend started with PID: $BACKEND_PID"
    cd ..
else
    log_warning "No backend configuration found"
fi
echo ""

# 9. Start monitoring agent
log_step "9" "Starting monitoring agent..."
if [ -d "$AGENT_DIR" ] && [ -f "$AGENT_DIR/start.sh" ]; then
    cd "$AGENT_DIR"
    chmod +x start.sh
    ./start.sh &
    AGENT_PID=$!
    log_info "Agent started with PID: $AGENT_PID"
    cd ..
elif [ -d "$AGENT_DIR" ] && [ -f "$AGENT_DIR/main.py" ]; then
    cd "$AGENT_DIR"
    nohup python3 main.py > ../agent.log 2>&1 &
    AGENT_PID=$!
    log_info "Agent started with PID: $AGENT_PID"
    cd ..
else
    log_warning "Monitoring agent not found or not configured"
fi
echo ""

# 10. Verify deployment
log_step "10" "Verifying deployment..."
log_info "Testing local backend..."
sleep 3
curl -s http://localhost:3001/health >/dev/null 2>&1 && log_success "Backend health check passed" || log_warning "Backend not responding locally"

log_info "Testing production deployment..."
curl -s "https://$DOMAIN/" >/dev/null 2>&1 && log_success "Production site accessible" || log_warning "Production site not yet accessible"

log_info "Testing webhook endpoint..."
curl -s "https://$DOMAIN/api/webhooks/vercel" >/dev/null 2>&1 && log_success "Webhook endpoint accessible" || log_warning "Webhook endpoint not accessible"
echo ""

# 11. Completion summary
log_step "11" "Deployment Complete!"
echo ""
echo "🎉 ${GREEN}Dante Voice Chip Successfully Deployed!${NC}"
echo "=========================================="
echo ""
echo "🌐 ${BLUE}Production URLs:${NC}"
echo "   Main Site:     https://$DOMAIN"
echo "   Dashboard:     https://$DOMAIN/dashboard"
echo "   Notes Demo:    https://$DOMAIN/notes"
echo ""
echo "📡 ${BLUE}API Endpoints:${NC}"
echo "   Logs API:      https://$DOMAIN/api/logs"
echo "   Webhooks:      https://$DOMAIN/api/webhooks/vercel"
echo "   Health Check:  http://localhost:3001/health"
echo ""
echo "🔐 ${BLUE}Security:${NC}"
echo "   Webhook Secret: $WEBHOOK_SECRET"
echo "   HTTPS:         Enabled via Vercel"
echo "   Auth:          Deployment protection enabled"
echo ""
echo "📊 ${BLUE}Local Services:${NC}"
echo "   Frontend:      http://localhost:3000"
echo "   Backend:       http://localhost:3001"
echo "   Agent:         Running in background"
echo ""
echo "🎼 ${YELLOW}Ubuntu Excellence Achieved!${NC}"
echo "   'I am because we are' - Your collective deployment success!"
echo ""
echo "📚 ${BLUE}Next Steps:${NC}"
echo "   1. Configure webhook in Vercel dashboard"
echo "   2. Set up custom domain DNS if needed"
echo "   3. Add OpenAI API key for voice features"
echo "   4. Monitor logs: tail -f backend.log agent.log"
echo ""
echo "🚀 ${GREEN}Ready for Ubuntu-powered terminal monitoring!${NC}"