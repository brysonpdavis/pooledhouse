/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        swatch: {
          primary: "#e63946",
          "primary-focus": "#CC3340",
          secondary: "#a8dadc",
          accent: "#457b9d",
          neutral: "#f1faee",
          "base-100": "#ffffff",
        }
      }
    ]
  }
}
