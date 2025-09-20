# Dante Voice Chip - Terminal Monitor & Voice Control Tower

A comprehensive terminal monitoring system with voice interaction, daily organization, and secure log auditing.

## 🏗️ Architecture

```
├── frontend/      # Next.js dashboard (deploys to Vercel)
├── backend/       # Serverless API functions
├── agent/         # Local terminal monitoring scripts
├── voice/         # Voice interaction & AI integration
├── docs/          # Documentation
└── scripts/       # Utility scripts
```

## 🚀 Quick Start (1-Hour Deployment)

```bash
# Clone and setup
git clone https://github.com/gTek-Keys/gtek-dante-voice-chip.git
cd gtek-dante-voice-chip

# Run one-hour deployment script
./deploy.sh

# Deploy to Vercel
npm i -g vercel
vercel --prod

# Start local monitoring
cd agent && ./install.sh && ./start.sh
```

## 🎯 Features

- **🖥️ Terminal Monitoring**: Capture and analyze all terminal activity
- **🎤 Voice Interaction**: AI-powered voice commands and responses  
- **🔒 Secure Vault**: Encrypted local log storage with AES encryption
- **📊 Daily Organizer**: Task detection and productivity insights
- **🌐 Web Dashboard**: Beautiful UI for log analysis and management
- **⚡ Real-time Updates**: Live terminal activity streaming
- **🤖 AI Integration**: GPT-powered analysis and voice responses

## 🎯 Control Tower Metaphor

Think of this repo as an air traffic control tower:
- Your Terminal = Air traffic
- Monitor scripts = Radar systems  
- Vault = Black box storage
- Vercel site = Glass control tower with dashboards
- AI voice = Radio operator providing briefings

## 🔧 Manual Setup

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Development server
npm run build  # Production build
```

### 2. Backend API
```bash
cd backend
npm install
npm run dev  # Local API server
```

### 3. Terminal Agent
```bash
cd agent
./install.sh  # One-time setup
./start.sh    # Start monitoring
./stop.sh     # Stop monitoring
```

### 4. Voice Interface
```bash
cd voice
npm install
npm start     # Voice service
```

## ⚙️ Configuration

### Environment Variables
Create `frontend/.env.local`:
```env
ENCRYPTION_KEY=your_32_char_key
OPENAI_API_KEY=your_openai_key
VOICE_MODEL=gpt-4-turbo-preview
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Agent Configuration
Edit `agent/config.json`:
```json
{
  "log_directory": "~/.dante-voice-chip/logs",
  "max_log_size_mb": 100,
  "retention_days": 30,
  "encryption_enabled": true,
  "commands_to_ignore": ["ls", "pwd", "cd"],
  "sensitive_patterns": ["password", "token", "key"]
}
```

## 📋 Commands Reference

### Development
```bash
npm run dev              # Start frontend dev server
npm run build           # Build frontend for production
npm run agent:start     # Start terminal monitoring
npm run agent:stop      # Stop terminal monitoring
npm run voice:start     # Start voice interface
```

### Deployment
```bash
vercel --prod           # Deploy to Vercel
./deploy.sh             # Full deployment script
```

### Monitoring
```bash
./agent/status.sh       # Check agent status
tail -f ~/.dante-voice-chip/logs/monitor.log  # View logs
```

## � Security Features

- **Local Encryption**: All logs encrypted with AES-256
- **Sensitive Filtering**: Automatic detection of passwords, tokens, keys
- **Retention Policies**: Configurable log cleanup and archival
- **Privacy First**: No data leaves your machine unless explicitly shared
- **Secure Vault**: SQLite database with encrypted sensitive fields

## 🎤 Voice Commands

- *"Summarize today's activity"* - Get daily terminal summary
- *"Show recent errors"* - Display latest command failures
- *"What am I working on?"* - Analysis of current projects
- *"Generate tasks"* - Create tasks from terminal patterns

## 📊 Dashboard Panels

- **📈 Stats Grid**: Commands, errors, active time, tasks
- **🖥️ Terminal Logs**: Real-time command history with syntax highlighting
- **📝 Tasks List**: AI-generated and manual tasks with priorities
- **🎤 Voice Control**: Microphone input and speech output

## 🛠️ Customization

### Adding New Voice Commands
Edit `voice/ai-handler.js`:
```javascript
const commands = {
  'deploy': () => triggerDeployment(),
  'backup': () => createBackup(),
  'analyze': (text) => generateInsights(text)
}
```

### Custom Dashboard Widgets
Create new components in `frontend/app/components/`:
```jsx
export function CustomWidget({ data }) {
  return <div className="dashboard-card">...</div>
}
```

### Agent Hooks
Add custom monitoring in `agent/hooks/`:
```python
def on_command_executed(command, output, exit_code):
    # Custom processing logic
    pass
```

## � Troubleshooting

### Agent Won't Start
```bash
# Check Python dependencies
pip3 install --user cryptography psutil watchdog

# Verify permissions
ls -la ~/.dante-voice-chip/
```

### Frontend Build Fails
```bash
# Clear cache
rm -rf frontend/.next frontend/node_modules
cd frontend && npm install
```

### Voice Features Not Working
- Enable microphone permissions in browser
- Check HTTPS (required for speech API)
- Verify OpenAI API key in environment

### Database Issues
```bash
# Reset local database
rm ~/.dante-voice-chip/vault/sessions.db
cd agent && ./install.sh
```

## 📖 Documentation

- `docs/ARCHITECTURE.md` - System design and data flow
- `docs/API.md` - Backend API reference  
- `docs/VOICE.md` - Voice command development
- `docs/SECURITY.md` - Encryption and privacy details
- `QUICKSTART.md` - Step-by-step deployment guide

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see `LICENSE` file for details.

## 🎉 What's Next?

- [ ] Mobile app companion
- [ ] Slack/Discord integrations  
- [ ] Team dashboard for shared monitoring
- [ ] Plugin system for custom analyzers
- [ ] Advanced AI context understanding
- [ ] Performance benchmarking tools

---

**Your terminal control tower is ready! 🎉**

Deploy with `./deploy.sh` and start monitoring with `cd agent && ./install.sh`