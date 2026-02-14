import { useState, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useModelKit } from "../hooks/useModelKit";
import { ModelSelector } from "./ModelSelector";
import { ParameterEditor } from "./ParameterEditor";
import type { CreateFeatureDefinition } from "modelkit";

export interface CreateFeatureFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  className?: string;
}

export function CreateFeatureForm({
  onSuccess,
  onCancel,
  className,
}: CreateFeatureFormProps): ReactElement {
  const modelKit = useModelKit();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [modelId, setModelId] = useState("google/gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) {
      setError("ID is required");
      return;
    }
    if (!modelKit.createFeature) return;
    setError(null);
    setSubmitting(true);
    try {
      const definition: CreateFeatureDefinition = {
        id: id.trim(),
        name: name.trim() || undefined,
        title: title.trim() || undefined,
        modelId,
        temperature,
        maxTokens,
      };
      await modelKit.createFeature(definition);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "mk-panel relative border border-mk-border bg-mk-surface p-mk-xl space-y-mk-xl",
        className,
      )}
    >
      <div className="pb-mk-md border-b border-mk-border">
        <h3 className="font-mk-mono text-lg text-mk-text font-bold uppercase tracking-tight">
          New Configuration
        </h3>
      </div>

      <div className="grid gap-mk-lg">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mk-mono font-bold text-mk-text-muted uppercase tracking-wider block">
            Unique Identifier <span className="text-mk-color-error">*</span>
          </label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="e.g. core.pipeline"
            className={cn(
              "w-full bg-mk-background/50 border border-mk-border px-3 py-2 text-mk-text text-sm font-mk-mono",
              "focus:outline-none focus:border-mk-primary/50 focus:ring-1 focus:ring-mk-primary/20 transition-all placeholder:text-mk-text-muted/50",
            )}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-mk-lg">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mk-mono font-bold text-mk-text-muted uppercase tracking-wider block">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Internal ID"
              className={cn(
                "w-full bg-mk-background/50 border border-mk-border px-3 py-2 text-mk-text text-sm font-mk-mono",
                "focus:outline-none focus:border-mk-primary/50 focus:ring-1 focus:ring-mk-primary/20 transition-all placeholder:text-mk-text-muted/50",
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mk-mono font-bold text-mk-text-muted uppercase tracking-wider block">
              Classification
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Content Generation"
              className={cn(
                "w-full bg-mk-background/50 border border-mk-border px-3 py-2 text-mk-text text-sm font-mk-mono",
                "focus:outline-none focus:border-mk-primary/50 focus:ring-1 focus:ring-mk-primary/20 transition-all placeholder:text-mk-text-muted/50",
              )}
            />
          </div>
        </div>

        <div className="border-t border-mk-border/50 pt-mk-lg space-y-mk-lg">
          <ModelSelector value={modelId} onChange={setModelId} />
          <ParameterEditor
            temperature={temperature}
            maxTokens={maxTokens}
            onTemperatureChange={setTemperature}
            onMaxTokensChange={setMaxTokens}
          />
        </div>
      </div>

      {error && (
        <div className="p-mk-md bg-mk-color-error/10 border border-mk-color-error/20">
          <p className="text-[10px] font-mk-mono text-mk-color-error uppercase tracking-widest font-bold">
            Critical Error: {error}
          </p>
        </div>
      )}

      <div className="flex items-center gap-mk-md pt-mk-lg border-t border-mk-border">
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "flex-1 sm:flex-none border border-mk-primary bg-mk-primary text-mk-background px-8 py-2.5 text-xs font-mk-mono font-bold uppercase tracking-widest transition-all",
            "hover:bg-transparent hover:text-mk-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,245,255,0.15)]",
          )}
        >
          {submitting ? "Initializing…" : "Initialize Feature"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            "flex-1 sm:flex-none border border-mk-border text-mk-text-secondary px-8 py-2.5 text-xs font-mk-mono font-bold uppercase tracking-widest transition-all",
            "hover:text-mk-text hover:bg-mk-surface-hover",
          )}
        >
          Abort
        </button>
      </div>
    </form>
  );
}
