import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom pastel theme
        primary: {
          50: '#F0F8FF',
          100: '#E5F3FF', 
          200: '#D4EDFF',
          300: '#B8E0FF',
          400: '#A5C9FF', // Primary pastel blue
          500: '#7BB3FF',
          600: '#4A8FFF',
          700: '#2563EB',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE', 
          300: '#C8B6FF', // Secondary pastel purple
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        accent: {
          50: '#FFF7F5',
          100: '#FFEDE8',
          200: '#FFD6CC',
          300: '#FFB5A7', // Accent pastel coral
          400: '#FF9482',
          500: '#FF7A5C',
          600: '#F56040',
          700: '#E5422B',
          800: '#D73423',
          900: '#B91C1C',
        },
        cream: {
          50: '#FFFDF7', // Light background
          100: '#FFF9F0',
          200: '#FEF2E8',
          300: '#FDEAD5',
          400: '#F9D6B8',
          500: '#F4C2A3',
        },
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#1E1E2E', // Dark background
        },
      },
      fontFamily: {
        sans: ['Nunito', 'Inter', ...fontFamily.sans],
        display: ['Poppins', ...fontFamily.serif],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(165, 201, 255, 0.1), 0 10px 20px -2px rgba(165, 201, 255, 0.04)',
        'soft-lg': '0 10px 15px -3px rgba(165, 201, 255, 0.1), 0 4px 6px -2px rgba(165, 201, 255, 0.05)',
        'pastel': '0 4px 25px -5px rgba(200, 182, 255, 0.15)',
        'accent-glow': '0 0 20px rgba(255, 181, 167, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'mood-glow': 'moodGlow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        moodGlow: {
          '0%': { boxShadow: '0 0 20px rgba(165, 201, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(200, 182, 255, 0.5)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    // Add line-clamp utilities
    function({ addUtilities }) {
      addUtilities({
        '.line-clamp-1': {
          display: '-webkit-box',
          '-webkit-line-clamp': '1',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-8': {
          display: '-webkit-box',
          '-webkit-line-clamp': '8',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.writing-vertical-rl': {
          'writing-mode': 'vertical-rl',
          'text-orientation': 'mixed',
        },
      })
    }
  ],
}