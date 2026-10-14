/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sunset & Desert Sand
        terracotta: {
          50: '#fff5f2',
          100: '#ffe8e2',
          500: '#ff5a36',
          600: '#e04826',
        },
        // Himalayan Pine & Ghats
        pine: {
          50: '#f0fdf4',
          500: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Ocean & Alpine Lagoon
        lagoon: {
          400: '#38bdf8',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
        // Snow & Warm Paper Canvas
        snow: '#FFFFFF',
        sand: '#FAF8F5',
        charcoal: '#18181B',
        stone: '#71717A',
        // Backward compatibility for existing UI elements
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        dark: {
          bg: '#080d19',
          card: '#0f172a',
          surface: '#1e293b',
          border: '#334155'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-terracotta': '0 10px 30px -5px rgba(255, 90, 54, 0.35)',
        'glow-lagoon': '0 10px 30px -5px rgba(14, 165, 233, 0.35)',
        'card-warm': '0 10px 25px -5px rgba(24, 24, 27, 0.08), 0 4px 6px -2px rgba(24, 24, 27, 0.04)',
        'card-float': '0 20px 35px -10px rgba(0, 0, 0, 0.15)',
        'glow': '0 4px 20px -2px rgba(14, 165, 233, 0.15)',
        'glow-emerald': '0 4px 20px -2px rgba(16, 185, 129, 0.15)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem'
      }
    },
  },
  plugins: [],
}
