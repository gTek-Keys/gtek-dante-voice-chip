import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

const router = express.Router()

// Get logs directory path
const DANTE_LOGS_DIR = path.join(os.homedir(), '.dante-voice-chip', 'logs')

// Helper function to read Dante logs
async function getDanteLogs(limit = 50) {
  try {
    // Check if logs directory exists
    await fs.access(DANTE_LOGS_DIR)
    
    // Read directory contents
    const files = await fs.readdir(DANTE_LOGS_DIR)
    const logFiles = files.filter(f => f.endsWith('.log') || f.endsWith('.json'))
    
    // Sort by modification time (newest first)
    const fileStats = await Promise.all(
      logFiles.map(async (file) => {
        const fullPath = path.join(DANTE_LOGS_DIR, file)
        const stats = await fs.stat(fullPath)
        return { file, fullPath, mtime: stats.mtime }
      })
    )
    
    fileStats.sort((a, b) => b.mtime - a.mtime)
    
    // Read the most recent logs
    const recentLogs = []
    for (const { fullPath } of fileStats.slice(0, 5)) {
      try {
        const content = await fs.readFile(fullPath, 'utf8')
        const lines = content.split('\n').filter(line => line.trim())
        
        // Try to parse as JSON, fallback to plain text
        for (const line of lines.slice(-limit/5)) {
          try {
            const log = JSON.parse(line)
            recentLogs.push({
              ...log,
              timestamp: log.timestamp || new Date().toISOString(),
              source: 'dante-logs'
            })
          } catch {
            // Plain text log entry
            recentLogs.push({
              message: line,
              timestamp: new Date().toISOString(),
              source: 'dante-logs',
              type: 'text'
            })
          }
        }
      } catch (err) {
        console.error(`Error reading ${fullPath}:`, err.message)
      }
    }
    
    return recentLogs.slice(-limit)
  } catch (error) {
    console.error('Error accessing Dante logs:', error.message)
    return []
  }
}

// Fallback function for mock logs
function getMockLogs(limit = 50) {
  const mockLogs = []
  const commands = ['ls -la', 'cd ~/Desktop', 'git status', 'npm install', 'dante help']
  
  for (let i = 0; i < Math.min(limit, 10); i++) {
    mockLogs.push({
      id: i + 1,
      command: commands[Math.floor(Math.random() * commands.length)],
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      exitCode: Math.random() > 0.1 ? 0 : 1,
      directory: '/Users/test',
      duration: Math.floor(Math.random() * 1000),
      source: 'mock-data'
    })
  }
  
  return mockLogs
}

// GET /api/logs/recent - Get recent terminal commands
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50
    
    // Try to get real Dante logs first
    let logs = await getDanteLogs(limit)
    
    // If no real logs, provide mock data
    if (logs.length === 0) {
      logs = getMockLogs(limit)
    }
    
    res.json({
      logs,
      total: logs.length,
      source: logs.length > 0 ? logs[0].source : 'none'
    })
  } catch (error) {
    console.error('Error fetching recent logs:', error)
    res.status(500).json({ error: 'Failed to fetch recent logs' })
  }
})

// GET /api/logs - Get all logs
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100
    const logs = await getDanteLogs(limit)
    
    res.json({
      logs: logs.length > 0 ? logs : getMockLogs(limit),
      total: logs.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching logs:', error)
    res.status(500).json({ error: 'Failed to fetch logs' })
  }
})

// GET /api/logs/health - Health check for logs service
router.get('/health', async (req, res) => {
  try {
    const canAccessLogs = await fs.access(DANTE_LOGS_DIR).then(() => true).catch(() => false)
    
    res.json({
      status: 'ok',
      logsDirectory: DANTE_LOGS_DIR,
      canAccessLogs,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

export { router as logsRouter }