# Dante Voice Chip - Quick Start Guide

## 🚀 1-Hour Deployment Complete!

Your terminal monitoring system is ready. Here's what you have:

### 📁 Project Structure
- `frontend/` - Next.js dashboard (deploys to Vercel)
- `backend/` - API functions 
- `agent/` - Local terminal monitor
- `voice/` - Voice interaction system

### 🔧 Next Steps

#### 1. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

#### 2. Start Local Monitoring
```bash
cd agent
./install.sh  # One-time setup
./start.sh    # Start monitoring
```

#### 3. Set Environment Variables
Copy `frontend/.env.local.example` to `frontend/.env.local` and fill in:
- `ENCRYPTION_KEY` - Generate with: `openssl rand -base64 32`
- `OPENAI_API_KEY` - Your OpenAI API key for voice features

#### 4. Local Development
```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

### 🎛️ Control Commands
- `npm run agent:start` - Start terminal monitoring
- `npm run agent:stop` - Stop monitoring  
- `npm run dev` - Start development server
- `npm run build` - Build for production

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
```bash
# Check Python dependencies
pip3 install --user cryptography psutil watchdog

# Check logs
tail -f ~/.dante-voice-chip/logs/agent.log
```

### Build Fails
```bash
# Clear cache and rebuild
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Voice Not Working
- Check microphone permissions in browser
- Ensure HTTPS for voice features (works on localhost)
- Add OpenAI API key for AI responses

## 🎯 What's Next?

1. **Customize Monitoring**: Edit `agent/config.json`
2. **Add Integrations**: Extend `backend/api/` functions
3. **Enhance UI**: Modify `frontend/app/components/`
4. **Voice Commands**: Extend `voice/ai-handler.js`

Your terminal control tower is ready! 🎉
