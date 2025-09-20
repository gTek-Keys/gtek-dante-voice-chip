// 🌍 gTek Global Terminal Monitor Voice Processor (powered by Ubuntu)
// Advanced AI-powered voice command processing with African wisdom and Azure integration

interface CommandResult {
  success: boolean
  command: string
  response: string
  ubuntu_wisdom?: string
  confidence: number
  execution_time: number
}

interface VoiceCommand {
  intent: string
  parameters: Record<string, string>
  confidence: number
  raw_transcript: string
}

export class UbuntuVoiceProcessor {
  private commandHistory: string[] = []
  private contextMemory: Map<string, any> = new Map()
  private mcpSecret: string

  constructor(mcpSecret: string) {
    this.mcpSecret = mcpSecret
  }

  // 🧠 Advanced Command Processing with Ubuntu Intelligence
  async processCommand(transcript: string): Promise<CommandResult> {
    const startTime = Date.now()
    console.log('🌍 Ubuntu Voice Processing:', transcript)

    try {
      // 1. Parse voice command with cultural context
      const voiceCommand = this.parseVoiceCommand(transcript)
      
      // 2. Add to context memory for conversation flow
      this.updateContextMemory(voiceCommand)
      
      // 3. Execute command via gTek MCP connector
      const mcpResult = await this.executeMCPCommand(voiceCommand)
      
      // 4. Generate Ubuntu-themed response
      const response = this.generateUbuntuResponse(voiceCommand, mcpResult)
      
      // 5. Update command history
      this.addToHistory(transcript)

      return {
        success: true,
        command: voiceCommand.intent,
        response: response.message,
        ubuntu_wisdom: response.wisdom,
        confidence: voiceCommand.confidence,
        execution_time: Date.now() - startTime
      }
    } catch (error) {
      console.error('🚨 Ubuntu Voice Error:', error)
      return {
        success: false,
        command: 'error',
        response: `🌍 Ubuntu spirit: ${error instanceof Error ? error.message : 'Unknown error'}. We remain resilient together.`,
        confidence: 0,
        execution_time: Date.now() - startTime
      }
    }
  }

  // 🎯 Parse Voice Command with Cultural Intelligence
  private parseVoiceCommand(transcript: string): VoiceCommand {
    const cleanTranscript = transcript.toLowerCase().trim()
    
    // Ubuntu greeting patterns
    if (this.matchesPattern(cleanTranscript, ['hello', 'hi', 'hey', 'greetings', 'sawubona'])) {
      return {
        intent: 'greeting',
        parameters: { type: 'ubuntu_greeting' },
        confidence: 0.9,
        raw_transcript: transcript
      }
    }

    // Ubuntu philosophy requests
    if (this.matchesPattern(cleanTranscript, ['ubuntu', 'philosophy', 'wisdom', 'community', 'together'])) {
      return {
        intent: 'ubuntu_philosophy',
        parameters: { depth: this.extractPhilosophyDepth(cleanTranscript) },
        confidence: 0.95,
        raw_transcript: transcript
      }
    }

    // System status commands
    if (this.matchesPattern(cleanTranscript, ['status', 'health', 'check', 'how are', 'system'])) {
      return {
        intent: 'system_status',
        parameters: { detail_level: this.extractDetailLevel(cleanTranscript) },
        confidence: 0.85,
        raw_transcript: transcript
      }
    }

    // Git commands with Ubuntu collaboration context
    if (this.matchesPattern(cleanTranscript, ['git', 'repository', 'commit', 'branch', 'collaborate'])) {
      const gitAction = this.extractGitAction(cleanTranscript)
      return {
        intent: 'git_operation',
        parameters: { action: gitAction, collaborative: 'true' },
        confidence: 0.8,
        raw_transcript: transcript
      }
    }

    // Azure VM management with Ubuntu cloud community
    if (this.matchesPattern(cleanTranscript, ['vm', 'virtual machine', 'azure', 'provision', 'cloud'])) {
      return {
        intent: 'azure_vm_management',
        parameters: {
          action: this.extractVMAction(cleanTranscript),
          vmName: this.extractVMName(cleanTranscript) || 'ubuntu-vm',
          vmOs: this.extractVMOS(cleanTranscript)
        },
        confidence: 0.85,
        raw_transcript: transcript
      }
    }

    // Container management with Ubuntu community metaphors
    if (this.matchesPattern(cleanTranscript, ['container', 'docker', 'service', 'deploy'])) {
      return {
        intent: 'container_management',
        parameters: { operation: this.extractContainerOperation(cleanTranscript) },
        confidence: 0.8,
        raw_transcript: transcript
      }
    }

    // Voice system commands
    if (this.matchesPattern(cleanTranscript, ['voice', 'mic', 'speak', 'listen', 'audio'])) {
      return {
        intent: 'voice_control',
        parameters: { operation: this.extractVoiceOperation(cleanTranscript) },
        confidence: 0.9,
        raw_transcript: transcript
      }
    }

    // Analytics and insights
    if (this.matchesPattern(cleanTranscript, ['analytics', 'stats', 'metrics', 'data', 'insights'])) {
      return {
        intent: 'analytics',
        parameters: { timeframe: this.extractTimeframe(cleanTranscript) },
        confidence: 0.8,
        raw_transcript: transcript
      }
    }

    // Default: Unknown command with Ubuntu guidance
    return {
      intent: 'unknown',
      parameters: { suggestion: this.generateCommandSuggestion(cleanTranscript) },
      confidence: 0.3,
      raw_transcript: transcript
    }
  }

  // 🔍 Pattern Matching with Fuzzy Logic
  private matchesPattern(transcript: string, keywords: string[]): boolean {
    return keywords.some(keyword => 
      transcript.includes(keyword) || 
      this.calculateSimilarity(transcript, keyword) > 0.7
    )
  }

  // 📏 Calculate String Similarity (Levenshtein-based)
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  // 🔢 Levenshtein Distance Algorithm
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  // 🔗 Execute Command via gTek MCP Connector
  private async executeMCPCommand(voiceCommand: VoiceCommand): Promise<any> {
    const mcpCommand = this.mapToMCPCommand(voiceCommand)
    
    console.log('🌐 Executing gTek MCP Command:', mcpCommand)
    
    const response = await fetch('/api/gtek-mcp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-gtek-secret': this.mcpSecret
      },
      body: JSON.stringify(mcpCommand)
    })
    
    if (!response.ok) {
      throw new Error(`gTek MCP Error: ${response.status} ${response.statusText}`)
    }
    
    return await response.json()
  }

  // 🗺️ Map Voice Command to gTek MCP Command
  private mapToMCPCommand(voiceCommand: VoiceCommand): any {
    switch (voiceCommand.intent) {
      case 'greeting':
        return { command: 'hello' }
      
      case 'ubuntu_philosophy':
        return { command: 'ubuntu' }
      
      case 'system_status':
        return { command: 'status' }
      
      case 'git_operation':
        const gitAction = voiceCommand.parameters.action || 'status'
        return { command: 'git', args: [gitAction] }
      
      case 'container_management':
        return { command: 'containers' }
      
      case 'voice_control':
        return { command: 'voice' }
      
      case 'analytics':
        return { command: 'analytics' }
      
      case 'azure_vm_management':
        const vmAction = voiceCommand.parameters.action || 'list'
        const vmName = voiceCommand.parameters.vmName
        const vmOs = voiceCommand.parameters.vmOs || 'ubuntu'
        
        if (vmAction === 'provision' || vmAction === 'create') {
          return { command: `provision vm ${vmOs} ${vmName || 'ubuntu-vm-' + Date.now()}` }
        } else if (vmAction === 'list' || vmAction === 'show') {
          return { command: 'show vms' }
        } else if (vmAction === 'status') {
          return { command: `vm status ${vmName || 'unknown'}` }
        } else {
          return { command: 'azure status' }
        }
      
      default:
        return { command: 'ubuntu', args: ['guidance'] }
    }
  }

  // 🎭 Generate Ubuntu-themed Response
  private generateUbuntuResponse(voiceCommand: VoiceCommand, mcpResult: any): { message: string, wisdom: string } {
    const baseResponse = mcpResult.cultural_message || mcpResult.ubuntu_message || mcpResult.message || 'Ubuntu spirit acknowledges'
    
    const wisdomPool = [
      "🌍 Ubuntu teaches: I am because we are",
      "🤝 Through collective intelligence, we flourish", 
      "🌱 Ubuntu wisdom grows through shared knowledge",
      "💫 Individual brilliance shines in community harmony",
      "🌊 Like rivers joining the ocean, together we are vast"
    ]
    
    const contextualWisdom = {
      greeting: "👋🏿 Ubuntu greetings flow from community spirit",
      ubuntu_philosophy: "🌍 Ubuntu philosophy: Technology serves humanity",
      system_status: "📊 Ubuntu health: We monitor our collective well-being",
      git_operation: "🌱 Ubuntu collaboration: Version control reflects our journey together",
      container_management: "🐳 Ubuntu containers: Like community, stronger when connected",
      voice_control: "🎤 Ubuntu voice: Technology speaks with community wisdom",
      analytics: "📈 Ubuntu insights: Data tells our community story"
    }
    
    const wisdom = contextualWisdom[voiceCommand.intent as keyof typeof contextualWisdom] || 
                   wisdomPool[Math.floor(Math.random() * wisdomPool.length)]
    
    return {
      message: `${baseResponse}`,
      wisdom: wisdom
    }
  }

  // 🧠 Context Memory Management
  private updateContextMemory(voiceCommand: VoiceCommand) {
    this.contextMemory.set('last_intent', voiceCommand.intent)
    this.contextMemory.set('last_confidence', voiceCommand.confidence)
    this.contextMemory.set('timestamp', Date.now())
    
    // Maintain conversation context
    if (voiceCommand.intent === 'ubuntu_philosophy') {
      this.contextMemory.set('philosophy_depth', voiceCommand.parameters.depth || 'basic')
    }
  }

  // 📚 Command History Management
  private addToHistory(command: string) {
    this.commandHistory.unshift(command)
    if (this.commandHistory.length > 10) {
      this.commandHistory = this.commandHistory.slice(0, 10)
    }
  }

  // 🎯 Extract Command Parameters
  private extractPhilosophyDepth(transcript: string): string {
    if (transcript.includes('deep') || transcript.includes('detailed')) return 'deep'
    if (transcript.includes('simple') || transcript.includes('basic')) return 'basic'
    return 'medium'
  }

  private extractDetailLevel(transcript: string): string {
    if (transcript.includes('detailed') || transcript.includes('full')) return 'detailed'
    if (transcript.includes('quick') || transcript.includes('brief')) return 'brief'
    return 'standard'
  }

  private extractGitAction(transcript: string): string {
    if (transcript.includes('status')) return 'status'
    if (transcript.includes('log') || transcript.includes('history')) return 'log'
    if (transcript.includes('branch')) return 'branch'
    if (transcript.includes('diff')) return 'diff'
    return 'status'
  }

  private extractContainerOperation(transcript: string): string {
    if (transcript.includes('start') || transcript.includes('up')) return 'start'
    if (transcript.includes('stop') || transcript.includes('down')) return 'stop'
    if (transcript.includes('status') || transcript.includes('list')) return 'status'
    return 'status'
  }

  // 🌐 Azure VM Helper Methods
  private extractVMAction(transcript: string): string {
    if (transcript.includes('provision') || transcript.includes('create') || transcript.includes('new')) return 'provision'
    if (transcript.includes('delete') || transcript.includes('remove') || transcript.includes('destroy')) return 'delete'
    if (transcript.includes('start') || transcript.includes('boot') || transcript.includes('power on')) return 'start'
    if (transcript.includes('stop') || transcript.includes('shutdown') || transcript.includes('power off')) return 'stop'
    if (transcript.includes('restart') || transcript.includes('reboot')) return 'restart'
    if (transcript.includes('status') || transcript.includes('check') || transcript.includes('health')) return 'status'
    if (transcript.includes('list') || transcript.includes('show') || transcript.includes('all')) return 'list'
    return 'list'
  }

  private extractVMName(transcript: string): string | null {
    // Look for common VM name patterns
    const vmNamePatterns = [
      /vm\s+(\w+)/i,
      /machine\s+(\w+)/i,
      /server\s+(\w+)/i,
      /called\s+(\w+)/i,
      /named\s+(\w+)/i
    ]
    
    for (const pattern of vmNamePatterns) {
      const match = transcript.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    
    return null
  }

  private extractVMOS(transcript: string): string {
    if (transcript.includes('ubuntu') || transcript.includes('linux')) return 'ubuntu'
    if (transcript.includes('windows') || transcript.includes('win')) return 'windows'
    return 'ubuntu' // Default to Ubuntu with Ubuntu philosophy
  }

  private extractVoiceOperation(transcript: string): string {
    if (transcript.includes('test') || transcript.includes('check')) return 'test'
    if (transcript.includes('volume') || transcript.includes('level')) return 'volume'
    if (transcript.includes('settings') || transcript.includes('config')) return 'settings'
    return 'status'
  }

  private extractTimeframe(transcript: string): string {
    if (transcript.includes('today') || transcript.includes('daily')) return 'daily'
    if (transcript.includes('week') || transcript.includes('weekly')) return 'weekly'
    if (transcript.includes('month') || transcript.includes('monthly')) return 'monthly'
    return 'recent'
  }

  private generateCommandSuggestion(transcript: string): string {
    return "Try commands like 'show status', 'ubuntu philosophy', or 'git status'"
  }

  // 📊 Get Voice Analytics
  getAnalytics() {
    return {
      command_history: this.commandHistory,
      context_memory: Object.fromEntries(this.contextMemory),
      total_commands: this.commandHistory.length,
      ubuntu_wisdom: "🌍 Voice analytics serve community understanding"
    }
  }
}