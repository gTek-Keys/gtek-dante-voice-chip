import express from 'express'
import OpenAI from 'openai'

const router = express.Router()

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// POST /api/ai/summarize - Generate activity summary
router.post('/summarize', async (req, res) => {
  try {
    const { period = 'today', includeCommands = false } = req.body
    
    // Mock data for now - in production this would come from the vault
    const mockContext = {
      commandCount: 45,
      errorCount: 3,
      topCommands: ['git status', 'npm install', 'cd project'],
      errors: ['build failed', 'permission denied'],
      timeSpent: '4.2 hours'
    }
    
    const prompt = `
Summarize the user's terminal activity for ${period}:

- Total commands executed: ${mockContext.commandCount}
- Errors encountered: ${mockContext.errorCount}
- Time spent in terminal: ${mockContext.timeSpent}
- Most used commands: ${mockContext.topCommands.join(', ')}
- Common errors: ${mockContext.errors.join(', ')}

Provide a concise, helpful summary with insights and suggestions for improvement.
`
    
    if (!process.env.OPENAI_API_KEY) {
      // Return mock response if no API key
      return res.json({
        summary: `Terminal Summary for ${period}: You executed ${mockContext.commandCount} commands with ${mockContext.errorCount} errors. You spent ${mockContext.timeSpent} actively coding. Your top commands were development-focused (${mockContext.topCommands.join(', ')}). Consider reviewing build configurations to reduce errors.`,
        suggestions: [
          'Review build configuration to reduce failures',
          'Consider using aliases for frequently used commands',
          'Set up better error handling in your workflow'
        ]
      })
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 500
    })
    
    const summary = completion.choices[0].message.content
    
    res.json({
      summary,
      suggestions: [
        'Review build configuration to reduce failures',
        'Consider using aliases for frequently used commands',
        'Set up better error handling in your workflow'
      ]
    })
  } catch (error) {
    console.error('Error generating summary:', error)
    res.status(500).json({ error: 'Failed to generate summary' })
  }
})

// POST /api/ai/analyze-command - Analyze a specific command
router.post('/analyze-command', async (req, res) => {
  try {
    const { command, context } = req.body
    
    if (!command) {
      return res.status(400).json({ error: 'Command is required' })
    }
    
    const prompt = `
Analyze this terminal command and provide insights:

Command: ${command}
Context: ${context || 'No additional context'}

Provide:
1. What this command does
2. Potential risks or concerns
3. Suggestions for improvement
4. Alternative approaches
`
    
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        analysis: `The command "${command}" appears to be a standard terminal operation. Consider reviewing the command documentation for best practices.`,
        risks: ['Always verify commands before execution'],
        suggestions: ['Use command flags for better control', 'Consider automation for repeated tasks']
      })
    }
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 400
    })
    
    const analysis = completion.choices[0].message.content
    
    res.json({
      analysis,
      command,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error analyzing command:', error)
    res.status(500).json({ error: 'Failed to analyze command' })
  }
})

// POST /api/ai/voice-command - Process voice commands
router.post('/voice-command', async (req, res) => {
  try {
    const { transcript, intent } = req.body
    
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' })
    }
    
    // Process voice command intent
    let response = ''
    let action = null
    
    const lowerTranscript = transcript.toLowerCase()
    
    if (lowerTranscript.includes('summarize') || lowerTranscript.includes('summary')) {
      response = 'Generating your daily terminal activity summary...'
      action = 'summarize'
    } else if (lowerTranscript.includes('task') || lowerTranscript.includes('todo')) {
      response = 'Checking your current tasks...'
      action = 'tasks'
    } else if (lowerTranscript.includes('error') || lowerTranscript.includes('problem')) {
      response = 'Analyzing recent errors in your terminal...'
      action = 'errors'
    } else if (lowerTranscript.includes('help')) {
      response = 'I can help you with terminal summaries, task management, and error analysis. What would you like to know?'
      action = 'help'
    } else {
      response = 'I understand you said: "' + transcript + '". How can I help you with your terminal activity?'
      action = 'unknown'
    }
    
    res.json({
      transcript,
      response,
      action,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error processing voice command:', error)
    res.status(500).json({ error: 'Failed to process voice command' })
  }
})

// POST /api/ai/generate-tasks - Generate task suggestions from activity
router.post('/generate-tasks', async (req, res) => {
  try {
    const { commands, errors, timeframe = 'today' } = req.body
    
    // Mock task generation for now
    const suggestedTasks = [
      {
        title: 'Fix recurring build errors',
        description: 'Several build commands failed. Review configuration and dependencies.',
        priority: 'high',
        source: 'ai-generated',
        confidence: 0.85
      },
      {
        title: 'Update project dependencies',
        description: 'Multiple package management commands detected. Consider updating outdated packages.',
        priority: 'medium',
        source: 'ai-generated',
        confidence: 0.72
      },
      {
        title: 'Optimize terminal workflow',
        description: 'Detected repetitive command patterns. Consider creating aliases or scripts.',
        priority: 'low',
        source: 'ai-generated',
        confidence: 0.68
      }
    ]
    
    res.json({
      tasks: suggestedTasks,
      timeframe,
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error generating tasks:', error)
    res.status(500).json({ error: 'Failed to generate tasks' })
  }
})

export { router as aiRouter }