'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface VoiceContextType {
  isListening: boolean
  isSpeaking: boolean
  startListening: () => void
  stopListening: () => void
  speak: (text: string) => void
  lastCommand: string
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined)

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastCommand, setLastCommand] = useState('')
  
  const startListening = () => {
    setIsListening(true)
    // Web Speech API implementation will go here
  }
  
  const stopListening = () => {
    setIsListening(false)
  }
  
  const speak = (text: string) => {
    setIsSpeaking(true)
    // Text-to-speech implementation will go here
    setTimeout(() => setIsSpeaking(false), 2000) // Mock duration
  }

  return (
    <VoiceContext.Provider value={{
      isListening,
      isSpeaking,
      startListening,
      stopListening,
      speak,
      lastCommand
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