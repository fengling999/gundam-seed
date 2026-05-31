/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: '#C9A227',
        'deep-black': '#000000',
      }
    },
  },
  plugins: [],
}