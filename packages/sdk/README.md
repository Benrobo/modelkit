# modelkit

Type-safe AI model configuration with runtime overrides.

## Installation

```bash
npm install @benrobo/modelkit
```

## Quick Start

```typescript
import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";

const adapter = createRedisAdapter({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

const modelKit = createModelKit(adapter);

const modelId = await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");

await modelKit.setOverride("chatbot", {
  modelId: "anthropic/claude-opus-4",
  temperature: 0.9
});
```

## Type Generation

Generate TypeScript types from your ModelKit API for compile-time type safety:

```bash
# Start your backend with ModelKit REST API, then generate types
npx modelkit-generate --api-url http://localhost:3000/api/modelkit

# Custom output path
npx modelkit-generate --api-url http://localhost:3000/api/modelkit --output src/types/modelkit.ts
```

This fetches all features from your running ModelKit API and generates a TypeScript file:

```typescript
// src/modelkit.generated.ts (auto-generated)
export type FeatureId =
  | "chatbot"
  | "content.generate"
  | "swot.analysis";

// ... plus dynamic usage examples with your actual feature IDs and models
```

**Use the generated types:**

```typescript
import type { FeatureId } from "./modelkit.generated";
import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";

const adapter = createRedisAdapter<FeatureId>({ url: "..." });
const modelKit = createModelKit<FeatureId>(adapter);

// ✅ TypeScript autocomplete works!
await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");

// ❌ Compile-time error for invalid feature IDs
await modelKit.getModel("invalid", "gpt-4");
// Error: Argument of type '"invalid"' is not assignable to parameter of type 'FeatureId'
```

**Workflow (similar to Prisma):**

Add to your `package.json` scripts:

```json
{
  "scripts": {
    "generate": "modelkit-generate --api-url http://localhost:3000/api/modelkit",
    "build": "npm run generate && tsc",
    "dev": "npm run generate && next dev"
  }
}
```

Then run `npm run generate` after adding new features to regenerate types.

## REST API

ModelKit provides ready-to-use routers for Hono and Express to expose your configuration as a REST API.

### Hono Router

```typescript
import { Hono } from "hono";
import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";
import { createModelKitHonoRouter } from "@benrobo/modelkit/hono";

const app = new Hono();
const adapter = createRedisAdapter({ url: process.env.REDIS_URL });
const modelKit = createModelKit(adapter);

app.route("/api/modelkit", createModelKitHonoRouter(modelKit, {
  cors: true // optional CORS configuration
}));

export default app;
```

### Express Router

```typescript
import express from "express";
import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";
import { createModelKitExpressRouter } from "@benrobo/modelkit/express";

const app = express();
app.use(express.json());

const adapter = createRedisAdapter({ url: process.env.REDIS_URL });
const modelKit = createModelKit(adapter);

app.use("/api/modelkit", createModelKitExpressRouter(modelKit));

app.listen(3000);
```

The routers expose these endpoints:
- `GET /overrides` - List all overrides
- `GET /overrides/:featureId` - Get specific override
- `POST /overrides/:featureId` - Set override
- `DELETE /overrides/:featureId` - Clear override

## API

### `createRedisAdapter(options)`

```typescript
const adapter = createRedisAdapter({
  url: "redis://localhost:6379",
  prefix: "modelkit:" // optional
});
```

### `createModelKit(adapter, options?)`

```typescript
const modelKit = createModelKit(adapter, {
  cacheTTL: 60000, // optional, default 60s
  debug: false // optional, enable debug logging
});
```

### `getModel(featureId, fallbackModel)`

Returns Redis override if exists, otherwise returns fallback model.

```typescript
const modelId = await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");
```

Model IDs are strictly typed (340+ OpenRouter models). For custom models, use type assertion:

```typescript
const modelId = await modelKit.getModel("chatbot", "my-model" as ModelId);
```

### `setOverride(featureId, override)`

```typescript
await modelKit.setOverride("chatbot", {
  modelId: "anthropic/claude-opus-4",
  temperature: 0.9,
  maxTokens: 4096
});
```

### `getConfig(featureId)`

```typescript
const override = await modelKit.getConfig("chatbot");
```

### `clearOverride(featureId)`

```typescript
await modelKit.clearOverride("chatbot");
```

### `listOverrides()`

```typescript
const overrides = await modelKit.listOverrides();
```

## Debug Logging

Enable debug mode to see detailed logs of model lookups and cache hits:

```typescript
const modelKit = createModelKit(adapter, { debug: true });

await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");
// [modelkit] [chatbot] Using fallback model: anthropic/claude-3.5-sonnet

await modelKit.setOverride("chatbot", { modelId: "anthropic/claude-opus-4" });
// [modelkit] [chatbot] Setting override: { modelId: 'anthropic/claude-opus-4' }

await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");
// [modelkit] [chatbot] Using override model: anthropic/claude-opus-4

await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");
// [modelkit] [chatbot] Using cached model: anthropic/claude-opus-4
```

## Custom Storage Adapter

```typescript
import type { StorageAdapter, ModelOverride } from "@benrobo/modelkit";

function createMyAdapter(): StorageAdapter {
  return {
    async get(featureId): Promise<ModelOverride | null> { },
    async set(featureId, override): Promise<void> { },
    async delete(featureId): Promise<void> { },
    async list(): Promise<Array<{ featureId: string; override: ModelOverride }>> { }
  };
}

const modelKit = createModelKit(createMyAdapter());
```

## Types

```typescript
interface ModelOverride {
  modelId: ModelId;      // required
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  updatedAt?: number;    // auto-set
}
```

## License

MIT
