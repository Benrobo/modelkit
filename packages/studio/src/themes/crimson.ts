import type { StudioTheme } from "./default";

export const crimsonTheme: StudioTheme = {
  colors: {
    primary: "#E4295D",
    secondary: "#FF9F9F",
    background: "#1a0a0f",
    surface: "#2d1018",
    text: "#FFECEC",
    textSecondary: "#ffb3c1",
    border: "#F75C4E",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#ff0000",
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
    primaryHover: "rgba(228, 41, 93, 0.8)",
    primaryMuted: "rgba(228, 41, 93, 0.1)",
    surfaceHover: "#3f1524",
    borderHover: "rgba(247, 92, 78, 0.8)",
    textHover: "#ffffff",
  },
};
