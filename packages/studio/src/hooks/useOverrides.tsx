import type { ModelOverride } from "modelkit";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useModelKit } from "./useModelKit";

export interface OverrideItem {
  featureId: string;
  override: ModelOverride;
}

const OVERRIDES_QUERY_KEY = ["modelkit", "overrides"] as const;

export function useOverrides(): {
  overrides: OverrideItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  setOverride: (featureId: string, override: Partial<ModelOverride>) => Promise<void>;
  clearOverride: (featureId: string) => Promise<void>;
  isSettingOverride: boolean;
  isClearingOverride: boolean;
} {
  const modelKit = useModelKit();
  const queryClient = useQueryClient();

  const {
    data: overrides = [],
    isPending: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: OVERRIDES_QUERY_KEY,
    queryFn: () => modelKit.listOverrides(),
  });

  const setOverrideMutation = useMutation({
    mutationFn: ({
      featureId,
      override,
    }: {
      featureId: string;
      override: Partial<ModelOverride>;
    }) => modelKit.setOverride(featureId, override),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERRIDES_QUERY_KEY });
    },
  });

  const clearOverrideMutation = useMutation({
    mutationFn: (featureId: string) => modelKit.clearOverride(featureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OVERRIDES_QUERY_KEY });
    },
  });

  const setOverride = async (
    featureId: string,
    override: Partial<ModelOverride>
  ) => {
    await setOverrideMutation.mutateAsync({ featureId, override });
  };

  const clearOverride = async (featureId: string) => {
    await clearOverrideMutation.mutateAsync(featureId);
  };

  return {
    overrides,
    loading,
    error:
      error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
    setOverride,
    clearOverride,
    isSettingOverride: setOverrideMutation.isPending,
    isClearingOverride: clearOverrideMutation.isPending,
  };
}
