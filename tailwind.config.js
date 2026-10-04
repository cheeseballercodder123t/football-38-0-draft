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
        field: {
          dark: '#08170e',
          DEFAULT: '#0b1f13',
          border: '#1f4a2d',
          line: 'rgba(255, 255, 255, 0.25)',
        },
        panel: {
          dark: '#0d1117',
          DEFAULT: '#161b22',
          border: '#30363d',
          accent: '#21262d',
        }
      },
    },
  },
  plugins: [],
}
