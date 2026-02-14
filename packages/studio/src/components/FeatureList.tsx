import { useState, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useFeatures } from "../hooks/useFeatures";
import { useModelKit } from "../hooks/useModelKit";
import { useOverrides } from "../hooks/useOverrides";
import { useNavigation } from "../hooks/useNavigation";
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
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedFeatureId } = useNavigation();
  const { features, loading, error, refetch } = useFeatures();
  const { overrides } = useOverrides();
  const overrideMap = new Map(overrides.map((o) => [o.featureId, o.override]));
  const modelKit = useModelKit();
  const canCreate = typeof modelKit.createFeature === "function";

  const filteredFeatures = features.filter((f) => {
    const search = searchQuery.toLowerCase();
    return (
      f.id.toLowerCase().includes(search) ||
      f.name?.toLowerCase().includes(search) ||
      f.title?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="p-mk-xl text-mk-text-secondary text-sm font-mk-mono animate-pulse">
        Initializing Registry...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-mk-xl text-mk-color-error text-sm font-mk-mono border border-mk-color-error/20 bg-mk-color-error/5">
        Registry Error: {error.message}
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className={cn("h-full overflow-y-auto p-1", className)}>
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
    <div className={cn("flex flex-col h-full", className)}>
      <div className="space-y-4 mb-4 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search registry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full bg-mk-background/50 border border-mk-border px-4 py-2.5 text-sm font-mk-mono text-mk-text",
              "focus:outline-none focus:border-mk-primary/50 focus:ring-1 focus:ring-mk-primary/10 transition-all placeholder:text-mk-text-muted/50",
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mk-text-muted hover:text-mk-text text-lg transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {canCreate && (
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className={cn(
              "w-full flex items-center justify-center gap-2 border border-mk-primary/30 text-mk-primary py-2.5",
              "text-[11px] font-mk-mono font-bold uppercase tracking-widest hover:bg-mk-primary/10 transition-all",
            )}
          >
            <span>+ REGISTER NEW FEATURE</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-0">
        {filteredFeatures.length === 0 ? (
          <div className="text-mk-text-muted text-xs py-10 text-center font-mk-mono uppercase tracking-widest border border-dashed border-mk-border/50 opacity-50">
            {searchQuery ? "No matching records" : "Registry Empty"}
          </div>
        ) : (
          filteredFeatures.map((f) => (
            <FeatureCard
              key={f.id}
              featureId={f.id}
              config={f}
              override={overrideMap.get(f.id) ?? null}
              onSelect={() => onSelectFeature(f.id)}
              isActive={selectedFeatureId === f.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
