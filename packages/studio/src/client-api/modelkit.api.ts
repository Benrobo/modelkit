import type { ModelOverride } from "@benrobo/modelkit";

export interface OverrideItem {
  featureId: string;
  override: ModelOverride;
}

export interface ModelKitApi {
  listOverrides: () => Promise<OverrideItem[]>;
  setOverride: (featureId: string, override: ModelOverride) => Promise<void>;
  clearOverride: (featureId: string) => Promise<void>;
}

export function createModelKitApi(baseUrl: string): ModelKitApi {
  if (!baseUrl) {
    throw new Error("baseUrl is required for ModelKit API");
  }

  const url = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  return {
    async listOverrides() {
      const res = await fetch(`${url}/overrides`);
      if (!res.ok) {
        throw new Error(`Failed to list overrides: ${res.statusText}`);
      }
      return res.json();
    },

    async setOverride(featureId: string, override: ModelOverride) {
      const res = await fetch(`${url}/overrides/${encodeURIComponent(featureId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(override),
      });
      if (!res.ok) {
        throw new Error(`Failed to set override: ${res.statusText}`);
      }
    },

    async clearOverride(featureId: string) {
      const res = await fetch(`${url}/overrides/${encodeURIComponent(featureId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to clear override: ${res.statusText}`);
      }
    },
  };
}
