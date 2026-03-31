/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0B0D10',
          dark: '#12151A',
          card: '#181C23',
          border: '#252A33',
          red: '#FF3333',
          redGlow: '#FF4444',
          redDark: '#CC0000',
          blue: '#2D9CDB',
          blueGlow: '#3DAEE8',
          blueDark: '#1A7CB8',
          green: '#22C55E',
          yellow: '#F59E0B',
          white: '#FFFFFF',
          gray: '#8B95A5',
          lightGray: '#C5CDD8',
        }
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
