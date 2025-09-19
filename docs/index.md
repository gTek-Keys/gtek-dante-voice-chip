# Dante Voice Chip Documentation

Welcome to the comprehensive documentation for Dante Voice Chip - your intelligent terminal monitoring and voice control system.

## Overview

Dante Voice Chip transforms your terminal into an intelligent control tower, monitoring all activity, providing voice interaction, and offering AI-powered insights for enhanced productivity.

### Key Features

- **🎤 Voice Control**: Natural language commands for terminal analysis
- **📊 Real-time Monitoring**: Automatic terminal session recording
- **🔒 Encrypted Storage**: Secure local data vault
- **🤖 AI Insights**: Smart summaries and task generation
- **📱 Web Dashboard**: Beautiful interface for data visualization
- **🔄 Task Management**: Automated and manual productivity tracking

## Documentation Structure

### [Installation Guide](installation.md)
Complete setup instructions for all components:
- Prerequisites and environment setup
- Terminal agent installation
- Frontend and backend deployment
- Vercel deployment guide

### [User Guide](user-guide.md)
Comprehensive user documentation:
- Getting started walkthrough
- Voice command reference
- Dashboard navigation
- Task management
- Troubleshooting guide

### [API Reference](api-reference.md)
Technical API documentation:
- Endpoint specifications
- Request/response formats
- Authentication details
- WebSocket events
- Rate limiting information

## Quick Start

1. **Install the system**:
   ```bash
   cd gtek-dante-voice-chip
   npm install
   npm run agent:install
   ```

2. **Start all services**:
   ```bash
   # Terminal 1: Backend
   cd backend && npm install && npm start
   
   # Terminal 2: Voice Service
   cd voice && npm install && npm start
   
   # Terminal 3: Frontend
   cd frontend && npm install && npm run dev
   ```

3. **Access the dashboard**:
   Open `http://localhost:3000` in your browser

4. **Try voice commands**:
   Click the microphone and say "summarize my terminal activity"

Welcome to your new terminal control tower! 🚀
