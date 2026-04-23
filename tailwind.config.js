/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          bg: '#0a0a0a',
          card: '#141414',
          border: '#222222',
          input: '#1a1a1a',
          'input-border': '#333333',
          lighter: '#1c1c1c',
          hover: '#1e1e1e',
        },
        orange: {
          primary: '#f97316',
          hover: '#ea580c',
          light: '#fb923c',
          bg: 'rgba(249, 115, 22, 0.1)',
          'bg-hover': 'rgba(249, 115, 22, 0.15)',
          border: 'rgba(249, 115, 22, 0.3)',
        },
        txt: {
          primary: '#ffffff',
          secondary: '#888888',
          muted: '#666666',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(249, 115, 22, 0.25)',
        'glow-green': '0 0 15px rgba(34, 197, 94, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'flash-orange': 'flashOrange 3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-dot': 'pulseDot 2s infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'spin-slow': 'spin 1.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out 1.5s infinite',
      },
      keyframes: {
        flashOrange: {
          '0%': { boxShadow: '0 0 30px rgba(249, 115, 22, 0.6)', borderColor: '#f97316' },
          '100%': { boxShadow: 'none', borderColor: '#222222' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
