import { useState, useEffect, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useOverrides } from "../hooks/useOverrides";
import { ModelSelector } from "./ModelSelector";
import { ParameterEditor } from "./ParameterEditor";
import { TacticalPanel } from "./TacticalPanel";
import { OpenRouterModelId } from "modelkit";

export interface FeatureDetailProps {
  featureId: string;
  onBack?: () => void;
  className?: string;
}

export function FeatureDetail({
  featureId,
  className,
}: FeatureDetailProps): ReactElement {
  const {
    overrides,
    setOverride,
    clearOverride,
    loading: overridesLoading,
  } = useOverrides();

  const override = overrides.find((o) => o.featureId === featureId)?.override;

  const [editingFeatureId, setEditingFeatureId] = useState(featureId);
  const [modelId, setModelId] = useState(override?.modelId ?? "");
  const [temperature, setTemperature] = useState(override?.temperature ?? 0.7);
  const [maxTokens, setMaxTokens] = useState(override?.maxTokens ?? 4096);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setEditingFeatureId(featureId);
  }, [featureId]);

  useEffect(() => {
    if (override) {
      setModelId(override.modelId);
      setTemperature(override.temperature ?? 0.7);
      setMaxTokens(override.maxTokens ?? 4096);
    }
  }, [override]);

  if (overridesLoading) {
    return (
      <div className="p-mk-xl text-mk-text-muted text-sm animate-pulse">
        Loading...
      </div>
    );
  }

  const isNewOverride = !override;
  const isModified = isNewOverride
    ? modelId !== "" || editingFeatureId !== featureId
    : editingFeatureId !== featureId ||
      modelId !== override.modelId ||
      temperature !== (override.temperature ?? 0.7) ||
      maxTokens !== (override.maxTokens ?? 4096);

  const handleCommit = async () => {
    if (!editingFeatureId.trim() || !modelId) return;

    setIsUpdating(true);
    try {
      // If feature ID changed, clear the old one first
      if (!isNewOverride && editingFeatureId !== featureId) {
        await clearOverride(featureId);
      }
      await setOverride(editingFeatureId.trim(), {
        modelId: modelId as OpenRouterModelId,
        temperature,
        maxTokens,
      });
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
    <TacticalPanel
      className={cn(
        "bg-mk-surface/50 border border-mk-border h-full flex flex-col overflow-hidden",
        className
      )}
    >
      <div className="p-mk-xl border-b border-mk-border/50 flex items-start justify-between gap-mk-lg flex-shrink-0">
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-bold text-mk-text-secondary uppercase tracking-widest mb-1.5">
            Feature ID
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={editingFeatureId}
              onChange={(e) => setEditingFeatureId(e.target.value)}
              className="flex-1 px-3 py-2 bg-mk-surface border border-mk-border text-mk-text text-base font-bold uppercase focus:border-mk-border-accent focus:outline-none"
            />
            {!isNewOverride && (
              <div className="px-3 py-1.5 bg-mk-primary text-mk-background text-[10px] font-bold uppercase tracking-widest shrink-0">
                ACTIVE OVERRIDE
              </div>
            )}
            {isNewOverride && (
              <div className="px-3 py-1.5 bg-mk-text-muted text-mk-background text-[10px] font-bold uppercase tracking-widest shrink-0">
                NEW
              </div>
            )}
          </div>
        </div>

        {!isNewOverride && (
          <button
            onClick={handleReset}
            disabled={isUpdating}
            className="text-mk-color-error/70 hover:text-mk-color-error text-xs font-bold uppercase tracking-widest transition-colors px-4 py-2.5 border border-mk-color-error/20 hover:bg-mk-color-error/5 shrink-0 self-end"
          >
            Clear Override
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-mk-xl space-y-mk-xl custom-scrollbar min-h-0">
        <section className="space-y-mk-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-mk-md">
            <div className="w-1.5 h-1.5 bg-mk-primary shadow-[0_0_8px_rgba(var(--mk-primary-rgb),0.5)]" />
            <h3 className="text-sm font-mk-mono font-bold text-mk-text uppercase tracking-widest">
              Override Parameters
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
              disabled={!isModified || isUpdating || !modelId}
              className={cn(
                "flex-1 border border-mk-primary bg-mk-primary text-mk-background px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all",
                "hover:bg-transparent hover:text-mk-primary disabled:opacity-30 disabled:cursor-not-allowed"
              )}
            >
              {isUpdating
                ? "Updating..."
                : isNewOverride
                ? "Create Override"
                : "Update Override"}
            </button>
            <button
              onClick={() => {
                if (override) {
                  setModelId(override.modelId);
                  setTemperature(override.temperature ?? 0.7);
                  setMaxTokens(override.maxTokens ?? 4096);
                } else {
                  setModelId("");
                  setTemperature(0.7);
                  setMaxTokens(4096);
                }
              }}
              disabled={!isModified || isUpdating}
              className={cn(
                "flex-1 border border-mk-border text-mk-text-muted px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all",
                "hover:text-mk-text hover:bg-mk-surface-hover disabled:opacity-30"
              )}
            >
              Discard Changes
            </button>
          </div>
        </section>
      </div>
    </TacticalPanel>
  );
}
