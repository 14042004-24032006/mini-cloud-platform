/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: '#080c14',
        panel: '#0d1420',
        surface: '#111b2e',
        border: '#1a2d4a',
        accent: '#00d4ff',
        'accent-dim': '#0099bb',
        glow: '#00ff9d',
        warn: '#f59e0b',
        danger: '#ef4444',
        muted: '#4a6080',
        text: '#c8dff5',
        bright: '#e8f4ff',
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(0, 212, 255, 0.15)',
        'glow-green': '0 0 20px rgba(0, 255, 157, 0.15)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
