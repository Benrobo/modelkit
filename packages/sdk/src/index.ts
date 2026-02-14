/**
 * ModelKit – type-safe, zero-downtime AI model configuration.
 */

export { defineConfig } from "./config.js";
export { createModelKit } from "./client.js";
export type { CreateModelKitOptions } from "./client.js";

export type {
  FeatureConfig,
  CreateFeatureDefinition,
  ModelKit,
  ModelKitConfig,
  ModelOverride,
  RedisStorageConfig,
  MemoryStorageConfig,
  StorageConfig,
} from "./types.js";

export type { StorageAdapter } from "./adapter/index.js";
export { createStorage, RedisStorage, MemoryStorage } from "./adapter/index.js";
