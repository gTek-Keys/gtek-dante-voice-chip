import aiGateway from '../frontend/lib/ai-gateway.js';

/**
 * AI-powered terminal analysis endpoint
 * Integrates with AI Gateway for enhanced command analysis
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            error: 'Method not allowed',
            ubuntu: 'Ubuntu wisdom: use POST for collective analysis' 
        });
    }

    try {
        const { command, context = {} } = req.body;
        
        if (!command) {
            return res.status(400).json({ 
                error: 'Command is required',
                ubuntu: 'Ubuntu teaches us: clarity in communication strengthens understanding'
            });
        }

        console.log('🤖 Analyzing command with AI Gateway:', command);

        // Check AI Gateway health first
        const healthCheck = await aiGateway.healthCheck();
        if (healthCheck.status !== 'healthy') {
            console.warn('⚠️  AI Gateway unhealthy, using fallback analysis');
            
            // Fallback analysis without AI Gateway
            return res.json({
                analysis: {
                    command,
                    risk_level: 'unknown',
                    suggestions: ['Run with caution', 'Check documentation'],
                    ubuntu_wisdom: 'Even without AI assistance, Ubuntu philosophy guides us to proceed thoughtfully'
                },
                fallback: true,
                timestamp: new Date().toISOString()
            });
        }

        // Perform AI analysis
        const analysis = await aiGateway.analyzeCommand(command, {
            ...context,
            user_agent: req.headers['user-agent'],
            ip: req.ip
        });

        // Add Ubuntu philosophy to response
        const ubuntuEnhanced = {
            ...analysis,
            ubuntu_message: "Through collective intelligence, we strengthen individual understanding",
            philosophy: "I am because we are - your command analysis benefits the entire community"
        };

        console.log('✅ AI analysis completed successfully');

        res.json({
            analysis: ubuntuEnhanced,
            gateway_health: healthCheck,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('🚨 AI analysis error:', error.message);
        
        res.status(500).json({
            error: 'AI analysis failed',
            message: error.message,
            ubuntu: 'Ubuntu resilience: when technology fails, human wisdom prevails',
            timestamp: new Date().toISOString()
        });
    }
}