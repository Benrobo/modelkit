import type { ReactElement } from "react";
import { cn } from "../utils/cn";
import type { ModelOverride } from "@benrobo/modelkit";

export interface FeatureCardProps {
  featureId: string;
  override: ModelOverride;
  onSelect: () => void;
  className?: string;
  isActive?: boolean;
}

export function FeatureCard({
  featureId,
  override,
  onSelect,
  className,
  isActive,
}: FeatureCardProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "mk:w-full mk:text-left mk:p-4 mk:border mk:transition-all mk:relative mk:group mk:cursor-pointer",
        isActive
          ? "mk:border-mk-primary mk:bg-mk-primary/10"
          : "mk:border-mk-border mk:bg-mk-surface mk:hover:bg-mk-surface-hover mk:hover:border-mk-primary/50",
        "mk:focus:outline-none mk:focus:border-mk-primary",
        className
      )}
    >
      <div className="mk:flex mk:flex-col mk:gap-2 mk:relative mk:z-10">
        <div className="mk:flex mk:items-center mk:justify-between mk:gap-3">
          <div className="mk:min-w-0 mk:flex mk:items-center mk:gap-2">
            <div
              className={cn(
                "mk:w-1.5 mk:h-1.5 mk:shrink-0 mk:transition-all",
                isActive
                  ? "mk:bg-mk-primary"
                  : "mk:bg-mk-border mk:group-hover:bg-mk-primary/70"
              )}
            />
            <h3
              className={cn(
                "mk:text-sm mk:font-medium mk:tracking-wide mk:truncate mk:transition-colors",
                isActive
                  ? "mk:text-mk-primary"
                  : "mk:text-mk-text mk:group-hover:text-mk-primary"
              )}
            >
              {featureId}
            </h3>
          </div>
          <div
            className={cn(
              "mk:w-2 mk:h-2 mk:shrink-0 mk:transition-all",
              isActive
                ? "mk:bg-mk-primary"
                : "mk:bg-mk-border mk:group-hover:bg-mk-primary/50"
            )}
          />
        </div>

        <div className="mk:text-xs mk:text-mk-text-secondary mk:uppercase mk:tracking-wide mk:truncate">
          {override.modelId}
        </div>
      </div>
    </button>
  );
}
