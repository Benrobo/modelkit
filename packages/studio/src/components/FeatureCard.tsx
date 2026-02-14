import type { ReactElement } from "react";
import { cn } from "../utils/cn";
import type { ModelOverride } from "modelkit";

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
        "w-full text-left p-4 border transition-all relative group",
        isActive
          ? "border-mk-primary bg-mk-primary/10"
          : "border-mk-border bg-mk-surface hover:bg-mk-surface-hover hover:border-mk-primary/50",
        "focus:outline-none focus:border-mk-primary",
        className,
      )}
    >
      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            <div className={cn(
              "w-1.5 h-1.5 shrink-0 transition-all",
              isActive ? "bg-mk-primary" : "bg-mk-border group-hover:bg-mk-primary/70"
            )} />
            <h3
              className={cn(
                "text-sm font-medium uppercase tracking-wide truncate transition-colors",
                isActive
                  ? "text-mk-primary"
                  : "text-mk-text group-hover:text-mk-primary",
              )}
            >
              {featureId}
            </h3>
          </div>
          <div className={cn(
            "w-2 h-2 shrink-0 transition-all",
            isActive
              ? "bg-mk-primary"
              : "bg-mk-border group-hover:bg-mk-primary/50"
          )} />
        </div>

        <div className="text-xs text-mk-text-secondary uppercase tracking-wide truncate">
          {override.modelId}
        </div>
      </div>
    </button>
  );
}
