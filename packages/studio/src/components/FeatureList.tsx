import { useState, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useOverrides } from "../hooks/useOverrides";
import { useNavigation } from "../hooks/useNavigation";
import { FeatureCard } from "./FeatureCard";
import { CreateOverrideModal } from "./CreateOverrideModal";
import { SearchIcon, PlusIcon } from "./Icons";

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

  const filteredOverrides = overrides.filter((o) =>
    o.featureId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {showCreateModal && (
        <CreateOverrideModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => refetch()}
        />
      )}

      <div className={cn("mk:flex mk:flex-col mk:h-full", className)}>
        {/* Sidebar header */}
        <div className="mk:px-3 mk:pt-3 mk:pb-2 mk:border-b mk:border-mk-border mk:shrink-0">
          <div className="mk:flex mk:items-center mk:justify-between mk:mb-2.5">
            <span className="mk:text-xs mk:font-medium mk:text-mk-text-muted mk:uppercase mk:tracking-wider">
              Overrides
            </span>
            <span className="mk:text-xs mk:text-mk-text-muted mk:tabular-nums">
              {loading ? "—" : overrides.length}
            </span>
          </div>
          {/* Search */}
          <div className="mk:relative">
            <SearchIcon size={13} className="mk:absolute mk:left-2.5 mk:top-1/2 mk:-translate-y-1/2 mk:text-mk-text-muted mk:pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "mk:w-full mk:bg-mk-background mk:border mk:border-mk-border mk:rounded-md",
                "mk:pl-8 mk:pr-3 mk:py-1.5 mk:text-sm mk:text-mk-text mk:placeholder:text-mk-text-muted",
                "mk:focus:outline-none mk:focus:ring-1 mk:focus:ring-mk-primary/40 mk:focus:border-mk-border-hover mk:transition-all"
              )}
            />
          </div>
        </div>

        {/* List */}
        <div className="mk:flex-1 mk:overflow-y-auto mk:min-h-0 mk:p-2 custom-scrollbar">
          {loading ? (
            <div className="mk:space-y-1.5 mk:p-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="mk:h-12 mk:rounded-md mk:bg-mk-surface mk:animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="mk:p-3 mk:text-xs mk:text-mk-color-error mk:bg-mk-color-error/5 mk:rounded-md mk:border mk:border-mk-color-error/15">
              Failed to load overrides
            </div>
          ) : filteredOverrides.length === 0 ? (
            <div className="mk:py-8 mk:flex mk:flex-col mk:items-center mk:gap-2 mk:text-center">
              <p className="mk:text-xs mk:text-mk-text-muted">
                {searchQuery ? "No results" : "No overrides yet"}
              </p>
            </div>
          ) : (
            <div className="mk:space-y-0.5">
              {filteredOverrides.map((item) => (
                <FeatureCard
                  key={item.featureId}
                  featureId={item.featureId}
                  override={item.override}
                  onSelect={() => onSelectFeature(item.featureId)}
                  isActive={selectedFeatureId === item.featureId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add button — pinned to bottom */}
        <div className="mk:px-3 mk:py-3 mk:border-t mk:border-mk-border mk:shrink-0">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className={cn(
              "mk:w-full mk:flex mk:items-center mk:justify-center mk:gap-2",
              "mk:px-3 mk:py-2 mk:rounded-md mk:text-sm mk:font-medium",
              "mk:bg-mk-primary mk:text-white",
              "mk:hover:bg-mk-primary/90 mk:transition-colors",
              "mk:focus-visible:outline-none mk:focus-visible:ring-1 mk:focus-visible:ring-mk-primary/50"
            )}
          >
            <PlusIcon size={14} />
            New override
          </button>
        </div>
      </div>
    </>
  );
}
