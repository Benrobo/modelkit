/**
 * In-memory storage adapter using node-cache (internal use for caching).
 */

import NodeCache from "node-cache";
import type { StorageAdapter, ModelOverride } from "../types.js";

const KEY_PREFIX = "modelkit:memory:";

export interface MemoryStorageOptions {
  /** TTL in seconds; 0 = no expiry. Default 0. */
  stdTTL?: number;
}

export class MemoryStorage<TFeatureId extends string = string> implements StorageAdapter<TFeatureId> {
  private cache: NodeCache;

  constructor(options: MemoryStorageOptions = {}) {
    this.cache = new NodeCache({
      stdTTL: options.stdTTL ?? 0,
      useClones: false,
    });
  }

  private key(featureId: TFeatureId): string {
    return `${KEY_PREFIX}${featureId}`;
  }

  async get(featureId: TFeatureId): Promise<ModelOverride | null> {
    const value = this.cache.get<ModelOverride>(this.key(featureId));
    return value ?? null;
  }

  async set(featureId: TFeatureId, override: ModelOverride): Promise<void> {
    this.cache.set(this.key(featureId), {
      ...override,
      updatedAt: Date.now(),
    });
  }

  async delete(featureId: TFeatureId): Promise<void> {
    this.cache.del(this.key(featureId));
  }

  async list(): Promise<Array<{ featureId: TFeatureId; override: ModelOverride }>> {
    const keys = this.cache.keys().filter((k) => k.startsWith(KEY_PREFIX));
    const result: Array<{ featureId: TFeatureId; override: ModelOverride }> = [];
    for (const key of keys) {
      const override = this.cache.get<ModelOverride>(key);
      if (override != null) {
        result.push({
          featureId: key.slice(KEY_PREFIX.length) as TFeatureId,
          override,
        });
      }
    }
    return result;
  }
}
