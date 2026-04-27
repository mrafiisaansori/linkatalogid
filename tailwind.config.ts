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
        soft: "0 24px 70px rgba(15, 23, 42, 0.08)",
        card: "0 12px 38px rgba(15, 23, 42, 0.10)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 18px 50px rgba(20, 184, 166, 0.16)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(circle at 20% 20%, rgba(45, 212, 191, 0.18), transparent 26%), radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.16), transparent 24%), radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.12), transparent 22%)"
      }
    }
  },
  plugins: []
};

export default config;
