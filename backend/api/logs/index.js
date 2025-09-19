import express from 'express'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import os from 'os'

const execAsync = promisify(exec)
const router = express.Router()

// Get vault directory path
const VAULT_DIR = path.join(os.homedir(), '.dante-voice-chip', 'vault')
const VAULT_SCRIPT = path.join(process.cwd(), '..', 'agent', 'vault_manager.py')

// Helper function to run Python vault manager
async function runVaultScript(method, ...args) {
  try {
    const command = `python3 -c "
import sys
sys.path.append('${path.dirname(VAULT_SCRIPT)}')
from vault_manager import VaultManager
import json
import os

vault_dir = '${VAULT_DIR}'
key_path = os.path.join(os.path.dirname(vault_dir), 'encryption.key')
vault = VaultManager(vault_dir, key_path)

result = vault.${method}(${args.map(arg => `'${arg}'`).join(', ')})
print(json.dumps(result, default=str))
"`
    
    const { stdout } = await execAsync(command)
    return JSON.parse(stdout.trim())
  } catch (error) {
    console.error('Vault script error:', error)
    return []
  }
}

// GET /api/logs/recent - Get recent terminal commands
router.get('/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50
    const logs = await runVaultScript('get_recent_commands', limit)
    
    res.json(logs || [])
  } catch (error) {
    console.error('Error fetching recent logs:', error)
    res.status(500).json({ error: 'Failed to fetch recent logs' })
  }
})

// GET /api/logs/search - Search through command history
router.get('/search', async (req, res) => {
  try {
    const { q: query, start, end } = req.query
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter required' })
    }
    
    let dateRange = null
    if (start && end) {
      dateRange = [start, end]
    }
    
    const results = await runVaultScript('search_commands', query, dateRange)
    
    res.json(results || [])
  } catch (error) {
    console.error('Error searching logs:', error)
    res.status(500).json({ error: 'Failed to search logs' })
  }
})

// GET /api/logs/export - Export logs for a date range
router.get('/export', async (req, res) => {
  try {
    const { start, end, format = 'json' } = req.query
    
    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end date parameters required' })
    }
    
    // Create temporary export file
    const exportFile = path.join('/tmp', `logs_export_${Date.now()}.${format}`)
    
    const count = await runVaultScript('export_data', start, end, exportFile)
    
    if (count > 0) {
      res.download(exportFile, `dante-logs-${start}-to-${end}.${format}`, (err) => {
        if (!err) {
          // Clean up temp file
          setTimeout(() => {
            try {
              require('fs').unlinkSync(exportFile)
            } catch (e) {}
          }, 5000)
        }
      })
    } else {
      res.status(404).json({ error: 'No logs found for the specified date range' })
    }
  } catch (error) {
    console.error('Error exporting logs:', error)
    res.status(500).json({ error: 'Failed to export logs' })
  }
})

// GET /api/logs/live - WebSocket endpoint for live log streaming
router.get('/live', (req, res) => {
  // Set up Server-Sent Events for live log streaming
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  })
  
  // Send initial connection message
  res.write('data: {"type": "connected", "message": "Live log stream connected"}\n\n')
  
  // Mock live data for now
  const interval = setInterval(() => {
    const mockLog = {
      type: 'command',
      timestamp: new Date().toISOString(),
      command: 'ls -la',
      exitCode: 0,
      directory: '/Users/test'
    }
    
    res.write(`data: ${JSON.stringify(mockLog)}\n\n`)
  }, 5000)
  
  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval)
  })
})

export { router as logsRouter }