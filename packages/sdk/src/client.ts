import type { ModelKit, ModelOverride, StorageAdapter } from "./types.js";
import type { ModelId } from "./models.js";
import { MemoryStorage } from "./adapter/memory.js";

const DEFAULT_CACHE_TTL_MS = 60_000; // 1 minute

export interface CreateModelKitOptions {
  /** Cache TTL in milliseconds for in-memory caching of model lookups. Default: 60000 (1 minute) */
  cacheTTL?: number;
  /** Enable debug logging. Logs model lookups, overrides, and cache hits. Default: false */
  debug?: boolean;
}

function createLogger(enabled: boolean) {
  return {
    debug: (...args: any[]) => {
      if (enabled) {
        console.log("[modelkit]", ...args);
      }
    },
    info: (...args: any[]) => {
      if (enabled) {
        console.info("[modelkit]", ...args);
      }
    },
    warn: (...args: any[]) => {
      console.warn("[modelkit]", ...args);
    },
    error: (...args: any[]) => {
      console.error("[modelkit]", ...args);
    },
  };
}

export function createModelKit<TFeatureId extends string = string>(
  adapter: StorageAdapter<TFeatureId>,
  options: CreateModelKitOptions = {}
): ModelKit<TFeatureId> {
  const { cacheTTL = DEFAULT_CACHE_TTL_MS, debug = false } = options;
  const logger = createLogger(debug);

  const cache = new MemoryStorage({ stdTTL: Math.floor(cacheTTL / 1000) });

  async function getModel(
    featureId: TFeatureId,
    fallbackModel: ModelId
  ): Promise<ModelId> {
    const cached = await cache.get(featureId);
    if (cached) {
      logger.debug(`[${featureId}] Using cached model: ${cached.modelId}`);
      return cached.modelId;
    }

    try {
      const override = await adapter.get(featureId);
      if (override) {
        logger.info(
          `[${featureId}] Using override model: ${override.modelId}`,
          {
            temperature: override.temperature,
            maxTokens: override.maxTokens,
          }
        );
        await cache.set(featureId, override);
        return override.modelId;
      }
    } catch (err) {
      logger.warn(
        `[${featureId}] Storage adapter unavailable, using fallback model:`,
        err instanceof Error ? err.message : err
      );
    }

    // Use fallback
    logger.info(`[${featureId}] Using fallback model: ${fallbackModel}`);
    await cache.set(featureId, { modelId: fallbackModel });
    return fallbackModel;
  }

  async function getConfig(featureId: TFeatureId): Promise<ModelOverride | null> {
    try {
      return await adapter.get(featureId);
    } catch {
      return null;
    }
  }

  async function setOverride(
    featureId: TFeatureId,
    override: ModelOverride
  ): Promise<void> {
    logger.info(`[${featureId}] Setting override:`, {
      modelId: override.modelId,
      temperature: override.temperature,
      maxTokens: override.maxTokens,
    });
    await cache.delete(featureId);
    await adapter.set(featureId, override);
  }

  async function clearOverride(featureId: TFeatureId): Promise<void> {
    logger.info(`[${featureId}] Clearing override`);
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
