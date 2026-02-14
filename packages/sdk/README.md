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
import { defineConfig, createModelKit } from "modelkit";

const config = defineConfig({
  features: {
    chatbot: {
      modelId: "anthropic/claude-3.5-sonnet",
      temperature: 0.7,
      maxTokens: 2048
    }
  },
  storage: {
    type: "redis",
    url: process.env.REDIS_URL
  }
});

const modelKit = await createModelKit(config);

// Get current model ID
const modelId = await modelKit.getModel("chatbot");

// Get full configuration (with overrides applied)
const config = await modelKit.getConfig("chatbot");

// Set runtime override
await modelKit.setOverride("chatbot", {
  modelId: "anthropic/claude-3.5-sonnet-20250129",
  temperature: 0.9
});
```

## API Reference

### `defineConfig(config)`

Helper function to define type-safe model configurations.

```typescript
const config = defineConfig({
  features: {
    [featureId: string]: FeatureConfig
  },
  storage: StorageConfig
});
```

**FeatureConfig:**
```typescript
interface FeatureConfig {
  name?: string;          // Display name for the feature
  title?: string;         // Description of the feature
  modelId: string;        // AI model identifier (required)
  temperature?: number;   // Sampling temperature (0-2)
  maxTokens?: number;     // Maximum tokens to generate
  topP?: number;          // Nucleus sampling parameter
  topK?: number;          // Top-k sampling parameter
}
```

**StorageConfig:**
```typescript
type StorageConfig =
  | { type: "redis"; url: string; keyPrefix?: string; ttl?: number }
  | { type: "memory"; ttl?: number }
  | { type: "custom"; adapter: StorageAdapter };
```

### `createModelKit(config)`

Creates a ModelKit instance with the specified configuration.

```typescript
const modelKit = await createModelKit(config);
```

**Returns:** `Promise<ModelKit>`

### ModelKit Instance Methods

#### `getModel(featureId: string): Promise<string>`

Get the current model ID for a feature (respects overrides).

```typescript
const modelId = await modelKit.getModel("chatbot");
// "anthropic/claude-3.5-sonnet-20250129"
```

#### `getConfig(featureId: string): Promise<FeatureConfig & ModelOverride>`

Get the full configuration for a feature with overrides applied.

```typescript
const config = await modelKit.getConfig("chatbot");
// {
//   modelId: "anthropic/claude-3.5-sonnet-20250129",
//   temperature: 0.9,
//   maxTokens: 2048,
//   name: "Customer Support Chatbot"
// }
```

#### `setOverride(featureId: string, override: Partial<ModelOverride>): Promise<void>`

Set runtime overrides for a feature. Only provided fields are overridden.

```typescript
await modelKit.setOverride("chatbot", {
  temperature: 0.9,
  maxTokens: 4096
});
```

**ModelOverride:**
```typescript
interface ModelOverride {
  modelId?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
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

#### `listFeatures(): Promise<Array<FeatureConfig & { id: string }>>`

List all configured features with their base configurations.

```typescript
const features = await modelKit.listFeatures();
// [
//   {
//     id: "chatbot",
//     modelId: "anthropic/claude-3.5-sonnet",
//     temperature: 0.7,
//     maxTokens: 2048,
//     name: "Customer Support Chatbot"
//   }
// ]
```

## Storage Adapters

### Redis Storage (Production)

Persistent storage using Redis. Recommended for production use.

```typescript
import { createModelKit } from "modelkit";

const config = defineConfig({
  features: { /* ... */ },
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
