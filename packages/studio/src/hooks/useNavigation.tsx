import { useQueryState, parseAsStringLiteral } from "nuqs";
import { useCallback } from "react";

export type StudioView = "list" | "detail";

export function useNavigation(): {
  view: StudioView;
  selectedFeatureId: string | null;
  goToList: () => void;
  goToDetail: (featureId: string) => void;
} {
  const [view, setView] = useQueryState(
    "view",
    parseAsStringLiteral(["list", "detail"] as const).withDefault("list")
  );
  const [selectedFeatureId, setSelectedFeatureId] = useQueryState("featureId");

  const goToList = useCallback(() => {
    setView("list");
    setSelectedFeatureId(null);
  }, [setView, setSelectedFeatureId]);

  const goToDetail = useCallback(
    (featureId: string) => {
      setView("detail");
      setSelectedFeatureId(featureId);
    },
    [setView, setSelectedFeatureId],
  );

  return {
    view,
    selectedFeatureId,
    goToList,
    goToDetail,
  };
}
