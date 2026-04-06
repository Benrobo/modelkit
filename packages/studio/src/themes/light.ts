import { defaultTheme, type StudioTheme } from "./default";

export const lightTheme: StudioTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: "#7c3aed",
    secondary: "#6d28d9",
    background: "#fafafa",
    surface: "#ffffff",
    text: "#18181b",
    textSecondary: "#71717a",
    border: "#e4e4e7",
    success: "#16a34a",
    warning: "#d97706",
    error: "#dc2626",
  },
  interactive: {
    ...defaultTheme.interactive,
    primaryHover: "rgba(124, 58, 237, 0.08)",
    primaryMuted: "rgba(124, 58, 237, 0.05)",
    surfaceHover: "#f4f4f5",
    borderHover: "rgba(124, 58, 237, 0.3)",
    textHover: "#09090b",
  },
  fonts: {
    body: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif",
    mono: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace",
  },
  borderRadius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
  },
};
