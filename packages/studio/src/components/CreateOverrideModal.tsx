import { useState, type ReactElement } from "react";
import type { OpenRouterModelId } from "@benrobo/modelkit";
import { cn } from "../utils/cn";
import { useOverrides } from "../hooks/useOverrides";
import { ModelSelector } from "./ModelSelector";
import { ParameterEditor } from "./ParameterEditor";
import { TacticalPanel } from "./TacticalPanel";

export interface CreateOverrideModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateOverrideModal({
  onClose,
  onSuccess,
}: CreateOverrideModalProps): ReactElement {
  const { setOverride } = useOverrides();
  const [featureId, setFeatureId] = useState("");
  const [modelId, setModelId] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [topP, setTopP] = useState(1);
  const [topK, setTopK] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureId.trim() || !modelId) return;

    setIsCreating(true);
    try {
      await setOverride(featureId.trim(), {
        modelId: modelId as OpenRouterModelId,
        temperature,
        maxTokens,
        topP,
        topK,
      });
      onSuccess();
      onClose();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <TacticalPanel className="w-full max-w-2xl bg-mk-surface border border-mk-border">
        <form
          onSubmit={handleSubmit}
          className="p-mk-xl space-y-mk-lg max-h-[85vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-mk-border pb-mk-md">
            <h2 className="text-xl font-bold text-mk-text uppercase tracking-tight">
              Create New Override
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-mk-text-secondary hover:text-mk-text px-2 py-1"
            >
              ✕
            </button>
          </div>

          <div className="space-y-mk-md">
            <div>
              <label className="block text-xs font-bold text-mk-text-secondary uppercase tracking-wide mb-2">
                Feature ID
              </label>
              <input
                type="text"
                value={featureId}
                onChange={(e) => setFeatureId(e.target.value)}
                placeholder="my-feature-id"
                className="w-full px-3 py-2 bg-mk-background/50 border border-mk-border text-mk-text focus:border-mk-primary/50 focus:outline-none"
                autoFocus
                required
              />
            </div>

            <ModelSelector value={modelId} onChange={setModelId} />

            <ParameterEditor
              temperature={temperature}
              maxTokens={maxTokens}
              topP={topP}
              topK={topK}
              onTemperatureChange={setTemperature}
              onMaxTokensChange={setMaxTokens}
              onTopPChange={setTopP}
              onTopKChange={setTopK}
            />
          </div>

          <div className="flex gap-mk-md pt-mk-md border-t border-mk-border">
            <button
              type="submit"
              disabled={isCreating || !featureId.trim() || !modelId}
              className={cn(
                "flex-1 px-6 py-3 uppercase font-bold tracking-wide transition-colors",
                "bg-mk-primary text-mk-background hover:bg-mk-primary/90",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isCreating ? "Creating..." : "Create Override"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 uppercase font-bold tracking-wide transition-colors border border-mk-border text-mk-text hover:bg-mk-surface-hover"
            >
              Cancel
            </button>
          </div>
        </form>
      </TacticalPanel>
    </div>
  );
}
