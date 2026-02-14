import type { ModelKit, ModelOverride, StorageAdapter } from "./types.js";
import type { ModelId } from "./models.js";
import { MemoryStorage } from "./adapter/memory.js";

const DEFAULT_CACHE_TTL_MS = 60_000; // 1 minute

export interface CreateModelKitOptions {
  /** Cache TTL in milliseconds for in-memory caching of model lookups. Default: 60000 (1 minute) */
  cacheTTL?: number;
}

export function createModelKit(
  adapter: StorageAdapter,
  options: CreateModelKitOptions = {}
): ModelKit {
  const { cacheTTL = DEFAULT_CACHE_TTL_MS } = options;

  const cache = new MemoryStorage({ stdTTL: Math.floor(cacheTTL / 1000) });

  async function getModel(
    featureId: string,
    fallbackModel: ModelId
  ): Promise<ModelId> {
    const cached = await cache.get(featureId);
    if (cached) {
      return cached.modelId;
    }

    try {
      const override = await adapter.get(featureId);
      if (override) {
        await cache.set(featureId, override);
        return override.modelId;
      }
    } catch (err) {
      console.warn(
        `[modelkit] Storage adapter unavailable, using fallback model:`,
        err instanceof Error ? err.message : err
      );
    }

    await cache.set(featureId, { modelId: fallbackModel });
    return fallbackModel;
  }

  async function getConfig(featureId: string): Promise<ModelOverride | null> {
    try {
      return await adapter.get(featureId);
    } catch {
      return null;
    }
  }

  async function setOverride(
    featureId: string,
    override: ModelOverride
  ): Promise<void> {
    await cache.delete(featureId);
    await adapter.set(featureId, override);
  }

  async function clearOverride(featureId: string): Promise<void> {
    await cache.delete(featureId);
    await adapter.delete(featureId);
  }

  return {
    getModel,
    getConfig,
    setOverride,
    clearOverride,
    listOverrides: () => adapter.list(),
  };
}
