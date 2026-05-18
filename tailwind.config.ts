import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./app/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        appPrimary: "var(--app-color-primary)",
        appSecondary: "var(--app-color-secondary)",

        // background layers
        bgPrimary: "var(--bg-primary)",
        bgSecondary: "var(--bg-secondary)",

        // background layers
        bgHoverPrimary: "var(--bg-hover-primary)",
        bgHoverSecondary: "var(--bg-hover-secondary)",

        // text roles
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",

        // borders
        borderPrimary: "var(--border-primary)",
      },
    },
  },
  plugins: [],
} satisfies Config;
