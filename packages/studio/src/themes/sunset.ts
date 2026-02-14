import type { StudioTheme } from "./default";

export const sunsetTheme: StudioTheme = {
  colors: {
    primary: "#ff5518",
    secondary: "#f99d52",
    background: "#331e14",
    surface: "#442817",
    text: "#fff5eb",
    textSecondary: "#fccda2",
    border: "#f4bf8e",
    success: "#27993f",
    warning: "#EFCE3F",
    error: "#ff4741",
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
    primaryHover: "rgba(255, 85, 24, 0.8)",
    primaryMuted: "rgba(255, 85, 24, 0.1)",
    surfaceHover: "#553320",
    borderHover: "rgba(244, 191, 142, 0.8)",
    textHover: "#ffffff",
  },
};
