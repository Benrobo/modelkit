import type { CSSProperties } from "react";
import type { StudioTheme, StudioThemeOverride } from "./default";
import { darkTheme } from "./dark";
import { defaultTheme } from "./default";
import { lightTheme } from "./light";
import { chocoTheme } from "./choco";
import { oceanTheme } from "./ocean";
import { sunsetTheme } from "./sunset";
import { forestTheme } from "./forest";
import { purpleTheme } from "./purple";
import { crimsonTheme } from "./crimson";
import { cyanTheme } from "./cyan";
import { amberTheme } from "./amber";
import { ThemeMode } from "..";

function deepMerge<T extends object>(base: T, override: DeepPartial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const overrideVal = override[key];
    if (overrideVal === undefined) continue;
    const baseVal = result[key];
    if (
      baseVal !== null &&
      typeof baseVal === "object" &&
      !Array.isArray(baseVal) &&
      overrideVal !== null &&
      typeof overrideVal === "object" &&
      !Array.isArray(overrideVal)
    ) {
      (result as Record<keyof T, unknown>)[key] = deepMerge(
        baseVal as object,
        overrideVal as DeepPartial<typeof baseVal>
      ) as T[keyof T];
    } else {
      (result as Record<keyof T, unknown>)[key] = overrideVal as T[keyof T];
    }
  }
  return result;
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Resolve theme: preset name or merge custom override onto a base theme.
 * Use this to get a full StudioTheme from "dark" | "light" or a partial override.
 */
export function resolveTheme(
  theme: ThemeMode | StudioThemeOverride,
  basePreset: ThemeMode = "dark"
): StudioTheme {
  if (theme === "dark") return darkTheme;
  if (theme === "light") return lightTheme;
  if (theme === "choco") return chocoTheme;
  if (theme === "ocean") return oceanTheme;
  if (theme === "sunset") return sunsetTheme;
  if (theme === "forest") return forestTheme;
  if (theme === "purple") return purpleTheme;
  if (theme === "crimson") return crimsonTheme;
  if (theme === "cyan") return cyanTheme;
  if (theme === "amber") return amberTheme;
  const base = basePreset === "light" ? lightTheme : darkTheme;
  return deepMerge(base, theme) as StudioTheme;
}

/**
 * Convert a full StudioTheme to CSS custom properties for the .modelkit-studio root.
 * Use the returned object as inline style: style={themeToCssVars(theme)}
 */
export function themeToCssVars(theme: StudioTheme): CSSProperties {
  const { colors, fonts, borderRadius, spacing, interactive } = theme;
  return {
    "--mk-font-body": fonts.body,
    "--mk-font-mono": fonts.mono,
    "--mk-color-primary": colors.primary,
    "--mk-color-secondary": colors.secondary,
    "--mk-color-background": colors.background,
    "--mk-color-surface": colors.surface,
    "--mk-color-text": colors.text,
    "--mk-color-text-secondary": colors.textSecondary,
    "--mk-color-border": colors.border,
    "--mk-color-success": colors.success,
    "--mk-color-warning": colors.warning,
    "--mk-color-error": colors.error,
    "--mk-color-primary-hover": interactive.primaryHover,
    "--mk-color-primary-muted": interactive.primaryMuted,
    "--mk-color-surface-hover": interactive.surfaceHover,
    "--mk-color-border-hover": interactive.borderHover,
    "--mk-color-text-hover": interactive.textHover,
    "--mk-border-radius-sm": borderRadius.sm,
    "--mk-border-radius-md": borderRadius.md,
    "--mk-border-radius-lg": borderRadius.lg,
    "--mk-spacing-xs": spacing.xs,
    "--mk-spacing-sm": spacing.sm,
    "--mk-spacing-md": spacing.md,
    "--mk-spacing-lg": spacing.lg,
    "--mk-spacing-xl": spacing.xl,
  } as CSSProperties;
}

export { defaultTheme, darkTheme, lightTheme };
