'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import VoiceControlDashboard from '../../components/VoiceControlDashboard'

interface LogData {
  file: string
  lines: number
  size: string
  lastModified: string
  preview: string[]
  commands: number
  errors: number
}

interface AgentStatus {
  status: string
  monitored_paths: string[]
}

interface DashboardData {
  success: boolean
  message: string
  timestamp: string
  agent: AgentStatus
  logs: LogData[]
  stats: {
    total_files: number
    total_commands: number
    total_errors: number
    total_size: number
  }
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/logs')
        const result = await response.json()
        setData(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch logs')
        console.error('🚨 Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLogs, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-status-success'
      case 'stopped': return 'text-status-error'
      default: return 'text-status-warning'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return '🟢'
      case 'stopped': return '🔴'
      default: return '🟡'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-african-midnight flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🎼
        </motion.div>
        <div className="ml-4 text-african-gold text-xl font-medium">
          Loading Orchestra Data...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-african-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚨</div>
          <div className="text-african-crimson text-xl font-medium mb-2">
            Orchestra Error
          </div>
          <div className="text-interface-mist">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-african-midnight text-interface-mist p-8">
      {/* Header with Pan-African Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-gradient-african rounded-lg p-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎼 Dante Voice Chip Orchestra
          </h1>
          <p className="text-interface-mist/80">
            Terminal Control Tower with Afrocentric Excellence
          </p>
        </div>
      </motion.div>

      {/* Agent Status */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="bg-interface-charcoal border border-african-gold/30 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getStatusIcon(data?.agent.status || 'unknown')}</span>
              <div>
                <h2 className="text-xl font-semibold text-african-gold">Agent Status</h2>
                <p className={`font-medium ${getStatusColor(data?.agent.status || 'unknown')}`}>
                  {data?.agent.status.toUpperCase() || 'UNKNOWN'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-interface-mist/70">Monitored Paths</div>
              <div className="text-african-emerald font-mono text-sm">
                {data?.agent.monitored_paths.length || 0} locations
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Log Files', value: data?.stats.total_files || 0, color: 'african-gold', icon: '📁' },
          { label: 'Commands', value: data?.stats.total_commands || 0, color: 'african-emerald', icon: '⚡' },
          { label: 'Errors', value: data?.stats.total_errors || 0, color: 'african-crimson', icon: '🚨' },
          { label: 'Total Size', value: `${data?.stats.total_size || 0} KB`, color: 'earth-sahara', icon: '💾' }
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            whileHover={{ scale: 1.05 }}
            className={`bg-interface-charcoal border border-${stat.color}/30 rounded-lg p-4 hover:border-${stat.color}/60 transition-all duration-300`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <div className={`text-2xl font-bold text-${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-interface-mist/70">
                  {stat.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Log Files Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {data?.logs.map((log, idx) => (
          <motion.div
            key={log.file}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-interface-charcoal border border-african-crimson/20 rounded-lg p-6 hover:border-african-gold/50 hover:shadow-glow transition-all duration-300"
          >
            {/* File Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-african-gold">
                  {log.file}
                </h3>
                <div className="text-sm text-interface-mist/70">
                  {new Date(log.lastModified).toLocaleDateString()} • {log.size}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl text-african-gold">
                  {log.file.endsWith('.db') ? '🗄️' : '📜'}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <div className="text-african-emerald font-bold">{log.lines}</div>
                <div className="text-xs text-interface-mist/70">Lines</div>
              </div>
              <div className="text-center">
                <div className="text-african-gold font-bold">{log.commands}</div>
                <div className="text-xs text-interface-mist/70">Commands</div>
              </div>
              <div className="text-center">
                <div className="text-african-crimson font-bold">{log.errors}</div>
                <div className="text-xs text-interface-mist/70">Errors</div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-african-midnight/50 rounded p-3 border border-african-emerald/20">
              <div className="text-xs text-african-emerald mb-2 font-semibold">
                Recent Activity:
              </div>
              <pre className="text-xs text-interface-mist/80 font-mono leading-relaxed overflow-hidden">
                {log.preview.slice(0, 5).join('\n')}
                {log.preview.length > 5 && '\n...'}
              </pre>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {(!data?.logs || data.logs.length === 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🎼</div>
          <div className="text-xl text-african-gold font-medium mb-2">
            No Orchestra Data Found
          </div>
          <div className="text-interface-mist/70">
            Start the agent to begin monitoring: <code className="text-african-emerald">npm run agent:start</code>
          </div>
        </motion.div>
      )}

      {/* Voice Control Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <VoiceControlDashboard />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 text-center text-interface-mist/50 text-sm"
      >
        🎼 Orchestra conducted with Afrocentric excellence • Last updated: {data?.timestamp && new Date(data.timestamp).toLocaleString()}
      </motion.div>
    </div>
  )
}