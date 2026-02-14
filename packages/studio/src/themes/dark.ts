import { defaultTheme, type StudioTheme } from "./default";

export const darkTheme: StudioTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: "#00f5ff",
    secondary: "#ff6b35",
    background: "#0a0e14",
    surface: "#151b24",
    text: "#e6edf3",
    textSecondary: "#8b949e",
    border: "#30363d",
    success: "#3fb950",
    warning: "#d29922",
    error: "#f85149",
  },
  interactive: {
    ...defaultTheme.interactive,
    primaryHover: "rgba(0, 245, 255, 0.25)",
    primaryMuted: "rgba(0, 245, 255, 0.12)",
    surfaceHover: "#1c2128",
    borderHover: "rgba(0, 245, 255, 0.6)",
    textHover: "#ffffff",
  },
};
