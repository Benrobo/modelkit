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

function getProviderFromModelId(modelId: string): string {
  const parts = modelId.split("/");
  return parts.length > 1 ? parts[0] : "";
}

function getModelShortName(modelId: string): string {
  const parts = modelId.split("/");
  return parts.length > 1 ? parts[1] : modelId;
}

export function FeatureCard({
  featureId,
  override,
  onSelect,
  className,
  isActive,
}: FeatureCardProps): ReactElement {
  const provider = getProviderFromModelId(override.modelId);
  const modelName = getModelShortName(override.modelId);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "mk:w-full mk:text-left mk:px-3 mk:py-2.5 mk:rounded-md mk:transition-colors mk:group mk:relative mk:cursor-pointer",
        isActive
          ? "mk:bg-mk-primary/10 mk:text-mk-text"
          : "mk:text-mk-text mk:hover:bg-mk-surface-hover",
        "mk:focus-visible:outline-none mk:focus-visible:ring-1 mk:focus-visible:ring-mk-primary/50",
        className
      )}
    >
      {isActive && (
        <span className="mk:absolute mk:left-0 mk:top-1/2 mk:-translate-y-1/2 mk:w-0.5 mk:h-5 mk:bg-mk-primary mk:rounded-r-full" />
      )}
      <div className="mk:flex mk:items-center mk:justify-between mk:gap-2">
        <span
          className={cn(
            "mk:text-sm mk:font-medium mk:truncate mk:leading-none",
            isActive ? "mk:text-mk-text" : "mk:text-mk-text"
          )}
        >
          {featureId}
        </span>
        <span className="mk:shrink-0 mk:w-1.5 mk:h-1.5 mk:rounded-full mk:bg-mk-color-success mk:opacity-70" />
      </div>
      <div className="mk:mt-1 mk:flex mk:items-center mk:gap-1.5">
        {provider && (
          <span className="mk:text-[11px] mk:text-mk-text-muted mk:font-mono mk:leading-none">
            {provider}
          </span>
        )}
        {provider && (
          <span className="mk:text-mk-border mk:text-[11px] mk:leading-none">/</span>
        )}
        <span className="mk:text-[11px] mk:text-mk-text-secondary mk:font-mono mk:leading-none mk:truncate">
          {modelName}
        </span>
      </div>
    </button>
  );
}
