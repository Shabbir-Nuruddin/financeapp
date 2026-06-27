/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Marigold & Indigo: deep indigo night, saffron/marigold primary, magenta accent.
        // `brand` = marigold (primary). `gold` token repurposed as the magenta accent.
        brand: {
          50: '#fff8ec',
          100: '#ffefcb',
          200: '#ffe0a0',
          300: '#ffc857',
          400: '#ffb020',
          500: '#f59e0b',
          600: '#db8400',
          700: '#b26a00',
          800: '#7c4a00',
          900: '#4d2e00',
          950: '#2e1b00',
        },
        gold: {
          400: '#ff6fa3',
          500: '#ff4d8d',
          600: '#e63673',
        },
        ink: {
          950: '#0e0b26',
          900: '#15123a',
          800: '#211c4d',
          700: '#2e2860',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        phone: '0 25px 60px -15px rgba(0,0,0,0.45)',
        card: '0 4px 20px -8px rgba(2,44,34,0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.92)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out',
        'pop': 'pop 0.25s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
