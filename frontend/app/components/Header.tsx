'use client'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900">Terminal Monitor</h1>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Agent Active</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900">
            🔔
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            ⚙️
          </button>
        </div>
      </div>
    </header>
  )
}