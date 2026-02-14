import { useState, useEffect, useCallback, type ReactElement } from "react";
import type { ModelKit } from "modelkit";
import { cn } from "../utils/cn";
import { useModelKit } from "../hooks/useModelKit";
import { useFeatures } from "../hooks/useFeatures";
import { useOverrides } from "../hooks/useOverrides";
import { OverrideIndicator } from "./OverrideIndicator";
import { ModelSelector } from "./ModelSelector";
import { ParameterEditor } from "./ParameterEditor";

export interface FeatureDetailProps {
  featureId: string;
  onBack: () => void;
  className?: string;
}

export function FeatureDetail({
  featureId,
  onBack: _onBack,
  className,
}: FeatureDetailProps): ReactElement {
  const modelKit = useModelKit();
  const { features } = useFeatures();
  const {
    setOverride,
    clearOverride,
    isSettingOverride,
    isClearingOverride,
  } = useOverrides();
  const defaultConfig = features.find((f) => f.id === featureId);
  const [config, setConfig] = useState<Awaited<ReturnType<ModelKit["getConfig"]>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [formModelId, setFormModelId] = useState("");
  const [formTemperature, setFormTemperature] = useState(0.7);
  const [formMaxTokens, setFormMaxTokens] = useState(4096);
  const saving = isSettingOverride || isClearingOverride;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await modelKit.getConfig(featureId);
      setConfig(c);
      setFormModelId(c.modelId);
      setFormTemperature(c.temperature ?? 0.7);
      setFormMaxTokens(c.maxTokens ?? 4096);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [modelKit, featureId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    await setOverride(featureId, {
      modelId: formModelId,
      temperature: formTemperature,
      maxTokens: formMaxTokens,
    });
  };

  const handleClear = async () => {
    await clearOverride(featureId);
    await load();
  };

  if (loading || !config) {
    return (
      <div className={cn("text-mk-text-secondary text-sm py-mk-lg", className)}>
        {loading ? "Loading…" : error?.message ?? "Not found"}
      </div>
    );
  }

  const displayName = (defaultConfig?.name ?? config?.name) || featureId;
  const displayTitle = defaultConfig?.title ?? config?.title;

  return (
    <div className={cn("space-y-mk-lg", className)}>
      <div className="mk-panel relative border border-mk-border p-mk-lg space-y-mk-lg">
      <div className="font-mk-mono text-mk-text font-medium">
        ┌─ {displayName} ─
      </div>
      {displayTitle != null && displayTitle !== "" && (
        <p className="text-mk-text-secondary text-sm font-mk-mono">{displayTitle}</p>
      )}
      <OverrideIndicator
        defaultModelId={defaultConfig?.modelId ?? config.modelId}
        overrideModelId={
          config.modelId !== (defaultConfig?.modelId ?? config.modelId)
            ? config.modelId
            : null
        }
      />
      <ModelSelector value={formModelId} onChange={setFormModelId} />
      <ParameterEditor
        temperature={formTemperature}
        maxTokens={formMaxTokens}
        onTemperatureChange={setFormTemperature}
        onMaxTokensChange={setFormMaxTokens}
      />
      <div className="flex gap-mk-sm">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-mk-md bg-mk-primary text-mk-background px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Override"}
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={saving}
          className="rounded-mk-md border border-mk-border text-mk-text px-4 py-2 text-sm font-medium hover:bg-mk-surface disabled:opacity-50"
        >
          Clear
        </button>
      </div>
      </div>
    </div>
  );
}
