#!/bin/bash

# Clean Vercel deployment for Dante Voice Chip

echo "🚀 Starting clean Vercel deployment..."

# Ensure we're in the right directory
cd "$(dirname "$0")" || exit 1

# Remove any existing Vercel configuration
rm -rf .vercel

# Deploy with specific configuration
echo "📤 Deploying to Vercel..."
echo ""
echo "When prompted, use these answers:"
echo "• Link to existing project? → No"
echo "• Project name → dante-voice-chip"  
echo "• Directory with code → ./"
echo ""

# Start deployment
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your terminal control tower is now live!"
echo ""
echo "🔧 Next steps:"
echo "1. Visit your Vercel dashboard"
echo "2. Add environment variables:"
echo "   - ENCRYPTION_KEY: $(openssl rand -base64 32)"
echo "   - OPENAI_API_KEY: your_openai_key"
echo "3. Install local agent: cd agent && ./install.sh"
echo ""