import { createContext, useContext, type ReactNode } from "react";
import type { ModelKit } from "modelkit";

const ModelKitContext = createContext<ModelKit | null>(null);

export function ModelKitProvider({
  modelKit,
  children,
}: {
  modelKit: ModelKit;
  children: ReactNode;
}) {
  return (
    <ModelKitContext.Provider value={modelKit}>
      {children}
    </ModelKitContext.Provider>
  );
}

export function useModelKit(): ModelKit {
  const ctx = useContext(ModelKitContext);
  if (!ctx) throw new Error("useModelKit must be used within ModelKitStudio");
  return ctx;
}
