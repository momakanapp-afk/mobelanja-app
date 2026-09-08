/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}",],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#ff7f23", // spotify green
          light: "#f18f48",
          dark: "#ff6a00",
        },
        background: {
          DEFAULT: "#1B1818", // dark background
          light: "#1e1e1e",
          lighter: "#282828ee",
        },
        surface: {
          DEFAULT: "#282828",
          light: "#3E3E3E",
        },
        text: {
          primary: "#E3D3CC",
          secondary: "#B3B3B3",
          tertiary: "#6A6A6A",
        },
        accent: {
          DEFAULT: "#1DB954",
          red: "#F44336",
          yellow: "#FFC107",
          blue: "#3B82F6"
        },
      },
    },
  },
  plugins: [],
}

