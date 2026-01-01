/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3F7E44',      // SDG Green
        secondary: '#26BDE2',    // SDG Blue
        accent: '#FCC30B',       // SDG Yellow
        danger: '#E5243B',       // SDG Red
      }
    },
  },
  plugins: [],
}
