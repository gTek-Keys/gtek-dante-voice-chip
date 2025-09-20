#!/bin/bash
set -e

echo "🚀 Starting setup for frontend..."

# 1. Install runtime dependencies
echo "📦 Installing Next.js + React..."
npm install next react react-dom

# 2. Install dev dependencies
echo "📦 Installing ESLint configs..."
npm install --save-dev eslint eslint-config-next

# 3. Create vercel.json
echo "📝 Creating vercel.json..."
cat > vercel.json <<'EOF'
{
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
EOF

# 4. Create ESLint config
echo "📝 Creating .eslintrc.json..."
cat > .eslintrc.json <<'EOF'
{
  "extends": ["next/core-web-vitals"]
}
EOF

# 5. Create tsconfig.json
echo "📝 Creating tsconfig.json..."
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF

# 6. Create next.config.js
echo "📝 Creating next.config.js..."
cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || "changeme"
  }
};
module.exports = nextConfig;
EOF

# 7. Create app config JSON
echo "📝 Creating config/app.json..."
mkdir -p config
cat > config/app.json <<'EOF'
{
  "appName": "Dante Frontend",
  "version": "0.1.0",
  "author": "gTek Industries",
  "features": {
    "voiceInterface": true,
    "terminalMonitor": true
  }
}
EOF

# 8. Run local build
echo "🏗 Running local build..."
npm run build || { echo "❌ Build failed"; exit 1; }

# 9. Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Setup and deployment complete!"
