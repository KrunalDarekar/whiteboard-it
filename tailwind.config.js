/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stroke-red': "#b92929",
        'stroke-green': "#278338",
        'stroke-blue': "#155ea1",
        'stroke-orange': "#c77400",
        'fill-transparent': "#00000000",
        'fill-red': "#ffc9c9",
        'fill-green': "#b2f2bb",
        'fill-blue': "#a5d8ff",
        'fill-orange': "#ffec99"
      }
    },
  },
  plugins: [],
}

