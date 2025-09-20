'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceCommand {
  timestamp: string
  command: string
  success: boolean
  result: string
  cultural_response: string
}

interface VoiceControlState {
  isListening: boolean
  transcript: string
  isProcessing: boolean
  lastCommand: VoiceCommand | null
  mcpAvailable: boolean
  availableCommands: string[]
}

export default function VoiceControlDashboard() {
  const [state, setState] = useState<VoiceControlState>({
    isListening: false,
    transcript: '',
    isProcessing: false,
    lastCommand: null,
    mcpAvailable: false,
    availableCommands: []
  })
  
  const [recentCommands, setRecentCommands] = useState<VoiceCommand[]>([])
  const recognitionRef = useRef<any>(null)
  
  // 🎤 Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onstart = () => {
        setState(prev => ({ ...prev, isListening: true, transcript: '' }))
      }
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('')
        
        setState(prev => ({ ...prev, transcript }))
        
        // Process final result
        if (event.results[event.results.length - 1].isFinal) {
          processVoiceCommand(transcript)
        }
      }
      
      recognitionRef.current.onend = () => {
        setState(prev => ({ ...prev, isListening: false }))
      }
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setState(prev => ({ 
          ...prev, 
          isListening: false,
          transcript: '🚨 Voice recognition error - try again with Ubuntu spirit'
        }))
      }
    }
    
    // Load available commands
    loadAvailableCommands()
  }, [])
  
  // 🧠 Load available voice commands
  const loadAvailableCommands = async () => {
    try {
      const response = await fetch('/api/mcp/command')
      const data = await response.json()
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          mcpAvailable: data.mcp_available,
          availableCommands: data.available_commands
        }))
      }
    } catch (error) {
      console.error('Failed to load commands:', error)
    }
  }
  
  // 🎯 Process voice command
  const processVoiceCommand = async (command: string) => {
    if (!command.trim()) return
    
    setState(prev => ({ ...prev, isProcessing: true }))
    
    try {
      const response = await fetch('/api/mcp/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command })
      })
      
      const result = await response.json()
      
      const newCommand: VoiceCommand = {
        timestamp: new Date().toISOString(),
        command,
        success: result.success,
        result: result.success ? 'Command executed' : result.error,
        cultural_response: result.message
      }
      
      setState(prev => ({ ...prev, lastCommand: newCommand }))
      setRecentCommands(prev => [newCommand, ...prev.slice(0, 9)])
      
      // Speak response if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(result.message)
        utterance.rate = 0.8
        utterance.pitch = 1.0
        speechSynthesis.speak(utterance)
      }
      
    } catch (error) {
      console.error('Voice command error:', error)
      const errorCommand: VoiceCommand = {
        timestamp: new Date().toISOString(),
        command,
        success: false,
        result: 'Network error',
        cultural_response: '🚨 Network challenge - Ubuntu guides us forward'
      }
      
      setState(prev => ({ ...prev, lastCommand: errorCommand }))
      setRecentCommands(prev => [errorCommand, ...prev.slice(0, 9)])
    }
    
    setState(prev => ({ ...prev, isProcessing: false, transcript: '' }))
  }
  
  // 🎙️ Start voice recognition
  const startListening = () => {
    if (recognitionRef.current && !state.isListening) {
      recognitionRef.current.start()
    }
  }
  
  // 🛑 Stop voice recognition
  const stopListening = () => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop()
    }
  }
  
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-xl border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-green-500 bg-clip-text text-transparent">
            🎤 Dante Voice Control
          </h2>
          <p className="text-slate-400 mt-1">
            Model Context Protocol Integration {state.mcpAvailable ? '✅' : '🔧 Fallback Mode'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className={`w-4 h-4 rounded-full ${state.mcpAvailable ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
          <span className="text-sm text-slate-400">
            {state.mcpAvailable ? 'MCP Active' : 'Direct Commands'}
          </span>
        </div>
      </div>
      
      {/* Voice Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Voice Controls */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">🎙️ Voice Input</h3>
          
          <div className="text-center mb-6">
            <motion.button
              onClick={state.isListening ? stopListening : startListening}
              disabled={state.isProcessing}
              className={`w-24 h-24 rounded-full border-4 transition-all duration-300 ${
                state.isListening
                  ? 'bg-red-500 border-red-400 animate-pulse'
                  : state.isProcessing
                  ? 'bg-yellow-500 border-yellow-400'
                  : 'bg-green-600 border-green-400 hover:bg-green-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl">
                {state.isListening ? '🔴' : state.isProcessing ? '⚡' : '🎤'}
              </span>
            </motion.button>
            
            <p className="text-sm text-slate-400 mt-3">
              {state.isListening
                ? 'Listening with Ubuntu spirit...'
                : state.isProcessing
                ? 'Processing command...'
                : 'Click to speak your command'
              }
            </p>
          </div>
          
          {/* Transcript Display */}
          <div className="bg-slate-900 rounded-lg p-4 min-h-[80px]">
            <p className="text-slate-300">
              {state.transcript || (state.isListening ? '🎵 Speak now...' : '💭 Ready for voice commands')}
            </p>
          </div>
        </div>
        
        {/* Available Commands */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-yellow-400 mb-4">🎯 Available Commands</h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {state.availableCommands.map((command, index) => (
              <motion.div
                key={command}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900 rounded-lg p-3 border border-slate-600"
              >
                <code className="text-green-400 text-sm">"{command}"</code>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-slate-500">
            Try saying: "Dante, rebuild frontend" or "show containers"
          </div>
        </div>
      </div>
      
      {/* Last Command Result */}
      <AnimatePresence>
        {state.lastCommand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-lg p-6 mb-8 border ${
              state.lastCommand.success
                ? 'bg-green-900/30 border-green-500/50'
                : 'bg-red-900/30 border-red-500/50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {state.lastCommand.success ? '✅' : '❌'} Last Command
                </h3>
                <p className="text-slate-300 mt-1">"{state.lastCommand.command}"</p>
                <p className={`mt-2 ${state.lastCommand.success ? 'text-green-400' : 'text-red-400'}`}>
                  {state.lastCommand.cultural_response}
                </p>
              </div>
              
              <div className="text-xs text-slate-500">
                {new Date(state.lastCommand.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Recent Commands History */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">📊 Command History</h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentCommands.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              🎵 No commands yet - start speaking with Ubuntu spirit!
            </p>
          ) : (
            recentCommands.map((cmd, index) => (
              <motion.div
                key={`${cmd.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border ${
                  cmd.success
                    ? 'bg-green-900/20 border-green-500/30'
                    : 'bg-red-900/20 border-red-500/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <code className="text-sm text-slate-300">"{cmd.command}"</code>
                    <p className={`text-xs mt-1 ${cmd.success ? 'text-green-400' : 'text-red-400'}`}>
                      {cmd.cultural_response}
                    </p>
                  </div>
                  
                  <div className="text-xs text-slate-500">
                    {new Date(cmd.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}