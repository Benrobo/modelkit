/**
 * Model list and display helpers for OpenRouter-style model IDs.
 */

/**
 * Extract provider name from model ID (e.g. "anthropic/claude-sonnet-4-5" -> "anthropic").
 */
export function getProviderFromModelId(modelId: string): string {
  const slash = modelId.indexOf("/");
  return slash > 0 ? modelId.slice(0, slash) : "unknown";
}

/**
 * Human-friendly label for model ID (e.g. "anthropic/claude-sonnet-4-5" -> "Claude Sonnet 4.5").
 */
export function getModelDisplayName(modelId: string): string {
  const slash = modelId.indexOf("/");
  const name = slash > 0 ? modelId.slice(slash + 1) : modelId;
  return name
    .split(/[-./]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Group model IDs by provider for selector UI.
 */
export function groupModelsByProvider(modelIds: string[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const id of modelIds) {
    const provider = getProviderFromModelId(id);
    const list = map.get(provider) ?? [];
    list.push(id);
    map.set(provider, list);
  }
  return map;
}
