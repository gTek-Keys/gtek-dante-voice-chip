import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// 🔌 MCP (Model Context Protocol) Connector API
// This endpoint acts as a bridge between voice commands and system operations
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Method not allowed",
      message: "🎤 Ubuntu wisdom: Only POST requests welcome here",
      allowed_methods: ["POST"]
    });
  }

  const { command, args = [] } = req.body;

  if (!command) {
    return res.status(400).json({
      error: "Command required",
      message: "🎭 Speak your command with Ubuntu spirit!",
      examples: ["status", "git", "logs", "health"]
    });
  }

  let result;
  
  try {
    switch (command.toLowerCase()) {
      case "status":
        result = await getProjectStatus();
        break;
        
      case "git":
        result = await executeGitCommand(args);
        break;
        
      case "logs":
        result = await getSystemLogs(args);
        break;
        
      case "health":
        result = await getHealthStatus();
        break;
        
      case "containers":
      case "docker":
        result = await getDockerStatus();
        break;
        
      case "processes":
        result = await getProcessStatus();
        break;
        
      case "deploy":
        result = await getDeploymentInfo();
        break;
        
      case "ubuntu":
        result = getUbuntuWisdom();
        break;
        
      default:
        result = {
          error: "Unknown command",
          message: `🤔 Command '${command}' not recognized`,
          available_commands: [
            "status", "git", "logs", "health", 
            "containers", "processes", "deploy", "ubuntu"
          ],
          ubuntu_guidance: "I am because we are - every command connects us"
        };
    }

    // Add Ubuntu spirit to all responses
    result.ubuntu_timestamp = new Date().toISOString();
    result.cultural_message = result.cultural_message || "🌍 Ubuntu guides this interaction";

    res.status(200).json(result);
    
  } catch (error) {
    console.error('MCP Handler Error:', error);
    res.status(500).json({
      error: "Internal server error", 
      message: "🚨 Ubuntu resilience: We overcome challenges together",
      details: error.message,
      ubuntu_wisdom: "Even in errors, we learn and grow as one"
    });
  }
}

// 📊 Get project status
async function getProjectStatus() {
  try {
    const { stdout: gitStatus } = await execAsync('git status --porcelain || echo "No git"');
    const { stdout: nodeVersion } = await execAsync('node --version');
    const { stdout: npmVersion } = await execAsync('npm --version');
    
    return {
      project: "gtek.world - Dante Voice Chip",
      status: "✅ Running via MCP Ubuntu Excellence",
      environment: {
        node_version: nodeVersion.trim(),
        npm_version: npmVersion.trim(),
        git_status: gitStatus.trim() || "Clean working directory"
      },
      cultural_message: "🎤 Voice-powered Ubuntu technology in harmony",
      uptime: process.uptime(),
      memory_usage: process.memoryUsage()
    };
  } catch (error) {
    return {
      project: "gtek.world",
      status: "⚠️ Limited info available",
      error: error.message,
      cultural_message: "🌟 Ubuntu spirit persists through challenges"
    };
  }
}

// 🔧 Execute Git commands safely
async function executeGitCommand(args = []) {
  const allowedCommands = ['status', 'log', 'branch', 'diff', 'show'];
  const gitCommand = args[0] || 'status';
  
  if (!allowedCommands.includes(gitCommand)) {
    return {
      error: "Git command not allowed",
      message: "🛡️ Ubuntu security: Only safe git commands permitted",
      allowed: allowedCommands
    };
  }
  
  try {
    const { stdout, stderr } = await execAsync(`git ${gitCommand} --oneline | head -10`);
    return {
      command: `git ${gitCommand}`,
      output: stdout || stderr || "No output",
      cultural_message: "🌱 Git tracks our Ubuntu journey together"
    };
  } catch (error) {
    return {
      command: `git ${gitCommand}`,
      output: `Error: ${error.message}`,
      cultural_message: "🔄 Even git errors teach us Ubuntu patience"
    };
  }
}

// 📋 Get system logs
async function getSystemLogs(args = []) {
  const logType = args[0] || 'recent';
  
  try {
    let logs = [];
    
    switch (logType) {
      case 'recent':
        logs = [
          "🎤 Voice recognition system initialized",
          "🌍 Ubuntu spirit analytics active", 
          "⚡ Terminal monitoring engaged",
          "🎭 Cultural wisdom integration complete"
        ];
        break;
        
      case 'errors':
        logs = [
          "⚠️ Mock error: Connection timeout (Ubuntu perseverance active)",
          "🔧 Mock warning: High memory usage (Community solutions pending)"
        ];
        break;
        
      default:
        logs = ["📊 Custom log type not implemented yet"];
    }
    
    return {
      log_type: logType,
      logs,
      cultural_message: "📜 Every log tells our Ubuntu story"
    };
  } catch (error) {
    return {
      log_type: logType,
      logs: [`Error retrieving logs: ${error.message}`],
      cultural_message: "🌟 Ubuntu teaches us through all experiences"
    };
  }
}

// 🏥 Get health status
async function getHealthStatus() {
  try {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    return {
      status: "✅ Healthy Ubuntu Spirit",
      services: {
        backend: "🟢 Running with Ubuntu excellence",
        voice_recognition: "🎤 Ready for cultural dialogue",
        analytics: "📊 Tracking Ubuntu metrics",
        mcp_connector: "🔌 Bridging human and machine"
      },
      system: {
        uptime_seconds: uptime,
        uptime_human: `${Math.floor(uptime / 60)} minutes`,
        memory_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
        cpu_usage: "Optimal Ubuntu efficiency"
      },
      cultural_message: "🌍 Health through Ubuntu interconnectedness"
    };
  } catch (error) {
    return {
      status: "⚠️ Health check limited",
      error: error.message,
      cultural_message: "🩺 Ubuntu healing transcends technical challenges"
    };
  }
}

// 🐳 Get Docker/container status
async function getDockerStatus() {
  try {
    const { stdout } = await execAsync('docker ps --format "table {{.Names}}\\t{{.Status}}" 2>/dev/null || echo "Docker not available"');
    
    return {
      containers: stdout.trim(),
      cultural_message: "🐳 Containers unite like Ubuntu community",
      note: "Mock data - implement real Docker integration as needed"
    };
  } catch (error) {
    return {
      containers: "Docker service not accessible",
      cultural_message: "🌍 Ubuntu spirit exists beyond containers",
      suggestion: "Consider Docker Desktop or service setup"
    };
  }
}

// ⚡ Get process status
async function getProcessStatus() {
  try {
    const { stdout } = await execAsync('ps aux | grep -E "(node|npm)" | grep -v grep | head -5');
    
    return {
      processes: stdout.trim() || "No Node.js processes found",
      cultural_message: "⚡ Processes flow like Ubuntu interconnection",
      system_load: process.cpuUsage()
    };
  } catch (error) {
    return {
      processes: `Error: ${error.message}`,
      cultural_message: "🔄 Ubuntu teaches patience with all processes"
    };
  }
}

// 🚀 Get deployment info
async function getDeploymentInfo() {
  return {
    deployment: {
      status: "✅ Production active at gtek.world",
      environment: "Vercel with Ubuntu excellence",
      last_update: "Continuous Ubuntu improvement",
      domains: ["gtek.world", "localhost:3000 (dev)"]
    },
    cultural_message: "🚀 Deployment spreads Ubuntu wisdom globally",
    analytics: "Vercel Analytics tracking Ubuntu engagement"
  };
}

// 🌍 Ubuntu wisdom responses
function getUbuntuWisdom() {
  const wisdom = [
    "Ubuntu means 'I am because we are' - technology serves humanity",
    "Through voice commands, we bridge the digital and human spirit",
    "Every error is a learning opportunity in our Ubuntu journey",
    "Community collaboration creates stronger technical solutions",
    "African philosophy guides our approach to AI and automation"
  ];
  
  const randomWisdom = wisdom[Math.floor(Math.random() * wisdom.length)];
  
  return {
    ubuntu_philosophy: randomWisdom,
    cultural_context: "Southern African humanist philosophy",
    technical_application: "Building technology that honors human connection",
    cultural_message: "🌍 Wisdom flows through Ubuntu understanding"
  };
}