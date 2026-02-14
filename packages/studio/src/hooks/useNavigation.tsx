import { useCallback, useState } from "react";

export type StudioView = "list" | "detail";

export function useNavigation(): {
  view: StudioView;
  selectedFeatureId: string | null;
  goToList: () => void;
  goToDetail: (featureId: string) => void;
} {
  const [view, setView] = useState<StudioView>("list");
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  const goToList = useCallback(() => {
    setSelectedFeatureId(null);
    setView("list");
  }, []);

  const goToDetail = useCallback((featureId: string) => {
    setSelectedFeatureId(featureId);
    setView("detail");
  }, []);

  return {
    view,
    selectedFeatureId,
    goToList,
    goToDetail,
  };
}
