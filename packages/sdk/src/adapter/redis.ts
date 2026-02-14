/**
 * Redis storage adapter using ioredis.
 * Connects via Redis URL (e.g. redis://localhost:6379 or redis://user:pass@host:port).
 */

import IORedis from "ioredis";
import type { StorageAdapter } from "./types.js";
import type { ModelOverride } from "../types.js";

/** Minimal Redis client interface for type-safe declaration emit (ioredis CJS interop). */
interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<string>;
  del(...keys: string[]): Promise<number>;
  keys(pattern: string): Promise<string[]>;
}

export interface RedisStorageOptions {
  /** Redis connection URL (e.g. redis://localhost:6379, redis://:password@host:6379). */
  url: string;
  prefix?: string;
}

const DEFAULT_PREFIX = "modelkit:overrides:";

export class RedisStorage implements StorageAdapter {
  private redis: RedisClient;
  private prefix: string;

  constructor(options: RedisStorageOptions) {
    const { url, prefix = DEFAULT_PREFIX } = options;
    this.redis = new (IORedis as unknown as new (url: string) => RedisClient)(url);
    this.prefix = prefix;
  }

  private key(featureId: string): string {
    return `${this.prefix}${featureId}`;
  }

  async get(featureId: string): Promise<ModelOverride | null> {
    const k = this.key(featureId);
    const data = await this.redis.get(k);
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
  }

  async set(featureId: string, override: ModelOverride): Promise<void> {
    const k = this.key(featureId);
    const data: ModelOverride = {
      ...override,
      updatedAt: Date.now(),
    };
    await this.redis.set(k, JSON.stringify(data));
  }

  async delete(featureId: string): Promise<void> {
    await this.redis.del(this.key(featureId));
  }

  async list(): Promise<Array<{ featureId: string; override: ModelOverride }>> {
    const pattern = `${this.prefix}*`;
    const keys = await this.redis.keys(pattern);
    if (!keys.length) return [];

    const overrides = await Promise.all(
      keys.map(async (key: string) => {
        const featureId = key.replace(this.prefix, "");
        const override = await this.get(featureId);
        return { featureId, override };
      })
    );

    return overrides.filter(
      (o: { featureId: string; override: ModelOverride | null }): o is {
        featureId: string;
        override: ModelOverride;
      } => o.override != null
    );
  }

  async clear(): Promise<void> {
    const keys = await this.redis.keys(`${this.prefix}*`);
    if (keys.length) {
      await this.redis.del(...keys);
    }
  }
}
