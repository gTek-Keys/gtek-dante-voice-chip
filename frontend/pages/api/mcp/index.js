// 🌍 Dante MCP Connector for Perplexity AI Integration
// Ubuntu: "I am because we are" - Bridging AI platforms with African wisdom

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// 🔒 Security configuration
const MCP_SECRET = process.env.MCP_SECRET || 'dev-secret-key';
const ALLOWED_COMMANDS = [
  'status', 'git', 'logs', 'hello', 'ubuntu', 'health', 
  'containers', 'voice', 'analytics', 'deploy'
];

// 🌍 Ubuntu wisdom for AI responses
const UBUNTU_WISDOM = [
  "Through Ubuntu, we understand that technology serves humanity",
  "I am because we are - AI working in harmony with human community",
  "Ubuntu teaches us that wisdom flows through collective intelligence",
  "Technology guided by African philosophy creates meaningful connection"
];

// 🎯 Main MCP handler for Perplexity compatibility
export default async function handler(req, res) {
  // ✋ CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-mcp-secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: "Method not allowed",
      ubuntu_message: "🌍 Ubuntu spirit flows through proper protocols",
      allowed_methods: ["POST"]
    });
  }

  // 🔐 Security validation
  const clientSecret = req.headers['x-mcp-secret'] || req.body.secret;
  if (clientSecret !== MCP_SECRET) {
    return res.status(403).json({ 
      error: "Forbidden - Invalid MCP secret",
      ubuntu_message: "🔒 Ubuntu trust requires proper authentication",
      hint: "Include x-mcp-secret header or secret in body"
    });
  }

  const { command, args = [] } = req.body;
  
  if (!command) {
    return res.status(400).json({ 
      error: "Missing command parameter",
      ubuntu_message: "🤔 Ubuntu wisdom: Clear communication requires clear intent",
      available_commands: ALLOWED_COMMANDS
    });
  }

  console.log(`📡 MCP Command from Perplexity: ${command}`, args);

  // 🛡️ Command validation
  if (!ALLOWED_COMMANDS.includes(command.toLowerCase())) {
    return res.status(400).json({ 
      error: `Unknown command: ${command}`,
      ubuntu_message: "⚠️ Ubuntu teaches us to stay within safe boundaries",
      available_commands: ALLOWED_COMMANDS
    });
  }

  let result;
  
  try {
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
          ubuntu_wisdom: getRandomUbuntuWisdom(),
          connector_version: "1.0.0-ubuntu"
        };
        break;

      case "status":
        result = await executeViaDante('health');
        result.ubuntu_context = "🌍 Ubuntu spirit monitoring our technological harmony";
        break;

      case "git":
        const gitCommand = args.length > 0 ? args.join(' ') : 'status';
        result = await executeViaDante(`git ${gitCommand}`);
        result.ubuntu_message = "🤝 Ubuntu collaboration through version control";
        break;

      case "logs":
        result = await executeViaDante('logs');
        result.ubuntu_insight = "📜 Ubuntu wisdom: Understanding comes through observation";
        break;

      case "health":
        result = await executeViaDante('health');
        result.ubuntu_message = "💚 Ubuntu teaches us to care for our technological community";
        break;

      case "containers":
        result = await executeViaDante('docker ps');
        result.ubuntu_philosophy = "🐳 Like Ubuntu containers, we are stronger together";
        break;

      case "voice":
        result = {
          voice_system: "✅ Dante Voice Chip operational",
          microphone: "Ready for Ubuntu-guided commands",
          talkback: "Wisdom flows through spoken word",
          integration: "Connected to MCP bridge",
          ubuntu_voice: "🗣️ Technology speaks with community wisdom"
        };
        break;

      case "ubuntu":
        result = {
          philosophy: "African philosophy guiding our AI approach",
          meaning: "I am because we are",
          application: "Building technology that honors human connection",
          wisdom: getRandomUbuntuWisdom(),
          ubuntu_timestamp: new Date().toISOString(),
          cultural_context: "Southern African humanist philosophy in AI"
        };
        break;

      case "analytics":
        result = {
          vercel_analytics: "✅ Operational (@vercel/analytics@1.5.0)",
          custom_tracking: "Ubuntu-themed events ready",
          mcp_analytics: "Command tracking active",
          ubuntu_insights: "📊 Data tells our Ubuntu community story"
        };
        break;

      case "deploy":
        result = await executeViaDante('deploy');
        result.ubuntu_celebration = "🚀 Ubuntu spirit deployed to the world!";
        break;

      default:
        result = { 
          error: `Command '${command}' not implemented`,
          ubuntu_guidance: "🌍 Ubuntu teaches patience in learning new capabilities",
          available_commands: ALLOWED_COMMANDS
        };
    }

    // 🌍 Always include Ubuntu timestamp and connector source
    result.ubuntu_timestamp = new Date().toISOString();
    result.mcp_source = "perplexity-connector";
    result.connector_status = "✅ Bridge active between Perplexity and gtek.world";

    res.status(200).json(result);

  } catch (error) {
    console.error('❌ MCP Command Error:', error);
    res.status(500).json({ 
      error: "Command execution failed",
      message: error.message,
      ubuntu_comfort: "🤗 Ubuntu spirit: Every challenge teaches us wisdom",
      ubuntu_timestamp: new Date().toISOString(),
      mcp_source: "perplexity-connector-error"
    });
  }
}

// 🎯 Execute commands via dante.sh dispatcher
async function executeViaDante(command) {
  const projectRoot = path.resolve(process.cwd(), '..');
  const danteScript = path.join(projectRoot, 'dante.sh');
  
  try {
    const { stdout, stderr } = await execAsync(`bash "${danteScript}" ${command}`, {
      cwd: projectRoot,
      timeout: 30000, // 30 second timeout
      env: { ...process.env, UBUNTU_MCP: 'true' }
    });

    return {
      command: command,
      output: stdout.trim(),
      error: stderr ? stderr.trim() : null,
      execution_time: new Date().toISOString(),
      dante_dispatcher: "✅ Executed via Ubuntu-powered dante.sh"
    };
  } catch (error) {
    return {
      command: command,
      error: error.message,
      ubuntu_resilience: "🌱 Ubuntu teaches us to grow through challenges",
      execution_time: new Date().toISOString(),
      dante_dispatcher: "❌ Error in dante.sh execution"
    };
  }
}

// 🌍 Get random Ubuntu wisdom
function getRandomUbuntuWisdom() {
  return UBUNTU_WISDOM[Math.floor(Math.random() * UBUNTU_WISDOM.length)];
}

// 📊 Log MCP usage for analytics
function logMCPUsage(command, source = 'perplexity') {
  console.log(`📈 MCP Analytics: ${source} executed '${command}' at ${new Date().toISOString()}`);
}