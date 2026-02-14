import type { FeatureConfig } from "modelkit";
import { useQuery } from "@tanstack/react-query";
import { useModelKit } from "./useModelKit";

export interface FeatureWithId extends FeatureConfig {
  id: string;
}

const FEATURES_QUERY_KEY = ["modelkit", "features"] as const;

export function useFeatures(): {
  features: FeatureWithId[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const modelKit = useModelKit();
  const {
    data: features = [],
    isPending: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: FEATURES_QUERY_KEY,
    queryFn: () => modelKit.listFeatures(),
  });

  return {
    features,
    loading,
    error: error instanceof Error ? error : error ? new Error(String(error)) : null,
    refetch,
  };
}
