import { useCallback, useEffect, useState } from "react";

export type StudioView = "list" | "detail";

export function useNavigation(): {
  view: StudioView;
  selectedFeatureId: string | null;
  goToList: () => void;
  goToDetail: (featureId: string) => void;
} {
  const [params, setParams] = useState(
    () => new URLSearchParams(window.location.search),
  );

  useEffect(() => {
    const handlePopState = () => {
      setParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateUrl = useCallback((newParams: URLSearchParams) => {
    const search = newParams.toString();
    const url = `${window.location.pathname}${search ? "?" + search : ""}`;
    window.history.pushState({}, "", url);
    setParams(newParams);
  }, []);

  const view = (params.get("view") as StudioView) || "list";
  const selectedFeatureId = params.get("featureId");

  const goToList = useCallback(() => {
    const next = new URLSearchParams(window.location.search);
    next.set("view", "list");
    next.delete("featureId");
    updateUrl(next);
  }, [updateUrl]);

  const goToDetail = useCallback(
    (featureId: string) => {
      const next = new URLSearchParams(window.location.search);
      next.set("view", "detail");
      next.set("featureId", featureId);
      updateUrl(next);
    },
    [updateUrl],
  );

  return {
    view,
    selectedFeatureId,
    goToList,
    goToDetail,
  };
}
