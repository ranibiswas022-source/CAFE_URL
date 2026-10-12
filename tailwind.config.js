/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080B0F',
        surface: '#12161F',
        cream: '#F7F2EA',
        gold: '#D4A574',
        espresso: '#4B2E20',
        textPrimary: '#FFFFFF',
        textSecondary: '#A7ADB7',
        success: '#19C99A',
        border: '#1E2433',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4A574 0%, #B8863A 100%)',
        'dark-gradient': 'linear-gradient(180deg, #080B0F 0%, #12161F 100%)',
        'hero-gradient': 'linear-gradient(90deg, rgba(8,11,15,0.97) 0%, rgba(8,11,15,0.8) 50%, rgba(8,11,15,0.2) 100%)',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(212, 165, 116, 0.15)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 60px rgba(212, 165, 116, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'float-delay2': 'float 6s ease-in-out 4s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(5deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-3deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
