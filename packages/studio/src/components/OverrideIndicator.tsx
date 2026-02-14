import type { ReactElement } from "react";
import { cn } from "../utils/cn";
import { getModelDisplayName } from "../utils/models";

export interface OverrideIndicatorProps {
  defaultModelId: string;
  overrideModelId?: string | null;
  className?: string;
}

export function OverrideIndicator({
  defaultModelId,
  overrideModelId,
  className,
}: OverrideIndicatorProps): ReactElement {
  const hasOverride =
    overrideModelId != null && overrideModelId !== defaultModelId;

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 gap-mk-lg font-mk-mono",
        className,
      )}
    >
      <div className="space-y-2">
        <span className="text-[11px] text-mk-text-muted uppercase tracking-widest block font-bold">
          Primary Configuration
        </span>
        <div className="p-mk-md bg-mk-background/50 border border-mk-border text-sm text-mk-text-secondary">
          {getModelDisplayName(defaultModelId)}
        </div>
      </div>

      <div className="space-y-2">
        <span
          className={cn(
            "text-[11px] uppercase tracking-widest block font-bold",
            hasOverride ? "text-mk-primary" : "text-mk-text-muted",
          )}
        >
          Registry Override
        </span>
        <div
          className={cn(
            "p-mk-md border text-sm transition-all duration-300",
            hasOverride
              ? "bg-mk-primary/5 border-mk-primary/30 text-mk-primary font-bold shadow-[0_0_15px_rgba(var(--mk-primary-rgb),0.05)]"
              : "bg-mk-background/50 border-mk-border text-mk-text-muted italic",
          )}
        >
          {hasOverride
            ? getModelDisplayName(overrideModelId)
            : "No active override"}
        </div>
      </div>
    </div>
  );
}
