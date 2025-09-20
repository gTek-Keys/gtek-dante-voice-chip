/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables
  env: {
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
    VOICE_MODEL: process.env.VOICE_MODEL || 'gpt-4-turbo-preview',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
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