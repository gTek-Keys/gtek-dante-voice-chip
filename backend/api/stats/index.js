import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

const router = express.Router()

// Mock stats data generator
function generateMockStats() {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  
  return {
    date: today,
    commandsExecuted: Math.floor(Math.random() * 50) + 10,
    errorsEncountered: Math.floor(Math.random() * 5),
    averageResponseTime: Math.floor(Math.random() * 200) + 100,
    sessionsStarted: Math.floor(Math.random() * 10) + 1,
    topCommands: [
      { command: 'ls', count: Math.floor(Math.random() * 20) + 5 },
      { command: 'cd', count: Math.floor(Math.random() * 15) + 3 },
      { command: 'git', count: Math.floor(Math.random() * 10) + 2 },
      { command: 'npm', count: Math.floor(Math.random() * 8) + 1 },
      { command: 'dante', count: Math.floor(Math.random() * 5) + 1 }
    ],
    uptime: Math.floor(Math.random() * 86400) + 3600, // Random uptime in seconds
    memoryUsage: {
      used: Math.floor(Math.random() * 500) + 100,
      total: 1024
    }
  }
}

// GET /api/stats/today - Get today's statistics
router.get('/today', async (req, res) => {
  try {
    // Try to read real stats from Dante logs if available
    const danteStatsPath = path.join(os.homedir(), '.dante-voice-chip', 'stats.json')
    
    let stats
    try {
      const statsContent = await fs.readFile(danteStatsPath, 'utf8')
      stats = JSON.parse(statsContent)
    } catch {
      // Generate mock stats if no real data available
      stats = generateMockStats()
    }
    
    res.json({
      ...stats,
      timestamp: new Date().toISOString(),
      source: 'dante-stats'
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

// GET /api/stats/summary - Get a summary of recent activity
router.get('/summary', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7
    
    const summary = {
      period: `${days} days`,
      totalCommands: Math.floor(Math.random() * 500) + 100,
      avgCommandsPerDay: Math.floor(Math.random() * 70) + 20,
      mostActiveDay: new Date(Date.now() - Math.random() * days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      errorRate: (Math.random() * 5).toFixed(2) + '%',
      trends: {
        commands: Math.random() > 0.5 ? 'increasing' : 'decreasing',
        errors: Math.random() > 0.7 ? 'increasing' : 'decreasing',
        efficiency: Math.random() > 0.6 ? 'improving' : 'stable'
      }
    }
    
    res.json(summary)
  } catch (error) {
    console.error('Error fetching summary:', error)
    res.status(500).json({ error: 'Failed to fetch summary' })
  }
})

// GET /api/stats/health - Health check for stats service
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'stats',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

export { router as statsRouter }