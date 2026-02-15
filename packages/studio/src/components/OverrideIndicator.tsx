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
        "mk:grid mk:grid-cols-1 mk:sm:grid-cols-2 mk:gap-mk-lg mk:font-mk-mono",
        className,
      )}
    >
      <div className="mk:space-y-2">
        <span className="mk:text-[11px] mk:text-mk-text-muted mk:uppercase mk:tracking-widest mk:block mk:font-bold">
          Primary Configuration
        </span>
        <div className="mk:p-mk-md mk:bg-mk-background/50 mk:border mk:border-mk-border mk:text-sm mk:text-mk-text-secondary">
          {getModelDisplayName(defaultModelId)}
        </div>
      </div>

      <div className="mk:space-y-2">
        <span
          className={cn(
            "mk:text-[11px] mk:uppercase mk:tracking-widest mk:block mk:font-bold",
            hasOverride ? "mk:text-mk-primary" : "mk:text-mk-text-muted",
          )}
        >
          Registry Override
        </span>
        <div
          className={cn(
            "mk:p-mk-md mk:border mk:text-sm mk:transition-all mk:duration-300",
            hasOverride
              ? "mk:bg-mk-primary/5 mk:border-mk-primary/30 mk:text-mk-primary mk:font-bold mk:shadow-[0_0_15px_rgba(var(--mk-primary-rgb),0.05)]"
              : "mk:bg-mk-background/50 mk:border-mk-border mk:text-mk-text-muted mk:italic",
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
