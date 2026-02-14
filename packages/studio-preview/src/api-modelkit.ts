/**
 * ModelKit client that talks to the example API server (examples/api-server).
 * Set VITE_API_URL=http://localhost:3456 to use real data instead of the mock.
 */

import type { ModelKit } from "modelkit";

export function createApiModelKit(baseUrl: string): ModelKit {
  const api = (path: string, options?: RequestInit) =>
    fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

  return {
    async getModel(featureId: string): Promise<string> {
      const res = await api(`/api/features/${encodeURIComponent(featureId)}/model`);
      if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
      const { modelId } = (await res.json()) as { modelId: string };
      return modelId;
    },

    async getConfig(featureId: string) {
      const res = await api(`/api/features/${encodeURIComponent(featureId)}/config`);
      if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
      return res.json();
    },

    async setOverride(
      featureId: string,
      override: { modelId?: string; temperature?: number; maxTokens?: number }
    ): Promise<void> {
      const res = await api(`/api/features/${encodeURIComponent(featureId)}/override`, {
        method: "POST",
        body: JSON.stringify(override),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
    },

    async clearOverride(featureId: string): Promise<void> {
      const res = await api(`/api/features/${encodeURIComponent(featureId)}/override`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
    },

    async listOverrides() {
      const res = await api("/api/overrides");
      if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
      return res.json();
    },

    async listFeatures() {
      const res = await api("/api/features");
      if (!res.ok) throw new Error((await res.json()).error ?? res.statusText);
      return res.json();
    },
  };
}
