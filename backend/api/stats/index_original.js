import express from 'express'
import { VaultManager } from '../../../agent/vault_manager.py'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
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
    return null
  }
}

// GET /api/stats/today - Get today's statistics
router.get('/today', async (req, res) => {
  try {
    const stats = await runVaultScript('get_daily_stats')
    
    if (!stats) {
      return res.json({
        commandsToday: 0,
        errorsToday: 0,
        activeMinutes: 0,
        tasksGenerated: 0
      })
    }
    
    res.json({
      commandsToday: stats.commands_today || 0,
      errorsToday: stats.errors_today || 0,
      activeMinutes: stats.active_minutes || 0,
      tasksGenerated: Math.floor(Math.random() * 5) // Mock for now
    })
  } catch (error) {
    console.error('Error fetching today stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
})

// GET /api/stats/frequency - Get command frequency analysis
router.get('/frequency', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7
    const frequency = await runVaultScript('get_command_frequency', days)
    
    res.json(frequency || [])
  } catch (error) {
    console.error('Error fetching frequency stats:', error)
    res.status(500).json({ error: 'Failed to fetch frequency statistics' })
  }
})

// GET /api/stats/errors - Get error analysis
router.get('/errors', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7
    const errors = await runVaultScript('get_error_analysis', days)
    
    res.json(errors || [])
  } catch (error) {
    console.error('Error fetching error stats:', error)
    res.status(500).json({ error: 'Failed to fetch error statistics' })
  }
})

// GET /api/stats/weekly - Get weekly trend data
router.get('/weekly', async (req, res) => {
  try {
    // Mock weekly data for now
    const weeklyData = [
      { day: 'Mon', commands: 45, errors: 2 },
      { day: 'Tue', commands: 52, errors: 1 },
      { day: 'Wed', commands: 38, errors: 3 },
      { day: 'Thu', commands: 61, errors: 0 },
      { day: 'Fri', commands: 55, errors: 2 },
      { day: 'Sat', commands: 23, errors: 1 },
      { day: 'Sun', commands: 31, errors: 0 }
    ]
    
    res.json(weeklyData)
  } catch (error) {
    console.error('Error fetching weekly stats:', error)
    res.status(500).json({ error: 'Failed to fetch weekly statistics' })
  }
})

export { router as statsRouter }