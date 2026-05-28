/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0e14',
          card: '#131820',
          border: '#1e2a3a',
          accent: '#00d4aa',
          accent2: '#00aaff',
          danger: '#ff4757',
          warning: '#ffa502',
          text: '#c8d6e5',
          muted: '#5c6e80',
          header: '#0d1117',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,212,170,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0,212,170,0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
