# Installation Guide

## Quick Start

1. **Clone and Initialize**
   ```bash
   cd gtek-dante-voice-chip
   npm install
   ```

2. **Install Terminal Agent**
   ```bash
   npm run agent:install
   ```

3. **Start the System**
   ```bash
   # Start backend API
   cd backend && npm install && npm start
   
   # Start voice interface
   cd voice && npm install && npm start
   
   # Start frontend dashboard
   cd frontend && npm install && npm run dev
   ```

4. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

## Detailed Setup

### Prerequisites

- **macOS** (for the terminal agent)
- **Node.js 18+**
- **Python 3.8+**
- **Git**

### Environment Variables

Create `.env` files in each module:

**Backend (.env)**
```
OPENAI_API_KEY=your_openai_api_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Voice (.env)**
```
OPENAI_API_KEY=your_openai_api_key
VOICE_PORT=3002
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_VOICE_URL=http://localhost:3002
```

### Terminal Agent Installation

The terminal agent runs locally on your macOS machine to monitor shell activity:

```bash
cd agent
./install.sh
```

This will:
- Install Python dependencies
- Generate encryption keys
- Set up launchd service for auto-start
- Create necessary directories

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

### Backend API

```bash
cd backend
npm install
npm start
```

API will be available at `http://localhost:3001`

### Voice Interface

```bash
cd voice
npm install
npm start
```

Voice service will be available at `http://localhost:3002`

## Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   In Vercel dashboard, add:
   - `OPENAI_API_KEY`
   - `ENCRYPTION_KEY`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

For other platforms:

1. **Build Frontend**
   ```bash
   cd frontend && npm run build
   ```

2. **Deploy Backend**
   Upload `backend/` to your server and run:
   ```bash
   npm install --production
   npm start
   ```

## Troubleshooting

### Common Issues

**Agent Not Starting**
```bash
# Check logs
tail -f ~/.dante-voice-chip/logs/agent.log

# Restart manually
cd agent && ./restart.sh
```

**Permission Denied**
```bash
# Fix permissions
chmod +x agent/*.sh
```

**Voice Not Working**
- Ensure microphone permissions are granted
- Check browser console for Web Speech API errors
- Verify OpenAI API key is set

**Database Errors**
```bash
# Reset database
rm ~/.dante-voice-chip/vault/sessions.db
# Restart agent to recreate
```

### Logs

- Agent logs: `~/.dante-voice-chip/logs/`
- Backend logs: Console output
- Frontend logs: Browser console
- Voice logs: Console output

## Advanced Configuration

### Custom Commands

Edit `~/.dante-voice-chip/config.json`:

```json
{
  "commands_to_ignore": ["ls", "pwd", "cd", "clear"],
  "sensitive_patterns": ["password", "token", "key"],
  "retention_days": 30
}
```

### Voice Settings

Modify voice recognition in `frontend/app/components/VoiceControl.tsx`

### Dashboard Customization

Edit components in `frontend/app/components/` to customize the UI.

## Security Notes

- All logs are encrypted locally
- Encryption keys are stored securely on your machine
- No sensitive data is sent to external services
- Voice data is processed locally when possible