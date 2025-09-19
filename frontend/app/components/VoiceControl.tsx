'use client'

import { useState } from 'react'
import { useVoice } from '../providers/VoiceProvider'

interface VoiceControlProps {
  onCommand: (command: string) => void
  isActive: boolean
  onActiveChange: (active: boolean) => void
}

export function VoiceControl({ onCommand, isActive, onActiveChange }: VoiceControlProps) {
  const { isListening, isSpeaking, startListening, stopListening, speak } = useVoice()

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
    onActiveChange(!isListening)
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleListening}
        className={`p-3 rounded-full transition-colors ${
          isListening 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
        }`}
      >
        🎤
      </button>
      
      <div className="flex items-center space-x-2">
        <div className={`voice-indicator ${
          isListening ? 'listening' : isSpeaking ? 'speaking' : ''
        }`} />
        <span className="text-sm text-gray-600">
          {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
        </span>
      </div>
    </div>
  )
}