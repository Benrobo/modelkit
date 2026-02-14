export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeFonts {
  body: string;
  mono: string;
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

/** Hover, focus, and interactive state tokens for full customization */
export interface ThemeInteractive {
  primaryHover: string;
  primaryMuted: string;
  surfaceHover: string;
  borderHover: string;
  textHover: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fonts: ThemeFonts;
  borderRadius: ThemeBorderRadius;
  spacing: ThemeSpacing;
}

/** Full theme including interactive tokens (used internally and for presets) */
export interface StudioTheme extends ThemeConfig {
  interactive: ThemeInteractive;
}

/** Deep partial: every key optional at every level for type-safe overrides */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** User-facing theme override: pass only what you want to change */
export type StudioThemeOverride = DeepPartial<StudioTheme>;

export const defaultTheme: StudioTheme = {
  colors: {
    primary: "#00f5ff",
    secondary: "#004e89",
    background: "#0a0a0a",
    surface: "#1a1a1a",
    text: "#f5f5f5",
    textSecondary: "#a0a0a0",
    border: "#333333",
    success: "#00c896",
    warning: "#ffa500",
    error: "#ff4444",
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
    primaryHover: "rgba(0, 245, 255, 0.2)",
    primaryMuted: "rgba(0, 245, 255, 0.1)",
    surfaceHover: "#252525",
    borderHover: "rgba(0, 245, 255, 0.5)",
    textHover: "#f5f5f5",
  },
};
