import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-contractica)", "ui-sans-serif", "system-ui"],
        contractica: ["var(--font-contractica)", "sans-serif"],
        "contractica-caps": ["var(--font-contractica-caps)", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        "h1, h2, h3, h4, h5, h6": {
          fontFamily: theme("fontFamily.contractica-caps"),
        },
      });
    }),
  ],
};

export default config;
