import { useState, useEffect, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useOverrides } from "../hooks/useOverrides";
import { ModelSelector } from "./ModelSelector";
import { ParameterEditor } from "./ParameterEditor";
import { TacticalPanel } from "./TacticalPanel";
import { OpenRouterModelId } from "@benrobo/modelkit";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  const [topP, setTopP] = useState(override?.topP ?? 1);
  const [topK, setTopK] = useState(override?.topK ?? 0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setEditingFeatureId(featureId);
  }, [featureId]);

  useEffect(() => {
    if (override) {
      setModelId(override.modelId);
      setTemperature(override.temperature ?? 0.7);
      setMaxTokens(override.maxTokens ?? 4096);
      setTopP(override.topP ?? 1);
      setTopK(override.topK ?? 0);
    }
  }, [override]);

  if (overridesLoading) {
    return (
      <div className="mk:p-mk-xl mk:text-mk-text-muted mk:text-sm mk:animate-pulse">
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
      maxTokens !== (override.maxTokens ?? 4096) ||
      topP !== (override.topP ?? 1) ||
      topK !== (override.topK ?? 0);

  const handleCommit = async () => {
    if (!editingFeatureId.trim() || !modelId) return;

    setIsUpdating(true);
    try {
      if (!isNewOverride && editingFeatureId !== featureId) {
        await clearOverride(featureId);
      }
      await setOverride(editingFeatureId.trim(), {
        modelId: modelId as OpenRouterModelId,
        temperature,
        maxTokens,
        topP,
        topK,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = async () => {
    setIsUpdating(true);
    try {
      await clearOverride(featureId);
      setModelId("");
      setTemperature(0.7);
      setMaxTokens(4096);
      setTopP(1);
      setTopK(0);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TacticalPanel
      className={cn(
        "mk:bg-mk-surface/50 mk:border mk:border-mk-border/40 mk:h-full mk:flex mk:flex-col mk:overflow-hidden",
        className
      )}
    >
      <div className="mk:p-mk-xl mk:border-b mk:border-mk-border/50 mk:flex mk:items-start mk:justify-between mk:gap-mk-lg mk:flex-shrink-0">
        <div className="mk:flex-1 mk:min-w-0">
          <label className="mk:block mk:text-[10px] mk:font-bold mk:text-mk-text-secondary mk:uppercase mk:tracking-widest mk:mb-1.5">
            Feature ID
          </label>
          <div className="mk:flex mk:items-center mk:gap-3">
            <input
              type="text"
              value={editingFeatureId}
              onChange={(e) => setEditingFeatureId(e.target.value)}
              className="mk:flex-1 mk:px-3 mk:py-2 mk:bg-mk-surface mk:border mk:border-mk-border mk:text-mk-text mk:text-base mk:font-bold mk:focus:border-mk-border-accent mk:focus:outline-none"
            />
            {/* {!isNewOverride && (
              <div className="mk:px-3 mk:py-1.5 mk:bg-mk-primary mk:text-mk-background mk:text-[10px] mk:font-bold mk:uppercase mk:tracking-widest mk:shrink-0">
                ACTIVE OVERRIDE
              </div>
            )} */}
            {isNewOverride && (
              <div className="mk:px-3 mk:py-1.5 mk:bg-mk-text-muted mk:text-mk-background mk:text-[10px] mk:font-bold mk:uppercase mk:tracking-widest mk:shrink-0">
                NEW
              </div>
            )}
          </div>
        </div>

        {!isNewOverride && (
          <button
            onClick={handleReset}
            disabled={isUpdating}
            className="mk:text-mk-color-error/70 mk:hover:text-mk-color-error mk:text-xs mk:font-bold mk:uppercase mk:tracking-widest mk:transition-colors mk:px-4 mk:py-2.5 mk:border mk:border-mk-color-error/20 mk:hover:bg-mk-color-error/5 mk:shrink-0 mk:self-end"
          >
            Clear Override
          </button>
        )}
      </div>

      <div className="mk:flex-1 mk:overflow-y-auto mk:p-mk-xl mk:space-y-mk-xl custom-scrollbar mk:min-h-0">
        <section className="mk:space-y-mk-xl mk:animate-in mk:fade-in mk:slide-in-from-top-4 mk:duration-500">
          <div className="mk:flex mk:items-center mk:gap-2 mk:mb-mk-md">
            <div className="mk:w-1.5 mk:h-1.5 mk:bg-mk-primary mk:shadow-[0_0_8px_rgba(var(--mk-primary-rgb),0.5)]" />
            <h3 className="mk:text-sm mk:font-mk-mono mk:font-bold mk:text-mk-text mk:uppercase mk:tracking-widest">
              Override Parameters
            </h3>
          </div>

          <div className="mk:space-y-mk-xl mk:pl-mk-md mk:border-l-2 mk:border-mk-border/20">
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

          <div className="mk:pt-mk-xl mk:flex mk:flex-col mk:sm:flex-row mk:gap-mk-md mk:border-t mk:border-mk-border/10 mk:flex-shrink-0">
            <button
              onClick={handleCommit}
              disabled={!isModified || isUpdating || !modelId}
              className={cn(
                "mk:flex-1 mk:border mk:border-mk-primary mk:bg-mk-primary mk:text-mk-background mk:px-8 mk:py-4 mk:text-sm mk:font-bold mk:uppercase mk:tracking-widest mk:transition-all",
                "mk:hover:bg-transparent mk:hover:text-mk-primary mk:disabled:opacity-30 mk:disabled:cursor-not-allowed"
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
                  setTopP(override.topP ?? 1);
                  setTopK(override.topK ?? 0);
                } else {
                  setModelId("");
                  setTemperature(0.7);
                  setMaxTokens(4096);
                  setTopP(1);
                  setTopK(0);
                }
              }}
              disabled={!isModified || isUpdating}
              className={cn(
                "mk:flex-1 mk:border mk:border-mk-border mk:text-mk-text-muted mk:px-8 mk:py-4 mk:text-sm mk:font-bold mk:uppercase mk:tracking-widest mk:transition-all",
                "mk:hover:text-mk-text mk:hover:bg-mk-surface-hover mk:disabled:opacity-30"
              )}
            >
              Discard Changes
            </button>
          </div>
        </section>

        {/* Usage Examples Section */}
        <section className="mk:space-y-mk-md mk:animate-in mk:fade-in mk:slide-in-from-top-6 mk:duration-700 mk:delay-150">
          <div className="mk:flex mk:items-center mk:gap-2 mk:mb-mk-md">
            <div className="mk:w-1.5 mk:h-1.5 mk:bg-mk-text-secondary/50 mk:shadow-[0_0_8px_rgba(var(--mk-text-secondary-rgb),0.3)]" />
            <h3 className="mk:text-sm mk:font-mk-mono mk:font-bold mk:text-mk-text-secondary mk:uppercase mk:tracking-widest">
              SDK Usage Examples
            </h3>
          </div>

          <div className="mk:pl-mk-md mk:border-l-2 mk:border-mk-border/10 mk:space-y-mk-lg">
            {/* Get Model */}
            <div className="mk:space-y-2">
              <p className="mk:text-xs mk:text-mk-text-muted mk:font-bold mk:uppercase mk:tracking-wide">
                Get Model
              </p>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  fontSize: "0.75rem",
                  background: "rgba(var(--mk-background-rgb), 0.8)",
                  border: "1px solid rgba(var(--mk-border-rgb), 0.3)",
                  padding: "var(--mk-spacing-md)",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "var(--font-mono)",
                  },
                }}
              >
                {`const modelId = await modelKit.getModel(
  "${editingFeatureId}",
  "anthropic/claude-3.5-sonnet" // fallback
);
// Returns: "${modelId || "fallback-model"}"${
                  override ? " (override)" : " (fallback)"
                }`}
              </SyntaxHighlighter>
            </div>

            {/* Set Override */}
            <div className="mk:space-y-2">
              <p className="mk:text-xs mk:text-mk-text-muted mk:font-bold mk:uppercase mk:tracking-wide">
                Set Override
              </p>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  fontSize: "0.75rem",
                  background: "rgba(var(--mk-background-rgb), 0.8)",
                  border: "1px solid rgba(var(--mk-border-rgb), 0.3)",
                  padding: "var(--mk-spacing-md)",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "var(--font-mono)",
                  },
                }}
              >
                {`await modelKit.setOverride("${editingFeatureId}", {
  modelId: "${modelId || "anthropic/claude-3.5-sonnet"}",
  temperature: ${temperature},
  maxTokens: ${maxTokens},
  topP: ${topP},
  topK: ${topK}
});`}
              </SyntaxHighlighter>
            </div>

            {/* Get Config */}
            <div className="mk:space-y-2">
              <p className="mk:text-xs mk:text-mk-text-muted mk:font-bold mk:uppercase mk:tracking-wide">
                Get Configuration
              </p>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  fontSize: "0.75rem",
                  background: "rgba(var(--mk-background-rgb), 0.8)",
                  border: "1px solid rgba(var(--mk-border-rgb), 0.3)",
                  padding: "var(--mk-spacing-md)",
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "var(--font-mono)",
                  },
                }}
              >
                {`const config = await modelKit.getConfig("${editingFeatureId}");
// Returns: ${
                  override
                    ? `{
//   modelId: "${modelId}",
//   temperature: ${temperature},
//   maxTokens: ${maxTokens},
//   topP: ${topP},
//   topK: ${topK},
//   updatedAt: ${override.updatedAt || Date.now()}
// }`
                    : "null (no override)"
                }`}
              </SyntaxHighlighter>
            </div>

            {/* Clear Override */}
            {override && (
              <div className="mk:space-y-2">
                <p className="mk:text-xs mk:text-mk-text-muted mk:font-bold mk:uppercase mk:tracking-wide">
                  Clear Override
                </p>
                <SyntaxHighlighter
                  language="typescript"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    fontSize: "0.75rem",
                    background: "rgba(var(--mk-background-rgb), 0.8)",
                    border: "1px solid rgba(var(--mk-border-rgb), 0.3)",
                    padding: "var(--mk-spacing-md)",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "var(--font-mono)",
                    },
                  }}
                >
                  {`await modelKit.clearOverride("${editingFeatureId}");
// Reverts to fallback model`}
                </SyntaxHighlighter>
              </div>
            )}

            {/* Type Safety Hint */}
            <div className="mk:mt-mk-lg mk:p-mk-md mk:bg-mk-surface/30 mk:border mk:border-mk-border/20">
              <p className="mk:text-xs mk:text-mk-text-muted mk:leading-relaxed">
                <span className="mk:font-bold mk:text-mk-primary">💡 Tip:</span>{" "}
                Generate TypeScript types for autocomplete:{" "}
                <code className="mk:px-2 mk:py-0.5 mk:bg-mk-background/80 mk:border mk:border-mk-border/30 mk:text-mk-text mk:text-xs mk:font-mono">
                  npx modelkit-generate --api-url &lt;url&gt;
                </code>
              </p>
            </div>
          </div>
        </section>
      </div>
    </TacticalPanel>
  );
}
