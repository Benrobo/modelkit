import type { ReactElement } from "react";
import { cn } from "../utils/cn";
import type { FeatureConfig } from "modelkit";
import type { ModelOverride } from "modelkit";

export interface FeatureCardProps {
  featureId: string;
  config: FeatureConfig;
  override?: ModelOverride | null;
  onSelect: () => void;
  className?: string;
  isActive?: boolean;
}

export function FeatureCard({
  featureId,
  config,
  override,
  onSelect,
  className,
  isActive,
}: FeatureCardProps): ReactElement {
  const hasOverride = override != null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left p-4 border transition-all relative overflow-hidden group",
        isActive
          ? "border-mk-primary bg-mk-primary/5 ring-1 ring-mk-primary/20"
          : "border-mk-border bg-mk-surface hover:bg-mk-surface-hover hover:border-mk-primary/30",
        "focus:outline-none focus:ring-1 focus:ring-mk-primary",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5 relative z-10 font-mk-mono">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className={cn(
                "text-sm font-bold uppercase tracking-tight truncate transition-colors",
                isActive
                  ? "text-mk-primary"
                  : "text-mk-text group-hover:text-mk-primary",
              )}
            >
              {config.name ?? featureId}
            </h3>
            {config.title != null && config.title !== "" && (
              <p className="text-mk-text-muted text-[11px] uppercase tracking-widest truncate">
                {config.title}
              </p>
            )}
          </div>
          {hasOverride && (
            <div className="shrink-0 flex items-center justify-center pt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-mk-primary shadow-[0_0_8px_rgba(var(--mk-primary-rgb),0.5)]" />
            </div>
          )}
        </div>

        <div className="mt-1 flex items-center gap-2 overflow-hidden text-[10px] uppercase tracking-tighter opacity-60">
          <span className="truncate">{config.modelId.split("/").pop()}</span>
          {hasOverride && override.modelId !== config.modelId && (
            <>
              <span className="text-mk-primary">→</span>
              <span className="text-mk-primary font-bold truncate">
                {override.modelId.split("/").pop()}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
