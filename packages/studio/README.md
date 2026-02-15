# @benrobo/modelkit-studio

React UI for managing ModelKit overrides.

## Preview

![ModelKit Studio](../../screenshots/prev-3.png)

Feature list and override editor with multiple themes (dark, forest, purple, and more).

## Installation

```bash
npm install @benrobo/modelkit-studio
```

## Quick Start

Set up the backend API first:

```typescript
import { Hono } from "hono";
import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";
import { createModelKitHonoRouter } from "@benrobo/modelkit/hono";

const adapter = createRedisAdapter({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

const modelKit = createModelKit(adapter);

const app = new Hono();
app.route("/api/modelkit", createModelKitHonoRouter(modelKit));
```

Then use the Studio UI (you must import the styles for the component to display correctly):

```tsx
import { ModelKitStudio } from "@benrobo/modelkit-studio";
import "@benrobo/modelkit-studio/styles";

<ModelKitStudio apiUrl="http://localhost:3000/api/modelkit" theme="dark" />
```

## Props

```tsx
interface ModelKitStudioProps {
  apiUrl: string;
  theme?: "light" | "dark" | StudioThemeOverride;
  themeBase?: "light" | "dark";
  className?: string;
  classNames?: ClassNameOverrides;
  queryClient?: QueryClient;
}
```

## Themes

### Built-in Themes

ModelKit Studio includes 10 preset themes. You can use them by importing and passing the theme object:

```tsx
import {
  ModelKitStudio,
  darkTheme,
  lightTheme,
  chocoTheme,
  oceanTheme,
  sunsetTheme,
  forestTheme,
  purpleTheme,
  crimsonTheme,
  cyanTheme,
  amberTheme,
} from "@benrobo/modelkit-studio";

// Use a preset theme
<ModelKitStudio apiUrl="http://localhost:3000/api/modelkit" theme={chocoTheme} />
<ModelKitStudio apiUrl="http://localhost:3000/api/modelkit" theme={oceanTheme} />
<ModelKitStudio apiUrl="http://localhost:3000/api/modelkit" theme={darkTheme} />
```

**Available preset themes:**

- `darkTheme` - Tactical dark theme with cyan accents (default)
- `lightTheme` - Clean light theme
- `chocoTheme` - Warm chocolate/coffee theme with rounded corners
- `oceanTheme` - Deep blue ocean theme
- `sunsetTheme` - Orange and brown sunset theme
- `forestTheme` - Green forest theme
- `purpleTheme` - Purple/violet theme
- `crimsonTheme` - Red/pink crimson theme
- `cyanTheme` - Bright cyan/teal theme
- `amberTheme` - Golden amber/yellow theme

### Custom Theme with Type-Safe Autocomplete

**Important:** To get TypeScript autocomplete for custom themes, define the theme object separately with an explicit type annotation:

```tsx
import {
  ModelKitStudio,
  type StudioThemeOverride,
} from "@benrobo/modelkit-studio";

// Define custom theme
const customTheme: StudioThemeOverride = {
  colors: {
    primary: "#ff00ff",
    background: "#000000",
    text: "#ffffff",
  },
  fonts: {
    body: "Inter, sans-serif",
    mono: "Fira Code, monospace",
  },
  spacing: {
    md: "20px",
  },
  interactive: {
    primaryHover: "rgba(255, 0, 255, 0.8)",
  },
};

<ModelKitStudio
  apiUrl="http://localhost:3000/api/modelkit"
  theme={customTheme}
/>;
```

### Available Theme Properties

```typescript
interface StudioThemeOverride {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    surface?: string;
    text?: string;
    textSecondary?: string;
    border?: string;
    success?: string;
    warning?: string;
    error?: string;
  };
  fonts?: {
    body?: string;
    mono?: string;
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  spacing?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  interactive?: {
    primaryHover?: string;
    primaryMuted?: string;
    surfaceHover?: string;
    borderHover?: string;
    textHover?: string;
  };
}
```

All properties are optional - only override what you need. Unspecified values will use the default theme.

## Styling

Import the package CSS once (e.g. in your root layout or main entry):

```tsx
import "@benrobo/modelkit-studio/styles";
```

Studio uses Tailwind with the `mk:` prefix, so its classes won’t conflict with your app’s Tailwind.

Override classes:

```tsx
<ModelKitStudio
  apiUrl="http://localhost:3000/api/modelkit"
  classNames={{
    container: "max-w-7xl",
    buttonPrimary: "bg-green-500",
  }}
/>
```

## License

MIT
