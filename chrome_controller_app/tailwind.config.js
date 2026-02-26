/** @type {import('tailwindcss').Config} */
const { colors } = require("./constants/colors");

module.exports = {
  content: ["./components/**/*.tsx", "./app/**/*.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        text: colors.text,
        background: colors.background,
      }
    },
  },
  plugins: [],
}

