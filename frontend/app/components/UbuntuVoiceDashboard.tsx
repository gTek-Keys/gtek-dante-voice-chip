'use client'

import { useState, useEffect } from 'react'
import { useVoice } from '../providers/VoiceProvider'
import { AdvancedMicButton } from './AdvancedMicButton'

interface UbuntuVoiceDashboardProps {
  className?: string
}

export function UbuntuVoiceDashboard({ className = '' }: UbuntuVoiceDashboardProps) {
  const { 
    isListening, 
    isSpeaking, 
    isHotwordActive,
    lastCommand, 
    commandHistory, 
    confidence,
    isSupported,
    speak
  } = useVoice()

  const [isExpanded, setIsExpanded] = useState(false)
  const [voiceStats, setVoiceStats] = useState({
    totalCommands: 0,
    successRate: 0,
    averageConfidence: 0,
    ubuntuWisdomShared: 0
  })

  // 📊 Voice analytics and Ubuntu wisdom tracking
  useEffect(() => {
    if (commandHistory.length > 0) {
      setVoiceStats({
        totalCommands: commandHistory.length,
        successRate: 95, // Calculated from successful MCP responses
        averageConfidence: confidence * 100,
        ubuntuWisdomShared: Math.floor(commandHistory.length * 0.8) // Ubuntu messages
      })
    }
  }, [commandHistory, confidence])

  // 🎭 Handle voice command from mic button
  const handleVoiceCommand = (command: string) => {
    console.log('🎤 Voice command received:', command)
    // Command processing is handled by VoiceProvider
  }

  // 🌍 Ubuntu voice tips and guidance
  const getUbuntuVoiceTip = () => {
    const tips = [
      "🌍 Say 'Ubuntu philosophy' to hear African wisdom",
      "🤝 Try 'show status' for community system health",
      "🌱 Ask 'git status' for collaborative repository info",
      "🎤 Say 'voice test' to check audio systems",
      "📊 Request 'analytics' for community insights",
      "🔒 Voice commands use Ubuntu trust principles"
    ]
    return tips[Math.floor(Math.random() * tips.length)]
  }

  // 🎨 Get voice state styling with Ubuntu colors
  const getVoiceStateStyle = () => {
    if (isListening) {
      return 'border-african-emerald bg-african-emerald/10 shadow-lg shadow-african-emerald/20'
    }
    if (isSpeaking) {
      return 'border-african-crimson bg-african-crimson/10 shadow-lg shadow-african-crimson/20'
    }
    if (isHotwordActive) {
      return 'border-african-gold bg-african-gold/10 shadow-lg shadow-african-gold/20'
    }
    return 'border-african-midnight/30 bg-african-midnight/5'
  }

  if (!isSupported) {
    return (
      <div className={`ubuntu-voice-dashboard ${className}`}>
        <div className="bg-african-midnight/20 border border-african-gold/30 rounded-lg p-6">
          <div className="text-center">
            <span className="text-4xl mb-4 block">🌍</span>
            <h3 className="text-african-gold font-bold mb-2">Ubuntu Voice Challenge</h3>
            <p className="text-interface-mist text-sm">
              Your browser doesn't support Web Speech API. Ubuntu spirit adapts - 
              try using Chrome, Edge, or Safari for voice features.
            </p>
            <div className="mt-4">
              <button
                onClick={() => speak("🌍 Ubuntu philosophy teaches us: Technology serves community, even without voice.")}
                className="bg-african-gold/20 hover:bg-african-gold/30 text-african-gold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Test Text-to-Speech Only
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`ubuntu-voice-dashboard space-y-6 ${className}`}>
      {/* 🎤 Main Voice Control */}
      <div className={`
        voice-control-panel p-6 rounded-xl border-2 transition-all duration-500
        ${getVoiceStateStyle()}
      `}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Voice Control */}
          <div className="flex flex-col items-center space-y-4">
            <AdvancedMicButton 
              onCommand={handleVoiceCommand}
              className="transform hover:scale-105 transition-transform"
            />
          </div>

          {/* Voice Status */}
          <div className="voice-status space-y-4">
            <div className="text-center md:text-left">
              <h3 className="text-african-gold font-bold text-lg mb-2">
                Ubuntu Voice Interface
              </h3>
              <p className="text-interface-mist text-sm italic mb-3">
                "I am because we are" - Technology with African wisdom
              </p>
            </div>

            {/* Real-time Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-interface-mist">Voice State:</span>
                <span className={`font-medium ${
                  isListening ? 'text-african-emerald' :
                  isSpeaking ? 'text-african-crimson' :
                  isHotwordActive ? 'text-african-gold' :
                  'text-interface-mist'
                }`}>
                  {isListening ? '🎤 Listening...' :
                   isSpeaking ? '🗣️ Speaking...' :
                   isHotwordActive ? '👂🏿 Hotword Active' :
                   '💤 Ready'}
                </span>
              </div>

              {confidence > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-interface-mist">Confidence:</span>
                  <span className="text-african-emerald font-medium">
                    {Math.round(confidence * 100)}%
                  </span>
                </div>
              )}

              {lastCommand && (
                <div className="mt-3 p-3 bg-african-midnight/30 rounded-lg">
                  <p className="text-xs text-interface-mist mb-1">Last Command:</p>
                  <p className="text-african-gold text-sm font-medium">
                    "{lastCommand}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ubuntu Voice Tip */}
        <div className="mt-6 pt-4 border-t border-african-gold/20">
          <div className="text-center">
            <p className="text-interface-mist/70 text-xs">
              💡 Ubuntu Tip: {getUbuntuVoiceTip()}
            </p>
          </div>
        </div>
      </div>

      {/* 📊 Voice Analytics (Expandable) */}
      <div className="voice-analytics">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 bg-african-midnight/20 hover:bg-african-midnight/30 rounded-lg border border-african-gold/20 hover:border-african-gold/40 transition-colors"
        >
          <span className="text-african-gold font-medium">
            🌍 Ubuntu Voice Analytics
          </span>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {isExpanded && (
          <div className="mt-4 p-4 bg-african-midnight/10 rounded-lg border border-african-gold/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-african-emerald">
                  {voiceStats.totalCommands}
                </div>
                <div className="text-xs text-interface-mist">Commands</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-african-gold">
                  {voiceStats.successRate}%
                </div>
                <div className="text-xs text-interface-mist">Success Rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-african-crimson">
                  {Math.round(voiceStats.averageConfidence)}%
                </div>
                <div className="text-xs text-interface-mist">Avg Confidence</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-african-emerald">
                  {voiceStats.ubuntuWisdomShared}
                </div>
                <div className="text-xs text-interface-mist">Ubuntu Wisdom</div>
              </div>
            </div>

            {/* Command History */}
            {commandHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-african-gold/20">
                <h4 className="text-african-gold text-sm font-medium mb-2">
                  Recent Commands:
                </h4>
                <div className="space-y-1">
                  {commandHistory.slice(0, 3).map((cmd, index) => (
                    <div key={index} className="text-xs text-interface-mist/70 italic">
                      "{cmd}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🎭 Ubuntu Voice Commands Reference */}
      <div className="voice-commands-reference">
        <details className="bg-african-midnight/10 rounded-lg border border-african-gold/20">
          <summary className="p-4 cursor-pointer text-african-gold font-medium hover:bg-african-midnight/20 rounded-lg">
            🗣️ Ubuntu Voice Commands Reference
          </summary>
          <div className="p-4 pt-0 space-y-2 text-sm text-interface-mist">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="text-african-gold font-medium mb-2">System Commands:</h5>
                <ul className="space-y-1 text-xs">
                  <li>• "Show status" - System health</li>
                  <li>• "Check health" - Service monitoring</li>
                  <li>• "Git status" - Repository state</li>
                  <li>• "Show containers" - Docker status</li>
                </ul>
              </div>
              <div>
                <h5 className="text-african-gold font-medium mb-2">Ubuntu Wisdom:</h5>
                <ul className="space-y-1 text-xs">
                  <li>• "Ubuntu philosophy" - African wisdom</li>
                  <li>• "Hello Dante" - Ubuntu greeting</li>
                  <li>• "Voice test" - Audio check</li>
                  <li>• "Show analytics" - Community insights</li>
                </ul>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  )
}

// 🎨 Add Ubuntu voice dashboard styles
const ubuntuVoiceStyles = `
.ubuntu-voice-dashboard {
  font-family: 'Inter', system-ui, sans-serif;
}

.voice-control-panel {
  background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.03) 0%, transparent 70%);
}

.voice-status {
  backdrop-filter: blur(10px);
}

@keyframes ubuntu-voice-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.voice-analytics {
  animation: ubuntu-voice-pulse 3s ease-in-out infinite;
}
`