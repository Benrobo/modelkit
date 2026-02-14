# ModelKit Studio Theming Guide

Complete guide to understanding and customizing ModelKit Studio themes.

## Table of Contents

- [Theme Structure](#theme-structure)
- [CSS Variable Mapping](#css-variable-mapping)
- [Available Themes](#available-themes)
- [Creating Custom Themes](#creating-custom-themes)
- [Component Usage](#component-usage)

## Theme Structure

Each theme in ModelKit Studio follows this TypeScript interface:

```typescript
interface StudioTheme {
  colors: {
    primary: string;        // Main accent color - buttons, links, active states
    secondary: string;      // Secondary accent color
    background: string;     // Main page background
    surface: string;        // Cards, panels, modals, headers, sidebar
    text: string;           // Primary text color
    textSecondary: string;  // Labels, muted text, placeholders
    border: string;         // All borders and dividers
    success: string;        // Success states and messages
    warning: string;        // Warning states and messages
    error: string;          // Error states and messages
  };

  fonts: {
    body: string;           // Body font family
    mono: string;           // Monospace font family
  };

  borderRadius: {
    sm: string;             // Small border radius
    md: string;             // Medium border radius
    lg: string;             // Large border radius
  };

  spacing: {
    xs: string;             // Extra small spacing (4px default)
    sm: string;             // Small spacing (8px default)
    md: string;             // Medium spacing (16px default)
    lg: string;             // Large spacing (24px default)
    xl: string;             // Extra large spacing (32px default)
  };

  interactive: {
    primaryHover: string;   // Hover state for primary elements
    primaryMuted: string;   // Subtle primary background (10% opacity)
    surfaceHover: string;   // Surface hover state (lists, dropdowns)
    borderHover: string;    // Border hover state
    textHover: string;      // Text hover state
  };
}
```

## CSS Variable Mapping

Theme properties are converted to CSS variables that components use:

### Colors

| Theme Property | CSS Variable | Used For |
|---|---|---|
| `colors.primary` | `--mk-color-primary` | Primary buttons, active states, links, accents |
| `colors.secondary` | `--mk-color-secondary` | Secondary buttons and accents |
| `colors.background` | `--mk-color-background` | Main page background, input fields (`bg-mk-background`) |
| `colors.surface` | `--mk-color-surface` | Modals, cards, panels, headers, sidebar (`bg-mk-surface`) |
| `colors.text` | `--mk-color-text` | Main body text, headings (`text-mk-text`) |
| `colors.textSecondary` | `--mk-color-text-secondary` | Labels, muted text (`text-mk-text-secondary`) |
| `colors.border` | `--mk-color-border` | Borders and dividers (`border-mk-border`) |
| `colors.success` | `--mk-color-success` | Success messages and states |
| `colors.warning` | `--mk-color-warning` | Warning messages and states |
| `colors.error` | `--mk-color-error` | Error messages and states |

### Interactive States

| Theme Property | CSS Variable | Used For |
|---|---|---|
| `interactive.primaryHover` | `--mk-color-primary-hover` | Primary button hover backgrounds |
| `interactive.primaryMuted` | `--mk-color-primary-muted` | Subtle primary backgrounds (selected items) |
| `interactive.surfaceHover` | `--mk-color-surface-hover` | Hover state for list items, dropdown items |
| `interactive.borderHover` | `--mk-color-border-hover` | Border hover states |
| `interactive.textHover` | `--mk-color-text-hover` | Text hover states |

### Fonts

| Theme Property | CSS Variable |
|---|---|
| `fonts.body` | `--mk-font-body` |
| `fonts.mono` | `--mk-font-mono` |

### Border Radius

| Theme Property | CSS Variable |
|---|---|
| `borderRadius.sm` | `--mk-border-radius-sm` |
| `borderRadius.md` | `--mk-border-radius-md` |
| `borderRadius.lg` | `--mk-border-radius-lg` |

### Spacing

| Theme Property | CSS Variable |
|---|---|
| `spacing.xs` | `--mk-spacing-xs` |
| `spacing.sm` | `--mk-spacing-sm` |
| `spacing.md` | `--mk-spacing-md` |
| `spacing.lg` | `--mk-spacing-lg` |
| `spacing.xl` | `--mk-spacing-xl` |

## Available Themes

ModelKit Studio includes 10 preset themes:

### Dark Theme (Default)
Tactical dark theme with cyan accents and sharp corners.
```typescript
theme="dark"
```

### Light Theme
Clean light theme with blue accents.
```typescript
theme="light"
```

### Choco Theme
Warm chocolate/coffee theme with rounded corners and light background.
```typescript
theme="choco"
```
- Background: `#f9f4f2` (light cream)
- Surface: `#ffffff` (white)
- Primary: `#b65c45` (choco brown)
- Border Radius: 4-8px (rounded)

### Ocean Theme
Deep blue ocean theme with sharp corners.
```typescript
theme="ocean"
```
- Background: `#0e2d52` (deep blue)
- Primary: `#3770fe` (bright blue)

### Sunset Theme
Orange and brown sunset theme.
```typescript
theme="sunset"
```
- Background: `#331e14` (dark brown)
- Primary: `#ff5518` (bright orange)

### Forest Theme
Green forest theme.
```typescript
theme="forest"
```
- Background: `#0a1f0f` (dark green)
- Primary: `#22C55E` (bright green)

### Purple Theme
Purple/violet theme.
```typescript
theme="purple"
```
- Background: `#1a0a2e` (dark purple)
- Primary: `#8f63f3` (bright purple)

### Crimson Theme
Red/pink crimson theme.
```typescript
theme="crimson"
```
- Background: `#1a0a0f` (dark)
- Primary: `#E4295D` (crimson red)

### Cyan Theme
Bright cyan/teal theme.
```typescript
theme="cyan"
```
- Background: `#0a1a1a` (dark teal)
- Primary: `#00ffff` (bright cyan)

### Amber Theme
Golden amber/yellow theme.
```typescript
theme="amber"
```
- Background: `#1a1408` (dark)
- Primary: `#F59E0B` (golden amber)

## Creating Custom Themes

### Method 1: Using Preset Themes

```tsx
import { ModelKitStudio } from "@benrobo/modelkit-studio";

<ModelKitStudio apiUrl={apiUrl} theme="choco" />
```

### Method 2: Import Theme Objects

```tsx
import { ModelKitStudio, oceanTheme, chocoTheme } from "@benrobo/modelkit-studio";

<ModelKitStudio apiUrl={apiUrl} theme={oceanTheme} />
```

### Method 3: Custom Theme Override (Type-Safe)

**IMPORTANT**: Define the theme object separately with an explicit type annotation for TypeScript autocomplete:

```tsx
import { ModelKitStudio, type StudioThemeOverride } from "@benrobo/modelkit-studio";

// Define custom theme with type-safe autocomplete
const customTheme: StudioThemeOverride = {
  colors: {
    primary: "#ff00ff",
    background: "#000000",
    surface: "#1a1a1a",
    text: "#ffffff",
    border: "#444444",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
  interactive: {
    primaryHover: "#ff33ff",
    surfaceHover: "#252525",
  },
};

<ModelKitStudio apiUrl={apiUrl} theme={customTheme} />
```

**All properties are optional** - only override what you need. Unspecified values use the default theme.

### Method 4: Full Custom Theme

```tsx
import { type StudioTheme } from "@benrobo/modelkit-studio";

const myTheme: StudioTheme = {
  colors: {
    primary: "#ff6b35",
    secondary: "#004e89",
    background: "#f5f5f5",
    surface: "#ffffff",
    text: "#1a1a1a",
    textSecondary: "#666666",
    border: "#dddddd",
    success: "#00c896",
    warning: "#ffa500",
    error: "#ff4444",
  },
  fonts: {
    body: "Inter, sans-serif",
    mono: "Fira Code, monospace",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  interactive: {
    primaryHover: "#ff8555",
    primaryMuted: "rgba(255, 107, 53, 0.1)",
    surfaceHover: "#f9f9f9",
    borderHover: "#ff6b35",
    textHover: "#000000",
  },
};

<ModelKitStudio apiUrl={apiUrl} theme={myTheme} />
```

## Component Usage

Components use Tailwind utility classes that map to the CSS variables:

### Background Classes

```tsx
// Main page background
className="bg-mk-background"

// Cards, panels, modals, headers
className="bg-mk-surface"

// Hover states
className="hover:bg-mk-surface-hover"
```

### Text Classes

```tsx
// Primary text
className="text-mk-text"

// Secondary/muted text
className="text-mk-text-secondary"

// Hover states
className="hover:text-mk-primary"
```

### Border Classes

```tsx
// Default borders
className="border-mk-border"

// Hover states
className="hover:border-mk-primary"
```

### Button Classes

```tsx
// Primary button
className="bg-mk-primary text-mk-background hover:bg-mk-primary/90"

// Secondary button
className="border border-mk-border text-mk-text hover:bg-mk-surface-hover"
```

### Complete Example

```tsx
<button className="
  px-4 py-2
  bg-mk-primary
  text-mk-background
  border border-mk-border
  hover:bg-mk-primary/90
  hover:border-mk-primary
  transition-colors
">
  Click Me
</button>
```

## Design Guidelines

### Light vs Dark Themes

**Dark Themes** (dark, ocean, sunset, forest, purple, crimson, cyan, amber):
- `background`: Very dark color (#0a0a0a - #2d2d2d range)
- `surface`: Slightly lighter than background (#1a1a1a - #3d3d3d range)
- `text`: Light color (#e0e0e0 - #ffffff range)
- `borderRadius`: Usually `0` (sharp corners) for tactical feel

**Light Themes** (light, choco):
- `background`: Very light color (#f0f0f0 - #ffffff range)
- `surface`: White or very light (#ffffff - #fafafa range)
- `text`: Dark color (#1a1a1a - #535151 range)
- `borderRadius`: Can be rounded (4-12px) for softer feel

### Color Contrast

Ensure sufficient contrast between:
- `text` and `background` (minimum 4.5:1 ratio)
- `text` and `surface` (minimum 4.5:1 ratio)
- `primary` and `background` (for buttons)

### Interactive States

- `primaryHover` should be slightly different from `primary` (lighter or darker)
- `surfaceHover` should be subtly different from `surface`
- `borderHover` often matches `primary` for consistency

## TypeScript Autocomplete

To get full TypeScript autocomplete when creating custom themes:

1. **Always import the type**: `import { type StudioThemeOverride } from "@benrobo/modelkit-studio"`
2. **Define theme separately**: Don't define inline in JSX
3. **Use explicit type annotation**: `const myTheme: StudioThemeOverride = { ... }`

**This works** ✅:
```tsx
const customTheme: StudioThemeOverride = {
  colors: { /* autocomplete works here! */ }
};
<ModelKitStudio theme={customTheme} />
```

**This doesn't work** ❌:
```tsx
<ModelKitStudio theme={{ colors: { /* no autocomplete */ } }} />
```

## Exporting Custom Themes

Export your custom themes from a dedicated file:

```typescript
// themes.ts
import { type StudioTheme } from "@benrobo/modelkit-studio";

export const corporateTheme: StudioTheme = {
  // ... theme definition
};

export const marketingTheme: StudioTheme = {
  // ... theme definition
};
```

Then use them:

```tsx
import { corporateTheme } from "./themes";
<ModelKitStudio apiUrl={apiUrl} theme={corporateTheme} />
```

## Troubleshooting

### Theme not applying
- Ensure you've imported `@benrobo/modelkit-studio/styles`
- Check that CSS variables are being set on `.modelkit-studio` root element
- Verify theme object structure matches `StudioTheme` or `StudioThemeOverride` type

### TypeScript autocomplete not working
- Define theme object separately with explicit type annotation
- Make sure you're importing the type: `type StudioThemeOverride`
- Restart TypeScript server in your IDE

### Colors look wrong
- Check contrast ratios between `text` and `background`/`surface`
- Ensure `primary` color has sufficient contrast with `background`
- Verify hex color format includes `#` prefix

## Additional Resources

- [Main README](./README.md) - Installation and quick start
- [Theme Source Files](./src/themes/) - Browse preset theme implementations
- [Component Examples](./src/components/) - See how components use theme variables
