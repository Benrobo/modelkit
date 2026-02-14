/**
 * Core type definitions for ModelKit.
 */

export interface FeatureConfig {
  /** Optional display name (e.g. "Content generation") */
  name?: string;
  /** Optional short description or subtitle */
  title?: string;
  modelId: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
}

export interface ModelOverride {
  modelId: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  updatedAt?: number;
}

export interface RedisStorageConfig {
  type: "redis";
  url: string;
  prefix?: string;
}

export interface MemoryStorageConfig {
  type: "memory";
  /** TTL in seconds; 0 = no expiry. Optional. */
  stdTTL?: number;
}

export type StorageConfig = RedisStorageConfig | MemoryStorageConfig;

export interface ModelKitConfig {
  storage: StorageConfig;
  features: Record<string, FeatureConfig>;
}

/** Definition for creating a new feature (id + FeatureConfig) */
export type CreateFeatureDefinition = FeatureConfig & { id: string };

export interface ModelKit {
  getModel(featureId: string): Promise<string>;
  getConfig(featureId: string): Promise<FeatureConfig & ModelOverride>;
  setOverride(
    featureId: string,
    override: Partial<ModelOverride>
  ): Promise<void>;
  clearOverride(featureId: string): Promise<void>;
  listOverrides(): Promise<
    Array<{ featureId: string; override: ModelOverride }>
  >;
  listFeatures(): Promise<Array<FeatureConfig & { id: string }>>;
  /** Optional: create a new feature (e.g. in dev/mock). Not all backends support this. */
  createFeature?(definition: CreateFeatureDefinition): Promise<void>;
}
