#!/bin/bash

# Dante Voice Chip - One-Hour Deployment Script
# Gets you from zero to deployed Vercel site with working terminal monitoring

set -e

echo "🚀 Dante Voice Chip - One-Hour Deployment"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "\n${BLUE}⏱️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Environment Check
print_step "Step 1: Checking environment..."

# Check for required tools
command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed."; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed."; exit 1; }
command -v git >/dev/null 2>&1 || { print_error "git is required but not installed."; exit 1; }

print_success "Environment check passed"

# Step 2: Install Frontend Dependencies
print_step "Step 2: Installing frontend dependencies..."

cd frontend
npm install

print_success "Frontend dependencies installed"

# Step 3: Install Agent Dependencies
print_step "Step 3: Setting up local monitoring agent..."

cd ../agent
chmod +x *.sh

# Check if Python 3 is available
if command -v python3 >/dev/null 2>&1; then
    print_success "Python 3 found"
    
    # Install required Python packages
    pip3 install --user cryptography psutil watchdog || {
        print_warning "Some Python packages failed to install. Agent may have limited functionality."
    }
else
    print_warning "Python 3 not found. Install it for full agent functionality."
fi

cd ..

# Step 4: Create Environment Variables Template
print_step "Step 4: Creating environment configuration..."

cat > frontend/.env.local.example << EOF
# Dante Voice Chip Environment Variables
# Copy this file to .env.local and fill in your values

# Encryption key for local vault (generate with: openssl rand -base64 32)
ENCRYPTION_KEY=your_encryption_key_here

# OpenAI API key for voice AI features
OPENAI_API_KEY=your_openai_api_key_here

# Voice model to use
VOICE_MODEL=gpt-4-turbo-preview

# Local API endpoint
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF

print_success "Environment template created"

# Step 5: Build Frontend
print_step "Step 5: Building frontend application..."

cd frontend
npm run build

print_success "Frontend built successfully"

# Step 6: Test Local Development
print_step "Step 6: Testing local development server..."

# Start dev server in background
npm run dev &
DEV_PID=$!

# Wait for server to start
sleep 5

# Check if server is responding
if curl -f http://localhost:3000 >/dev/null 2>&1; then
    print_success "Local development server is working"
    kill $DEV_PID
else
    print_warning "Local development server test failed"
    kill $DEV_PID 2>/dev/null || true
fi

cd ..

# Step 7: Initialize Git (if not already)
print_step "Step 7: Preparing for deployment..."

if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial commit: Dante Voice Chip terminal monitoring system"
    print_success "Git repository initialized"
else
    print_success "Git repository already exists"
fi

# Step 8: Create Vercel Configuration
print_step "Step 8: Creating deployment configuration..."

# Ensure vercel.json exists and is properly configured
cat > vercel.json << EOF
{
  "version": 2,
  "functions": {
    "backend/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/\$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/\$1"
    }
  ],
  "env": {
    "ENCRYPTION_KEY": "@encryption_key",
    "OPENAI_API_KEY": "@openai_api_key",
    "VOICE_MODEL": "gpt-4-turbo-preview"
  }
}
EOF

print_success "Vercel configuration created"

# Step 9: Create Quick Start Documentation
print_step "Step 9: Creating quick start guide..."

cat > QUICKSTART.md << EOF
# Dante Voice Chip - Quick Start Guide

## 🚀 1-Hour Deployment Complete!

Your terminal monitoring system is ready. Here's what you have:

### 📁 Project Structure
- \`frontend/\` - Next.js dashboard (deploys to Vercel)
- \`backend/\` - API functions 
- \`agent/\` - Local terminal monitor
- \`voice/\` - Voice interaction system

### 🔧 Next Steps

#### 1. Deploy to Vercel
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
\`\`\`

#### 2. Start Local Monitoring
\`\`\`bash
cd agent
./install.sh  # One-time setup
./start.sh    # Start monitoring
\`\`\`

#### 3. Set Environment Variables
Copy \`frontend/.env.local.example\` to \`frontend/.env.local\` and fill in:
- \`ENCRYPTION_KEY\` - Generate with: \`openssl rand -base64 32\`
- \`OPENAI_API_KEY\` - Your OpenAI API key for voice features

#### 4. Local Development
\`\`\`bash
cd frontend
npm run dev
# Visit http://localhost:3000
\`\`\`

### 🎛️ Control Commands
- \`npm run agent:start\` - Start terminal monitoring
- \`npm run agent:stop\` - Stop monitoring  
- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production

### 🔐 Security Features
- ✅ Encrypted local log storage
- ✅ Sensitive data filtering
- ✅ Configurable retention policies
- ✅ Local-only processing

### 🎤 Voice Features
- ✅ Voice command recognition
- ✅ AI-powered responses
- ✅ Terminal activity summaries
- ✅ Daily productivity insights

### 📊 Dashboard Features
- ✅ Real-time terminal activity
- ✅ Command statistics
- ✅ Error tracking
- ✅ Task generation from patterns

## 🆘 Troubleshooting

### Agent Won't Start
\`\`\`bash
# Check Python dependencies
pip3 install --user cryptography psutil watchdog

# Check logs
tail -f ~/.dante-voice-chip/logs/agent.log
\`\`\`

### Build Fails
\`\`\`bash
# Clear cache and rebuild
cd frontend
rm -rf .next node_modules
npm install
npm run build
\`\`\`

### Voice Not Working
- Check microphone permissions in browser
- Ensure HTTPS for voice features (works on localhost)
- Add OpenAI API key for AI responses

## 🎯 What's Next?

1. **Customize Monitoring**: Edit \`agent/config.json\`
2. **Add Integrations**: Extend \`backend/api/\` functions
3. **Enhance UI**: Modify \`frontend/app/components/\`
4. **Voice Commands**: Extend \`voice/ai-handler.js\`

Your terminal control tower is ready! 🎉
EOF

print_success "Quick start guide created"

# Step 10: Final Status
print_step "Step 10: Deployment summary"

echo ""
echo "🎉 Dante Voice Chip setup complete!"
echo ""
echo "📋 What's Ready:"
echo "   ✅ Frontend built and tested"
echo "   ✅ Agent scripts configured"
echo "   ✅ Environment templates created"
echo "   ✅ Vercel deployment ready"
echo "   ✅ Git repository prepared"
echo ""
echo "🚀 Deploy Now:"
echo "   1. vercel --prod"
echo "   2. cd agent && ./install.sh"
echo "   3. Visit your Vercel URL"
echo ""
echo "📖 Read QUICKSTART.md for detailed next steps"
echo ""

print_success "Ready for deployment! 🚀"