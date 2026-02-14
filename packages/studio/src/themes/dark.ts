import { defaultTheme, type StudioTheme } from "./default";

export const darkTheme: StudioTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: "#00f5ff",
    background: "#0a0a0a",
    surface: "#1a1a1a",
    text: "#f5f5f5",
    textSecondary: "#a0a0a0",
    border: "#333333",
  },
};
