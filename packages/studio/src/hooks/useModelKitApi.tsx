import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createModelKitApi, type ModelKitApi } from "../client-api";

const ModelKitApiContext = createContext<ModelKitApi | null>(null);

export function ModelKitApiProvider({
  apiUrl,
  children,
}: {
  apiUrl: string;
  children: ReactNode;
}) {
  const api = useMemo(() => createModelKitApi(apiUrl), [apiUrl]);

  return (
    <ModelKitApiContext.Provider value={api}>
      {children}
    </ModelKitApiContext.Provider>
  );
}

export function useModelKitApi(): ModelKitApi {
  const context = useContext(ModelKitApiContext);
  if (!context) {
    throw new Error("useModelKitApi must be used within ModelKitApiProvider");
  }
  return context;
}
