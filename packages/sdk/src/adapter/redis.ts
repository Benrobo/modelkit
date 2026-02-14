/**
 * Redis storage adapter using ioredis.
 * Connects via Redis URL (e.g. redis://localhost:6379 or redis://user:pass@host:port).
 */

import IORedis from "ioredis";
import type { StorageAdapter, ModelOverride } from "../types.js";

/** Minimal Redis client interface for type-safe declaration emit (ioredis CJS interop). */
interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<string>;
  del(...keys: string[]): Promise<number>;
  keys(pattern: string): Promise<string[]>;
}

export interface RedisAdapterOptions {
  /** Redis connection URL (e.g. redis://localhost:6379, redis://:password@host:6379). */
  url: string;
  /** Key prefix for Redis keys. Default: "modelkit:overrides:" */
  prefix?: string;
}

const DEFAULT_PREFIX = "modelkit:overrides:";

/**
 * Create a Redis storage adapter for ModelKit.
 * @param options - Redis connection options
 * @returns StorageAdapter instance
 */
export function createRedisAdapter<TFeatureId extends string = string>(options: RedisAdapterOptions): StorageAdapter<TFeatureId> {
  const { url, prefix = DEFAULT_PREFIX } = options;
  const redis = new (IORedis as unknown as new (url: string) => RedisClient)(url);

  function key(featureId: TFeatureId): string {
    return `${prefix}${featureId}`;
  }

  return {
    async get(featureId: TFeatureId): Promise<ModelOverride | null> {
      const k = key(featureId);
      const data = await redis.get(k);
      if (data == null) return null;
      try {
        return JSON.parse(data) as ModelOverride;
      } catch (err) {
        console.error(
          `[modelkit] Failed to parse override for ${featureId}:`,
          err
        );
        return null;
      }
    },

    async set(featureId: TFeatureId, override: ModelOverride): Promise<void> {
      const k = key(featureId);
      const data: ModelOverride = {
        ...override,
        updatedAt: Date.now(),
      };
      await redis.set(k, JSON.stringify(data));
    },

    async delete(featureId: TFeatureId): Promise<void> {
      await redis.del(key(featureId));
    },

    async list(): Promise<Array<{ featureId: TFeatureId; override: ModelOverride }>> {
      const pattern = `${prefix}*`;
      const keys = await redis.keys(pattern);
      if (!keys.length) return [];

      const overrides = await Promise.all(
        keys.map(async (k: string) => {
          const featureId = k.replace(prefix, "") as TFeatureId;
          const override = await this.get(featureId);
          return { featureId, override };
        })
      );

      return overrides.filter(
        (o: { featureId: TFeatureId; override: ModelOverride | null }): o is {
          featureId: TFeatureId;
          override: ModelOverride;
        } => o.override != null
      );
    },
  };
}
