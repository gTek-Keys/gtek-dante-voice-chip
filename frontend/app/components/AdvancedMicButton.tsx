'use client'

import { useState, useEffect, useRef } from 'react'
import { useVoice } from '../providers/VoiceProvider'

interface AdvancedMicButtonProps {
  onCommand: (command: string) => void
  className?: string
}

export function AdvancedMicButton({ onCommand, className = '' }: AdvancedMicButtonProps) {
  const { 
    isListening, 
    isSpeaking, 
    isHotwordActive,
    startListening, 
    stopListening, 
    speak,
    lastCommand,
    confidence,
    voiceActivity
  } = useVoice()
  
  const [isPressed, setIsPressed] = useState(false)
  const [visualizerData, setVisualizerData] = useState<number[]>([])
  const micRef = useRef<HTMLButtonElement>(null)

  // 🌍 Ubuntu-themed voice states
  const getVoiceState = () => {
    if (isHotwordActive) return { 
      icon: '👂🏿', 
      text: 'Ubuntu spirit listening...', 
      style: 'bg-gradient-to-r from-african-gold to-african-crimson animate-pulse',
      message: '🌍 Say "Hey Dante" to awaken Ubuntu wisdom'
    }
    if (isListening) return { 
      icon: '🎤', 
      text: 'Ubuntu wisdom flows...', 
      style: 'bg-african-emerald animate-pulse border-2 border-african-gold',
      message: '🗣️ Speak your command with Ubuntu purpose'
    }
    if (isSpeaking) return { 
      icon: '🗣️', 
      text: 'Dante responds...', 
      style: 'bg-african-crimson animate-bounce',
      message: '🎭 Ubuntu wisdom being spoken'
    }
    return { 
      icon: '🎙️', 
      text: 'Ready for Ubuntu dialogue', 
      style: 'bg-african-midnight/70 hover:bg-african-midnight/90 border border-african-gold/30',
      message: '👋🏿 Click to start Ubuntu conversation'
    }
  }

  // 🎯 Enhanced click handling with Ubuntu feedback
  const handleMicClick = () => {
    const state = getVoiceState()
    
    if (isListening) {
      stopListening()
      speak("🌍 Ubuntu wisdom received. Processing your command...")
    } else {
      startListening()
      speak("👋🏿 Ubuntu spirit awakened. I am listening because we are connected...")
    }
    
    // Visual feedback with Ubuntu spirit
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 200)
  }

  // 🎵 Voice activity visualizer
  useEffect(() => {
    if (voiceActivity && isListening) {
      const newData = Array.from({ length: 20 }, () => 
        Math.random() * voiceActivity * 100
      )
      setVisualizerData(newData)
    } else {
      setVisualizerData(Array(20).fill(0))
    }
  }, [voiceActivity, isListening])

  // ⌨️ Keyboard shortcuts with Ubuntu wisdom
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Space bar toggle
      if (e.code === 'Space' && e.ctrlKey) {
        e.preventDefault()
        handleMicClick()
      }
      // Ubuntu hotkey: Ctrl+U for Ubuntu
      if (e.code === 'KeyU' && e.ctrlKey && e.altKey) {
        e.preventDefault()
        speak("🌍 Ubuntu philosophy: I am because we are. Technology serves community.")
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isListening])

  const state = getVoiceState()

  return (
    <div className={`relative voice-control-container ${className}`}>
      {/* 🌍 Ubuntu Philosophy Header */}
      <div className="mb-4 text-center">
        <p className="text-african-gold text-sm font-medium">
          Ubuntu Voice Interface: "I am because we are"
        </p>
      </div>

      {/* 🎤 Main Mic Button */}
      <button
        ref={micRef}
        onClick={handleMicClick}
        className={`
          relative w-20 h-20 rounded-full transition-all duration-300 ease-ubuntu
          ${state.style}
          ${isPressed ? 'scale-95' : 'scale-100'}
          shadow-lg hover:shadow-xl
          border-2 border-african-gold/50 hover:border-african-gold
          group
        `}
        aria-label={state.message}
        title={state.message}
      >
        {/* 🌟 Ubuntu Energy Rings */}
        {isListening && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 rounded-full border-2 border-african-gold animate-ping opacity-75"></div>
            <div className="absolute inset-2 rounded-full border border-african-emerald animate-pulse opacity-50"></div>
          </div>
        )}
        
        {/* 🎭 Icon */}
        <span className="text-2xl filter drop-shadow-lg">
          {state.icon}
        </span>
        
        {/* 🔊 Confidence Indicator */}
        {confidence > 0 && (
          <div className="absolute -top-2 -right-2 bg-african-emerald text-african-midnight text-xs px-2 py-1 rounded-full font-bold">
            {Math.round(confidence * 100)}%
          </div>
        )}
      </button>

      {/* 🎵 Voice Activity Visualizer */}
      {isListening && (
        <div className="flex items-end justify-center space-x-1 h-8 mt-4">
          {visualizerData.map((height, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-african-gold to-african-emerald rounded-full w-1 transition-all duration-150"
              style={{ 
                height: Math.max(2, height / 5) + 'px',
                opacity: height > 0 ? 0.8 : 0.3
              }}
            />
          ))}
        </div>
      )}

      {/* 🗨️ Status Message */}
      <div className="text-center mt-4">
        <p className="text-interface-mist text-sm font-medium">
          {state.text}
        </p>
        {lastCommand && (
          <p className="text-african-gold text-xs mt-1 italic">
            "🎤 {lastCommand}"
          </p>
        )}
      </div>

      {/* ⌨️ Keyboard Shortcuts */}
      <div className="text-center mt-3 text-xs text-interface-mist/70">
        <p>Ctrl+Space: Toggle • Ctrl+Alt+U: Ubuntu Wisdom</p>
      </div>

      {/* 🌍 Ubuntu Cultural Context */}
      {isHotwordActive && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-64">
          <div className="bg-african-midnight/90 border border-african-gold/30 rounded-lg p-3 text-center">
            <p className="text-african-gold text-xs">
              🌍 Ubuntu spirit listens: Technology serving community wisdom
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// 🎨 Ubuntu-themed CSS classes (add to globals.css)
const ubuntuStyles = `
.ease-ubuntu {
  transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.voice-control-container .group:hover {
  transform: translateY(-1px);
}

@keyframes ubuntu-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.animate-ubuntu-pulse {
  animation: ubuntu-pulse 2s ease-in-out infinite;
}
`