/**
 * ModelKit client: creates the main API instance with storage adapter and caching.
 */

import type {
  FeatureConfig,
  ModelKit,
  ModelKitConfig,
  ModelOverride,
} from "./types.js";
import { createStorage } from "./adapter/index.js";

const DEFAULT_CACHE_TTL_MS = 60_000; // 1 minute

interface CachedConfig {
  modelId: string;
  fetchedAt: number;
  source: "redis" | "config";
}

export interface CreateModelKitOptions {
  cacheTTL?: number;
}

export function createModelKit(
  config: ModelKitConfig,
  options: CreateModelKitOptions = {}
): ModelKit {
  const { cacheTTL = DEFAULT_CACHE_TTL_MS } = options;
  const storage = createStorage(config);
  const { features } = config;
  const configCache = new Map<string, CachedConfig>();

  async function getModel(featureId: string): Promise<string> {
    const cached = configCache.get(featureId);
    if (cached && Date.now() - cached.fetchedAt < cacheTTL) {
      return cached.modelId;
    }

    try {
      const override = await storage.get(featureId);
      if (override) {
        configCache.set(featureId, {
          modelId: override.modelId,
          fetchedAt: Date.now(),
          source: "redis",
        });
        return override.modelId;
      }
    } catch (err) {
      console.warn(
        `[modelkit] Redis unavailable, using config default:`,
        err instanceof Error ? err.message : err
      );
    }

    const def = features[featureId];
    if (!def) throw new Error(`Feature "${featureId}" not found`);
    configCache.set(featureId, {
      modelId: def.modelId,
      fetchedAt: Date.now(),
      source: "config",
    });
    return def.modelId;
  }

  async function getConfig(
    featureId: string
  ): Promise<FeatureConfig & ModelOverride> {
    const def = features[featureId];
    if (!def) throw new Error(`Feature "${featureId}" not found`);
    try {
      const override = await storage.get(featureId);
      return override ? { ...def, ...override } : { ...def };
    } catch {
      return { ...def };
    }
  }

  async function setOverride(
    featureId: string,
    override: Partial<ModelOverride>
  ): Promise<void> {
    const def = features[featureId];
    if (!def) throw new Error(`Feature "${featureId}" not found`);
    configCache.delete(featureId);
    await storage.set(featureId, {
      modelId: override.modelId ?? def.modelId,
      ...override,
    });
  }

  async function clearOverride(featureId: string): Promise<void> {
    configCache.delete(featureId);
    await storage.delete(featureId);
  }

  return {
    getModel,
    getConfig,
    setOverride,
    clearOverride,
    listOverrides: () => storage.list(),
    listFeatures: () =>
      Promise.resolve(
        Object.entries(features).map(([id, f]) => ({ ...f, id }))
      ),
  };
}
