import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import os from 'os'

const router = express.Router()

// Task storage file
const TASKS_FILE = path.join(os.homedir(), '.dante-voice-chip', 'tasks.json')

// Helper functions
async function loadTasks() {
  try {
    const data = await fs.readFile(TASKS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Return empty array if file doesn't exist
    return []
  }
}

async function saveTasks(tasks) {
  try {
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2))
  } catch (error) {
    console.error('Error saving tasks:', error)
    throw error
  }
}

function generateTaskId() {
  return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// GET /api/tasks/today - Get today's tasks
router.get('/today', async (req, res) => {
  try {
    const tasks = await loadTasks()
    const today = new Date().toDateString()
    
    // Filter tasks for today
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.createdAt).toDateString()
      return taskDate === today
    })
    
    res.json(todayTasks)
  } catch (error) {
    console.error('Error fetching today tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// GET /api/tasks - Get all tasks with optional filters
router.get('/', async (req, res) => {
  try {
    const tasks = await loadTasks()
    const { completed, priority, source, limit } = req.query
    
    let filteredTasks = tasks
    
    if (completed !== undefined) {
      filteredTasks = filteredTasks.filter(task => 
        task.completed === (completed === 'true')
      )
    }
    
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority)
    }
    
    if (source) {
      filteredTasks = filteredTasks.filter(task => task.source === source)
    }
    
    if (limit) {
      filteredTasks = filteredTasks.slice(0, parseInt(limit))
    }
    
    // Sort by creation date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    res.json(filteredTasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority = 'medium', source = 'manual' } = req.body
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' })
    }
    
    const newTask = {
      id: generateTaskId(),
      title,
      description: description || '',
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
      source
    }
    
    const tasks = await loadTasks()
    tasks.push(newTask)
    await saveTasks(tasks)
    
    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// POST /api/tasks/:id/toggle - Toggle task completion
router.post('/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params
    const tasks = await loadTasks()
    
    const taskIndex = tasks.findIndex(task => task.id === id)
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    tasks[taskIndex].completed = !tasks[taskIndex].completed
    tasks[taskIndex].updatedAt = new Date().toISOString()
    
    await saveTasks(tasks)
    
    res.json(tasks[taskIndex])
  } catch (error) {
    console.error('Error toggling task:', error)
    res.status(500).json({ error: 'Failed to toggle task' })
  }
})

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, priority } = req.body
    
    const tasks = await loadTasks()
    const taskIndex = tasks.findIndex(task => task.id === id)
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    // Update task fields
    if (title !== undefined) tasks[taskIndex].title = title
    if (description !== undefined) tasks[taskIndex].description = description
    if (priority !== undefined) tasks[taskIndex].priority = priority
    
    tasks[taskIndex].updatedAt = new Date().toISOString()
    
    await saveTasks(tasks)
    
    res.json(tasks[taskIndex])
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const tasks = await loadTasks()
    
    const filteredTasks = tasks.filter(task => task.id !== id)
    
    if (filteredTasks.length === tasks.length) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    await saveTasks(filteredTasks)
    
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

// POST /api/tasks/ai-generate - AI-generated task suggestions
router.post('/ai-generate', async (req, res) => {
  try {
    // Mock AI-generated tasks based on terminal activity
    const mockTasks = [
      {
        id: generateTaskId(),
        title: 'Review build failures',
        description: 'Multiple build commands failed today. Check configuration.',
        priority: 'high',
        completed: false,
        createdAt: new Date().toISOString(),
        source: 'ai-generated'
      },
      {
        id: generateTaskId(),
        title: 'Update dependencies',
        description: 'Several npm/pip commands detected. Consider updating packages.',
        priority: 'medium',
        completed: false,
        createdAt: new Date().toISOString(),
        source: 'ai-generated'
      }
    ]
    
    const tasks = await loadTasks()
    tasks.push(...mockTasks)
    await saveTasks(tasks)
    
    res.json(mockTasks)
  } catch (error) {
    console.error('Error generating AI tasks:', error)
    res.status(500).json({ error: 'Failed to generate AI tasks' })
  }
})

export { router as tasksRouter }