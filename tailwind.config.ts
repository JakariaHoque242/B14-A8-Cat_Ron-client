import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf8f4",
          100: "#f9ede2",
          200: "#f3d9c3",
          300: "#ebbe9d",
          400: "#e09d72",
          500: "#d97736",
          600: "#c75f28",
          700: "#a54922",
          800: "#843b22",
          900: "#6d331f",
          950: "#3b170c",
        },
        warm: {
          50: "#fbfaf8",
          100: "#f6f4f0",
          200: "#ebe6df",
          300: "#dbd3c7",
          400: "#bfb2a0",
          500: "#a59480",
          600: "#8d7c69",
          700: "#746455",
          800: "#605348",
          900: "#50463e",
        }
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'book': '0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0,0,0,0.04)',
        'book-hover': '0 20px 40px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
};
export default config;
