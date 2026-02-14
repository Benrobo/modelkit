import type { ModelKit, CreateFeatureDefinition } from "modelkit";

const mockFeatures: Array<CreateFeatureDefinition> = [
  {
    id: "contentStudio.generateContent",
    name: "Generate content",
    title: "Default model for content generation",
    modelId: "anthropic/claude-sonnet-4-5",
    temperature: 0.7,
    maxTokens: 4096,
  },
  {
    id: "businessInsights.swot",
    name: "SWOT analysis",
    title: "Business insights and SWOT",
    modelId: "google/gemini-2.5-flash",
    temperature: 0.8,
    maxTokens: 2048,
  },
];

const overrides = new Map<string, { modelId: string; temperature?: number; maxTokens?: number; updatedAt?: number }>();

export const mockModelKit: ModelKit = {
  async getModel(featureId: string): Promise<string> {
    const override = overrides.get(featureId);
    if (override) return override.modelId;
    const def = mockFeatures.find((f) => f.id === featureId);
    if (!def) throw new Error(`Feature "${featureId}" not found`);
    return def.modelId;
  },

  async getConfig(featureId: string) {
    const def = mockFeatures.find((f) => f.id === featureId);
    if (!def) throw new Error(`Feature "${featureId}" not found`);
    const override = overrides.get(featureId);
    return override ? { ...def, ...override } : { ...def };
  },

  async setOverride(featureId: string, override: { modelId: string; temperature?: number; maxTokens?: number }): Promise<void> {
    const def = mockFeatures.find((f) => f.id === featureId);
    if (!def) throw new Error(`Feature "${featureId}" not found`);
    overrides.set(featureId, {
      modelId: override.modelId ?? def.modelId,
      temperature: override.temperature,
      maxTokens: override.maxTokens,
      updatedAt: Date.now(),
    });
  },

  async clearOverride(featureId: string): Promise<void> {
    overrides.delete(featureId);
  },

  async listOverrides() {
    return Array.from(overrides.entries()).map(([featureId, override]) => ({
      featureId,
      override,
    }));
  },

  async listFeatures() {
    return mockFeatures.map((f) => ({ ...f }));
  },

  async createFeature(definition: CreateFeatureDefinition): Promise<void> {
    if (mockFeatures.some((f) => f.id === definition.id)) {
      throw new Error(`Feature "${definition.id}" already exists`);
    }
    mockFeatures.push({ ...definition });
  },
};
