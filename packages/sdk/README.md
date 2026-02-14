# modelkit

Type-safe AI model configuration with runtime overrides.

## Installation

```bash
npm install modelkit
```

## Quick Start

```typescript
import { createModelKit, createRedisAdapter } from "modelkit";

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

## REST API

ModelKit provides ready-to-use routers for Hono and Express to expose your configuration as a REST API.

### Hono Router

```typescript
import { Hono } from "hono";
import { createModelKit, createRedisAdapter, createModelKitRouter } from "modelkit";

const app = new Hono();
const adapter = createRedisAdapter({ url: process.env.REDIS_URL });
const modelKit = createModelKit(adapter);

app.route("/api/modelkit", createModelKitRouter(modelKit, {
  cors: true // optional CORS configuration
}));

export default app;
```

### Express Router

```typescript
import express from "express";
import { createModelKit, createRedisAdapter, createModelKitExpressRouter } from "modelkit";

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
import type { StorageAdapter, ModelOverride } from "modelkit";

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
