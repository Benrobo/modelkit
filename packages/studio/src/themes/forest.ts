import type { StudioTheme } from "./default";

export const forestTheme: StudioTheme = {
  colors: {
    primary: "#22C55E",
    secondary: "#27993f",
    background: "#0a1f0f",
    surface: "#132d1a",
    text: "#EAF1DA",
    textSecondary: "#a8c89a",
    border: "#228637",
    success: "#22C55E",
    warning: "#F6E35D",
    error: "#FF6F6F",
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
    primaryHover: "rgba(34, 197, 94, 0.8)",
    primaryMuted: "rgba(34, 197, 94, 0.1)",
    surfaceHover: "#1a3d24",
    borderHover: "rgba(34, 134, 55, 0.8)",
    textHover: "#ffffff",
  },
};
