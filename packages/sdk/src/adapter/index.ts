/**
 * Storage adapter interface and implementations.
 * Use createStorage() to get the right adapter from config.
 */

import type { ModelKitConfig } from "../types.js";
import { RedisStorage } from "./redis.js";
import { MemoryStorage } from "./memory.js";
import type { StorageAdapter } from "./types.js";

export type { ModelOverride, StorageAdapter } from "./types.js";
export { RedisStorage } from "./redis.js";
export { MemoryStorage } from "./memory.js";

/**
 * Create a storage adapter from ModelKit config.
 * Uses Redis when config.storage.type is "redis", MemoryStorage when "memory".
 */
export function createStorage(config: ModelKitConfig): StorageAdapter {
  if (config.storage.type === "redis") {
    return new RedisStorage({
      url: config.storage.url,
      prefix: config.storage.prefix,
    });
  }
  return new MemoryStorage({
    stdTTL: config.storage.stdTTL,
  });
}
