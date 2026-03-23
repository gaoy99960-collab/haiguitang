/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          gold: '#f59e0b',
          'gold-light': '#fcd34d',
        }
      }
    }
  },
  plugins: [],
}
