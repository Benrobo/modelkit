import { useState, useEffect, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useOverrides } from "../hooks/useOverrides";
import { ModelSelector } from "./ModelSelector";
import { ParameterEditor } from "./ParameterEditor";
import { OpenRouterModelId } from "@benrobo/modelkit";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { DeleteIcon, InfoIcon } from "./Icons";

export interface FeatureDetailProps {
  featureId: string;
  onBack?: () => void;
  className?: string;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mk:space-y-3">
      <h3 className="mk:text-xs mk:font-medium mk:text-mk-text-muted mk:uppercase mk:tracking-wider">
        {title}
      </h3>
      {children}
    </div>
  );
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
  const [activeTab, setActiveTab] = useState<"config" | "usage">("config");

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
      <div className="mk:h-full mk:flex mk:items-center mk:justify-center">
        <div className="mk:w-5 mk:h-5 mk:border-2 mk:border-mk-border mk:border-t-mk-primary mk:rounded-full mk:animate-spin" />
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

  const codeSnippetStyle = {
    margin: 0,
    fontSize: "12px",
    lineHeight: "1.6",
    background: "var(--mk-color-surface)",
    border: "1px solid var(--mk-color-border)",
    borderRadius: "var(--mk-border-radius-md)",
    padding: "12px 16px",
  };

  return (
    <div
      className={cn(
        "mk:h-full mk:flex mk:flex-col mk:overflow-hidden",
        className
      )}
    >
      {/* Detail header */}
      <div className="mk:px-6 mk:py-4 mk:border-b mk:border-mk-border mk:shrink-0 mk:flex mk:items-start mk:justify-between mk:gap-4">
        <div className="mk:flex-1 mk:min-w-0 mk:space-y-1.5">
          <div className="mk:flex mk:items-center mk:gap-2">
            <label className="mk:text-xs mk:font-medium mk:text-mk-text-muted">
              Feature ID
            </label>
            {isNewOverride && (
              <span className="mk:inline-flex mk:items-center mk:px-1.5 mk:py-0.5 mk:rounded mk:text-[10px] mk:font-medium mk:bg-mk-color-warning/10 mk:text-mk-color-warning mk:border mk:border-mk-color-warning/20">
                New
              </span>
            )}
          </div>
          <input
            type="text"
            value={editingFeatureId}
            onChange={(e) => setEditingFeatureId(e.target.value)}
            className={cn(
              "mk:w-full mk:px-3 mk:py-2 mk:rounded-md mk:text-sm mk:font-mono mk:font-medium mk:text-mk-text",
              "mk:bg-mk-surface mk:border mk:border-mk-border",
              "mk:focus:outline-none mk:focus:ring-1 mk:focus:ring-mk-primary/40 mk:focus:border-mk-border-hover",
              "mk:transition-all mk:placeholder:text-mk-text-muted"
            )}
          />
        </div>
        {!isNewOverride && (
          <button
            onClick={handleReset}
            disabled={isUpdating}
            className={cn(
              "mk:shrink-0 mk:flex mk:items-center mk:gap-1.5 mk:text-xs mk:text-mk-text-muted mk:mt-6",
              "mk:hover:text-mk-color-error mk:transition-colors mk:px-2.5 mk:py-1.5 mk:rounded-md",
              "mk:hover:bg-mk-color-error/8 mk:disabled:opacity-40"
            )}
          >
            <DeleteIcon size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div className="mk:flex mk:items-center mk:gap-0 mk:border-b mk:border-mk-border mk:px-6 mk:shrink-0">
        {(["config", "usage"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "mk:relative mk:px-0 mk:py-2.5 mk:mr-5 mk:text-sm mk:transition-colors mk:capitalize",
              activeTab === tab
                ? "mk:text-mk-text mk:font-medium"
                : "mk:text-mk-text-muted mk:hover:text-mk-text-secondary"
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="mk:absolute mk:bottom-0 mk:left-0 mk:right-0 mk:h-px mk:bg-mk-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Scrollable body */}
      <div className="mk:flex-1 mk:overflow-y-auto custom-scrollbar mk:min-h-0">
        {activeTab === "config" ? (
          <div className="mk:p-6 mk:space-y-6">
            <Section title="Model">
              <ModelSelector value={modelId} onChange={setModelId} />
            </Section>

            <Section title="Parameters">
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
            </Section>

            {/* Action bar */}
            <div className="mk:flex mk:items-center mk:gap-2 mk:pt-2">
              <button
                onClick={handleCommit}
                disabled={!isModified || isUpdating || !modelId}
                className={cn(
                  "mk:flex mk:items-center mk:gap-2 mk:px-4 mk:py-2 mk:rounded-md mk:text-sm mk:font-medium",
                  "mk:bg-mk-primary mk:text-white mk:transition-colors",
                  "mk:hover:bg-mk-primary/90",
                  "mk:disabled:opacity-40 mk:disabled:cursor-not-allowed"
                )}
              >
                {isUpdating ? (
                  <>
                    <span className="mk:w-3.5 mk:h-3.5 mk:border-2 mk:border-white/30 mk:border-t-white mk:rounded-full mk:animate-spin mk:inline-block" />
                    Saving...
                  </>
                ) : isNewOverride ? (
                  "Create override"
                ) : (
                  "Save changes"
                )}
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
                  setEditingFeatureId(featureId);
                }}
                disabled={!isModified || isUpdating}
                className={cn(
                  "mk:px-4 mk:py-2 mk:rounded-md mk:text-sm mk:text-mk-text-muted",
                  "mk:hover:text-mk-text mk:hover:bg-mk-surface-hover mk:transition-colors",
                  "mk:disabled:opacity-40 mk:disabled:cursor-not-allowed"
                )}
              >
                Discard
              </button>
            </div>
          </div>
        ) : (
          <div className="mk:p-6 mk:space-y-5">
            <div className="mk:space-y-2">
              <p className="mk:text-xs mk:text-mk-text-muted mk:font-medium">
                Get model
              </p>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={codeSnippetStyle}
                codeTagProps={{
                  style: { fontFamily: "var(--mk-font-mono)" },
                }}
              >
                {`const modelId = await modelKit.getModel(\n  "${editingFeatureId}",\n  "anthropic/claude-3.5-sonnet"\n);\n// → "${modelId || "fallback-model"}"${override ? " (override)" : " (fallback)"}`}
              </SyntaxHighlighter>
            </div>

            <div className="mk:space-y-2">
              <p className="mk:text-xs mk:text-mk-text-muted mk:font-medium">
                Set override
              </p>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={codeSnippetStyle}
                codeTagProps={{
                  style: { fontFamily: "var(--mk-font-mono)" },
                }}
              >
                {`await modelKit.setOverride("${editingFeatureId}", {\n  modelId: "${modelId || "anthropic/claude-3.5-sonnet"}",\n  temperature: ${temperature},\n  maxTokens: ${maxTokens},\n  topP: ${topP},\n  topK: ${topK}\n});`}
              </SyntaxHighlighter>
            </div>

            <div className="mk:space-y-2">
              <p className="mk:text-xs mk:text-mk-text-muted mk:font-medium">
                Get config
              </p>
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={codeSnippetStyle}
                codeTagProps={{
                  style: { fontFamily: "var(--mk-font-mono)" },
                }}
              >
                {`const config = await modelKit.getConfig("${editingFeatureId}");\n// → ${override ? `{ modelId: "${modelId}", temperature: ${temperature}, ... }` : "null"}`}
              </SyntaxHighlighter>
            </div>

            {override && (
              <div className="mk:space-y-2">
                <p className="mk:text-xs mk:text-mk-text-muted mk:font-medium">
                  Clear override
                </p>
                <SyntaxHighlighter
                  language="typescript"
                  style={vscDarkPlus}
                  customStyle={codeSnippetStyle}
                  codeTagProps={{
                    style: { fontFamily: "var(--mk-font-mono)" },
                  }}
                >
                  {`await modelKit.clearOverride("${editingFeatureId}");\n// Reverts to fallback model`}
                </SyntaxHighlighter>
              </div>
            )}

            <div className="mk:p-3 mk:rounded-md mk:bg-mk-surface mk:border mk:border-mk-border mk:flex mk:items-start mk:gap-2.5">
              <InfoIcon size={14} className="mk:text-mk-primary mk:shrink-0 mk:mt-0.5" />
              <p className="mk:text-xs mk:text-mk-text-secondary mk:leading-relaxed">
                Generate TypeScript types for full autocomplete:{" "}
                <code className="mk:font-mono mk:text-mk-text mk:bg-mk-background mk:px-1 mk:py-0.5 mk:rounded">
                  npx modelkit-generate --api-url &lt;url&gt;
                </code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
