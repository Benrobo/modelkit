/**
 * ModelKit – type-safe, zero-downtime AI model configuration.
 */

export { createModelKit } from "./client.js";
export type { CreateModelKitOptions } from "./client.js";

export type { ModelKit, ModelOverride, StorageAdapter } from "./types.js";

export type { ModelId, OpenRouterModelId } from "./models.js";

export { createRedisAdapter } from "./adapter/index.js";
export type { RedisAdapterOptions } from "./adapter/index.js";

// Routers are now exported separately to avoid importing peer dependencies
// import { createModelKitRouter } from "@benrobo/modelkit/hono"
// import { createModelKitExpressRouter } from "@benrobo/modelkit/express"
