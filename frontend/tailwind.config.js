/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        terminal: {
          bg: '#1a1b26',
          text: '#a9b1d6',
          accent: '#7aa2f7',
          success: '#9ece6a',
          warning: '#e0af68',
          error: '#f7768e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 1s infinite',
      }
    },
  },
  plugins: [],
}