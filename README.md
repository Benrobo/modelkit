# ModelKit

Type-safe AI model configuration with zero-downtime runtime overrides.

Change models and parameters on the fly without redeploying your app.

## Features

- Type-safe with 340+ OpenRouter models
- Zero-downtime configuration updates
- Redis-backed persistence
- React UI for visual management
- In-memory caching for performance

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [modelkit](./packages/sdk) | [![npm](https://img.shields.io/npm/v/modelkit.svg)](https://www.npmjs.com/package/modelkit) | Core SDK for model configuration management |
| [@modelkit/studio](./packages/studio) | [![npm](https://img.shields.io/npm/v/@modelkit/studio.svg)](https://www.npmjs.com/package/@modelkit/studio) | React UI for visual model management |

### Why Studio?

Studio provides a UI for managing model configurations without touching code:

- Switch models instantly for any feature
- Adjust temperature and token limits in real-time
- See all active overrides at a glance
- Non-engineers can manage model selection
- Useful for emergency rollbacks and cost optimization

## Quick Start

### Installation

```bash
npm install modelkit
```

### Basic Usage

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

### React UI

```bash
npm install @modelkit/studio
```

```tsx
import { ModelKitStudio } from "@modelkit/studio";
import "@modelkit/studio/styles";

<ModelKitStudio modelKit={modelKit} theme="dark" />
```

## Use Cases

- A/B test different models without redeploying
- Switch to cheaper models for cost optimization
- Emergency fallback during model outages
- Adjust parameters (temperature, tokens) in production
- Different models per environment (dev/staging/prod)

## How It Works

```
getModel(featureId, fallbackModel)
  ↓
1. Check in-memory cache (60s TTL)
  ↓
2. Check Redis override
  ↓
3. Return fallbackModel
```

The fallback model ensures your app works even if Redis is down.

## API

```typescript
// Get model with fallback
await modelKit.getModel("feature-id", "anthropic/claude-3.5-sonnet");

// Set override
await modelKit.setOverride("feature-id", {
  modelId: "anthropic/claude-opus-4",
  temperature: 0.9,
  maxTokens: 4096
});

// Get current override
await modelKit.getConfig("feature-id");

// List all overrides
await modelKit.listOverrides();

// Clear override
await modelKit.clearOverride("feature-id");
```

## Custom Storage Adapter

```typescript
import type { StorageAdapter } from "modelkit";

function createMyAdapter(): StorageAdapter {
  return {
    async get(featureId) { /* ... */ },
    async set(featureId, override) { /* ... */ },
    async delete(featureId) { /* ... */ },
    async list() { /* ... */ }
  };
}

const modelKit = createModelKit(createMyAdapter());
```

## License

MIT
