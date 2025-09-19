import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

export class SpeechRecognizer {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    
    this.isListening = false
    this.audioBuffer = []
  }
  
  async transcribe(audioData, format = 'wav') {
    try {
      if (!process.env.OPENAI_API_KEY) {
        // Return mock transcription for development
        return 'Mock transcription: Please configure OpenAI API key for actual speech recognition'
      }
      
      // Convert base64 to buffer if needed
      let audioBuffer
      if (typeof audioData === 'string') {
        audioBuffer = Buffer.from(audioData, 'base64')
      } else {
        audioBuffer = audioData
      }
      
      // Write temporary file for OpenAI API
      const tempFile = path.join('/tmp', `audio_${Date.now()}.${format}`)
      fs.writeFileSync(tempFile, audioBuffer)
      
      // Transcribe using OpenAI Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFile),
        model: 'whisper-1',
        language: 'en'
      })
      
      // Clean up temp file
      fs.unlinkSync(tempFile)
      
      return transcription.text
    } catch (error) {
      console.error('Speech recognition error:', error)
      throw new Error('Failed to transcribe audio')
    }
  }
  
  async transcribeChunk(audioChunk) {
    // For streaming audio chunks
    this.audioBuffer.push(audioChunk)
    
    // Process when we have enough audio (e.g., 3 seconds worth)
    if (this.audioBuffer.length > 10) {
      const combinedAudio = Buffer.concat(this.audioBuffer)
      this.audioBuffer = [] // Reset buffer
      
      try {
        return await this.transcribe(combinedAudio)
      } catch (error) {
        console.error('Chunk transcription error:', error)
        return null
      }
    }
    
    return null
  }
  
  startListening() {
    this.isListening = true
    this.audioBuffer = []
    console.log('🎤 Started listening...')
  }
  
  stopListening() {
    this.isListening = false
    console.log('🔇 Stopped listening')
  }
  
  // Web Speech API alternative for browser-based recognition
  createWebSpeechRecognizer() {
    return {
      start: () => {
        // This would be implemented on the frontend using Web Speech API
        console.log('Web Speech API recognition would start here')
      },
      stop: () => {
        console.log('Web Speech API recognition would stop here')
      },
      // Configuration for Web Speech API
      config: {
        continuous: true,
        interimResults: true,
        lang: 'en-US'
      }
    }
  }
  
  // Process voice commands with confidence scoring
  async transcribeWithConfidence(audioData, format = 'wav') {
    try {
      const transcript = await this.transcribe(audioData, format)
      
      // Calculate confidence based on transcript characteristics
      const confidence = this.calculateTranscriptConfidence(transcript)
      
      return {
        transcript,
        confidence,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        transcript: '',
        confidence: 0,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }
  
  calculateTranscriptConfidence(transcript) {
    if (!transcript || transcript.length < 3) {
      return 0.1
    }
    
    // Simple confidence calculation based on transcript characteristics
    let confidence = 0.5
    
    // Boost confidence for common command words
    const commandWords = ['summarize', 'tasks', 'errors', 'help', 'search']
    for (const word of commandWords) {
      if (transcript.toLowerCase().includes(word)) {
        confidence += 0.2
      }
    }
    
    // Reduce confidence for very short or very long transcripts
    if (transcript.length < 10) {
      confidence -= 0.2
    } else if (transcript.length > 200) {
      confidence -= 0.1
    }
    
    return Math.min(Math.max(confidence, 0.1), 1.0)
  }
}