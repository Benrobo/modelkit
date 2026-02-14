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
              topP={topP}
              topK={topK}
              onTemperatureChange={setTemperature}
              onMaxTokensChange={setMaxTokens}
              onTopPChange={setTopP}
              onTopKChange={setTopK}
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
                "flex-1 border border-mk-border text-mk-text-muted px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all",
                "hover:text-mk-text hover:bg-mk-surface-hover disabled:opacity-30"
              )}
            >
              Discard Changes
            </button>
          </div>
        </section>

        {/* Usage Examples Section */}
        <section className="space-y-mk-md animate-in fade-in slide-in-from-top-6 duration-700 delay-150">
          <div className="flex items-center gap-2 mb-mk-md">
            <div className="w-1.5 h-1.5 bg-mk-text-secondary/50 shadow-[0_0_8px_rgba(var(--mk-text-secondary-rgb),0.3)]" />
            <h3 className="text-sm font-mk-mono font-bold text-mk-text-secondary uppercase tracking-widest">
              SDK Usage Examples
            </h3>
          </div>

          <div className="pl-mk-md border-l-2 border-mk-border/10 space-y-mk-lg">
            {/* Get Model */}
            <div className="space-y-2">
              <p className="text-xs text-mk-text-muted font-bold uppercase tracking-wide">
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
                  }
                }}
              >
{`const modelId = await modelKit.getModel(
  "${editingFeatureId}",
  "anthropic/claude-3.5-sonnet" // fallback
);
// Returns: "${modelId || 'fallback-model'}"${override ? ' (override)' : ' (fallback)'}`}
              </SyntaxHighlighter>
            </div>

            {/* Set Override */}
            <div className="space-y-2">
              <p className="text-xs text-mk-text-muted font-bold uppercase tracking-wide">
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
                  }
                }}
              >
{`await modelKit.setOverride("${editingFeatureId}", {
  modelId: "${modelId || 'anthropic/claude-3.5-sonnet'}",
  temperature: ${temperature},
  maxTokens: ${maxTokens},
  topP: ${topP},
  topK: ${topK}
});`}
              </SyntaxHighlighter>
            </div>

            {/* Get Config */}
            <div className="space-y-2">
              <p className="text-xs text-mk-text-muted font-bold uppercase tracking-wide">
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
                  }
                }}
              >
{`const config = await modelKit.getConfig("${editingFeatureId}");
// Returns: ${override ? `{
//   modelId: "${modelId}",
//   temperature: ${temperature},
//   maxTokens: ${maxTokens},
//   topP: ${topP},
//   topK: ${topK},
//   updatedAt: ${override.updatedAt || Date.now()}
// }` : 'null (no override)'}`}
              </SyntaxHighlighter>
            </div>

            {/* Clear Override */}
            {override && (
              <div className="space-y-2">
                <p className="text-xs text-mk-text-muted font-bold uppercase tracking-wide">
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
                    }
                  }}
                >
{`await modelKit.clearOverride("${editingFeatureId}");
// Reverts to fallback model`}
                </SyntaxHighlighter>
              </div>
            )}

            {/* Type Safety Hint */}
            <div className="mt-mk-lg p-mk-md bg-mk-surface/30 border border-mk-border/20">
              <p className="text-xs text-mk-text-muted leading-relaxed">
                <span className="font-bold text-mk-primary">💡 Tip:</span> Generate TypeScript types for autocomplete:{" "}
                <code className="px-2 py-0.5 bg-mk-background/80 border border-mk-border/30 text-mk-text text-xs font-mono">
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
