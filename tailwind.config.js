/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lobster: {
          50: '#fff5f0',
          100: '#ffe8e0',
          200: '#ffccbc',
          300: '#ffab91',
          400: '#ff8c42',
          500: '#ff6b35',
          600: '#ff4500',
          700: '#cc3700',
          800: '#992a00',
          900: '#661a00',
        },
        ocean: {
          50: '#e6f4f7',
          100: '#b3e0ea',
          200: '#80ccd9',
          300: '#4db8c8',
          400: '#33a3b8',
          500: '#1a8fa8',
          600: '#006994',
          700: '#005580',
          800: '#003366',
          900: '#001a33',
        }
      }
    },
  },
  plugins: [],
}
