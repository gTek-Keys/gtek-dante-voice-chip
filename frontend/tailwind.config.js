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
        // Pan-African Core Palette
        african: {
          midnight: '#000000',    // Deep black base
          crimson: '#DC143C',     // Pan-African red
          gold: '#FFD700',        // Pan-African gold/yellow  
          emerald: '#228B22',     // Pan-African green
          bronze: '#CD7F32',      // African bronze
        },
        earth: {
          sahara: '#F4A460',      // Sahara sand
          baobab: '#8B4513',      // Baobab tree brown
          sunset: '#FF6347',      // African sunset
          savanna: '#9ACD32',     // Savanna grass
        },
        interface: {
          charcoal: '#1a1a1a',    // Dark backgrounds
          slate: '#2d3748',       // Card backgrounds
          mist: '#f7fafc',        // Light text on dark
          glow: '#ffd70080',      // Gold glow/hover
        },
        status: {
          success: '#228B22',     // Green success
          warning: '#FFD700',     // Gold warning
          error: '#DC143C',       // Red error
          info: '#4682B4',        // Steel blue info
        },
        // Legacy terminal colors for compatibility
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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Monaco', 'Cascadia Code', 'monospace'],
        display: ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 215, 0, 0.3)',
        'crimson-glow': '0 0 20px rgba(220, 20, 60, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'bounce-soft': 'bounce 1s ease-in-out infinite',
        'bounce-gentle': 'bounce 1s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-african': 'linear-gradient(135deg, #000000 0%, #DC143C 50%, #FFD700 100%)',
        'pattern-kente': `
          linear-gradient(45deg, transparent 25%, rgba(255, 215, 0, 0.05) 25%, rgba(255, 215, 0, 0.05) 50%, transparent 50%),
          linear-gradient(-45deg, transparent 25%, rgba(220, 20, 60, 0.05) 25%, rgba(220, 20, 60, 0.05) 50%, transparent 50%)
        `,
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}