# modelkit

**Type-safe AI model configuration management with runtime overrides**

Core SDK for managing AI model configurations with zero-downtime updates. Switch models, adjust parameters, and manage configurations without application restarts.

## Installation

```bash
npm install modelkit
# or
bun add modelkit
```

## Quick Start

```typescript
import { createModelKit, createRedisAdapter } from "modelkit";

// Create a storage adapter
const adapter = createRedisAdapter({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  prefix: "modelkit:" // Optional: customize key prefix
});

// Create ModelKit instance
const modelKit = createModelKit(adapter, {
  cacheTTL: 60000 // Optional: cache in memory for 60s (default)
});

// Get model ID - ALWAYS provide fallback for reliability
// Model IDs are strictly typed - autocomplete shows 340+ OpenRouter models
const modelId = await modelKit.getModel(
  "chatbot",
  "anthropic/claude-3.5-sonnet" // Type-safe! Autocomplete available
);
// Priority: Redis override → fallbackModel

// For custom/private models, use type assertion:
// const modelId = await modelKit.getModel("chatbot", "my-custom-model" as ModelId);

// Get current override configuration
const override = await modelKit.getConfig("chatbot");
// Returns: ModelOverride | null

// Set runtime override (no restart needed!)
await modelKit.setOverride("chatbot", {
  modelId: "anthropic/claude-3.5-sonnet-20250129",
  temperature: 0.9,
  maxTokens: 2048
});
```

## API Reference

### `createRedisAdapter(options)`

Creates a Redis storage adapter for ModelKit.

```typescript
import { createRedisAdapter } from "modelkit";

const adapter = createRedisAdapter({
  url: "redis://localhost:6379",
  prefix: "modelkit:overrides:" // Optional, default: "modelkit:overrides:"
});
```

**Options:**
- `url` (string, required): Redis connection URL
- `prefix` (string, optional): Key prefix for Redis keys. Default: `"modelkit:overrides:"`

**Returns:** `StorageAdapter`

### `createModelKit(adapter, options?)`

Creates a ModelKit instance with the specified storage adapter.

```typescript
import { createModelKit } from "modelkit";

const modelKit = createModelKit(adapter, {
  cacheTTL: 60000 // Optional: in-memory cache duration in ms
});
```

**Parameters:**
- `adapter` (StorageAdapter, required): Storage adapter instance
- `options` (object, optional):
  - `cacheTTL` (number): Cache TTL in milliseconds for in-memory caching. Default: 60000 (1 minute)

**Returns:** `ModelKit`

### ModelKit Instance Methods

#### `getModel(featureId: string, fallbackModel: ModelId): Promise<ModelId>`

Get the current model ID for a feature. **Always requires a fallback model.**

**Priority:** Redis override → fallbackModel

```typescript
const modelId = await modelKit.getModel(
  "chatbot",
  "anthropic/claude-3.5-sonnet" // Required fallback
);
// Returns override from Redis, or fallbackModel if no override exists or Redis is down
```

**Type Safety:** Model IDs are strictly typed with autocomplete for 340+ OpenRouter models. Invalid model IDs will cause TypeScript errors.

For custom/private models, use type assertion:
```typescript
const modelId = await modelKit.getModel(
  "chatbot",
  "my-custom-model" as ModelId // Type assertion for custom models
);
```

#### `getConfig(featureId: string): Promise<ModelOverride | null>`

Get the current override configuration from Redis. Returns `null` if no override exists.

```typescript
const override = await modelKit.getConfig("chatbot");
// {
//   modelId: "anthropic/claude-3.5-sonnet-20250129",
//   temperature: 0.9,
//   maxTokens: 2048,
//   updatedAt: 1707912345
// } | null
```

#### `setOverride(featureId: string, override: ModelOverride): Promise<void>`

Set runtime overrides for a feature in Redis. Changes take effect immediately.

```typescript
await modelKit.setOverride("chatbot", {
  modelId: "anthropic/claude-3.5-sonnet-20250129",
  temperature: 0.9,
  maxTokens: 4096
});
```

**ModelOverride:**
```typescript
interface ModelOverride {
  modelId: ModelId;      // Required: AI model identifier (type-safe)
  temperature?: number;  // Optional: 0-2
  maxTokens?: number;    // Optional: max tokens
  topP?: number;         // Optional: nucleus sampling
  topK?: number;         // Optional: top-k sampling
  updatedAt?: number;    // Auto-set by adapter
}
```

#### `clearOverride(featureId: string): Promise<void>`

Remove all overrides for a feature, reverting to base configuration.

```typescript
await modelKit.clearOverride("chatbot");
```

#### `listOverrides(): Promise<Array<{ featureId: string; override: ModelOverride }>>`

List all active overrides across all features.

```typescript
const overrides = await modelKit.listOverrides();
// [
//   {
//     featureId: "chatbot",
//     override: {
//       modelId: "anthropic/claude-3.5-sonnet-20250129",
//       temperature: 0.9,
//       updatedAt: 1707912345
//     }
//   }
// ]
```

## Custom Storage Adapters

You can create your own storage adapter by implementing the `StorageAdapter` interface:

```typescript
import type { StorageAdapter, ModelOverride } from "modelkit";

function createMyCustomAdapter(): StorageAdapter {
  return {
    async get(featureId: string): Promise<ModelOverride | null> {
      // Your custom logic to retrieve override
      return null;
    },

    async set(featureId: string, override: ModelOverride): Promise<void> {
      // Your custom logic to save override
    },

    async delete(featureId: string): Promise<void> {
      // Your custom logic to delete override
    },

    async list(): Promise<Array<{ featureId: string; override: ModelOverride }>> {
      // Your custom logic to list all overrides
      return [];
    }
  };
}

// Use your custom adapter
const modelKit = createModelKit(createMyCustomAdapter());
  storage: {
    type: "redis",
    url: "redis://localhost:6379",
    keyPrefix: "modelkit:overrides:",  // default prefix
    ttl: 60                             // cache TTL in seconds
  }
});
```

**Features:**
- Persistent storage across application restarts
- Shared configuration across multiple instances
- Automatic reconnection on connection loss
- Supports Redis URLs with authentication: `redis://user:pass@host:port`

### Memory Storage (Development)

In-memory storage using node-cache. Ideal for development and testing.

```typescript
const config = defineConfig({
  features: { /* ... */ },
  storage: {
    type: "memory",
    ttl: 0  // 0 = no expiry
  }
});
```

**Features:**
- Fast, no external dependencies
- Automatic cleanup with configurable TTL
- Perfect for local development
- Data lost on application restart

### Custom Storage Adapter

Implement your own storage backend by providing a custom adapter.

```typescript
import type { StorageAdapter, ModelOverride } from "modelkit";

class MyStorageAdapter implements StorageAdapter {
  async get(featureId: string): Promise<ModelOverride | null> {
    // Your implementation
  }

  async set(featureId: string, override: ModelOverride): Promise<void> {
    // Your implementation
  }

  async delete(featureId: string): Promise<void> {
    // Your implementation
  }

  async list(): Promise<Array<{ featureId: string; override: ModelOverride }>> {
    // Your implementation
  }
}

const config = defineConfig({
  features: { /* ... */ },
  storage: {
    type: "custom",
    adapter: new MyStorageAdapter()
  }
});
```

## Caching

ModelKit implements a two-tier caching strategy:

1. **In-memory cache** (default 60s TTL)
   - Reduces Redis roundtrips
   - Configurable TTL via `storage.ttl`
   - Automatically invalidated on override changes

2. **Graceful fallback**
   - If Redis is unavailable, falls back to static config
   - Ensures zero-downtime even during Redis outages
   - Logs warnings when fallback occurs

```typescript
// Custom cache TTL
const config = defineConfig({
  features: { /* ... */ },
  storage: {
    type: "redis",
    url: process.env.REDIS_URL,
    ttl: 120  // 2-minute cache
  }
});
```

## Best Practices

### 1. Environment-based Configuration

```typescript
const config = defineConfig({
  features: {
    chatbot: {
      modelId: process.env.NODE_ENV === "production"
        ? "anthropic/claude-3.5-sonnet"
        : "anthropic/claude-3-haiku",
      temperature: 0.7
    }
  },
  storage: {
    type: process.env.NODE_ENV === "production" ? "redis" : "memory",
    url: process.env.REDIS_URL
  }
});
```

### 2. Feature Organization

Group related features logically:

```typescript
const config = defineConfig({
  features: {
    // Customer-facing features
    "chat.support": { modelId: "anthropic/claude-3.5-sonnet", temperature: 0.7 },
    "chat.sales": { modelId: "anthropic/claude-3.5-sonnet", temperature: 0.8 },

    // Internal features
    "internal.summarizer": { modelId: "openai/gpt-4-turbo", temperature: 0.3 },
    "internal.classifier": { modelId: "openai/gpt-3.5-turbo", temperature: 0 }
  }
});
```

### 3. Error Handling

```typescript
try {
  const config = await modelKit.getConfig("chatbot");
  // Use config
} catch (error) {
  console.error("Failed to get model config:", error);
  // Fallback to default behavior
}
```

### 4. Graceful Degradation

```typescript
const modelKit = await createModelKit(config).catch(() => {
  console.warn("Redis unavailable, using static config only");
  return createModelKit({
    ...config,
    storage: { type: "memory" }
  });
});
```

## TypeScript

Full TypeScript support with comprehensive type definitions.

```typescript
import type {
  FeatureConfig,
  ModelKit,
  ModelKitConfig,
  ModelOverride,
  StorageAdapter,
  StorageConfig
} from "modelkit";
```

## Examples

### Basic API Integration

```typescript
import { defineConfig, createModelKit } from "modelkit";
import Anthropic from "@anthropic-ai/sdk";

const config = defineConfig({
  features: {
    chatbot: {
      modelId: "claude-3-5-sonnet-20250129",
      temperature: 0.7,
      maxTokens: 2048
    }
  },
  storage: { type: "redis", url: process.env.REDIS_URL }
});

const modelKit = await createModelKit(config);
const anthropic = new Anthropic();

// Get current configuration
const { modelId, temperature, maxTokens } = await modelKit.getConfig("chatbot");

// Use in API call
const response = await anthropic.messages.create({
  model: modelId,
  temperature,
  max_tokens: maxTokens,
  messages: [{ role: "user", content: "Hello!" }]
});
```

### A/B Testing

```typescript
// Set override for A/B test variant
const userId = getUserId();
const variant = userId % 2 === 0 ? "A" : "B";

if (variant === "B") {
  await modelKit.setOverride("chatbot", {
    modelId: "claude-3-5-sonnet-20250129",  // Test new model
    temperature: 0.8
  });
}

const config = await modelKit.getConfig("chatbot");
// Use config for this user's request
```

### Emergency Fallback

```typescript
// Quickly switch to cheaper/faster model during outage
await modelKit.setOverride("chatbot", {
  modelId: "claude-3-haiku-20240307"
});

// Revert when resolved
await modelKit.clearOverride("chatbot");
```

## Related Packages

- [@modelkit/studio](https://www.npmjs.com/package/@modelkit/studio) - React UI for visual management

## License

MIT © [Benaiah](https://github.com/benaiah)
