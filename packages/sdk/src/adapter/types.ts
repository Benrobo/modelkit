import type { ModelOverride } from "../types.js";

export type { ModelOverride };

export interface StorageAdapter {
  get(featureId: string): Promise<ModelOverride | null>;
  set(featureId: string, override: ModelOverride): Promise<void>;
  delete(featureId: string): Promise<void>;
  list(): Promise<Array<{ featureId: string; override: ModelOverride }>>;
}
