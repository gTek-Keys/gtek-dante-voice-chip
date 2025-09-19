'use client'

interface Task {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string
  source: 'manual' | 'ai-generated'
}

interface TasksListProps {
  tasks: Task[]
  onTaskUpdate: () => void
}

export function TasksList({ tasks, onTaskUpdate }: TasksListProps) {
  const toggleTask = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}/toggle`, { method: 'POST' })
      onTaskUpdate()
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="dashboard-card h-96">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Tasks</h3>
      <div className="space-y-3 overflow-y-auto h-80">
        {tasks.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No tasks for today</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`p-3 rounded-lg border ${
              task.completed ? 'bg-gray-50 opacity-60' : 'bg-white'
            }`}>
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1 h-4 w-4 text-blue-600 rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      getPriorityColor(task.priority)
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {task.source === 'ai-generated' ? '🤖 AI' : '👤 Manual'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(task.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}