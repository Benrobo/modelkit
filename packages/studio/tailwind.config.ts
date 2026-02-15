import type { Config } from "tailwindcss";

export default {
  prefix: "mk",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mk-primary": "var(--mk-color-primary, #00f5ff)",
        "mk-secondary": "var(--mk-color-secondary, #004e89)",
        "mk-background": "var(--mk-color-background, #0a0a0a)",
        "mk-surface": "var(--mk-color-surface, #1a1a1a)",
        "mk-text": "var(--mk-color-text, #f5f5f5)",
        "mk-text-secondary": "var(--mk-color-text-secondary, #a0a0a0)",
        "mk-border": "var(--mk-color-border, #333333)",
        "mk-primary-hover": "var(--mk-color-primary-hover)",
        "mk-primary-muted": "var(--mk-color-primary-muted)",
        "mk-surface-hover": "var(--mk-color-surface-hover)",
        "mk-border-hover": "var(--mk-color-border-hover)",
        "mk-text-hover": "var(--mk-color-text-hover)",
      },
      borderRadius: {
        "mk-sm": "var(--mk-border-radius-sm, 0)",
        "mk-md": "var(--mk-border-radius-md, 0)",
        "mk-lg": "var(--mk-border-radius-lg, 0)",
      },
      spacing: {
        "mk-xs": "var(--mk-spacing-xs, 4px)",
        "mk-sm": "var(--mk-spacing-sm, 8px)",
        "mk-md": "var(--mk-spacing-md, 16px)",
        "mk-lg": "var(--mk-spacing-lg, 24px)",
        "mk-xl": "var(--mk-spacing-xl, 32px)",
      },
      fontFamily: {
        "mk-body": "var(--mk-font-body)",
        "mk-mono": "var(--mk-font-mono)",
      },
    },
  },
  plugins: [],
} satisfies Config;
