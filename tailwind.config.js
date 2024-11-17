import defaultTheme from "tailwindcss/defaultTheme";
import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Noto Sans", ...defaultTheme.fontFamily.sans],
      },
      flex: {
        '2': '2 2 0%',
        '5': '5 5 0%',
      },
    },
  },
  plugins: [
    scrollbarHide,
  ],
};
