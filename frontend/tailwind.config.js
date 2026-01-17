/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f5a8b8',
          400: '#ef7691',
          500: '#e4486c',
          600: '#d12952',
          700: '#af1d42',
          800: '#921b3c',
          900: '#7b1a37',
          950: '#800020', // Primary maroon
        },
        darkred: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#8B0000', // Dark red accent
        },
        app: {
          bg: '#f5f5f6',
          card: '#ffffff',
          border: '#e5e5e5',
          text: '#1a1a1a',
          muted: '#6b7280',
        }
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12), 0 8px 32px rgba(0, 0, 0, 0.08)',
        'section': '0 4px 24px rgba(128, 0, 32, 0.08)',
      },
      animation: {
        'gradient': 'gradient 6s ease infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
