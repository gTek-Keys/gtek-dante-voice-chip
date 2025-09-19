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

## 🚀 Features

- **Terminal Monitoring**: Capture and analyze all terminal activity
- **Voice Interaction**: AI-powered voice commands and responses
- **Secure Vault**: Encrypted local log storage
- **Daily Organizer**: Task detection and productivity insights
- **Web Dashboard**: Beautiful UI for log analysis and management

## 🎯 Control Tower Metaphor

Think of this repo as an air traffic control tower:
- Your Terminal = Air traffic
- Monitor scripts = Radar systems
- Vault = Black box storage
- Vercel site = Glass control tower with dashboards
- AI voice = Radio operator providing briefings

## 🔧 Quick Start

1. **Setup Local Agent**:
   ```bash
   cd agent
   ./install.sh
   ```

2. **Launch Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

## 📋 Project Status

This project is actively under development. See individual module READMEs for specific setup instructions.

## 🔐 Security

All terminal logs are encrypted locally. The web interface only displays anonymized/filtered data unless you explicitly decrypt.