import { useState, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useFeatures } from "../hooks/useFeatures";
import { useModelKit } from "../hooks/useModelKit";
import { useOverrides } from "../hooks/useOverrides";
import { FeatureCard } from "./FeatureCard";
import { CreateFeatureForm } from "./CreateFeatureForm";

export interface FeatureListProps {
  onSelectFeature: (featureId: string) => void;
  className?: string;
}

export function FeatureList({
  onSelectFeature,
  className,
}: FeatureListProps): ReactElement {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const modelKit = useModelKit();
  const { features, loading, error, refetch } = useFeatures();
  const { overrides } = useOverrides();
  const overrideMap = new Map(overrides.map((o) => [o.featureId, o.override]));
  const canCreate = typeof modelKit.createFeature === "function";

  if (loading) {
    return (
      <div className={cn("text-mk-text-secondary text-sm py-mk-lg", className)}>
        Loading features…
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-mk-color-error text-sm py-mk-lg", className)}>
        {error.message}
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className={cn("space-y-mk-md", className)}>
        <CreateFeatureForm
          onSuccess={() => {
            setShowCreateForm(false);
            refetch();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-mk-md", className)}>
      {canCreate && (
        <div className="flex justify-end mb-mk-md">
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className={cn(
              "flex items-center gap-2 border border-mk-primary/30 text-mk-primary px-4 py-1.5",
              "text-[10px] font-mk-mono font-bold uppercase tracking-widest",
              "hover:bg-mk-primary/10 hover:border-mk-primary transition-all duration-200 group",
            )}
          >
            <span className="group-hover:rotate-90 transition-transform duration-300 inline-block">
              +
            </span>
            <span>Add feature config</span>
          </button>
        </div>
      )}
      {features.length === 0 ? (
        <div className="text-mk-text-secondary text-sm py-mk-lg font-mk-mono">
          {canCreate
            ? "No features yet. Add one above or define features in your modelkit.config."
            : "No features configured. Add features to your modelkit.config."}
        </div>
      ) : (
        <ul className="space-y-mk-md">
          {features.map((f) => (
            <li key={f.id}>
              <FeatureCard
                featureId={f.id}
                config={f}
                override={overrideMap.get(f.id) ?? null}
                onSelect={() => onSelectFeature(f.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
