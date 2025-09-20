// 🎼 Dante Voice Chip Orchestra - Backend API for Terminal Logs
// Serves encrypted agent data with Afrocentric excellence

import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

interface LogSummary {
  file: string
  lines: number
  size: string
  lastModified: string
  preview: string[]
  commands: number
  errors: number
}

export async function GET(request: NextRequest) {
  try {
    // Check both possible log locations
    const logsPaths = [
      path.join(process.env.HOME || '', '.dante-voice-chip', 'logs'),
      path.join(process.env.HOME || '', 'Library', 'Logs', 'terminal'),
      path.join(process.env.HOME || '', '.dante-voice-chip', 'vault')
    ]
    
    let summary: LogSummary[] = []
    let agentStatus = 'unknown'
    
    // Try to find logs in any of the locations
    for (const logsDir of logsPaths) {
      if (fs.existsSync(logsDir)) {
        try {
          const files = fs.readdirSync(logsDir)
          
          files.forEach(file => {
            if (file.endsWith('.log') || file.endsWith('.db')) {
              const filePath = path.join(logsDir, file)
              const stats = fs.statSync(filePath)
              
              if (file.endsWith('.log')) {
                const content = fs.readFileSync(filePath, 'utf-8')
                const lines = content.split('\n')
                
                // Count commands and errors
                const commands = lines.filter(line => 
                  line.includes('Recorded command:') || 
                  line.includes('INFO')
                ).length
                
                const errors = lines.filter(line => 
                  line.includes('ERROR') || 
                  line.includes('WARN')
                ).length
                
                summary.push({
                  file,
                  lines: lines.length,
                  size: formatBytes(stats.size),
                  lastModified: stats.mtime.toISOString(),
                  preview: lines.slice(-10).filter(line => line.trim()),
                  commands,
                  errors
                })
              }
              
              if (file.endsWith('.db')) {
                summary.push({
                  file,
                  lines: 0,
                  size: formatBytes(stats.size),
                  lastModified: stats.mtime.toISOString(),
                  preview: [`Database file: ${file}`, `Size: ${formatBytes(stats.size)}`],
                  commands: 0,
                  errors: 0
                })
              }
            }
          })
        } catch (dirError) {
          console.error(`Error reading directory ${logsDir}:`, dirError)
        }
      }
    }
    
    // Check agent status
    try {
      const agentLogPath = path.join(process.env.HOME || '', '.dante-voice-chip', 'logs', 'monitor.log')
      if (fs.existsSync(agentLogPath)) {
        const content = fs.readFileSync(agentLogPath, 'utf-8')
        const lines = content.split('\n')
        const lastLine = lines[lines.length - 2] || '' // -2 because last line is usually empty
        
        if (lastLine.includes('Starting Dante Voice Chip')) {
          agentStatus = 'running'
        } else if (lastLine.includes('stopped') || lastLine.includes('interrupt')) {
          agentStatus = 'stopped'
        }
      }
    } catch (statusError) {
      console.error('Error checking agent status:', statusError)
    }
    
    // Response with cultural flair
    return NextResponse.json({
      success: true,
      message: '🎼 Orchestra data retrieved with Afrocentric excellence',
      timestamp: new Date().toISOString(),
      agent: {
        status: agentStatus,
        monitored_paths: logsPaths.filter(p => fs.existsSync(p))
      },
      logs: summary,
      stats: {
        total_files: summary.length,
        total_commands: summary.reduce((acc, log) => acc + log.commands, 0),
        total_errors: summary.reduce((acc, log) => acc + log.errors, 0),
        total_size: summary.reduce((acc, log) => acc + parseInt(log.size.replace(/[^\d]/g, '')), 0)
      }
    })
    
  } catch (error) {
    console.error('🚨 Orchestra API Error:', error)
    
    return NextResponse.json({
      success: false,
      message: '🚨 Error retrieving orchestra data',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      logs: [],
      stats: {
        total_files: 0,
        total_commands: 0,
        total_errors: 0,
        total_size: 0
      }
    }, { status: 500 })
  }
}

// Helper function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}