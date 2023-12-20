/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}", "./src/js/*.js"],
  theme: {
    extend: {
      fontFamily: {
        playFair: ["Playfair Display", "serif"],
        lato: ["Lato", "sans-serif"],
      },
    },
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};
