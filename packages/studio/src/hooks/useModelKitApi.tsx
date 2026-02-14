import { createContext, useContext, type ReactNode } from "react";

export interface ModelKitApiClient {
  baseUrl: string;
  listOverrides: () => Promise<Array<{ featureId: string; override: any }>>;
  getOverride: (featureId: string) => Promise<any | null>;
  setOverride: (featureId: string, override: any) => Promise<void>;
  clearOverride: (featureId: string) => Promise<void>;
}

function createApiClient(baseUrl: string): ModelKitApiClient {
  if (!baseUrl) {
    throw new Error("apiUrl is required for ModelKitApiProvider");
  }
  const normalizedUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  return {
    baseUrl: normalizedUrl,

    async listOverrides() {
      const res = await fetch(`${normalizedUrl}/overrides`);
      if (!res.ok) throw new Error(`Failed to list overrides: ${res.statusText}`);
      return res.json();
    },

    async getOverride(featureId: string) {
      const res = await fetch(`${normalizedUrl}/overrides/${encodeURIComponent(featureId)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`Failed to get override: ${res.statusText}`);
      return res.json();
    },

    async setOverride(featureId: string, override: any) {
      const res = await fetch(`${normalizedUrl}/overrides/${encodeURIComponent(featureId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(override),
      });
      if (!res.ok) throw new Error(`Failed to set override: ${res.statusText}`);
    },

    async clearOverride(featureId: string) {
      const res = await fetch(`${normalizedUrl}/overrides/${encodeURIComponent(featureId)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to clear override: ${res.statusText}`);
    },
  };
}

const ModelKitApiContext = createContext<ModelKitApiClient | null>(null);

export function ModelKitApiProvider({
  apiUrl,
  children,
}: {
  apiUrl: string;
  children: ReactNode;
}) {
  const client = createApiClient(apiUrl);
  return (
    <ModelKitApiContext.Provider value={client}>
      {children}
    </ModelKitApiContext.Provider>
  );
}

export function useModelKitApi(): ModelKitApiClient {
  const context = useContext(ModelKitApiContext);
  if (!context) {
    throw new Error("useModelKitApi must be used within ModelKitApiProvider");
  }
  return context;
}
