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
| [@modelkit/studio](./packages/studio) | [![npm](https://img.shields.io/npm/v/@modelkit/studio.svg)](https://www.npmjs.com/package/@modelkit/studio) | React UI components for visual management |

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
import { defineConfig, createModelKit } from "modelkit";

// Define your AI model configurations
const config = defineConfig({
  features: {
    chatbot: {
      name: "Customer Support Chatbot",
      modelId: "anthropic/claude-3.5-sonnet",
      temperature: 0.7,
      maxTokens: 2048
    },
    summarizer: {
      name: "Document Summarizer",
      modelId: "openai/gpt-4-turbo",
      temperature: 0.3,
      maxTokens: 1024
    }
  },
  storage: {
    type: "redis",
    url: process.env.REDIS_URL
  }
});

// Create ModelKit instance
const modelKit = await createModelKit(config);

// Use in your application
const modelId = await modelKit.getModel("chatbot");
const fullConfig = await modelKit.getConfig("chatbot");
console.log(fullConfig);
// { modelId: "anthropic/claude-3.5-sonnet", temperature: 0.7, maxTokens: 2048 }

// Runtime override (no restart needed!)
await modelKit.setOverride("chatbot", {
  modelId: "anthropic/claude-3.5-sonnet-20250129",
  temperature: 0.9
});
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

```
┌─────────────────────┐
│  Your Application   │
└──────────┬──────────┘
           │
           ▼
    ┌─────────────┐
    │  ModelKit   │  ← Core SDK
    │   Client    │
    └──────┬──────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌──────────┐
│  Redis  │  │  Config  │
│ Storage │  │ (static) │
└─────────┘  └──────────┘
```

**Configuration Flow:**
1. Define base configuration with `defineConfig()`
2. Create client with `createModelKit(config)`
3. Client checks cache → Redis → static config
4. Override values stored in Redis take precedence
5. Changes propagate instantly (after cache TTL)

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
