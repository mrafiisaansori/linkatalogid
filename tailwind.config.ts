import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-soft": "rgb(var(--surface-soft) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        brand: "rgb(var(--brand) / <alpha-value>)",
        "brand-strong": "rgb(var(--brand-strong) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        "success-strong": "rgb(var(--success-strong) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.05)",
        card: "0 6px 16px -4px rgba(15, 23, 42, 0.10)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 18px 50px rgba(20, 184, 166, 0.16)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "hero-mesh": "radial-gradient(120% 90% at 0% 0%, rgba(13, 148, 136, 0.10), transparent 55%)"
      }
    }
  },
  plugins: []
};

export default config;
