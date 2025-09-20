/** @type {import('next').NextConfig} */
const nextConfig = {
  // React strict mode for better development experience
  reactStrictMode: true,
  
  // ESLint configuration - don't block builds on lint errors
  eslint: {
    ignoreDuringBuilds: true, // ✅ Prevents deployment failures from ESLint warnings
  },
  
  // Environment variables
  env: {
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
    VOICE_MODEL: process.env.VOICE_MODEL || 'gpt-4-turbo-preview',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3001',
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig