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
    <div className="mk:fixed mk:inset-0 mk:z-50 mk:flex mk:items-center mk:justify-center mk:bg-black/70 mk:backdrop-blur-sm mk:p-4">
      <TacticalPanel className="mk:w-full mk:max-w-2xl mk:bg-mk-surface mk:border mk:border-mk-border">
        <form
          onSubmit={handleSubmit}
          className="mk:p-mk-xl mk:space-y-mk-lg mk:max-h-[85vh] mk:overflow-y-auto"
        >
          <div className="mk:flex mk:items-center mk:justify-between mk:border-b mk:border-mk-border mk:pb-mk-md">
            <h2 className="mk:text-xl mk:font-bold mk:text-mk-text mk:uppercase mk:tracking-tight">
              Create New Override
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="mk:text-mk-text-secondary mk:hover:text-mk-text mk:px-2 mk:py-1"
            >
              ✕
            </button>
          </div>

          <div className="mk:space-y-mk-md">
            <div>
              <label className="mk:block mk:text-xs mk:font-bold mk:text-mk-text-secondary mk:uppercase mk:tracking-wide mk:mb-2">
                Feature ID
              </label>
              <input
                type="text"
                value={featureId}
                onChange={(e) => setFeatureId(e.target.value)}
                placeholder="my-feature-id"
                className="mk:w-full mk:px-3 mk:py-2 mk:bg-mk-background/50 mk:border mk:border-mk-border mk:text-mk-text mk:focus:border-mk-primary/50 mk:focus:outline-none"
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

          <div className="mk:flex mk:gap-mk-md mk:pt-mk-md mk:border-t mk:border-mk-border">
            <button
              type="submit"
              disabled={isCreating || !featureId.trim() || !modelId}
              className={cn(
                "mk:flex-1 mk:px-6 mk:py-3 mk:uppercase mk:font-bold mk:tracking-wide mk:transition-colors",
                "mk:bg-mk-primary mk:text-mk-background mk:hover:bg-mk-primary/90",
                "mk:disabled:opacity-50 mk:disabled:cursor-not-allowed"
              )}
            >
              {isCreating ? "Creating..." : "Create Override"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mk:flex-1 mk:px-6 mk:py-3 mk:uppercase mk:font-bold mk:tracking-wide mk:transition-colors mk:border mk:border-mk-border mk:text-mk-text mk:hover:bg-mk-surface-hover"
            >
              Cancel
            </button>
          </div>
        </form>
      </TacticalPanel>
    </div>
  );
}
