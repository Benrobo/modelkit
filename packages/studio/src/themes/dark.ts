import { defaultTheme, type StudioTheme } from "./default";

export const darkTheme: StudioTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: "#7c3aed",
    secondary: "#a78bfa",
    background: "#0c0c0d",
    surface: "#111113",
    text: "#f4f4f5",
    textSecondary: "#a1a1aa",
    border: "#27272a",
    success: "#22c55e",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  interactive: {
    ...defaultTheme.interactive,
    primaryHover: "rgba(124, 58, 237, 0.15)",
    primaryMuted: "rgba(124, 58, 237, 0.08)",
    surfaceHover: "#18181b",
    borderHover: "rgba(124, 58, 237, 0.4)",
    textHover: "#ffffff",
  },
};
