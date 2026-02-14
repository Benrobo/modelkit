/**
 * OpenRouter API client.
 * @see https://openrouter.ai/docs#list-models
 */

const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";

export interface OpenRouterModelPricing {
  prompt?: string;
  completion?: string;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  created?: number;
  context_length?: number;
  pricing?: OpenRouterModelPricing;
  top_provider?: { max_completion_tokens?: number };
}

export interface OpenRouterModelsResponse {
  data: OpenRouterModel[];
}

export const openrouterApi = {
  /**
   * Fetch all available models from OpenRouter.
   */
  async getModels(referer?: string): Promise<OpenRouterModel[]> {
    const res = await fetch(OPENROUTER_MODELS_URL, {
      headers: {
        "HTTP-Referer":
          referer ??
          (typeof window !== "undefined" ? window.location.origin : "https://modelkit.dev"),
      },
    });
    if (!res.ok) throw new Error(`OpenRouter API error: ${res.status}`);
    const data = (await res.json()) as OpenRouterModelsResponse;
    return Array.isArray(data.data) ? data.data : [];
  },
};
