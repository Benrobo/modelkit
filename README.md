# ModelKit

Type-safe AI model configuration with zero-downtime runtime overrides.

Change models and parameters on the fly without redeploying your app.

![ModelKit Studio](screenshots/prev-3.png)

## Features

- Type-safe with 340+ OpenRouter models
- Zero-downtime configuration updates
- Redis-backed persistence
- React UI for visual management
- In-memory caching for performance

## Packages

| Package                                       | Version                                                                                                                     | Description                                 |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [@benrobo/modelkit](./packages/sdk)           | [![npm](https://img.shields.io/npm/v/@benrobo/modelkit.svg)](https://www.npmjs.com/package/@benrobo/modelkit)               | Core SDK for model configuration management |
| [@benrobo/modelkit-studio](./packages/studio) | [![npm](https://img.shields.io/npm/v/@benrobo/modelkit-studio.svg)](https://www.npmjs.com/package/@benrobo/modelkit-studio) | React UI for visual model management        |

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
npm install @benrobo/modelkit
```

### Backend Setup

```typescript
import { Hono } from "hono";
import {
  createModelKit,
  createRedisAdapter,
  createModelKitRouter,
} from "@benrobo/modelkit";

const adapter = createRedisAdapter({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

const modelKit = createModelKit(adapter);

// Use in your app
const modelId = await modelKit.getModel(
  "chatbot",
  "anthropic/claude-3.5-sonnet"
);

// Expose REST API
const app = new Hono();
app.route("/api/modelkit", createModelKitRouter(modelKit));
```

### Type Safety

Generate TypeScript types from your ModelKit API:

```bash
# Start your backend first, then generate types
npx modelkit-generate --api-url http://localhost:3000/api/modelkit
```

This creates `src/modelkit.generated.ts` with:

```typescript
export type FeatureId = "chatbot" | "content.generate" | "swot.analysis";

// ... plus dynamic usage examples with your actual features
```

**Use the generated types:**

```typescript
import type { FeatureId } from "./modelkit.generated";

const adapter = createRedisAdapter<FeatureId>({ url: "..." });
const modelKit = createModelKit<FeatureId>(adapter);

// ✅ TypeScript autocomplete works!
await modelKit.getModel("chatbot", "anthropic/claude-3.5-sonnet");

// ❌ Compile-time error for invalid feature IDs
await modelKit.getModel("invalid", "gpt-4");
```

### React UI

```bash
npm install @benrobo/modelkit-studio
```

```tsx
import { ModelKitStudio } from "@benrobo/modelkit-studio";
import "@benrobo/modelkit-studio/styles";

<ModelKitStudio apiUrl="http://localhost:3000/api/modelkit" theme="dark" />;
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

## SDK API

```typescript
await modelKit.getModel("feature-id", "anthropic/claude-3.5-sonnet");

await modelKit.setOverride("feature-id", {
  modelId: "anthropic/claude-opus-4",
  temperature: 0.9,
  maxTokens: 4096,
});

await modelKit.getConfig("feature-id");
await modelKit.listOverrides();
await modelKit.clearOverride("feature-id");
```

## REST API

Both `createModelKitRouter()` (Hono) and `createModelKitExpressRouter()` (Express) expose:

- `GET /overrides` - List all overrides
- `GET /overrides/:featureId` - Get specific override
- `POST /overrides/:featureId` - Set override
- `DELETE /overrides/:featureId` - Clear override

## Custom Storage Adapter

```typescript
import type { StorageAdapter } from "@benrobo/modelkit";

function createMyAdapter(): StorageAdapter {
  return {
    async get(featureId) {
      /* ... */
    },
    async set(featureId, override) {
      /* ... */
    },
    async delete(featureId) {
      /* ... */
    },
    async list() {
      /* ... */
    },
  };
}

const modelKit = createModelKit(createMyAdapter());
```

## License

MIT
