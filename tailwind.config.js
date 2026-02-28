/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-gold': '#b5924e', // Deeper, more elegant gold
                'sys-black': '#0a0a0a',  // Richer black for higher contrast
                'sys-gray': '#333333',   // Darker gray for typography
                'sys-light': '#fafafa',  // Pure off-white
            },
            fontFamily: {
                sans: ['Lato', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        },
    },
    plugins: [],
}
