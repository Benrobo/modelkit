import { useOverrides } from "./useOverrides";

export interface FeatureWithId {
  id: string;
}

export function useFeatures(): {
  features: FeatureWithId[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { overrides, loading, error, refetch } = useOverrides();

  const features = overrides.map((item) => ({
    id: item.featureId
  }));

  return {
    features,
    loading,
    error,
    refetch,
  };
}
