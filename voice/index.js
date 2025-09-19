import express from 'express'
import WebSocket from 'ws'
import cors from 'cors'
import dotenv from 'dotenv'
import { VoiceProcessor } from './processors/VoiceProcessor.js'
import { SpeechRecognizer } from './processors/SpeechRecognizer.js'
import { TextToSpeech } from './processors/TextToSpeech.js'

dotenv.config()

const app = express()
const PORT = process.env.VOICE_PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())

// Initialize voice components
const voiceProcessor = new VoiceProcessor()
const speechRecognizer = new SpeechRecognizer()
const textToSpeech = new TextToSpeech()

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'voice-interface',
    timestamp: new Date().toISOString() 
  })
})

// Voice endpoints
app.post('/api/voice/process', async (req, res) => {
  try {
    const { audioData, format = 'wav' } = req.body
    
    if (!audioData) {
      return res.status(400).json({ error: 'Audio data required' })
    }
    
    // Process voice input
    const transcript = await speechRecognizer.transcribe(audioData, format)
    const response = await voiceProcessor.processCommand(transcript)
    
    res.json({
      transcript,
      response,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Voice processing error:', error)
    res.status(500).json({ error: 'Failed to process voice input' })
  }
})

app.post('/api/voice/synthesize', async (req, res) => {
  try {
    const { text, voice = 'alloy', format = 'mp3' } = req.body
    
    if (!text) {
      return res.status(400).json({ error: 'Text required' })
    }
    
    const audioBuffer = await textToSpeech.synthesize(text, voice, format)
    
    res.set({
      'Content-Type': `audio/${format}`,
      'Content-Length': audioBuffer.length
    })
    
    res.send(audioBuffer)
  } catch (error) {
    console.error('Speech synthesis error:', error)
    res.status(500).json({ error: 'Failed to synthesize speech' })
  }
})

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`🎤 Dante Voice Interface running on port ${PORT}`)
})

// WebSocket server for real-time voice communication
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws) => {
  console.log('🔗 Voice client connected')
  
  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data)
      
      switch (message.type) {
        case 'audio_chunk':
          // Handle streaming audio
          const transcript = await speechRecognizer.transcribeChunk(message.data)
          if (transcript) {
            ws.send(JSON.stringify({
              type: 'transcript',
              data: transcript
            }))
          }
          break
          
        case 'command':
          // Process voice command
          const response = await voiceProcessor.processCommand(message.data)
          ws.send(JSON.stringify({
            type: 'response',
            data: response
          }))
          break
          
        case 'tts_request':
          // Text-to-speech request
          const audioBuffer = await textToSpeech.synthesize(message.text)
          ws.send(JSON.stringify({
            type: 'audio_response',
            data: audioBuffer.toString('base64')
          }))
          break
      }
    } catch (error) {
      console.error('WebSocket message error:', error)
      ws.send(JSON.stringify({
        type: 'error',
        data: 'Failed to process message'
      }))
    }
  })
  
  ws.on('close', () => {
    console.log('🔌 Voice client disconnected')
  })
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

export default app