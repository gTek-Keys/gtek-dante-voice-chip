import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import { writeFile, appendFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const execAsync = promisify(exec)

// 🔐 Security: Allowed MCP commands
const ALLOWED_MCP_COMMANDS = {
  'docker-control': [
    'containers list',
    'images list',
    'compose up',
    'compose down',
    'compose build',
    'compose restart'
  ],
  'filesystem': [
    'read package.json',
    'read docker-compose.yml',
    'list logs/',
    'stat .'
  ],
  'terminal': [
    'npm run build',
    'npm test',
    'git status',
    'docker version'
  ]
}

// 🎵 Voice command patterns
const VOICE_PATTERNS = {
  'rebuild frontend': 'docker-control compose build frontend',
  'rebuild backend': 'docker-control compose build backend',
  'start orchestra': 'docker-control compose up',
  'stop orchestra': 'docker-control compose down',
  'show containers': 'docker-control containers list',
  'show logs': 'filesystem list logs/',
  'run tests': 'terminal npm test',
  'git status': 'terminal git status',
  'build project': 'terminal npm run build'
}

// 🌍 Afrocentric response messages
const RESPONSE_MESSAGES = {
  success: [
    '🎼 Orchestra command executed with excellence!',
    '✅ Task completed in the spirit of Ubuntu!',
    '🌍 Command successful - moving forward together!',
    '🎯 Excellence achieved through collective wisdom!'
  ],
  error: [
    '🚨 Command failed - let\'s troubleshoot with wisdom',
    '⚠️ Access denied - protecting our sacred workspace',
    '🔄 Retrying with patience and persistence',
    '❌ Challenge encountered - Ubuntu guides us forward'
  ],
  mcp_unavailable: [
    '🔧 MCP gateway not available - using traditional methods',
    '⚡ Falling back to direct commands with cultural pride',
    '🎭 MCP orchestra tuning in progress - patience Ubuntu!'
  ]
}

// 📊 Log voice commands
async function logVoiceCommand(command: string, result: any, success: boolean) {
  const logDir = path.join(process.env.HOME || '', '.dante-voice-chip', 'logs')
  
  if (!existsSync(logDir)) {
    await mkdir(logDir, { recursive: true })
  }
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    command,
    success,
    result: success ? 'Command executed' : result.error,
    cultural_response: result.message
  }
  
  const logFile = path.join(logDir, 'voice-commands.log')
  await appendFile(logFile, JSON.stringify(logEntry) + '\n')
}

// 🧠 Parse natural language voice command
function parseVoiceCommand(input: string): string | null {
  const cleanInput = input.toLowerCase().trim()
  
  // Direct pattern matches
  for (const [pattern, command] of Object.entries(VOICE_PATTERNS)) {
    if (cleanInput.includes(pattern) || cleanInput === pattern) {
      return command
    }
  }
  
  // Fuzzy matching for variations
  if (cleanInput.includes('rebuild') && cleanInput.includes('front')) {
    return VOICE_PATTERNS['rebuild frontend']
  }
  
  if (cleanInput.includes('rebuild') && cleanInput.includes('back')) {
    return VOICE_PATTERNS['rebuild backend']
  }
  
  if (cleanInput.includes('start') && (cleanInput.includes('server') || cleanInput.includes('app'))) {
    return VOICE_PATTERNS['start orchestra']
  }
  
  if (cleanInput.includes('stop') || cleanInput.includes('shutdown')) {
    return VOICE_PATTERNS['stop orchestra']
  }
  
  if (cleanInput.includes('container') || cleanInput.includes('docker')) {
    return VOICE_PATTERNS['show containers']
  }
  
  if (cleanInput.includes('log')) {
    return VOICE_PATTERNS['show logs']
  }
  
  if (cleanInput.includes('test')) {
    return VOICE_PATTERNS['run tests']
  }
  
  return null
}

// 🐳 Check if MCP is available
async function isMCPAvailable(): Promise<boolean> {
  try {
    await execAsync('docker mcp --help')
    return true
  } catch {
    return false
  }
}

// 🎭 Execute MCP command
async function executeMCPCommand(command: string): Promise<any> {
  const [server, ...args] = command.split(' ')
  
  // Validate command is allowed
  const allowedCommands = ALLOWED_MCP_COMMANDS[server as keyof typeof ALLOWED_MCP_COMMANDS]
  if (!allowedCommands) {
    throw new Error(`Server ${server} not allowed`)
  }
  
  const commandStr = args.join(' ')
  const isAllowed = allowedCommands.some(allowed => commandStr.startsWith(allowed))
  
  if (!isAllowed) {
    throw new Error(`Command "${commandStr}" not allowed for ${server}`)
  }
  
  // Execute MCP command
  const mcpCommand = `docker mcp tools call ${server} "${commandStr}"`
  const { stdout, stderr } = await execAsync(mcpCommand)
  
  if (stderr) {
    throw new Error(stderr)
  }
  
  return JSON.parse(stdout)
}

// 🎯 Fallback to direct commands when MCP unavailable
async function executeFallbackCommand(command: string): Promise<any> {
  const [server, ...args] = command.split(' ')
  const commandStr = args.join(' ')
  
  // Map MCP commands to direct equivalents
  const fallbackMappings: Record<string, string> = {
    'docker-control containers list': 'docker ps',
    'docker-control images list': 'docker images',
    'docker-control compose up': 'docker compose up -d',
    'docker-control compose down': 'docker compose down',
    'docker-control compose build': 'docker compose build',
    'terminal npm run build': 'npm run build',
    'terminal npm test': 'npm test',
    'terminal git status': 'git status'
  }
  
  const directCommand = fallbackMappings[command]
  if (!directCommand) {
    throw new Error(`No fallback available for: ${command}`)
  }
  
  const { stdout, stderr } = await execAsync(directCommand, {
    cwd: '/Users/bfh/gtek-dante-voice-chip'
  })
  
  return { stdout, stderr }
}

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json()
    
    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Voice command required',
          message: '🎤 Speak your command with Ubuntu spirit!'
        },
        { status: 400 }
      )
    }
    
    // Parse natural language command
    const mcpCommand = parseVoiceCommand(command)
    if (!mcpCommand) {
      return NextResponse.json(
        {
          success: false,
          error: 'Command not recognized',
          message: '🤔 Command not understood - try: "rebuild frontend", "show containers", "run tests"'
        },
        { status: 400 }
      )
    }
    
    let result: any
    let culturalMessage: string
    
    // Check if MCP is available
    const mcpAvailable = await isMCPAvailable()
    
    try {
      if (mcpAvailable) {
        // Use MCP gateway
        result = await executeMCPCommand(mcpCommand)
        culturalMessage = RESPONSE_MESSAGES.success[Math.floor(Math.random() * RESPONSE_MESSAGES.success.length)]
      } else {
        // Use fallback commands
        result = await executeFallbackCommand(mcpCommand)
        culturalMessage = RESPONSE_MESSAGES.mcp_unavailable[Math.floor(Math.random() * RESPONSE_MESSAGES.mcp_unavailable.length)]
      }
      
      // Log successful command
      await logVoiceCommand(command, { message: culturalMessage }, true)
      
      return NextResponse.json({
        success: true,
        message: culturalMessage,
        data: result,
        mcp_used: mcpAvailable,
        parsed_command: mcpCommand
      })
      
    } catch (executeError: any) {
      const errorMessage = RESPONSE_MESSAGES.error[Math.floor(Math.random() * RESPONSE_MESSAGES.error.length)]
      
      // Log failed command
      await logVoiceCommand(command, { error: executeError.message, message: errorMessage }, false)
      
      return NextResponse.json(
        {
          success: false,
          error: executeError.message,
          message: errorMessage,
          mcp_used: mcpAvailable,
          parsed_command: mcpCommand
        },
        { status: 500 }
      )
    }
    
  } catch (error: any) {
    console.error('Voice command error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        message: '🚨 Ubuntu wisdom guides us through challenges'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return available voice commands
  return NextResponse.json({
    success: true,
    message: '🎤 Voice commands available with Ubuntu excellence',
    available_commands: Object.keys(VOICE_PATTERNS),
    mcp_available: await isMCPAvailable(),
    patterns: VOICE_PATTERNS
  })
}