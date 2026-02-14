import type { ModelOverride } from "@benrobo/modelkit";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TacticalToast } from "../components/TacticalToast";
import { useModelKitApi } from "./useModelKitApi";
import type { OverrideItem } from "../client-api";
import { useNavigation } from "./useNavigation";

const OVERRIDES_QUERY_KEY = ["modelkit", "overrides"] as const;

export function useOverrides(): {
  overrides: OverrideItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  setOverride: (featureId: string, override: ModelOverride) => Promise<void>;
  clearOverride: (featureId: string) => Promise<void>;
  isSettingOverride: boolean;
  isClearingOverride: boolean;
} {
  const { goToList } = useNavigation();
  const api = useModelKitApi();
  const queryClient = useQueryClient();

  const {
    data: overrides = [],
    isPending: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: OVERRIDES_QUERY_KEY,
    queryFn: () => api.listOverrides(),
  });

  const setOverrideMutation = useMutation({
    mutationFn: ({
      featureId,
      override,
    }: {
      featureId: string;
      override: ModelOverride;
    }) => api.setOverride(featureId, override),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: OVERRIDES_QUERY_KEY });
      toast.custom(() => (
        <TacticalToast
          type="success"
          message={`Override for "${variables.featureId}" updated successfully`}
        />
      ));
    },
    onError: (error, variables) => {
      toast.custom(() => (
        <TacticalToast
          type="error"
          message={`Failed to update override for "${variables.featureId}": ${error.message}`}
        />
      ));
    },
  });

  const clearOverrideMutation = useMutation({
    mutationFn: (featureId: string) => api.clearOverride(featureId),
    onSuccess: (_data, featureId) => {
      queryClient.invalidateQueries({ queryKey: OVERRIDES_QUERY_KEY });
      toast.custom(() => (
        <TacticalToast
          type="success"
          message={`Override for "${featureId}" cleared successfully`}
        />
      ));
    },
    onError: (error, featureId) => {
      toast.custom(() => (
        <TacticalToast
          type="error"
          message={`Failed to clear override for "${featureId}": ${error.message}`}
        />
      ));
    },
  });

  const setOverride = async (featureId: string, override: ModelOverride) => {
    await setOverrideMutation.mutateAsync({ featureId, override });
  };

  const clearOverride = async (featureId: string) => {
    await clearOverrideMutation.mutateAsync(featureId);
    goToList();
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
