'use client'

import { useState, useEffect } from 'react'
import { StatsGrid } from './components/StatsGrid'
import { TerminalLogs } from './components/TerminalLogs'
import { VoiceControl } from './components/VoiceControl'
import { TasksList } from './components/TasksList'

export default function Dashboard() {
  const [stats, setStats] = useState({
    commandsToday: 0,
    errorsToday: 0,
    activeMinutes: 0,
    tasksGenerated: 0
  })

  const [recentLogs, setRecentLogs] = useState([])
  const [tasks, setTasks] = useState([])
  const [isVoiceActive, setIsVoiceActive] = useState(false)

  useEffect(() => {
    // Load dashboard data
    fetchDashboardData()
    
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000) // Update every 30s
    
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/stats/today')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch recent logs
      const logsResponse = await fetch('/api/logs/recent?limit=50')
      const logsData = await logsResponse.json()
      setRecentLogs(logsData)

      // Fetch tasks
      const tasksResponse = await fetch('/api/tasks/today')
      const tasksData = await tasksResponse.json()
      setTasks(tasksData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const handleVoiceCommand = async (command: string) => {
    console.log('Voice command received:', command)
    
    // Process voice commands
    if (command.toLowerCase().includes('summarize')) {
      // Trigger summary generation
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: 'today' })
      })
      const summary = await response.json()
      // Voice output handled by VoiceControl component
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Voice Control */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Terminal Control Tower</h1>
          <p className="text-gray-600 mt-2">Monitor your terminal activity and productivity insights</p>
        </div>
        <VoiceControl 
          onCommand={handleVoiceCommand}
          isActive={isVoiceActive}
          onActiveChange={setIsVoiceActive}
        />
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Logs - 2/3 width */}
        <div className="lg:col-span-2">
          <TerminalLogs logs={recentLogs} />
        </div>

        {/* Tasks - 1/3 width */}
        <div className="lg:col-span-1">
          <TasksList tasks={tasks} onTaskUpdate={fetchDashboardData} />
        </div>
      </div>
    </div>
  )
}