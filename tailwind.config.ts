import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F9F8F4",
        ink: "#2D3A31",
        sage: "#8C9A84",
        clay: "#DCCFC2",
        stone: "#E6E2DA",
        terracotta: "#C27B66",
      },
      fontFamily: {
        serif: ["var(--font-display)", "serif"],
        sans: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(45, 58, 49, 0.05)",
        softMd: "0 10px 15px -3px rgba(45, 58, 49, 0.05)",
        softLg: "0 20px 40px -10px rgba(45, 58, 49, 0.05)",
        softXl: "0 25px 50px -12px rgba(45, 58, 49, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
