import type { StudioTheme } from "./default";

export const cyanTheme: StudioTheme = {
  colors: {
    primary: "#00ffff",
    secondary: "#23d5d5",
    background: "#0a1a1a",
    surface: "#0f2828",
    text: "#e0ffff",
    textSecondary: "#a0e7e7",
    border: "#17BEBB",
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
    primaryHover: "rgba(0, 255, 255, 0.8)",
    primaryMuted: "rgba(0, 255, 255, 0.1)",
    surfaceHover: "#143636",
    borderHover: "rgba(23, 190, 187, 0.8)",
    textHover: "#ffffff",
  },
};
