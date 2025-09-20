'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface VoiceVisualizerProps {
  isListening: boolean
  isResponding: boolean
  amplitude?: number
}

export function VoiceVisualizer({ isListening, isResponding, amplitude = 0.5 }: VoiceVisualizerProps) {
  const [audioData, setAudioData] = useState<number[]>(new Array(50).fill(0))
  const animationRef = useRef<number>()
  
  useEffect(() => {
    if (isListening || isResponding) {
      const animate = () => {
        setAudioData(prev => 
          prev.map(() => 
            isListening 
              ? Math.random() * amplitude * (0.5 + Math.sin(Date.now() * 0.01) * 0.3)
              : Math.sin(Date.now() * 0.005) * amplitude * 0.7
          )
        )
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isListening, isResponding, amplitude])

  const getBarColor = (index: number) => {
    if (isResponding) {
      // Pan-African responding gradient
      const position = index / audioData.length
      if (position < 0.33) return 'bg-african-crimson'
      if (position < 0.66) return 'bg-african-gold'
      return 'bg-african-emerald'
    }
    
    if (isListening) {
      // Gold listening state
      return 'bg-african-gold'
    }
    
    // Muted state
    return 'bg-interface-slate'
  }

  return (
    <div className="relative">
      {/* Main visualizer */}
      <div className="flex items-end justify-center h-16 gap-1 px-4">
        {audioData.map((height, index) => (
          <motion.div
            key={index}
            className={`w-1 rounded-full ${getBarColor(index)} transition-colors duration-300`}
            style={{
              height: `${Math.max(2, height * 60)}px`,
            }}
            animate={{
              height: `${Math.max(2, height * 60)}px`,
              opacity: isListening || isResponding ? 1 : 0.3,
            }}
            transition={{
              duration: 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
      
      {/* Cultural pulse ring */}
      {(isListening || isResponding) && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-african-gold/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      
      {/* Status indicators */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-xs text-african-gold font-medium"
          >
            <div className="w-2 h-2 bg-african-gold rounded-full animate-pulse" />
            Listening...
          </motion.div>
        )}
        
        {isResponding && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-xs text-african-crimson font-medium"
          >
            <div className="w-2 h-2 bg-african-crimson rounded-full animate-pulse" />
            Responding...
          </motion.div>
        )}
      </div>
      
      {/* Adinkra symbol overlay when active */}
      {(isListening || isResponding) && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ 
            opacity: 0.1, 
            rotate: isResponding ? 360 : 0 
          }}
          transition={{ 
            duration: isResponding ? 3 : 0.5,
            repeat: isResponding ? Infinity : 0,
            ease: 'linear'
          }}
        >
          {/* Sankofa symbol for voice interaction */}
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-african-gold">
            <path 
              d="M50 10 C30 10, 10 30, 10 50 C10 70, 30 90, 50 90 C70 90, 90 70, 90 50 C90 40, 85 30, 75 25 L75 35 L85 30 L75 25 L70 35 L75 25" 
              fill="currentColor" 
              fillRule="evenodd"
            />
          </svg>
        </motion.div>
      )}
    </div>
  )
}