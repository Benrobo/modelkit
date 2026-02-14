import { useState, useEffect, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useFeatures } from "../hooks/useFeatures";
import { useOverrides } from "../hooks/useOverrides";
import { useAvailableModels } from "../hooks/useAvailableModels";
import { useModelKit } from "../hooks/useModelKit";
import { OverrideIndicator } from "./OverrideIndicator";
import { ModelSelector } from "./ModelSelector";
import { ParameterEditor } from "./ParameterEditor";

export interface FeatureDetailProps {
  featureId: string;
  onBack?: () => void;
  className?: string;
}

export function FeatureDetail({
  featureId,
  onBack,
  className,
}: FeatureDetailProps): ReactElement {
  const modelKit = useModelKit();
  const { features, loading: featuresLoading } = useFeatures();
  const {
    overrides,
    setOverride,
    clearOverride,
    loading: overridesLoading,
  } = useOverrides();
  const { allModels } = useAvailableModels();

  const config = features.find((f) => f.id === featureId);
  const override = overrides.find((o) => o.featureId === featureId)?.override;

  const [modelId, setModelId] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (config) {
      setModelId(override?.modelId ?? config.modelId);
      setTemperature(override?.temperature ?? config.temperature ?? 0.7);
      setMaxTokens(override?.maxTokens ?? config.maxTokens ?? 4096);
    }
  }, [config, override, featureId]);

  if (featuresLoading || overridesLoading) {
    return (
      <div className="p-mk-xl text-mk-text-muted font-mk-mono text-sm animate-pulse">
        Initializing Interface...
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-mk-xl text-mk-color-error font-mk-mono text-sm border border-mk-color-error/20 bg-mk-color-error/5">
        Registry Entry "{featureId}" not found.
      </div>
    );
  }

  const isModified =
    modelId !== (override?.modelId ?? config.modelId) ||
    temperature !== (override?.temperature ?? config.temperature) ||
    maxTokens !== (override?.maxTokens ?? config.maxTokens);

  const handleCommit = async () => {
    setIsUpdating(true);
    try {
      await setOverride(featureId, { modelId, temperature, maxTokens });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = async () => {
    setIsUpdating(true);
    try {
      await clearOverride(featureId);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={cn(
        "mk-panel bg-mk-surface/50 border border-mk-border h-full flex flex-col overflow-hidden",
        className,
      )}
    >
      <div className="p-mk-xl border-b border-mk-border/50 flex items-center justify-between gap-mk-lg flex-shrink-0">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="font-mk-mono text-xl text-mk-text font-bold uppercase tracking-tight truncate">
              {config.name ?? featureId}
            </h2>
            {override != null && (
              <div className="px-2 py-0.5 bg-mk-primary text-mk-background text-[10px] font-mk-mono font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(var(--mk-primary-rgb),0.3)] shrink-0">
                ACTIVE OVERRIDE
              </div>
            )}
          </div>
          {config.title != null && config.title !== "" && (
            <p className="text-mk-text-muted text-sm font-mk-mono uppercase tracking-[0.15em] opacity-60 truncate">
              {config.title}
            </p>
          )}
        </div>

        {override != null && (
          <button
            onClick={handleReset}
            disabled={isUpdating}
            className="text-mk-color-error/70 hover:text-mk-color-error text-xs font-mk-mono font-bold uppercase tracking-widest transition-colors px-4 py-2.5 border border-mk-color-error/20 hover:bg-mk-color-error/5 shrink-0"
          >
            Clear Override
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-mk-xl space-y-mk-xl custom-scrollbar min-h-0">
        <section className="animate-in fade-in slide-in-from-top-2 duration-300">
          <OverrideIndicator
            defaultModelId={config.modelId}
            overrideModelId={override?.modelId}
          />
        </section>

        <section className="space-y-mk-xl border-t border-mk-border/30 pt-mk-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-mk-md">
            <div className="w-1.5 h-1.5 bg-mk-primary shadow-[0_0_8px_rgba(var(--mk-primary-rgb),0.5)]" />
            <h3 className="text-sm font-mk-mono font-bold text-mk-text uppercase tracking-widest">
              Runtime Parameters
            </h3>
          </div>

          <div className="space-y-mk-xl pl-mk-md border-l-2 border-mk-border/20">
            <ModelSelector value={modelId} onChange={setModelId} />
            <ParameterEditor
              temperature={temperature}
              maxTokens={maxTokens}
              onTemperatureChange={setTemperature}
              onMaxTokensChange={setMaxTokens}
            />
          </div>

          <div className="pt-mk-xl flex flex-col sm:flex-row gap-mk-md border-t border-mk-border/10 flex-shrink-0">
            <button
              onClick={handleCommit}
              disabled={!isModified || isUpdating}
              className={cn(
                "flex-1 border border-mk-primary bg-mk-primary text-mk-background px-8 py-4 text-sm font-mk-mono font-bold uppercase tracking-widest transition-all",
                "hover:bg-transparent hover:text-mk-primary disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(var(--mk-primary-rgb),0.2)]",
              )}
            >
              {isUpdating ? "Storing Registry Override..." : "Commit Override"}
            </button>
            <button
              onClick={() => {
                setModelId(override?.modelId ?? config.modelId);
                setTemperature(override?.temperature ?? config.temperature ?? 0.7);
                setMaxTokens(override?.maxTokens ?? config.maxTokens ?? 4096);
              }}
              disabled={!isModified || isUpdating}
              className={cn(
                "flex-1 border border-mk-border text-mk-text-muted px-8 py-4 text-sm font-mk-mono font-bold uppercase tracking-widest transition-all",
                "hover:text-mk-text hover:bg-mk-surface-hover disabled:opacity-30",
              )}
            >
              Discard Changes
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
