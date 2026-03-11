/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'teal': '#008080',
        'silver': '#c0c0c0',
        'gray': '#808080',
        'navy': '#000080',
        'win_black': '#000000',
      },
      boxShadow: {
        'win95-outset': 'inset -1px -1px #000, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
        'win95-inset': 'inset -1px -1px #fff, inset 1px 1px #000, inset -2px -2px #dfdfdf, inset 2px 2px #808080',
      },
      fontFamily: {
        'pixel': ['"MS Sans Serif"', 'Tahoma', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

