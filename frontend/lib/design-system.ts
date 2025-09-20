// 🎨 Afrocentric Design System - Pan-African Excellence
// Colors, typography, and cultural identity for Dante Voice Chip

export const colors = {
  // Pan-African Core Palette
  african: {
    midnight: '#000000',    // Deep black base
    crimson: '#DC143C',     // Pan-African red
    gold: '#FFD700',        // Pan-African gold/yellow  
    emerald: '#228B22',     // Pan-African green
    bronze: '#CD7F32',      // African bronze
  },
  
  // Extended Cultural Palette
  earth: {
    sahara: '#F4A460',      // Sahara sand
    baobab: '#8B4513',      // Baobab tree brown
    sunset: '#FF6347',      // African sunset
    savanna: '#9ACD32',     // Savanna grass
  },
  
  // Modern Interface Colors
  interface: {
    charcoal: '#1a1a1a',    // Dark backgrounds
    slate: '#2d3748',       // Card backgrounds
    mist: '#f7fafc',        // Light text on dark
    glow: '#ffd70080',      // Gold glow/hover
  },
  
  // Status & Feedback
  status: {
    success: '#228B22',     // Green success
    warning: '#FFD700',     // Gold warning
    error: '#DC143C',       // Red error
    info: '#4682B4',        // Steel blue info
  }
}

export const typography = {
  // Display fonts - Bold African-inspired
  display: {
    primary: '"Inter", "Helvetica Neue", sans-serif',
    weight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    }
  },
  
  // Body fonts - Clean and readable
  body: {
    primary: '"Inter", system-ui, sans-serif',
    mono: '"Fira Code", "SF Mono", Consolas, monospace',
  },
  
  // Scale - Harmonious proportions
  scale: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  }
}

export const spacing = {
  // Rhythmic spacing based on 8px grid
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
}

export const shadows = {
  // African-inspired shadows with warmth
  soft: '0 1px 3px rgba(220, 20, 60, 0.1)',
  medium: '0 4px 6px rgba(220, 20, 60, 0.1), 0 2px 4px rgba(255, 215, 0, 0.06)',
  large: '0 10px 15px rgba(220, 20, 60, 0.1), 0 4px 6px rgba(255, 215, 0, 0.05)',
  glow: '0 0 20px rgba(255, 215, 0, 0.3)',
  crimsonGlow: '0 0 20px rgba(220, 20, 60, 0.4)',
}

export const patterns = {
  // Adinkra-inspired patterns for subtle backgrounds
  kente: `
    background-image: 
      linear-gradient(45deg, transparent 25%, rgba(255, 215, 0, 0.05) 25%, rgba(255, 215, 0, 0.05) 50%, transparent 50%),
      linear-gradient(-45deg, transparent 25%, rgba(220, 20, 60, 0.05) 25%, rgba(220, 20, 60, 0.05) 50%, transparent 50%);
    background-size: 20px 20px;
  `,
  
  geometric: `
    background-image: radial-gradient(circle at 2px 2px, rgba(255, 215, 0, 0.1) 1px, transparent 0);
    background-size: 20px 20px;
  `,
}

export const animations = {
  // Cultural motion principles
  transitions: {
    fast: '150ms ease-out',
    normal: '250ms ease-out', 
    slow: '350ms ease-out',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Voice visualizer keyframes
  pulse: `
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }
  `,
  
  glow: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
      50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
    }
  `,
}

// Adinkra Symbol Components (as inline SVG)
export const adinkraSymbols = {
  // Sankofa - Looking back to move forward (perfect for logs)
  sankofa: `
    <svg viewBox="0 0 100 100" className="w-6 h-6">
      <path d="M50 10 C30 10, 10 30, 10 50 C10 70, 30 90, 50 90 C70 90, 90 70, 90 50 C90 40, 85 30, 75 25 L75 35 L85 30 L75 25 L70 35 L75 25" 
            fill="currentColor" stroke="currentColor" strokeWidth="2" fillRule="evenodd"/>
    </svg>
  `,
  
  // Fawohodie - Independence/Freedom (for tasks)
  fawohodie: `
    <svg viewBox="0 0 100 100" className="w-6 h-6">
      <path d="M50 20 L60 40 L80 40 L65 52 L70 72 L50 60 L30 72 L35 52 L20 40 L40 40 Z" 
            fill="currentColor"/>
    </svg>
  `,
  
  // Dwennimmen - Ram's horns (strength and humility)
  dwennimmen: `
    <svg viewBox="0 0 100 100" className="w-6 h-6">
      <path d="M25 50 C25 35, 35 25, 50 25 C65 25, 75 35, 75 50 C75 65, 65 75, 50 75 C35 75, 25 65, 25 50" 
            fill="none" stroke="currentColor" strokeWidth="4"/>
      <circle cx="35" cy="40" r="3" fill="currentColor"/>
      <circle cx="65" cy="40" r="3" fill="currentColor"/>
    </svg>
  `,
}

// Component variants for consistent styling
export const variants = {
  card: {
    base: `bg-african-midnight border border-african-crimson/20 rounded-lg p-6 shadow-medium`,
    elevated: `bg-african-midnight border border-african-gold/30 rounded-lg p-6 shadow-large hover:shadow-glow transition-all duration-normal`,
    interactive: `bg-african-midnight border border-african-crimson/20 rounded-lg p-6 shadow-medium hover:border-african-gold/50 hover:shadow-glow transition-all duration-normal cursor-pointer`,
  },
  
  button: {
    primary: `bg-african-crimson hover:bg-african-crimson/90 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-fast`,
    secondary: `bg-african-gold hover:bg-african-gold/90 text-african-midnight font-semibold px-6 py-3 rounded-lg transition-all duration-fast`,
    ghost: `bg-transparent hover:bg-african-gold/10 text-african-gold border border-african-gold/30 hover:border-african-gold font-semibold px-6 py-3 rounded-lg transition-all duration-fast`,
  },
  
  text: {
    heading: `text-african-gold font-bold tracking-tight`,
    body: `text-interface-mist font-regular`,
    accent: `text-african-crimson font-medium`,
    muted: `text-interface-mist/70 font-regular`,
  }
}