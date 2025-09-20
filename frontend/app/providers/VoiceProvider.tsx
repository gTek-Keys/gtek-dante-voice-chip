'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'

// 🌍 Web Speech API TypeScript declarations
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface VoiceContextType {
  isListening: boolean
  isSpeaking: boolean
  isHotwordActive: boolean
  startListening: () => void
  stopListening: () => void
  speak: (text: string) => void
  lastCommand: string
  confidence: number
  voiceActivity: number
  recognition: SpeechRecognition | null
  synthesis: SpeechSynthesis | null
  commandHistory: string[]
  isSupported: boolean
}

// 🌍 Ubuntu Voice Command Mapping
const UBUNTU_COMMAND_MAPPING: Record<string, string> = {
  // Greetings & Philosophy
  'hello dante': 'hello',
  'hey dante': 'hello', 
  'ubuntu philosophy': 'ubuntu',
  'what is ubuntu': 'ubuntu',
  'tell me about ubuntu': 'ubuntu',
  
  // System Commands  
  'show status': 'status',
  'check status': 'status',
  'system status': 'status',
  'health check': 'health',
  'show health': 'health',
  
  // Git Commands
  'git status': 'git status',
  'show git': 'git status', 
  'check repository': 'git status',
  'git log': 'git log',
  'show commits': 'git log',
  
  // Container Commands
  'show containers': 'containers',
  'docker status': 'containers',
  'container health': 'containers',
  
  // Voice Commands
  'voice status': 'voice',
  'microphone test': 'voice',
  'audio check': 'voice',
  
  // Analytics
  'show analytics': 'analytics',
  'vercel analytics': 'analytics',
  'website stats': 'analytics'
}

// 🎭 Ubuntu Wisdom Responses
const UBUNTU_RESPONSES = [
  "🌍 Ubuntu teaches us: I am because we are",
  "🤝 Through Ubuntu, technology serves community", 
  "🌱 Ubuntu wisdom: We grow together through shared knowledge",
  "💫 Ubuntu spirit: Individual brilliance shines in collective harmony",
  "🌊 Ubuntu flow: Like rivers joining the ocean, we are stronger together"
]

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isHotwordActive, setIsHotwordActive] = useState(false)
  const [lastCommand, setLastCommand] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [voiceActivity, setVoiceActivity] = useState(0)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [isSupported, setIsSupported] = useState(false)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const hotwordTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const activityIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 🌐 Initialize Web Speech API with Ubuntu enhancements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check browser support
      const hasWebSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
      setIsSupported(hasWebSpeech)
      
      if (hasWebSpeech) {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        
        const recognition = recognitionRef.current
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'
        recognition.maxAlternatives = 3

        // 🎯 Speech Recognition Event Handlers
        recognition.onstart = () => {
          console.log('🎤 Ubuntu voice recognition started')
          setIsListening(true)
          startVoiceActivityMonitoring()
        }

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = ''
          let interimTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i]
            const transcript = result[0].transcript.toLowerCase().trim()
            
            if (result.isFinal) {
              finalTranscript = transcript
              setConfidence(result[0].confidence)
              
              // 🌍 Ubuntu command processing
              processUbuntuCommand(transcript)
            } else {
              interimTranscript = transcript
            }
          }
          
          if (finalTranscript) {
            setLastCommand(finalTranscript)
            addToHistory(finalTranscript)
          }
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('🚨 Ubuntu voice recognition error:', event.error)
          setIsListening(false)
          stopVoiceActivityMonitoring()
          
          // Ubuntu-themed error handling
          speak(`🌍 Ubuntu spirit encountered a challenge: ${event.error}. Let us try again together.`)
        }

        recognition.onend = () => {
          console.log('🔇 Ubuntu voice recognition ended')
          setIsListening(false)
          stopVoiceActivityMonitoring()
        }

        // Initialize Speech Synthesis
        if ('speechSynthesis' in window) {
          synthesisRef.current = window.speechSynthesis
        }

        // 👂 Start hotword detection
        startHotwordDetection()
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (hotwordTimeoutRef.current) {
        clearTimeout(hotwordTimeoutRef.current)
      }
      stopVoiceActivityMonitoring()
    }
  }, [])

  // 🔥 Hotword Detection: "Hey Dante"
  const startHotwordDetection = () => {
    setIsHotwordActive(true)
    // In a real implementation, this would use a lightweight always-listening model
    // For now, we'll simulate it with periodic activation
    hotwordTimeoutRef.current = setTimeout(() => {
      console.log('👂 Ubuntu hotword detection active')
    }, 1000)
  }

  // 🎵 Voice Activity Monitoring
  const startVoiceActivityMonitoring = () => {
    activityIntervalRef.current = setInterval(() => {
      // Simulate voice activity level (in real implementation, use AudioContext)
      const activity = Math.random() * (isListening ? 1 : 0.1)
      setVoiceActivity(activity)
    }, 100)
  }

  const stopVoiceActivityMonitoring = () => {
    if (activityIntervalRef.current) {
      clearInterval(activityIntervalRef.current)
      setVoiceActivity(0)
    }
  }

  // 🧠 Ubuntu Command Processing with Fuzzy Matching
  const processUbuntuCommand = async (transcript: string) => {
    console.log('🌍 Processing Ubuntu command:', transcript)
    
    try {
      // Use the advanced Ubuntu Voice Processor
      const { UbuntuVoiceProcessor } = await import('../../lib/ubuntu-voice-processor')
      const processor = new UbuntuVoiceProcessor(
        process.env.NEXT_PUBLIC_MCP_SECRET || 'dev-secret-key'
      )
      
      const result = await processor.processCommand(transcript)
      
      if (result.success) {
        // Speak the response with Ubuntu wisdom
        const fullResponse = result.ubuntu_wisdom ? 
          `${result.response} ${result.ubuntu_wisdom}` : 
          result.response
        
        speak(fullResponse)
        
        // Log analytics
        console.log('🌍 Ubuntu Voice Analytics:', processor.getAnalytics())
      } else {
        speak(result.response)
      }
    } catch (error) {
      console.error('🚨 Ubuntu Voice Processing Error:', error)
      speak('🌍 Ubuntu spirit: I encountered a challenge processing your command. Ubuntu teaches resilience - let us try again together.')
    }
  }

  // 🔗 Execute Command via MCP Connector
  const executeMCPCommand = async (command: string) => {
    try {
      const response = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-mcp-secret': process.env.NEXT_PUBLIC_MCP_SECRET || 'dev-secret-key'
        },
        body: JSON.stringify({ command })
      })
      
      const result = await response.json()
      console.log('🔌 MCP Response:', result)
      
      // Speak the result with Ubuntu context
      if (result.cultural_message) {
        speak(result.cultural_message)
      } else if (result.ubuntu_message) {
        speak(result.ubuntu_message)
      } else if (result.message) {
        speak(result.message)
      }
    } catch (error) {
      console.error('🚨 MCP Command Error:', error)
      speak('🌍 Ubuntu spirit: There was a challenge connecting to our systems. We remain resilient together.')
    }
  }

  // 🎭 Get Ubuntu-themed Response
  const getUbuntuResponse = (command: string): string => {
    const responses = {
      hello: "👋🏿 Ubuntu greetings! I am here because we are connected. How may I serve our community?",
      status: "📊 Ubuntu system harmony being checked...",
      ubuntu: UBUNTU_RESPONSES[Math.floor(Math.random() * UBUNTU_RESPONSES.length)],
      git: "🌱 Ubuntu collaboration: Checking our shared repository...",
      health: "💚 Ubuntu wellness: Monitoring our technological health...",
      voice: "🎤 Ubuntu voice: Testing our communication channels...",
      containers: "🐳 Ubuntu containers: Like community, stronger together...",
      analytics: "📈 Ubuntu insights: Understanding our community's journey..."
    }
    
    return responses[command as keyof typeof responses] || "🌍 Ubuntu spirit acknowledges your command..."
  }

  // 📚 Command History Management
  const addToHistory = (command: string) => {
    setCommandHistory(prev => [command, ...prev.slice(0, 4)]) // Keep last 5 commands
  }

  // 🎤 Start Listening
  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      try {
        recognitionRef.current.start()
        speak("🎤 Ubuntu voice activated. Speak your wisdom...")
      } catch (error) {
        console.error('🚨 Recognition start error:', error)
      }
    } else {
      console.warn('🚨 Speech recognition not supported')
      speak("🌍 Ubuntu challenge: Voice recognition not available in this browser.")
    }
  }
  
  // 🔇 Stop Listening  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }
  
  // 🗣️ Advanced Text-to-Speech with Ubuntu Cultural Voice
  const speak = (text: string) => {
    if (synthesisRef.current && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      synthesisRef.current.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      // 🌍 Ubuntu voice configuration with African cultural characteristics
      utterance.rate = 0.85 // Thoughtful, measured pace reflecting Ubuntu wisdom
      utterance.pitch = 1.15 // Warmer, more welcoming tone
      utterance.volume = 0.9 // Clear, confident community voice
      
      // 🎭 Select culturally appropriate voice
      const voices = synthesisRef.current.getVoices()
      
      // Preference order for Ubuntu spirit:
      // 1. Female voices (community/maternal wisdom)
      // 2. Voices with cultural warmth
      // 3. Clear, articulate voices for accessibility
      const preferredVoice = voices.find(voice => {
        const name = voice.name.toLowerCase()
        const lang = voice.lang.toLowerCase()
        
        // Prioritize voices that reflect community warmth
        return (
          // South African English if available
          lang.includes('en-za') ||
          // Female voices for Ubuntu maternal wisdom
          (name.includes('female') && lang.includes('en')) ||
          // Specific quality voices
          name.includes('samantha') || 
          name.includes('karen') ||
          name.includes('tessa') ||
          // UK/US female voices as fallback
          (name.includes('female') && (lang.includes('en-gb') || lang.includes('en-us')))
        )
      }) || voices.find(voice => voice.lang.includes('en'))

      if (preferredVoice) {
        utterance.voice = preferredVoice
        console.log('🎭 Ubuntu voice selected:', preferredVoice.name, preferredVoice.lang)
      }

      // 🌍 Enhanced event handlers with Ubuntu context
      utterance.onstart = () => {
        setIsSpeaking(true)
        console.log('🗣️ Ubuntu wisdom flows through spoken word')
      }
      
      utterance.onend = () => {
        setIsSpeaking(false)
        console.log('🔇 Ubuntu speech complete - wisdom shared')
        
        // Add subtle pause for Ubuntu reflection
        setTimeout(() => {
          console.log('🌍 Ubuntu moment of reflection complete')
        }, 500)
      }
      
      utterance.onerror = (error) => {
        setIsSpeaking(false)
        console.error('🚨 Ubuntu speech error:', error)
        
        // Fallback: try again with default voice
        setTimeout(() => {
          const fallbackUtterance = new SpeechSynthesisUtterance(
            "🌍 Ubuntu spirit: I encountered a voice challenge, but our connection remains strong."
          )
          fallbackUtterance.rate = 0.9
          fallbackUtterance.pitch = 1.0
          synthesisRef.current?.speak(fallbackUtterance)
        }, 1000)
      }

      // 🎵 Add Ubuntu-themed SSML-like emphasis for key phrases
      const enhancedText = enhanceTextWithUbuntuEmphasis(text)
      utterance.text = enhancedText

      synthesisRef.current.speak(utterance)
    } else {
      console.warn('🚨 Speech synthesis not available - Ubuntu wisdom remains silent')
    }
  }

  // 🎨 Enhance text with Ubuntu cultural emphasis
  const enhanceTextWithUbuntuEmphasis = (text: string): string => {
    return text
      // Add brief pauses after Ubuntu wisdom
      .replace(/Ubuntu/g, 'Ubuntu... ')
      .replace(/🌍/g, '🌍 ')
      .replace(/🤝/g, '🤝 ')
      // Emphasize community concepts
      .replace(/community/g, 'community ')
      .replace(/together/g, 'together ')
      .replace(/wisdom/g, 'wisdom ')
      // Add warmth to technical terms
      .replace(/status/g, 'system status')
      .replace(/error/g, 'challenge')
      .replace(/failed/g, 'encountered difficulty')
  }

  return (
    <VoiceContext.Provider value={{
      isListening,
      isSpeaking,
      isHotwordActive,
      startListening,
      stopListening,
      speak,
      lastCommand,
      confidence,
      voiceActivity,
      recognition: recognitionRef.current,
      synthesis: synthesisRef.current,
      commandHistory,
      isSupported
    }}>
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  const context = useContext(VoiceContext)
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider')
  }
  return context
}