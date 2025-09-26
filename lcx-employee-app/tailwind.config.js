/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#b8ca41",
        headings: '#4d4d4d',
        texts: '#b3b3b3',
        secondary: '#8e8d8e'
      }
    },
  },
  plugins: [],
}