# ModelKit

**Type-safe, zero-downtime AI model configuration management with runtime overrides**

ModelKit is a lightweight TypeScript library that enables dynamic AI model configuration without application restarts. Change models, temperature, and parameters on the fly with Redis or in-memory storage backends.

## Features

- 🔄 **Zero-downtime configuration** - Update AI model settings without redeploying
- 🎯 **Type-safe** - Full TypeScript support with comprehensive type definitions
- 💾 **Flexible storage** - Redis or in-memory backends with automatic fallback
- ⚡ **Smart caching** - Configurable TTL with automatic invalidation
- 🎨 **React UI** - Beautiful management interface with theme customization
- 🔌 **Runtime overrides** - Override any configuration parameter at runtime
- 📦 **Lightweight** - Minimal dependencies, tree-shakeable

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [modelkit](./packages/sdk) | [![npm](https://img.shields.io/npm/v/modelkit.svg)](https://www.npmjs.com/package/modelkit) | Core SDK for model configuration management |
| [@modelkit/studio](./packages/studio) | [![npm](https://img.shields.io/npm/v/@modelkit/studio.svg)](https://www.npmjs.com/package/@modelkit/studio) | React UI for visual model management |

### Why Studio Matters

**ModelKit Studio** is critical for production AI applications:

- **Visual Control** - Non-technical team members can switch models without code changes
- **Emergency Response** - Instantly revert problematic model updates with one click
- **Real-time Monitoring** - See which features use which models at a glance
- **Cost Management** - Quickly test cheaper models for specific features
- **Team Collaboration** - Product managers can optimize model costs without engineering help
- **Audit Trail** - Track who changed what model and when (via Redis timestamps)

While the SDK handles runtime configuration, **Studio makes it accessible to your entire team**. Engineers define the features in code, but anyone can manage model selection through the UI.

## Quick Start

### Installation

```bash
# Core SDK
npm install modelkit
# or
bun add modelkit

# React UI (optional)
npm install @modelkit/studio modelkit react react-dom
```

### Basic Usage

```typescript
import { createModelKit, createRedisAdapter } from "modelkit";

// Create a Redis adapter
const adapter = createRedisAdapter({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

// Create ModelKit with the adapter
const modelKit = createModelKit(adapter, {
  cacheTTL: 60000 // Optional: cache lookups in memory for 60s (default)
});

// ALWAYS provide fallbackModel for reliability
const modelId = await modelKit.getModel(
  "chatbot",
  "anthropic/claude-3.5-sonnet" // Required fallback
);
// Priority: Redis override → fallbackModel

// Get current override from Redis (returns null if none exists)
const override = await modelKit.getConfig("chatbot");
console.log(override);
// { modelId: "anthropic/claude-3.5-sonnet-20250129", temperature: 0.9, updatedAt: 1707912345 } | null

// Set runtime override via API (no restart needed!)
await modelKit.setOverride("chatbot", {
  modelId: "anthropic/claude-3.5-sonnet-20250129",
  temperature: 0.9,
  maxTokens: 2048
});

// Or use Studio UI to change models visually
```

### React UI

```tsx
import { ModelKitStudio } from "@modelkit/studio";
import "@modelkit/studio/styles";

function App() {
  return <ModelKitStudio modelKit={modelKit} theme="dark" />;
}
```

![ModelKit Studio Screenshot](./docs/screenshot.png)

## Use Cases

- **A/B Testing** - Test different models without deploying multiple versions
- **Cost Optimization** - Switch between models based on cost/performance needs
- **Gradual Rollouts** - Roll out new models to a subset of features
- **Emergency Fallback** - Quickly switch to backup models during outages
- **Development** - Use different models for dev/staging/production
- **Fine-tuning** - Adjust temperature and parameters without code changes

## Documentation

- [SDK Documentation](./packages/sdk/README.md)
- [Studio UI Documentation](./packages/studio/README.md)
- [API Reference](./docs/API.md)
- [Examples](./examples)

## Architecture

### Configuration Priority

ModelKit uses a simple two-tier system:

```
getModel(featureId, fallbackModel)
          ↓
    1. In-memory cache (60s TTL)
          ↓
    2. Redis override (persistent)
          ↓
    3. fallbackModel parameter (required)
```

**Why this matters:**

- **Redis override** - Runtime changes via Studio UI or API (highest priority)
- **Fallback model** - Your code-defined default (always required)
- **No config file needed** - Just storage settings

**Best Practice:**

```typescript
// Always provide a fallbackModel (required parameter)
const modelId = await modelKit.getModel(
  "chatbot",
  "anthropic/claude-3.5-sonnet" // Used when no Redis override exists
);
```

This ensures your app keeps working even if Redis is temporarily unavailable. No config file needed - you control the defaults in your code!

## Storage Options

### Redis (Production)

```typescript
storage: {
  type: "redis",
  url: "redis://localhost:6379",
  keyPrefix: "modelkit:overrides:",  // optional
  ttl: 60                             // cache TTL in seconds
}
```

### Memory (Development)

```typescript
storage: {
  type: "memory",
  ttl: 0  // 0 = no expiry
}
```

## Advanced Features

### Custom Cache TTL

```typescript
const config = defineConfig({
  features: { /* ... */ },
  storage: {
    type: "redis",
    url: process.env.REDIS_URL,
    ttl: 120  // 2 minutes cache
  }
});
```

### List All Overrides

```typescript
const overrides = await modelKit.listOverrides();
console.log(overrides);
// [
//   { featureId: "chatbot", override: { modelId: "...", temperature: 0.9, updatedAt: 1707912345 } }
// ]
```

### Clear Overrides

```typescript
// Clear specific override
await modelKit.clearOverride("chatbot");

// Or use the UI to manage overrides visually
```

## TypeScript Support

ModelKit is written in TypeScript and provides comprehensive type definitions:

```typescript
import type {
  FeatureConfig,
  ModelKit,
  ModelKitConfig,
  ModelOverride,
  StorageAdapter
} from "modelkit";

// All types are exported and well-documented
```

## Examples

Check out the [examples directory](./examples) for complete working examples:

- **API Server** - Hono + Bun integration with model configuration
- **React App** - Full-stack example with Studio UI

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT © [Benaiah](https://github.com/benaiah)

## Support

- 📖 [Documentation](./docs)
- 🐛 [Issue Tracker](https://github.com/benaiah/modelkit/issues)
- 💬 [Discussions](https://github.com/benaiah/modelkit/discussions)
