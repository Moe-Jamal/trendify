/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
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
