import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

// Import route handlers
import { statsRouter } from './api/stats/index.js'
import { logsRouter } from './api/logs/index.js'
import { tasksRouter } from './api/tasks/index.js'
import { aiRouter } from './api/ai/index.js'
import mcpHandler from './api/mcp/index.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  })
})

// API routes
app.use('/api/stats', statsRouter)
app.use('/api/logs', logsRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/ai', aiRouter)

// MCP Connector endpoint
app.post('/api/mcp', mcpHandler)
app.get('/api/mcp', (req, res) => {
  res.json({
    service: "MCP Connector - Ubuntu Voice Bridge",
    description: "Model Context Protocol endpoint with African cultural wisdom",
    methods: ["POST", "GET"],
    ubuntu_philosophy: "I am because we are - technology serves humanity",
    cultural_message: "🎤 Backend MCP ready for Ubuntu voice commands"
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dante Voice Chip Backend running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API endpoints: http://localhost:${PORT}/api/`)
})

export default app