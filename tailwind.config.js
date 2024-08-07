const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Noto Sans", ...defaultTheme.fontFamily.sans]
      },
      flex: {
        '2': '2 2 0%',
        '5': '5 5 0%',
      }
    },
  },
  plugins: [],
}

