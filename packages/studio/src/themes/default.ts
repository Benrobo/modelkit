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

/** User-facing theme override: pass only what you want to change */
export type StudioThemeOverride = {
  colors?: Partial<ThemeColors>;
  fonts?: Partial<ThemeFonts>;
  borderRadius?: Partial<ThemeBorderRadius>;
  spacing?: Partial<ThemeSpacing>;
  interactive?: Partial<ThemeInteractive>;
};

/** @deprecated Use StudioThemeOverride instead */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export const defaultTheme: StudioTheme = {
  colors: {
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
  fonts: {
    body: "Inter Variable, Inter, ui-sans-serif, system-ui, sans-serif",
    mono: "JetBrains Mono Variable, JetBrains Mono, ui-monospace, monospace",
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
    primaryHover: "rgba(124, 58, 237, 0.15)",
    primaryMuted: "rgba(124, 58, 237, 0.08)",
    surfaceHover: "#18181b",
    borderHover: "rgba(124, 58, 237, 0.4)",
    textHover: "#f4f4f5",
  },
};
