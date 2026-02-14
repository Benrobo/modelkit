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
  cacheTTL: 60000 // optional, default 60s
});
```

### `getModel(featureId, fallbackModel)`

```typescript
const modelId = await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");
```

Returns Redis override if exists, otherwise returns fallback model.

Model IDs are strictly typed (340+ OpenRouter models). For custom models:

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
// { modelId: "...", temperature: 0.9, updatedAt: 1234567890 } | null
```

### `clearOverride(featureId)`

```typescript
await modelKit.clearOverride("chatbot");
```

### `listOverrides()`

```typescript
const overrides = await modelKit.listOverrides();
// [{ featureId: "...", override: { ... } }]
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
