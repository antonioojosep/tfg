/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // Main blue
          light: "#3b82f6",
          dark: "#1e40af",
        },
        secondary: {
          DEFAULT: "#f59e42", // Orange
          light: "#fbbf24",
          dark: "#b45309",
        },
        accent: "#10b981", // Green
        background: "#f3f4f6", // Light gray
        surface: "#ffffff", // White
        danger: "#ef4444", // Red
      },
      borderRadius: {
        xl: "1.25rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
}