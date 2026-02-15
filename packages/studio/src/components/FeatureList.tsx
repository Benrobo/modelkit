import { useState, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useOverrides } from "../hooks/useOverrides";
import { useNavigation } from "../hooks/useNavigation";
import { FeatureCard } from "./FeatureCard";
import { CreateOverrideModal } from "./CreateOverrideModal";

export interface FeatureListProps {
  onSelectFeature: (featureId: string) => void;
  className?: string;
}

export function FeatureList({
  onSelectFeature,
  className,
}: FeatureListProps): ReactElement {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { selectedFeatureId } = useNavigation();
  const { overrides, loading, error, refetch } = useOverrides();

  const filteredOverrides = overrides.filter((o) => {
    const search = searchQuery.toLowerCase();
    return o.featureId.toLowerCase().includes(search);
  });

  if (loading) {
    return (
      <div className="mk:p-mk-xl mk:text-mk-text-secondary mk:text-sm mk:animate-pulse">
        Loading overrides...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mk:p-mk-xl mk:text-mk-color-error mk:text-sm mk:border mk:border-mk-color-error/20 mk:bg-mk-color-error/5">
        Error: {error.message}
      </div>
    );
  }

  return (
    <>
      {showCreateModal && (
        <CreateOverrideModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      <div className={cn("mk:flex mk:flex-col mk:h-full", className)}>
        <div className="mk:mb-4 mk:flex-shrink-0 mk:space-y-2">
          <div className="mk:relative">
            <input
              type="text"
              placeholder="Search overrides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "mk:w-full mk:bg-mk-surface mk:border mk:border-mk-border mk:px-4 mk:py-2.5 mk:text-sm mk:text-mk-text",
                "mk:focus:outline-none mk:focus:border-mk-primary mk:transition-colors mk:placeholder:text-mk-text-muted"
              )}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mk:absolute mk:right-3 mk:top-1/2 mk:-translate-y-1/2 mk:text-mk-text-muted mk:hover:text-mk-primary mk:transition-colors"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mk:w-full mk:px-4 mk:py-2.5 mk:border mk:border-mk-border mk:bg-mk-primary mk:hover:border-mk-primary mk:text-white mk:hover:text-mk-background mk:transition-colors mk:text-sm mk:uppercase mk:tracking-wide"
          >
            + New Override
          </button>
        </div>

        <div className="mk:flex-1 mk:overflow-y-auto mk:space-y-2 mk:pr-1 custom-scrollbar mk:min-h-0">
          {filteredOverrides.length === 0 ? (
            <div className="mk:text-mk-text-muted mk:text-xs mk:py-10 mk:text-center mk:uppercase mk:tracking-wider mk:border mk:border-dashed mk:border-mk-border">
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
    </>
  );
}
