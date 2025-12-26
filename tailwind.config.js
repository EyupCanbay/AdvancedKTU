/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#14aab8",
        "primary-dark": "#0e7c86",
        "accent": "#10b981",
        "background-dark": "#112022",
        "surface-dark": "#1a2c2e",
        "border-dark": "#244447",
        "warning": "#f59e0b", // Yeni renk
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem", // HTML'deki değer
      }
    },
  },
  plugins: [],
}