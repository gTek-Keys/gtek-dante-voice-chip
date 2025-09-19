import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

export class TextToSpeech {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    
    this.voices = {
      alloy: 'alloy',     // Neutral, balanced
      echo: 'echo',       // Clear, expressive
      fable: 'fable',     // Warm, engaging
      onyx: 'onyx',       // Deep, authoritative
      nova: 'nova',       // Bright, upbeat
      shimmer: 'shimmer'  // Soft, pleasant
    }
    
    this.cache = new Map() // Simple cache for common phrases
  }
  
  async synthesize(text, voice = 'alloy', format = 'mp3') {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('No text provided for synthesis')
      }
      
      // Check cache first
      const cacheKey = `${text}_${voice}_${format}`
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)
      }
      
      if (!process.env.OPENAI_API_KEY) {
        // Return mock audio for development
        return Buffer.from('mock-audio-data')
      }
      
      // Generate speech using OpenAI TTS
      const response = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: this.voices[voice] || voice,
        input: text,
        response_format: format
      })
      
      const audioBuffer = Buffer.from(await response.arrayBuffer())
      
      // Cache the result (limit cache size)
      if (this.cache.size > 50) {
        const firstKey = this.cache.keys().next().value
        this.cache.delete(firstKey)
      }
      this.cache.set(cacheKey, audioBuffer)
      
      return audioBuffer
    } catch (error) {
      console.error('Text-to-speech error:', error)
      throw new Error('Failed to synthesize speech')
    }
  }
  
  async synthesizeWithOptions(text, options = {}) {
    const {
      voice = 'alloy',
      speed = 1.0,
      format = 'mp3',
      quality = 'standard'
    } = options
    
    try {
      const response = await this.openai.audio.speech.create({
        model: quality === 'high' ? 'tts-1-hd' : 'tts-1',
        voice: this.voices[voice] || voice,
        input: text,
        response_format: format,
        speed: Math.max(0.25, Math.min(4.0, speed)) // Clamp speed
      })
      
      return Buffer.from(await response.arrayBuffer())
    } catch (error) {
      console.error('Advanced TTS error:', error)
      throw new Error('Failed to synthesize speech with options')
    }
  }
  
  // Generate contextual responses based on terminal activity
  async generateContextualResponse(data, responseType = 'summary') {
    let text = ''
    
    switch (responseType) {
      case 'summary':
        text = this.generateSummaryText(data)
        break
      case 'tasks':
        text = this.generateTasksText(data)
        break
      case 'errors':
        text = this.generateErrorsText(data)
        break
      case 'stats':
        text = this.generateStatsText(data)
        break
      default:
        text = 'I have the information you requested.'
    }
    
    return await this.synthesize(text, 'nova') // Use upbeat voice for responses
  }
  
  generateSummaryText(data) {
    if (!data) {
      return 'I couldn\'t retrieve your activity summary at the moment.'
    }
    
    return `Here\'s your terminal summary: You\'ve run ${data.commandsToday || 0} commands today with ${data.errorsToday || 0} errors. You\'ve been active for ${data.activeMinutes || 0} minutes.`
  }
  
  generateTasksText(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return 'You have no tasks scheduled for today.'
    }
    
    const incomplete = data.filter(task => !task.completed)
    const completed = data.filter(task => task.completed)
    
    let text = `You have ${incomplete.length} pending tasks`
    if (completed.length > 0) {
      text += ` and ${completed.length} completed tasks`
    }
    text += ' for today.'
    
    if (incomplete.length > 0) {
      const highPriority = incomplete.filter(task => task.priority === 'high')
      if (highPriority.length > 0) {
        text += ` ${highPriority.length} of them are high priority.`
      }
    }
    
    return text
  }
  
  generateErrorsText(data) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return 'Great news! I found no recent errors in your terminal activity.'
    }
    
    const totalErrors = data.reduce((sum, item) => sum + (item.error_count || 0), 0)
    return `I found ${totalErrors} errors across ${data.length} different commands. The most problematic command is ${data[0]?.command || 'unknown'}.`
  }
  
  generateStatsText(data) {
    if (!data) {
      return 'I couldn\'t retrieve your statistics at the moment.'
    }
    
    return `Today\'s statistics: ${data.commandsToday || 0} commands executed, ${data.errorsToday || 0} errors encountered, and ${data.activeMinutes || 0} minutes of active terminal time.`
  }
  
  // Utility method to get available voices
  getAvailableVoices() {
    return Object.keys(this.voices)
  }
  
  // Clear the audio cache
  clearCache() {
    this.cache.clear()
    console.log('TTS cache cleared')
  }
}