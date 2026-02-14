/**
 * Client API layer: all external API calls are defined here.
 * Import from @/client-api or from specific *.api modules.
 */

export { openrouterApi } from "./openrouter.api";
export type {
  OpenRouterModel,
  OpenRouterModelPricing,
  OpenRouterModelsResponse,
} from "./openrouter.api";
