'use client'

import { useState } from 'react'

interface StatsGridProps {
  stats: {
    commandsToday: number
    errorsToday: number
    activeMinutes: number
    tasksGenerated: number
  }
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    {
      title: 'Commands Today',
      value: stats.commandsToday,
      change: '+12%',
      icon: '⚡',
      color: 'text-blue-600'
    },
    {
      title: 'Errors Caught',
      value: stats.errorsToday,
      change: '-8%',
      icon: '🚨',
      color: 'text-red-600'
    },
    {
      title: 'Active Minutes',
      value: stats.activeMinutes,
      change: '+5%',
      icon: '⏱️',
      color: 'text-green-600'
    },
    {
      title: 'Tasks Generated',
      value: stats.tasksGenerated,
      change: '+3',
      icon: '📝',
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="dashboard-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.change} from yesterday</p>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}