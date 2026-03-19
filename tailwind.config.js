/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0A0A0A',
          dark: '#111111',
          card: '#1A1A1A',
          border: '#2A2A2A',
          red: '#FF3333',
          redGlow: '#FF4444',
          redDark: '#CC0000',
          blue: '#2D9CDB',
          blueGlow: '#3DAEE8',
          blueDark: '#1A7CB8',
          green: '#22C55E',
          yellow: '#F59E0B',
          white: '#FFFFFF',
          gray: '#9CA3AF',
          lightGray: '#D1D5DB',
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
