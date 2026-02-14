import { useState, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useOverrides } from "../hooks/useOverrides";
import { useNavigation } from "../hooks/useNavigation";
import { FeatureCard } from "./FeatureCard";

export interface FeatureListProps {
  onSelectFeature: (featureId: string) => void;
  className?: string;
}

export function FeatureList({
  onSelectFeature,
  className,
}: FeatureListProps): ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedFeatureId } = useNavigation();
  const { overrides, loading, error } = useOverrides();

  const filteredOverrides = overrides.filter((o) => {
    const search = searchQuery.toLowerCase();
    return o.featureId.toLowerCase().includes(search);
  });

  if (loading) {
    return (
      <div className="p-mk-xl text-mk-text-secondary text-sm animate-pulse">
        Loading overrides...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-mk-xl text-mk-color-error text-sm border border-mk-color-error/20 bg-mk-color-error/5">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="mb-4 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search overrides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full bg-mk-surface border border-mk-border px-4 py-2.5 text-sm text-mk-text",
              "focus:outline-none focus:border-mk-primary transition-colors placeholder:text-mk-text-muted",
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mk-text-muted hover:text-mk-primary transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-0">
        {filteredOverrides.length === 0 ? (
          <div className="text-mk-text-muted text-xs py-10 text-center uppercase tracking-wider border border-dashed border-mk-border">
            {searchQuery ? "No matching overrides" : "No active overrides"}
          </div>
        ) : (
          filteredOverrides.map((item) => (
            <FeatureCard
              key={item.featureId}
              featureId={item.featureId}
              override={item.override}
              onSelect={() => onSelectFeature(item.featureId)}
              isActive={selectedFeatureId === item.featureId}
            />
          ))
        )}
      </div>
    </div>
  );
}
