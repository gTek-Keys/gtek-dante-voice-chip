// AI Gateway Integration for Dante Voice Chip
// Provides enhanced AI capabilities using the AI Gateway API

const AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY;
const AI_GATEWAY_BASE_URL = process.env.AI_GATEWAY_BASE_URL || 'https://api.ai-gateway.com';

class AIGateway {
    constructor() {
        this.apiKey = AI_GATEWAY_API_KEY;
        this.baseUrl = AI_GATEWAY_BASE_URL;
        
        if (!this.apiKey) {
            console.warn('⚠️  AI_GATEWAY_API_KEY not found. Some AI features may be limited.');
        }
    }

    /**
     * Make authenticated request to AI Gateway
     */
    async makeRequest(endpoint, options = {}) {
        if (!this.apiKey) {
            throw new Error('AI Gateway API key not configured');
        }

        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Dante-Voice-Chip/1.0',
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                throw new Error(`AI Gateway request failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('🚨 AI Gateway Error:', error.message);
            throw error;
        }
    }

    /**
     * Process terminal command with AI analysis
     */
    async analyzeCommand(command, context = {}) {
        return await this.makeRequest('/v1/analyze/command', {
            method: 'POST',
            body: JSON.stringify({
                command,
                context: {
                    timestamp: new Date().toISOString(),
                    platform: process.platform,
                    ...context
                }
            })
        });
    }

    /**
     * Generate voice response for terminal output
     */
    async generateVoiceResponse(terminalOutput, options = {}) {
        return await this.makeRequest('/v1/voice/generate', {
            method: 'POST',
            body: JSON.stringify({
                text: terminalOutput,
                voice: options.voice || 'ubuntu-sage',
                style: options.style || 'helpful',
                format: options.format || 'mp3'
            })
        });
    }

    /**
     * Get AI insights for system monitoring
     */
    async getSystemInsights(metrics) {
        return await this.makeRequest('/v1/insights/system', {
            method: 'POST',
            body: JSON.stringify({
                metrics,
                analysis_type: 'ubuntu-wisdom',
                timestamp: new Date().toISOString()
            })
        });
    }

    /**
     * Process log entries with AI interpretation
     */
    async interpretLogs(logs, options = {}) {
        return await this.makeRequest('/v1/logs/interpret', {
            method: 'POST',
            body: JSON.stringify({
                logs: Array.isArray(logs) ? logs : [logs],
                context: options.context || 'terminal-monitoring',
                ubuntu_philosophy: true,
                max_insights: options.maxInsights || 5
            })
        });
    }

    /**
     * Health check for AI Gateway connection
     */
    async healthCheck() {
        try {
            const response = await this.makeRequest('/v1/health');
            return {
                status: 'healthy',
                gateway: response,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
}

// Export singleton instance
const aiGateway = new AIGateway();

export default aiGateway;

// Named exports for specific functionality
export {
    AIGateway,
    aiGateway
};

// Ubuntu Philosophy Integration
export const ubuntuAI = {
    /**
     * Apply Ubuntu philosophy to AI responses
     */
    addUbuntuWisdom(response) {
        return {
            ...response,
            ubuntu_message: "I am because we are - collective intelligence strengthens us all",
            philosophy: "Ubuntu teaches us that AI should serve the community, not just the individual"
        };
    },

    /**
     * Generate Ubuntu-themed system messages
     */
    generateUbuntuMessage(context) {
        const messages = [
            "Through Ubuntu, your terminal becomes a bridge between individual action and collective wisdom",
            "Every command you run contributes to the greater understanding of our shared digital experience",
            "In the spirit of Ubuntu: your monitoring strengthens the entire community's knowledge",
            "Like Ubuntu teaches us, your system's health reflects the health of our interconnected world"
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
};

// Example usage in comment form
/*
// Example: Analyze a terminal command
const analysis = await aiGateway.analyzeCommand('grep -r "error" logs/', {
    user: 'ubuntu-user',
    directory: '/var/log'
});

// Example: Get system insights
const insights = await aiGateway.getSystemInsights({
    cpu: 45,
    memory: 78,
    disk: 62,
    processes: 156
});

// Example: Health check
const health = await aiGateway.healthCheck();
console.log('AI Gateway Status:', health.status);
*/