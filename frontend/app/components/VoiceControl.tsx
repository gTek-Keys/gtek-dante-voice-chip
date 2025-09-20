'use client'

import { UbuntuVoiceDashboard } from './UbuntuVoiceDashboard'

interface VoiceControlProps {
  onCommand: (command: string) => void
  isActive: boolean
  onActiveChange: (active: boolean) => void
  className?: string
}

export function VoiceControl({ 
  onCommand, 
  isActive, 
  onActiveChange,
  className = ''
}: VoiceControlProps) {
  
  // 🌍 Enhanced Voice Control with Ubuntu Voice Dashboard
  const handleVoiceCommand = (command: string) => {
    console.log('🎤 Ubuntu voice command:', command)
    onCommand(command)
  }

  return (
    <div className={`ubuntu-voice-control ${className}`}>
      {/* 🎤 Advanced Ubuntu Voice Interface */}
      <UbuntuVoiceDashboard 
        className="w-full"
      />
      
      {/* 🌍 Ubuntu Philosophy Footer */}
      <div className="mt-6 text-center">
        <p className="text-interface-mist/50 text-xs italic">
          🌍 Ubuntu Voice Technology: "I am because we are"
        </p>
      </div>
    </div>
  )
}