import { defaultTheme, type StudioTheme } from "./default";

export const lightTheme: StudioTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: "#0f172a",
    background: "#fafafa",
    surface: "#ffffff",
    text: "#171717",
    textSecondary: "#737373",
    border: "#e5e5e5",
  },
  interactive: {
    ...defaultTheme.interactive,
    primaryHover: "rgba(15, 23, 42, 0.08)",
    primaryMuted: "rgba(15, 23, 42, 0.05)",
    surfaceHover: "#f5f5f5",
    borderHover: "rgba(15, 23, 42, 0.25)",
    textHover: "#171717",
  },
};
