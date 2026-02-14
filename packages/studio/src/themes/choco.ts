import type { StudioTheme } from "./default";

export const chocoTheme: StudioTheme = {
  colors: {
    primary: "#b65c45",
    secondary: "#df6f57",
    background: "#f9f4f2",
    surface: "#ffffff",
    text: "#535151",
    textSecondary: "#737373",
    border: "#DDBEA8",
    success: "#228637",
    warning: "#DEB841",
    error: "#cc0000",
  },
  fonts: {
    body: "JetBrains Mono Variable, ui-monospace, monospace",
    mono: "JetBrains Mono Variable, ui-monospace, monospace",
  },
  borderRadius: {
    sm: "4px",
    md: "6px",
    lg: "8px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  interactive: {
    primaryHover: "#df6f57",
    primaryMuted: "rgba(182, 92, 69, 0.1)",
    surfaceHover: "#fef9f6",
    borderHover: "#b65c45",
    textHover: "#535151",
  },
};
