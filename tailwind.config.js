/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.75rem",
        sm: "1rem",
        md: "2rem",
        lg: "2rem",
        xl: "60px",
        "2xl": "100px",
      },
    },
    extend: {
      padding: {
        "sec-p": "80px",
      },
      colors: {
        "main-color": "#8B5E35",
        "secondry-color": "#9B7E5C",
        "text-color": "#090F41",
        "secText-color": "#9D9DAA",
        "bg-color": "#F6F6F6",
      },
    },
  },
  plugins: [],
};
