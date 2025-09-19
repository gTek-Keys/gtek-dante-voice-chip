# User Guide

## Welcome to Dante Voice Chip

Dante Voice Chip is your intelligent terminal monitoring and voice control system. Think of it as an air traffic control tower for your command line activity.

## Getting Started

### First Time Setup

1. **Install the system** following the [Installation Guide](installation.md)
2. **Start the terminal agent** to begin monitoring
3. **Open the dashboard** at `http://localhost:3000`
4. **Try voice commands** using the microphone button

### Understanding the Interface

#### Dashboard Overview

The main dashboard shows:

- **Command Statistics**: Daily command count, errors, and activity time
- **Recent Terminal Activity**: Live feed of your terminal commands
- **Task List**: AI-generated and manual tasks
- **Voice Control**: Microphone interface for voice commands

#### Navigation

- **Dashboard**: Main overview and statistics
- **Terminal Logs**: Detailed command history and search
- **Tasks**: Task management and organization
- **Analytics**: Advanced charts and trends
- **Settings**: Configuration and preferences

## Using Voice Commands

### Basic Commands

**"Summarize my terminal activity"**
- Generates an AI-powered summary of your recent work
- Includes insights and suggestions

**"Show my tasks"**
- Lists current tasks and to-do items
- Highlights high-priority items

**"Check for errors"**
- Reviews recent command failures
- Suggests fixes for common issues

**"What are my statistics?"**
- Reports daily command counts and activity metrics

### Advanced Voice Features

**"Search for git commands"**
- Finds specific commands in your history
- Supports natural language queries

**"Export my logs"**
- Prepares data export for backup or analysis

**"Help me with..."**
- General assistance and guidance

### Voice Tips

- Speak clearly and at normal volume
- Wait for the listening indicator to appear
- Use natural language - no need for rigid commands
- The system learns your preferences over time

## Terminal Monitoring

### What Gets Monitored

The agent automatically tracks:

- **Commands executed**: Every shell command you run
- **Exit codes**: Success/failure status
- **Working directories**: Where commands were run
- **Output snippets**: Command results (filtered for security)
- **Timing data**: When and how long commands took

### Privacy and Security

- All data is **encrypted locally** on your machine
- **No sensitive information** leaves your computer
- **Configurable filtering** removes passwords and tokens
- **Retention policies** automatically clean old data

### Customizing Monitoring

Edit `~/.dante-voice-chip/config.json`:

```json
{
  "commands_to_ignore": ["ls", "pwd", "cd"],
  "sensitive_patterns": ["password", "token", "key"],
  "retention_days": 30
}
```

## Task Management

### Types of Tasks

**Manual Tasks**
- Created by you through the interface
- Custom priorities and descriptions

**AI-Generated Tasks**
- Automatically suggested based on terminal activity
- Smart detection of recurring issues
- Productivity recommendations

### Task Organization

- **Priority levels**: High, Medium, Low
- **Completion tracking**: Check off completed items
- **Source identification**: Manual vs AI-generated
- **Daily focus**: Today's tasks view

## Analytics and Insights

### Daily Statistics

Track your productivity with:

- Command execution counts
- Error rates and trends
- Active terminal time
- Most-used commands

### Weekly Trends

Visualize patterns in:

- Productivity cycles
- Error frequency
- Command usage evolution
- Project activity levels

### Command Analysis

Deep dive into:

- Frequently used commands
- Commands that often fail
- Directory-based activity
- Time-based patterns

## Troubleshooting

### Common Issues

**Voice not responding**
1. Check microphone permissions in browser
2. Ensure voice service is running
3. Verify OpenAI API key is configured

**No terminal data**
1. Confirm agent is running: `ps aux | grep dante`
2. Check agent logs: `tail -f ~/.dante-voice-chip/logs/monitor.log`
3. Restart agent: `cd agent && ./restart.sh`

**Dashboard not loading**
1. Verify backend is running on port 3001
2. Check browser console for errors
3. Ensure frontend is running on port 3000

**Encryption errors**
1. Regenerate encryption key: `cd agent && ./install.sh`
2. Clear vault data if corrupted
3. Restart all services

### Getting Help

**Voice Help**
- Say "help" or "what can you do?" for assistance

**Logs and Debugging**
- Agent logs: `~/.dante-voice-chip/logs/`
- Browser console for frontend issues
- Terminal output for backend errors

**Reset and Recovery**
```bash
# Stop all services
cd agent && ./stop.sh

# Clear data (optional)
rm -rf ~/.dante-voice-chip/vault/*

# Restart
./start.sh
```

## Advanced Features

### Custom Voice Commands

You can extend voice recognition by modifying:
- `voice/processors/VoiceProcessor.js`
- Add new command patterns and responses

### Dashboard Customization

Modify the dashboard by editing:
- `frontend/app/components/` - UI components
- `frontend/app/globals.css` - Styling
- `frontend/tailwind.config.js` - Theme colors

### API Integration

Build custom integrations using the [API Reference](api-reference.md):

- Export data to external tools
- Create custom analytics
- Integrate with other productivity systems

### Automation

Set up automated workflows:

- **Daily summaries**: Scheduled voice reports
- **Error alerts**: Notifications for recurring issues
- **Backup routines**: Automated data exports

## Best Practices

### Security

- Regularly update encryption keys
- Review sensitive pattern filters
- Monitor access logs
- Use HTTPS in production

### Performance

- Keep retention period reasonable (30 days)
- Clean up old logs regularly
- Monitor disk usage
- Optimize command filters

### Productivity

- Review daily summaries regularly
- Act on AI-generated task suggestions
- Use voice commands for quick insights
- Set up useful aliases based on frequency analysis

## Tips and Tricks

### Keyboard Shortcuts

- **Space**: Activate voice listening
- **Escape**: Cancel voice input
- **Tab**: Navigate dashboard sections

### Voice Shortcuts

- "Quick summary" - Brief daily overview
- "Top errors" - Most common failures
- "Show stats" - Key metrics
- "New task" - Create task via voice

### Data Management

- Export data monthly for backup
- Use search to find specific activities
- Review error patterns weekly
- Clean up completed tasks regularly

## Next Steps

Once you're comfortable with the basics:

1. **Explore advanced analytics** in the Analytics section
2. **Set up automation** for routine tasks
3. **Customize voice commands** for your workflow
4. **Integrate with other tools** using the API
5. **Share insights** with your team (anonymized data)

For technical details, see the [API Reference](api-reference.md) and [Installation Guide](installation.md).