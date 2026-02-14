import type { StudioTheme } from "./default";

export const purpleTheme: StudioTheme = {
  colors: {
    primary: "#8f63f3",
    secondary: "#7f21cc",
    background: "#1a0a2e",
    surface: "#2b1549",
    text: "#e9d5ff",
    textSecondary: "#c4b5fd",
    border: "#8f63f3",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#E4295D",
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
    primaryHover: "rgba(143, 99, 243, 0.8)",
    primaryMuted: "rgba(143, 99, 243, 0.1)",
    surfaceHover: "#3d1f5c",
    borderHover: "rgba(143, 99, 243, 0.8)",
    textHover: "#ffffff",
  },
};
