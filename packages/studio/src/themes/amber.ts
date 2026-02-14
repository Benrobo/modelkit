import type { StudioTheme } from "./default";

export const amberTheme: StudioTheme = {
  colors: {
    primary: "#F59E0B",
    secondary: "#EFCE3F",
    background: "#1a1408",
    surface: "#2d2210",
    text: "#fff5eb",
    textSecondary: "#f4e1c7",
    border: "#DEB841",
    success: "#27993f",
    warning: "#F6E35D",
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
    primaryHover: "rgba(245, 158, 11, 0.8)",
    primaryMuted: "rgba(245, 158, 11, 0.1)",
    surfaceHover: "#3d3018",
    borderHover: "rgba(222, 184, 65, 0.8)",
    textHover: "#ffffff",
  },
};
