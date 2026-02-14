import { useQuery } from "@tanstack/react-query";
import { openrouterApi } from "../client-api/openrouter.api";
import type { OpenRouterModel } from "../client-api/openrouter.api";

const OPENROUTER_MODELS_QUERY_KEY = ["openrouter", "models"] as const;

/** Group models by provider (prefix of id, e.g. "anthropic" from "anthropic/claude-..."). */
function groupByProvider(
  models: OpenRouterModel[]
): Record<string, OpenRouterModel[]> {
  const grouped: Record<string, OpenRouterModel[]> = {};
  for (const model of models) {
    const provider = model.id.includes("/")
      ? model.id.split("/")[0]!
      : "other";
    if (!grouped[provider]) grouped[provider] = [];
    grouped[provider].push(model);
  }
  const sorted: Record<string, OpenRouterModel[]> = {};
  for (const provider of Object.keys(grouped).sort()) {
    sorted[provider] = [...(grouped[provider] ?? [])].sort((a, b) =>
      (a.name || a.id).localeCompare(b.name || b.id)
    );
  }
  return sorted;
}

export function useAvailableModels(): {
  modelsByProvider: Record<string, OpenRouterModel[]>;
  allModels: OpenRouterModel[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const {
    data: allModels = [],
    isPending: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: OPENROUTER_MODELS_QUERY_KEY,
    queryFn: () => openrouterApi.getModels(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const modelsByProvider = groupByProvider(allModels);

  return {
    modelsByProvider,
    allModels,
    loading,
    error:
      error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
  };
}

// Re-export types so consumers can import from the hook or from client-api
export type {
  OpenRouterModel,
  OpenRouterModelPricing,
  OpenRouterModelsResponse,
} from "../client-api/openrouter.api";
