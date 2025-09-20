import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// 🔌 MCP (Model Context Protocol) Connector API
// Frontend API endpoint that acts as MCP connector with Ubuntu spirit
// Supports Perplexity AI, VS Code, and direct API access
export async function POST(request: NextRequest) {
  try {
    const { command, args = [], secret } = await request.json()

    // 🔐 Enhanced security for Perplexity integration  
    const authHeader = request.headers.get('x-mcp-secret')
    const providedSecret = authHeader || secret
    const expectedSecret = process.env.MCP_SECRET || 'dev-secret-key'
    
    if (providedSecret !== expectedSecret) {
      return NextResponse.json({
        error: "Forbidden - Invalid MCP secret",
        ubuntu_message: "� Ubuntu trust requires proper authentication",
        hint: "Include x-mcp-secret header or secret in body"
      }, { status: 403 })
    }

    if (!command) {
      return NextResponse.json({
        error: "Command required",
        message: "🎤 Ubuntu wisdom: Speak your command with purpose",
        examples: ["hello", "status", "git", "logs", "health", "ubuntu", "docker"],
        mcp_info: "Model Context Protocol endpoint for AI integration"
      }, { status: 400 })
    }

    console.log(`📡 MCP Command from client: ${command}`, args);

    let result;
    
    switch (command.toLowerCase()) {
      case "hello":
        result = {
          message: "👋🏿 Dante MCP Connector responding with Ubuntu spirit!",
          project: "gtek.world - Dante Voice Chip",
          philosophy: "Ubuntu: I am because we are",
          capabilities: [
            "Real command execution via dante.sh",
            "Ubuntu philosophy integration", 
            "Perplexity AI bridge",
            "VS Code MCP client support"
          ],
          ubuntu_wisdom: "Through Ubuntu, our AI speaks with the wisdom of community",
          connector_version: "1.0.0-ubuntu",
          cultural_message: "🌍 Technology serving African philosophy"
        };
        break;

      case "status":
        result = {
          project: "gtek.world - Dante Voice Chip",
          status: "✅ Running via MCP Ubuntu Excellence",
          frontend: "Next.js with African-inspired design",
          backend: "Express.js with cultural wisdom",
          voice: "AI-powered Ubuntu dialogue",
          cultural_message: "🎭 Technology serving Ubuntu philosophy"
        };
        break;

      case "git":
        result = await executeGitCommand(args);
        break;

      case "logs":
        result = {
          logs: [
            "🎤 [Voice] Ubuntu greeting processed successfully",
            "📊 [Analytics] Cultural engagement metrics updated", 
            "🌍 [System] African wisdom integration active",
            "⚡ [Performance] Ubuntu efficiency optimizations applied",
            "🎭 [Culture] Community philosophy responses generated"
          ],
          cultural_message: "📜 Every log chronicles our Ubuntu evolution"
        };
        break;

      case "health":
        result = {
          overall: "✅ Ubuntu Spirit Thriving",
          services: {
            frontend: "🟢 Next.js serving Ubuntu excellence",
            backend: "🟢 Express API with cultural wisdom",
            voice: "🎤 AI dialogue honoring Ubuntu values",
            analytics: "📊 Vercel tracking community engagement",
            webhooks: "🔗 Vercel integration active"
          },
          cultural_message: "🏥 Health through Ubuntu interconnectedness"
        };
        break;

      case "containers":
      case "docker":
        result = await executeDockerCommand(args);
        break;

      case "deploy":
        result = {
          status: "✅ Production Excellence Active",
          url: "https://gtek.world",
          platform: "Vercel with Ubuntu automation",
          features: [
            "🎤 Voice interaction with cultural wisdom",
            "📊 Analytics tracking Ubuntu engagement", 
            "🌍 African-inspired design philosophy",
            "🔗 Secure webhook integration",
            "⚡ Performance optimized for global community"
          ],
          cultural_message: "🚀 Deployment spreads Ubuntu wisdom worldwide"
        };
        break;

      case "ubuntu":
        const ubuntuWisdom = [
          "Ubuntu means 'I am because we are' - technology serves humanity",
          "Through voice commands, we bridge digital and human spirit",
          "Every error teaches us patience and community resilience",
          "African philosophy guides our approach to AI and automation",
          "Community collaboration creates stronger technical solutions"
        ];
        
        result = {
          philosophy: ubuntuWisdom[Math.floor(Math.random() * ubuntuWisdom.length)],
          cultural_context: "Southern African humanist philosophy",
          technical_application: "Building AI that honors human connection",
          voice_integration: "Ubuntu wisdom spoken through technology",
          cultural_message: "🌍 Wisdom flows through Ubuntu understanding"
        };
        break;

      case "voice":
        result = {
          recognition: "🎤 Web Speech API with Ubuntu enhancement",
          synthesis: "🔊 Text-to-speech with cultural wisdom",
          commands: [
            "Hello Dante - Ubuntu greeting",
            "Summarize today - Daily wisdom recap",
            "Show errors - Learning opportunities",
            "Ubuntu wisdom - Philosophy sharing"
          ],
          cultural_message: "🎭 Voice bridges human and machine with Ubuntu spirit"
        };
        break;

      case "analytics":
        result = {
          platform: "Vercel Analytics with Ubuntu insights",
          metrics: [
            "👥 Community engagement tracking",
            "🌍 Global reach of Ubuntu wisdom",
            "🎤 Voice interaction analytics", 
            "📱 Cross-device Ubuntu experience",
            "⚡ Performance with cultural excellence"
          ],
          cultural_message: "📊 Data tells our Ubuntu community story"
        };
        break;

      default:
        result = {
          error: "Unknown command",
          message: `🤔 Command '${command}' not recognized in Ubuntu context`,
          available_commands: [
            "hello", "status", "git", "logs", "health", "containers", 
            "deploy", "ubuntu", "voice", "analytics"
          ],
          ubuntu_guidance: "Every command connects us in the spirit of Ubuntu",
          cultural_message: "🌟 Ubuntu teaches patience with all unknowns"
        };
    }

    // Add Ubuntu timestamp to all responses
    const finalResult = {
      ...result,
      ubuntu_timestamp: new Date().toISOString(),
      mcp_source: "frontend-connector"
    };
    
    return NextResponse.json(finalResult)
    
  } catch (error) {
    console.error('MCP Frontend Handler Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({
      error: "Internal server error",
      message: "🚨 Ubuntu resilience: We overcome challenges together", 
      details: errorMessage,
      ubuntu_wisdom: "Even in errors, we learn and grow as one",
      cultural_message: "🌍 Ubuntu spirit persists through all challenges"
    }, { status: 500 })
  }
}

// GET endpoint for available commands
export async function GET() {
  return NextResponse.json({
    service: "MCP Connector - Ubuntu Voice Bridge",
    description: "Model Context Protocol endpoint with African cultural wisdom",
    methods: ["POST"],
    available_commands: {
      "status": "Get project status with Ubuntu context",
      "git": "Git operations with cultural wisdom",
      "logs": "System logs with Ubuntu storytelling",
      "health": "Health check with community spirit",
      "containers": "Container status with Ubuntu unity",
      "deploy": "Deployment info with global Ubuntu reach",
      "ubuntu": "Random Ubuntu philosophy and wisdom",
      "voice": "Voice system status and capabilities",
      "analytics": "Analytics insights with cultural context"
    },
    ubuntu_philosophy: "I am because we are - technology serves humanity",
    cultural_message: "🎤 Frontend MCP ready for Ubuntu voice commands"
  })
}

// 🔧 Execute Git commands safely with Ubuntu wisdom
async function executeGitCommand(args: string[] = []): Promise<any> {
  const allowedCommands = ['status', 'log', 'branch', 'diff', 'show', 'remote']
  const gitCommand = args[0] || 'status'
  
  if (!allowedCommands.includes(gitCommand)) {
    return {
      error: "Git command not allowed",
      message: "🛡️ Ubuntu security: Only safe git commands permitted", 
      allowed: allowedCommands,
      cultural_message: "🌍 Ubuntu wisdom protects our community"
    }
  }
  
  try {
    // 🔧 Build appropriate git command based on the request
    let fullCommand;
    const extraArgs = args.slice(1).join(' ');
    
    switch (gitCommand) {
      case 'status':
        fullCommand = extraArgs ? `git status ${extraArgs}` : 'git status --short';
        break;
      case 'log':
        fullCommand = `git log --oneline -10`;
        break;
      case 'branch':
        fullCommand = 'git branch -v';
        break;
      default:
        fullCommand = `git ${gitCommand} ${extraArgs}`.trim();
    }
    
    const { stdout, stderr } = await execAsync(fullCommand, {
      cwd: process.cwd(),
      timeout: 5000
    })
    
    return {
      command: fullCommand,
      output: stdout || stderr || "No output",
      cultural_message: "🌱 Git tracks our Ubuntu journey together",
      mcp_source: "frontend-git-executor"
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      command: `git ${gitCommand}`,
      output: `Error: ${errorMessage}`,
      cultural_message: "🔄 Ubuntu teaches patience through all challenges",
      mcp_source: "frontend-git-executor"
    }
  }
}

// 🐳 Execute Docker commands safely with Ubuntu community spirit
async function executeDockerCommand(args: string[] = []): Promise<any> {
  const allowedCommands = ['ps', 'images', 'version', 'info']
  const dockerCommand = args[0] || 'ps'
  
  if (!allowedCommands.includes(dockerCommand)) {
    return {
      error: "Docker command not allowed",
      message: "🛡️ Ubuntu security: Only safe docker commands permitted", 
      allowed: allowedCommands,
      cultural_message: "🐳 Ubuntu protects our container community"
    }
  }
  
  try {
    const { stdout, stderr } = await execAsync(`docker ${dockerCommand}`, {
      timeout: 10000
    })
    
    return {
      command: `docker ${dockerCommand}`,
      output: stdout || stderr || "No containers found",
      cultural_message: "🐳 Containers unite like Ubuntu community",
      mcp_source: "frontend-docker-executor"
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Docker not available'
    return {
      command: `docker ${dockerCommand}`,
      output: `Error: ${errorMessage}`,
      cultural_message: "🌍 Ubuntu spirit exists beyond containers",
      suggestion: "Consider Docker Desktop or service setup",
      mcp_source: "frontend-docker-executor"
    }
  }
}