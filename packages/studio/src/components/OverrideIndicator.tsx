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
    <div className={cn("text-[11px] font-mk-mono space-y-1.5", className)}>
      <div className="flex items-center gap-2">
        <span className="text-mk-text-muted uppercase tracking-wider">
          Default
        </span>
        <span className="text-mk-text-secondary">
          {getModelDisplayName(defaultModelId)}
        </span>
      </div>
      {hasOverride ? (
        <div className="flex items-center gap-2">
          <span className="text-mk-primary uppercase tracking-wider font-bold">
            Override
          </span>
          <span className="text-mk-primary">
            {getModelDisplayName(overrideModelId)}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-mk-text-muted uppercase tracking-wider">
            Override
          </span>
          <span className="text-mk-text-muted italic">None</span>
        </div>
      )}
    </div>
  );
}
