# @modelkit/studio

**React UI components for ModelKit - manage AI model configurations with live updates**

A beautiful, type-safe React interface for managing [ModelKit](https://www.npmjs.com/package/modelkit) configurations. Features live updates, theme customization, and integration with OpenRouter's model catalog.

## Installation

```bash
npm install @modelkit/studio modelkit react react-dom
# or
bun add @modelkit/studio modelkit react react-dom
```

## Quick Start

```tsx
import { defineConfig, createModelKit } from "modelkit";
import { ModelKitStudio } from "@modelkit/studio";
import "@modelkit/studio/styles";

// Create your ModelKit instance
const config = defineConfig({
  features: {
    chatbot: {
      name: "Customer Support",
      modelId: "anthropic/claude-3.5-sonnet",
      temperature: 0.7,
      maxTokens: 2048
    }
  },
  storage: { type: "redis", url: process.env.REDIS_URL }
});

const modelKit = await createModelKit(config);

// Render the Studio UI
function App() {
  return <ModelKitStudio modelKit={modelKit} theme="dark" />;
}
```

## Features

- 🎨 **Theme Customization** - Light, dark, and custom themes with deep override support
- 🔄 **Live Updates** - Real-time configuration changes via TanStack Query
- 🎯 **Type-safe** - Full TypeScript support with autocomplete
- 🌐 **OpenRouter Integration** - Browse 200+ AI models with metadata
- 🎛️ **Parameter Editor** - Adjust temperature, maxTokens, and more
- 📱 **Responsive** - Works on desktop and mobile
- ♿ **Accessible** - Keyboard navigation and ARIA support
- 🎨 **Customizable** - Override styles with className props

## API Reference

### `<ModelKitStudio />`

Main component for the ModelKit management interface.

```tsx
interface ModelKitStudioProps {
  modelKit: ModelKit;                           // Required: ModelKit instance
  theme?: "light" | "dark" | StudioThemeOverride; // Theme configuration
  themeBase?: "light" | "dark";                 // Base for custom themes
  className?: string;                           // Root container class
  classNames?: ClassNameOverrides;              // Per-component overrides
  queryClient?: QueryClient;                    // Optional TanStack Query client
}
```

### Props

#### `modelKit` (required)

The ModelKit instance to manage. Must be created using `createModelKit()`.

```tsx
import { createModelKit } from "modelkit";

const modelKit = await createModelKit(config);

<ModelKitStudio modelKit={modelKit} />
```

#### `theme` (optional)

Theme mode or custom theme override. Default: `"dark"`

**Preset themes:**
```tsx
<ModelKitStudio modelKit={modelKit} theme="light" />
<ModelKitStudio modelKit={modelKit} theme="dark" />
```

**Custom theme override:**
```tsx
<ModelKitStudio
  modelKit={modelKit}
  theme={{
    colors: {
      primary: "#ff00ff",
      background: "#000000"
    },
    borderRadius: {
      md: "8px"
    }
  }}
/>
```

#### `themeBase` (optional)

Base theme to merge custom overrides onto. Default: `"dark"`

```tsx
<ModelKitStudio
  modelKit={modelKit}
  theme={{ colors: { primary: "#00ff00" } }}
  themeBase="light"  // Merge onto light theme instead of dark
/>
```

#### `className` (optional)

CSS class for the root container.

```tsx
<ModelKitStudio modelKit={modelKit} className="my-custom-class" />
```

#### `classNames` (optional)

Override classes for specific components.

```tsx
<ModelKitStudio
  modelKit={modelKit}
  classNames={{
    container: "max-w-7xl",
    header: "bg-blue-500",
    featureCard: "border-2",
    button: "rounded-full",
    buttonPrimary: "bg-green-500"
  }}
/>
```

**Available className overrides:**
- `container` - Main content container
- `header` - Navigation header
- `featureList` - Feature list container
- `featureCard` - Individual feature cards
- `featureHeader` - Feature detail header
- `defaultBadge` - "Default" badge styling
- `overrideBadge` - "Override" badge styling
- `modelSelector` - Model selector dropdown
- `parameterInput` - Parameter input fields
- `button` - All buttons
- `buttonPrimary` - Primary action buttons
- `buttonSecondary` - Secondary action buttons
- `overrideIndicator` - Override status indicator

#### `queryClient` (optional)

Custom TanStack Query client for advanced use cases (SSR, shared cache).

```tsx
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

<ModelKitStudio modelKit={modelKit} queryClient={queryClient} />
```

## Theme System

### Built-in Themes

#### Dark Theme (Default)

```tsx
<ModelKitStudio modelKit={modelKit} theme="dark" />
```

Modern dark theme with cyan accents, JetBrains Mono font, and zero border radius.

#### Light Theme

```tsx
<ModelKitStudio modelKit={modelKit} theme="light" />
```

Clean light theme with blue accents and a softer color palette.

### Custom Themes

Override any theme property using deep partial syntax:

```tsx
import type { StudioThemeOverride } from "@modelkit/studio";

const customTheme: StudioThemeOverride = {
  colors: {
    primary: "#ff6b6b",
    secondary: "#4ecdc4",
    background: "#1a1a2e",
    surface: "#16213e",
    text: "#ffffff",
    textSecondary: "#a8b2d1",
    border: "#2d3561",
    hover: "#0f3460",
    error: "#ef476f",
    success: "#06ffa5"
  },
  fonts: {
    body: "Inter Variable, sans-serif",
    mono: "Fira Code, monospace"
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px"
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px"
  },
  interactive: {
    primaryHover: "#ff5252",
    surfaceHover: "#1e2a4a"
  }
};

<ModelKitStudio modelKit={modelKit} theme={customTheme} />
```

### Partial Theme Overrides

Only override specific properties:

```tsx
// Just change colors
<ModelKitStudio
  modelKit={modelKit}
  theme={{
    colors: {
      primary: "#00f5ff",
      background: "#0a0a0a"
    }
  }}
/>

// Just change border radius
<ModelKitStudio
  modelKit={modelKit}
  theme={{
    borderRadius: {
      sm: "8px",
      md: "12px",
      lg: "16px"
    }
  }}
/>
```

### Theme Type Reference

```typescript
interface StudioTheme {
  colors: {
    primary: string;          // Primary accent color
    secondary: string;        // Secondary accent
    background: string;       // Page background
    surface: string;          // Card/panel background
    text: string;             // Primary text color
    textSecondary: string;    // Muted text color
    border: string;           // Border color
    hover: string;            // Hover state background
    error: string;            // Error/danger color
    success: string;          // Success color
  };
  fonts: {
    body: string;             // Main font family
    mono: string;             // Monospace font
  };
  borderRadius: {
    sm: string;               // Small radius (badges, pills)
    md: string;               // Medium radius (buttons, inputs)
    lg: string;               // Large radius (cards, panels)
  };
  spacing: {
    xs: string;               // Extra small (4px)
    sm: string;               // Small (8px)
    md: string;               // Medium (16px)
    lg: string;               // Large (24px)
    xl: string;               // Extra large (32px)
  };
  interactive: {
    primaryHover: string;     // Primary button hover
    surfaceHover: string;     // Surface hover color
  };
}

type StudioThemeOverride = DeepPartial<StudioTheme>;
```

## Styling

### Import Styles

**Required:** Import the CSS file in your application:

```tsx
import "@modelkit/studio/styles";
```

### Tailwind Integration

ModelKit Studio uses Tailwind CSS internally. If you're using Tailwind in your app, the styles will work seamlessly. The component uses scoped CSS variables (`--mk-*`) to avoid conflicts.

### Custom Fonts

The default theme includes Inter Variable and JetBrains Mono. These are bundled with the package and loaded automatically.

To use custom fonts:

```tsx
<ModelKitStudio
  modelKit={modelKit}
  theme={{
    fonts: {
      body: "Your Custom Font, sans-serif",
      mono: "Your Mono Font, monospace"
    }
  }}
/>
```

## Components

The Studio includes several internal components that work together:

- **Navigation** - Header with back button and title
- **FeatureList** - Grid of all configured features
- **FeatureCard** - Individual feature card with override indicator
- **FeatureDetail** - Detailed view for editing a feature
- **ModelSelector** - Searchable dropdown with 200+ models from OpenRouter
- **ParameterEditor** - Temperature and maxTokens inputs
- **OverrideIndicator** - Shows default vs override status

All components are internal and not exported individually. Use `<ModelKitStudio />` as the main entry point.

## OpenRouter Integration

The model selector fetches live model data from OpenRouter's API, including:

- Model ID and display name
- Provider (Anthropic, OpenAI, Google, etc.)
- Context length
- Pricing information

Models are grouped by provider and searchable by ID, name, or provider.

**Note:** OpenRouter integration requires an active internet connection. The selector gracefully handles API failures and allows custom model IDs.

## Advanced Usage

### Server-Side Rendering (SSR)

For Next.js or other SSR frameworks:

```tsx
"use client";

import { ModelKitStudio } from "@modelkit/studio";
import "@modelkit/studio/styles";

export default function ModelKitPage() {
  // Create modelKit in a client component
  const [modelKit, setModelKit] = useState<ModelKit | null>(null);

  useEffect(() => {
    createModelKit(config).then(setModelKit);
  }, []);

  if (!modelKit) return <div>Loading...</div>;

  return <ModelKitStudio modelKit={modelKit} />;
}
```

### Multiple Instances

You can render multiple Studio instances with different ModelKit configurations:

```tsx
function App() {
  return (
    <>
      <ModelKitStudio modelKit={prodModelKit} theme="dark" />
      <ModelKitStudio modelKit={devModelKit} theme="light" />
    </>
  );
}
```

### Embedding in Existing Apps

Studio works within any React application:

```tsx
function AdminPanel() {
  return (
    <div className="admin-panel">
      <Sidebar />
      <main>
        <h1>AI Model Configuration</h1>
        <ModelKitStudio modelKit={modelKit} className="mt-4" />
      </main>
    </div>
  );
}
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  ModelKitStudioProps,
  ThemeMode,
  ClassNameOverrides,
  StudioTheme,
  StudioThemeOverride
} from "@modelkit/studio";
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- React 18+ or React 19+

## Peer Dependencies

- `react`: ^18.0.0 || ^19.0.0
- `react-dom`: ^18.0.0 || ^19.0.0
- `modelkit`: ^0.1.0

## Examples

### Basic Setup

```tsx
import { createModelKit, defineConfig } from "modelkit";
import { ModelKitStudio } from "@modelkit/studio";
import "@modelkit/studio/styles";

const config = defineConfig({
  features: {
    chatbot: {
      name: "Chatbot",
      modelId: "anthropic/claude-3.5-sonnet",
      temperature: 0.7
    }
  },
  storage: { type: "memory" }
});

const modelKit = await createModelKit(config);

export default function App() {
  return <ModelKitStudio modelKit={modelKit} />;
}
```

### Custom Theme

```tsx
<ModelKitStudio
  modelKit={modelKit}
  theme={{
    colors: {
      primary: "#00ff88",
      background: "#000000",
      surface: "#111111"
    },
    borderRadius: {
      sm: "4px",
      md: "8px",
      lg: "12px"
    }
  }}
  themeBase="dark"
/>
```

### Custom Styles

```tsx
<ModelKitStudio
  modelKit={modelKit}
  className="max-w-6xl mx-auto"
  classNames={{
    header: "bg-gradient-to-r from-purple-500 to-pink-500",
    buttonPrimary: "bg-green-500 hover:bg-green-600",
    featureCard: "border-2 border-blue-500"
  }}
/>
```

## Related Packages

- [modelkit](https://www.npmjs.com/package/modelkit) - Core SDK

## License

MIT © [Benaiah](https://github.com/benaiah)
