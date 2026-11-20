import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // New design system palette (reference screenshot)
        canvas: "#F4F3EF",
        surface: "#FFFFFF",
        "surface-border": "#E4E2DA",
        ink: "#1B1A2E",
        muted: "#55536B",
        teal: "#0F766E",
        "teal-light": "#E3F2EF",
        "teal-dark": "#0B5F58",
        warn: "#9A3412",
        "warn-bg": "#FFEDD5",
        // Legacy compatibility
        deepIndigo: "#272757",
        charcoal: "#1B1A2E",
        mutedIndigo: "#0F766E",
        mutedTeal: "#0F766E",
        dustyLavender: "#55536B",
        softSage: "#E3F2EF",
        offWhite: "#F4F3EF",
        warmSand: "#FFEDD5",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        nav: "0 1px 0 #E4E2DA",
        dropdown: "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
      },
      borderColor: {
        DEFAULT: "#E4E2DA",
      },
    },
  },
  plugins: [],
};

export default config;
