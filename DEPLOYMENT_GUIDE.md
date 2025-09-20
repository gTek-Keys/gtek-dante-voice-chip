# 🚀 One-Hour Deployment Guide

## Overview

The Dante Voice Chip deployment system provides a comprehensive, automated solution for deploying your Ubuntu-themed terminal monitoring application to production in under one hour.

## 🎯 Quick Start

### **Super Quick Launch (3 commands):**
```bash
git clone https://github.com/gTek-Keys/gtek-dante-voice-chip.git
cd gtek-dante-voice-chip
./launch.sh deploy
```

### **Development Mode:**
```bash
./launch.sh dev    # Start local development servers
./launch.sh health # Check if everything is running
```

---

## 📋 Prerequisites

### **Required Software:**
- **Node.js 18+** (check: `node --version`)
- **npm** (check: `npm --version`) 
- **Python 3.8+** (check: `python3 --version`)
- **Git** (check: `git --version`)

### **Optional (for full features):**
- **Docker** (for backend services)
- **Vercel Account** (for deployment)

### **Quick Install (macOS):**
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required software
brew install node python3 git docker
npm install -g vercel
```

---

## 🛠️ Deployment Scripts

### **1. Full Deployment Script**
**File:** `scripts/deploy.sh`

**What it does:**
- ✅ Environment validation (Node.js, npm, Python)
- ✅ Dependency installation (frontend + agent)
- ✅ Environment configuration with Supabase
- ✅ Production build
- ✅ Vercel deployment
- ✅ Domain configuration (gtek.world)
- ✅ Backend service startup
- ✅ Monitoring agent activation
- ✅ Health verification
- ✅ Complete status report

**Usage:**
```bash
./scripts/deploy.sh
```

### **2. Quick Launcher**
**File:** `launch.sh`

**Available Commands:**
```bash
./launch.sh deploy    # Full deployment
./launch.sh dev       # Development mode
./launch.sh build     # Production build
./launch.sh test      # Run tests
./launch.sh health    # System health check
./launch.sh clean     # Clean artifacts
./launch.sh logs      # View logs
```

---

## 🏗️ Deployment Process (Step by Step)

### **Step 1: Environment Check**
- Validates Node.js 18+, npm, Python 3.8+
- Checks for Docker (optional)
- Reports version information

### **Step 2: Frontend Dependencies**
- Installs Next.js and all React components
- Installs Supabase SDK, Tailwind CSS, etc.
- Cleans up conflicting lock files

### **Step 3: Monitoring Agent Setup**
- Installs Python dependencies for local monitoring
- Sets up background terminal monitoring

### **Step 4: Environment Configuration**
- Creates `.env.local` with Supabase credentials
- Sets webhook security secret
- Configures database connections

### **Step 5: Production Build**
- Runs `npm run build` with optimization
- Validates build success
- Prepares static assets

### **Step 6: Vercel Deployment**
- Deploys to Vercel production environment
- Retrieves deployment URL
- Configures production settings

### **Step 7: Domain Configuration**
- Links `gtek.world` custom domain
- Sets up SSL certificates
- Configures DNS routing

### **Step 8: Backend Services**
- Starts Express API server (port 3001)
- Initializes Docker containers if available
- Sets up API endpoints (/health, /api/*)

### **Step 9: Monitoring Agent**
- Starts background terminal monitoring
- Initializes log collection
- Sets up real-time analytics

### **Step 10: Verification**
- Tests all local endpoints
- Verifies production accessibility
- Confirms webhook functionality

### **Step 11: Success Report**
- Displays all URLs and endpoints
- Shows security configuration
- Provides next steps

---

## 🌐 Production URLs

After successful deployment:

### **Main Application:**
- **Production Site:** https://gtek.world
- **Dashboard:** https://gtek.world/dashboard  
- **Notes Demo:** https://gtek.world/notes

### **API Endpoints:**
- **Logs API:** https://gtek.world/api/logs
- **Webhook Handler:** https://gtek.world/api/webhooks/vercel
- **Local Backend:** http://localhost:3001/health

### **Development:**
- **Local Frontend:** http://localhost:3000
- **Local Backend:** http://localhost:3001

---

## 🔐 Security Configuration

### **Webhook Security:**
- **Secret:** `qRuMa9LuG4gCIvGMHzqctOCN`
- **Algorithm:** HMAC SHA-1
- **Header:** `x-vercel-signature`

### **Environment Variables:**
```bash
# Webhook security
VERCEL_WEBHOOK_SECRET=qRuMa9LuG4gCIvGMHzqctOCN

# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://mdyencizafeicqwqjihx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<secure-key>

# Database connections
POSTGRES_URL=<secure-connection-string>
```

### **HTTPS & SSL:**
- Automatic SSL via Vercel
- Custom domain SSL for gtek.world
- Secure webhook endpoints

---

## 🧪 Testing & Verification

### **Health Check Command:**
```bash
./launch.sh health
```

**Expected Output:**
- ✅ Backend: Running
- ✅ Frontend: Running  
- ✅ Production: Accessible
- ✅ Webhook: Active

### **Manual Testing:**
```bash
# Test local backend
curl http://localhost:3001/health

# Test production site
curl https://gtek.world/

# Test webhook endpoint
curl https://gtek.world/api/webhooks/vercel

# Test logs API
curl https://gtek.world/api/logs
```

---

## 🐛 Troubleshooting

### **Common Issues:**

**1. Node.js Version Error**
```bash
# Error: Node.js version 18+ required
# Solution: Update Node.js
brew install node@18
```

**2. Port Already in Use**
```bash
# Error: EADDRINUSE :::3001
# Solution: Kill existing processes
./launch.sh clean
pkill -f "node index.js"
```

**3. Vercel Deployment Failed**
```bash
# Error: Authentication required
# Solution: Login to Vercel
npx vercel login
```

**4. Domain Not Working**
```bash
# Error: gtek.world showing 404
# Solution: Check domain assignment in Vercel dashboard
# Go to: https://vercel.com/dashboard > Project > Domains
```

### **Log Files:**
- **Backend:** `backend.log`
- **Agent:** `agent.log`
- **View logs:** `./launch.sh logs`

---

## 🔄 Development Workflow

### **Daily Development:**
```bash
# Start development environment
./launch.sh dev

# Make changes to code
# ... edit files ...

# Test changes
./launch.sh health

# Deploy to production when ready
./launch.sh deploy
```

### **File Structure:**
```
gtek-dante-voice-chip/
├── frontend/          # Next.js application
├── backend/           # Express API server
├── agent/             # Python monitoring agent
├── scripts/           # Deployment scripts
├── launch.sh          # Quick launcher
└── docs/              # Documentation
```

---

## 🎼 Ubuntu Philosophy Integration

**"I am because we are"** - The deployment system embodies Ubuntu principles:

- **Collective Success:** All components work together
- **Shared Resources:** Unified environment configuration
- **Community Security:** Cryptographic webhook protection
- **Inclusive Access:** Multiple deployment options
- **Sustainable Growth:** Scalable architecture

---

## 📞 Support & Next Steps

### **After Deployment:**
1. **Configure Vercel Webhook** (see WEBHOOK_SETUP_GUIDE.md)
2. **Add OpenAI API Key** for voice features
3. **Set up monitoring dashboards**
4. **Customize Ubuntu theming**

### **Resources:**
- **Supabase Setup:** SUPABASE_SETUP.md
- **Webhook Guide:** WEBHOOK_SETUP_GUIDE.md
- **Production Site:** https://gtek.world

### **Community:**
- **Repository:** https://github.com/gTek-Keys/gtek-dante-voice-chip
- **Issues:** Report bugs and feature requests
- **Discussions:** Share Ubuntu-powered innovations

---

🚀 **Ready to deploy Ubuntu excellence to the world!**