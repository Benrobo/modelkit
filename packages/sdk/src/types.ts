import type { ModelId } from "./models.js";

export interface ModelOverride {
  modelId: ModelId;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  updatedAt?: number;
}

export interface StorageAdapter<TFeatureId extends string = string> {
  get(featureId: TFeatureId): Promise<ModelOverride | null>;
  set(featureId: TFeatureId, override: ModelOverride): Promise<void>;
  delete(featureId: TFeatureId): Promise<void>;
  list(): Promise<Array<{ featureId: TFeatureId; override: ModelOverride }>>;
}

export interface ModelKit<TFeatureId extends string = string> {
  /** Get model ID for a feature. Checks Redis override first, then uses fallbackModel. */
  getModel(featureId: TFeatureId, fallbackModel: ModelId): Promise<ModelId>;
  /** Get full override configuration from Redis for a feature. Returns null if no override exists. */
  getConfig(featureId: TFeatureId): Promise<ModelOverride | null>;
  /** Set a runtime override in Redis. modelId is required. */
  setOverride(featureId: TFeatureId, override: ModelOverride): Promise<void>;
  /** Clear a runtime override from Redis. */
  clearOverride(featureId: TFeatureId): Promise<void>;
  /** List all active overrides in Redis. */
  listOverrides(): Promise<Array<{ featureId: TFeatureId; override: ModelOverride }>>;
}
