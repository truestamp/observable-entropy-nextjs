const TRUESTAMP_BLUE = "#3B82F6"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        "truestamp-dark": {
          // Color Wheel : https://www.canva.com/colors/color-wheel/
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          primary: TRUESTAMP_BLUE,
          secondary: "#F63BDF",
          accent: "#3BF652",
          neutral: "#191D24",
          "base-100": "#2A303C",
          info: TRUESTAMP_BLUE,
          success: "#3BF652",
          warning: "#F6AF3B",
          error: "#F87272",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "truestamp-dark",
  },
}
