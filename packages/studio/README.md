# @modelkit/studio

React UI for managing ModelKit overrides.

## Installation

```bash
npm install @modelkit/studio
```

## Quick Start

Set up the backend API first:

```typescript
import { Hono } from "hono";
import { createModelKit, createRedisAdapter, createModelKitRouter } from "modelkit";

const adapter = createRedisAdapter({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

const modelKit = createModelKit(adapter);

const app = new Hono();
app.route("/api/modelkit", createModelKitRouter(modelKit));
```

Then use the Studio UI:

```tsx
import { ModelKitStudio } from "@modelkit/studio";
import "@modelkit/studio/styles";

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

Built-in themes:
```tsx
<ModelKitStudio apiUrl="http://localhost:3000/api/modelkit" theme="dark" />
<ModelKitStudio apiUrl="http://localhost:3000/api/modelkit" theme="light" />
```

Custom theme:
```tsx
<ModelKitStudio
  apiUrl="http://localhost:3000/api/modelkit"
  theme={{
    colors: {
      primary: "#ff00ff",
      background: "#000000"
    }
  }}
/>
```

## Styling

Import the CSS:
```tsx
import "@modelkit/studio/styles";
```

Override classes:
```tsx
<ModelKitStudio
  apiUrl="http://localhost:3000/api/modelkit"
  classNames={{
    container: "max-w-7xl",
    buttonPrimary: "bg-green-500"
  }}
/>
```

## License

MIT
