'use client'

interface LogEntry {
  id: string
  timestamp: string
  command: string
  output?: string
  exitCode: number
  directory: string
}

interface TerminalLogsProps {
  logs: LogEntry[]
}

export function TerminalLogs({ logs }: TerminalLogsProps) {
  return (
    <div className="dashboard-card h-96">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Terminal Activity</h3>
      <div className="terminal-window h-80 p-4 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-terminal-text opacity-60">No recent activity...</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="mb-3 pb-3 border-b border-gray-600 last:border-b-0">
              <div className="flex items-center justify-between text-xs text-terminal-accent mb-1">
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className={`px-2 py-1 rounded ${
                  log.exitCode === 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                }`}>
                  {log.exitCode === 0 ? '✓' : '✗'}
                </span>
              </div>
              <div className="text-terminal-text">
                <span className="text-terminal-accent">$ </span>
                {log.command}
              </div>
              {log.output && (
                <div className="text-terminal-text opacity-80 text-xs mt-1 pl-2 border-l border-gray-600">
                  {log.output.substring(0, 200)}{log.output.length > 200 ? '...' : ''}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}