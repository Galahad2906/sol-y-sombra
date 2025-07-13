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
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
  ],
};
