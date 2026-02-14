import type { StudioTheme } from "./default";

export const oceanTheme: StudioTheme = {
  colors: {
    primary: "#3770fe",
    secondary: "#67A2F1",
    background: "#0e2d52",
    surface: "#1f40ae",
    text: "#f4f9ff",
    textSecondary: "#c0d6ff",
    border: "#6b77f1",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#ff4723",
  },
  fonts: {
    body: "JetBrains Mono Variable, ui-monospace, monospace",
    mono: "JetBrains Mono Variable, ui-monospace, monospace",
  },
  borderRadius: {
    sm: "0",
    md: "0",
    lg: "0",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  interactive: {
    primaryHover: "rgba(55, 112, 254, 0.8)",
    primaryMuted: "rgba(55, 112, 254, 0.1)",
    surfaceHover: "#2a50c0",
    borderHover: "rgba(107, 119, 241, 0.8)",
    textHover: "#ffffff",
  },
};
