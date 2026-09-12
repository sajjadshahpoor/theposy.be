/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        posy: {
          50: "#fdf2f6",
          100: "#fbe6ee",
          200: "#f6c3d9",
          300: "#f19fc3",
          400: "#e8599a",
          500: "#df1471",
          600: "#c91266",
          700: "#a70e54",
          800: "#850b43",
          900: "#6d0937",
        },
      },
    },
  },
  plugins: [],
};
