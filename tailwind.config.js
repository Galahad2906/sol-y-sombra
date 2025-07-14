/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        marfil: '#f8f5f0', // Color personalizado
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // Tipografía moderna opcional
      },
      spacing: {
        '128': '32rem', // Espaciado extra grande si necesitás en algún diseño
      },
      animation: {
        'fade-in': 'fadeIn 1.5s ease-in-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-once': 'pulseOnce 0.3s ease-out',
        'fade-in-scale': 'fadeInScale 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseOnce: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeInScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
};
