export interface FeatureConfig {
  name?: string;
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
  stdTTL?: number;
}

export type StorageConfig = RedisStorageConfig | MemoryStorageConfig;

export interface ModelKitConfig {
  storage: StorageConfig;
  features: Record<string, FeatureConfig>;
}

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
  createFeature?(definition: CreateFeatureDefinition): Promise<void>;
}
