'use client'

import { useState } from 'react'

export function Sidebar() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'logs', label: 'Terminal Logs', icon: '💻' },
    { id: 'tasks', label: 'Tasks', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Dante Voice Chip</h2>
        <p className="text-sm text-gray-600 mt-1">Control Tower</p>
      </div>
      
      <nav className="mt-6">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            U
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">User</p>
            <p className="text-xs text-gray-600">Active Session</p>
          </div>
        </div>
      </div>
    </div>
  )
}