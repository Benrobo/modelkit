import { useState, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useModelKit } from "../hooks/useModelKit";
import { ModelSelector } from "./ModelSelector";
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
      className={cn("mk-panel relative border border-mk-border p-mk-lg space-y-mk-md", className)}
    >
      <h3 className="font-mk-mono text-mk-text font-medium border-b border-mk-border pb-mk-sm">
        Add feature config
      </h3>

      <div className="space-y-1">
        <label className="text-sm font-medium text-mk-text-secondary block font-mk-mono">
          ID <span className="text-mk-color-error">*</span>
        </label>
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. myFeature.chat"
          className={cn(
            "w-full border border-mk-border bg-mk-surface px-3 py-2 text-sm font-mk-mono text-mk-text",
            "focus:outline-none focus:ring-2 focus:ring-mk-primary"
          )}
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-mk-text-secondary block font-mk-mono">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display name"
          className={cn(
            "w-full border border-mk-border bg-mk-surface px-3 py-2 text-sm font-mk-mono text-mk-text",
            "focus:outline-none focus:ring-2 focus:ring-mk-primary"
          )}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-mk-text-secondary block font-mk-mono">
          Title / description
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short description"
          className={cn(
            "w-full border border-mk-border bg-mk-surface px-3 py-2 text-sm font-mk-mono text-mk-text",
            "focus:outline-none focus:ring-2 focus:ring-mk-primary"
          )}
        />
      </div>

      <ModelSelector value={modelId} onChange={setModelId} />

      <div className="grid grid-cols-2 gap-mk-md">
        <div className="space-y-1">
          <label className="text-sm font-medium text-mk-text-secondary block font-mk-mono">
            Temperature
          </label>
          <input
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className={cn(
              "w-full border border-mk-border bg-mk-surface px-3 py-2 text-sm font-mk-mono text-mk-text",
              "focus:outline-none focus:ring-2 focus:ring-mk-primary"
            )}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-mk-text-secondary block font-mk-mono">
            Max tokens
          </label>
          <input
            type="number"
            min={1}
            value={maxTokens}
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            className={cn(
              "w-full border border-mk-border bg-mk-surface px-3 py-2 text-sm font-mk-mono text-mk-text",
              "focus:outline-none focus:ring-2 focus:ring-mk-primary"
            )}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm font-mk-mono text-mk-color-error">{error}</p>
      )}

      <div className="flex gap-mk-sm pt-mk-sm">
        <button
          type="submit"
          disabled={submitting}
          className="border bg-mk-primary text-mk-background px-4 py-2 text-sm font-medium font-mk-mono hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-mk-border text-mk-text px-4 py-2 text-sm font-medium font-mk-mono hover:bg-mk-surface"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
