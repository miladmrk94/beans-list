/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", "sans-serif"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#FFBA00",
          secondary: "#F0AB9B",
          accent: "#e82e81",
          neutral: "#1d1d1d",
          "base-100": "#25292e",
          info: "#9DC3EF",
          success: "#169850",
          warning: "#FFBA60",
          error: "#E14E47",
        },
      },
    ],
  },
  plugins: [daisyui],
};
