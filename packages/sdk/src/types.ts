import type { ModelId } from "./models.js";

export interface ModelOverride {
  modelId: ModelId;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  updatedAt?: number;
}

export interface StorageAdapter {
  get(featureId: string): Promise<ModelOverride | null>;
  set(featureId: string, override: ModelOverride): Promise<void>;
  delete(featureId: string): Promise<void>;
  list(): Promise<Array<{ featureId: string; override: ModelOverride }>>;
}

export interface ModelKit {
  /** Get model ID for a feature. Checks Redis override first, then uses fallbackModel. */
  getModel(featureId: string, fallbackModel: ModelId): Promise<ModelId>;
  /** Get full override configuration from Redis for a feature. Returns null if no override exists. */
  getConfig(featureId: string): Promise<ModelOverride | null>;
  /** Set a runtime override in Redis. modelId is required. */
  setOverride(featureId: string, override: ModelOverride): Promise<void>;
  /** Clear a runtime override from Redis. */
  clearOverride(featureId: string): Promise<void>;
  /** List all active overrides in Redis. */
  listOverrides(): Promise<Array<{ featureId: string; override: ModelOverride }>>;
}
