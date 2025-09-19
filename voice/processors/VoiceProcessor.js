import OpenAI from 'openai'

export class VoiceProcessor {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    
    this.commandPatterns = {
      summarize: ['summarize', 'summary', 'recap', 'overview'],
      tasks: ['tasks', 'todo', 'things to do', 'task list'],
      errors: ['errors', 'problems', 'issues', 'failures'],
      stats: ['statistics', 'stats', 'metrics', 'numbers'],
      help: ['help', 'what can you do', 'commands'],
      export: ['export', 'download', 'save data'],
      search: ['search', 'find', 'look for']
    }
  }
  
  async processCommand(transcript) {
    if (!transcript) {
      return {
        action: 'error',
        message: 'No voice input detected',
        audioResponse: 'I didn\'t hear anything. Please try again.'
      }
    }
    
    const intent = this.detectIntent(transcript)
    const response = await this.generateResponse(intent, transcript)
    
    return {
      action: intent.action,
      message: response.text,
      audioResponse: response.audioText,
      data: response.data || null,
      confidence: intent.confidence
    }
  }
  
  detectIntent(transcript) {
    const lowerTranscript = transcript.toLowerCase()
    
    for (const [action, patterns] of Object.entries(this.commandPatterns)) {
      for (const pattern of patterns) {
        if (lowerTranscript.includes(pattern)) {
          return {
            action,
            confidence: this.calculateConfidence(lowerTranscript, pattern)
          }
        }
      }
    }
    
    return {
      action: 'unknown',
      confidence: 0.1
    }
  }
  
  calculateConfidence(transcript, pattern) {
    const words = transcript.split(' ')
    const patternWords = pattern.split(' ')
    
    let matches = 0
    for (const word of patternWords) {
      if (words.includes(word)) {
        matches++
      }
    }
    
    return matches / patternWords.length
  }
  
  async generateResponse(intent, transcript) {
    switch (intent.action) {
      case 'summarize':
        return {
          text: 'Generating your terminal activity summary...',
          audioText: 'Let me summarize your recent terminal activity.',
          data: { endpoint: '/api/ai/summarize', method: 'POST' }
        }
        
      case 'tasks':
        return {
          text: 'Checking your current tasks...',
          audioText: 'Here are your current tasks and to-do items.',
          data: { endpoint: '/api/tasks/today', method: 'GET' }
        }
        
      case 'errors':
        return {
          text: 'Analyzing recent errors in your terminal...',
          audioText: 'Let me check for any recent errors or issues.',
          data: { endpoint: '/api/stats/errors', method: 'GET' }
        }
        
      case 'stats':
        return {
          text: 'Fetching your terminal statistics...',
          audioText: 'Here are your current terminal usage statistics.',
          data: { endpoint: '/api/stats/today', method: 'GET' }
        }
        
      case 'help':
        return {
          text: 'I can help you with terminal summaries, task management, error analysis, and statistics. What would you like to know?',
          audioText: 'I can help you summarize your terminal activity, manage tasks, analyze errors, and show statistics. What would you like to do?'
        }
        
      case 'search':
        const searchQuery = this.extractSearchQuery(transcript)
        return {
          text: `Searching for: ${searchQuery}`,
          audioText: `Searching your terminal history for ${searchQuery}.`,
          data: { 
            endpoint: '/api/logs/search', 
            method: 'GET',
            params: { q: searchQuery }
          }
        }
        
      default:
        return await this.generateAIResponse(transcript)
    }
  }
  
  extractSearchQuery(transcript) {
    // Extract search terms after common search phrases
    const searchPhrases = ['search for', 'find', 'look for']
    
    for (const phrase of searchPhrases) {
      const index = transcript.toLowerCase().indexOf(phrase)
      if (index !== -1) {
        return transcript.substring(index + phrase.length).trim()
      }
    }
    
    return transcript
  }
  
  async generateAIResponse(transcript) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return {
          text: `I heard: "${transcript}". How can I help you with your terminal monitoring?`,
          audioText: 'I understand what you said, but I need more context. How can I help you with your terminal activity?'
        }
      }
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{
          role: 'system',
          content: 'You are Dante, a voice assistant for terminal monitoring. Respond helpfully and concisely to user requests about their terminal activity, tasks, and productivity.'
        }, {
          role: 'user',
          content: transcript
        }],
        max_tokens: 150
      })
      
      const response = completion.choices[0].message.content
      
      return {
        text: response,
        audioText: response
      }
    } catch (error) {
      console.error('AI response generation error:', error)
      return {
        text: 'I had trouble understanding that. Can you try rephrasing your request?',
        audioText: 'Sorry, I had trouble processing that. Could you please try again?'
      }
    }
  }
}