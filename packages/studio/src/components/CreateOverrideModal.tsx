import { useState, type ReactElement } from "react";
import type { OpenRouterModelId } from "@benrobo/modelkit";
import { cn } from "../utils/cn";
import { useOverrides } from "../hooks/useOverrides";
import { ModelSelector } from "./ModelSelector";
import { ParameterEditor } from "./ParameterEditor";
import { CancelCircleIcon } from "./Icons";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <div
      className="mk:fixed mk:inset-0 mk:z-50 mk:flex mk:items-center mk:justify-center mk:p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className={cn(
          "mk:w-full mk:max-w-lg mk:bg-mk-surface mk:border mk:border-mk-border mk:rounded-lg mk:shadow-2xl",
          "mk:animate-in mk:fade-in mk:zoom-in-95 mk:duration-150"
        )}
      >
        {/* Modal header */}
        <div className="mk:flex mk:items-center mk:justify-between mk:px-5 mk:py-4 mk:border-b mk:border-mk-border">
          <h2 className="mk:text-sm mk:font-semibold mk:text-mk-text">
            New override
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="mk:w-7 mk:h-7 mk:flex mk:items-center mk:justify-center mk:rounded-md mk:text-mk-text-muted mk:hover:text-mk-text mk:hover:bg-mk-surface-hover mk:transition-colors"
            aria-label="Close"
          >
            <CancelCircleIcon size={16} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mk:p-5 mk:space-y-4 mk:max-h-[70vh] mk:overflow-y-auto custom-scrollbar"
        >
          <div className="mk:space-y-1.5">
            <label className="mk:text-xs mk:font-medium mk:text-mk-text-muted mk:block">
              Feature ID
            </label>
            <input
              type="text"
              value={featureId}
              onChange={(e) => setFeatureId(e.target.value)}
              placeholder="e.g. chat-completion"
              className={cn(
                "mk:w-full mk:bg-mk-background mk:border mk:border-mk-border mk:rounded-md",
                "mk:px-3 mk:py-2 mk:text-sm mk:text-mk-text mk:font-mono mk:placeholder:text-mk-text-muted",
                "mk:focus:outline-none mk:focus:ring-1 mk:focus:ring-mk-primary/40 mk:focus:border-mk-border-hover mk:transition-all"
              )}
              autoFocus
              required
            />
          </div>

          <ModelSelector value={modelId} onChange={setModelId} />

          <div className="mk:space-y-1.5">
            <label className="mk:text-xs mk:font-medium mk:text-mk-text-muted mk:block">
              Parameters
            </label>
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

          {/* Footer actions */}
          <div className="mk:flex mk:items-center mk:justify-end mk:gap-2 mk:pt-2">
            <button
              type="button"
              onClick={onClose}
              className="mk:px-4 mk:py-2 mk:text-sm mk:text-mk-text-muted mk:hover:text-mk-text mk:hover:bg-mk-surface-hover mk:rounded-md mk:transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !featureId.trim() || !modelId}
              className={cn(
                "mk:flex mk:items-center mk:gap-2 mk:px-4 mk:py-2 mk:rounded-md mk:text-sm mk:font-medium",
                "mk:bg-mk-primary mk:text-white mk:transition-colors",
                "mk:hover:bg-mk-primary/90",
                "mk:disabled:opacity-40 mk:disabled:cursor-not-allowed"
              )}
            >
              {isCreating ? (
                <>
                  <span className="mk:w-3.5 mk:h-3.5 mk:border-2 mk:border-white/30 mk:border-t-white mk:rounded-full mk:animate-spin mk:inline-block" />
                  Creating…
                </>
              ) : (
                "Create override"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
