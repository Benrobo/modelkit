import type { ReactElement } from "react";
import { cn } from "../utils/cn";
import { OverrideIndicator } from "./OverrideIndicator";
import type { FeatureConfig } from "modelkit";
import type { ModelOverride } from "modelkit";

export interface FeatureCardProps {
  featureId: string;
  config: FeatureConfig;
  override?: ModelOverride | null;
  onSelect: () => void;
  className?: string;
}

export function FeatureCard({
  featureId,
  config,
  override,
  onSelect,
  className,
}: FeatureCardProps): ReactElement {
  const hasOverride = override != null;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={cn(
        "feature-card group relative border border-mk-border p-mk-lg transition-all duration-200",
        "bg-mk-surface hover:bg-mk-surface-hover hover:border-mk-primary/30 cursor-pointer overflow-hidden",
        "focus:outline-none focus:ring-1 focus:ring-mk-primary",
        className,
      )}
    >
      <div className="flex flex-col gap-mk-sm relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-mk-mono text-sm font-bold text-mk-text uppercase tracking-tight group-hover:text-mk-primary transition-colors">
              {config.name ?? featureId}
            </h3>
            {config.title != null && config.title !== "" && (
              <p className="text-mk-text-secondary text-[10px] font-mk-mono uppercase tracking-widest leading-relaxed max-w-[80%]">
                {config.title}
              </p>
            )}
          </div>
          {hasOverride && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-mk-primary/10 border border-mk-primary/20">
              <div className="w-1 h-1 bg-mk-primary animate-pulse" />
              <span className="text-[9px] font-mk-mono text-mk-primary uppercase font-bold">
                Active Override
              </span>
            </div>
          )}
        </div>

        <div className="mt-2 border-t border-mk-border/50 pt-2">
          <OverrideIndicator
            defaultModelId={config.modelId}
            overrideModelId={override?.modelId}
          />
        </div>
      </div>

      {/* Background flare effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-mk-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </article>
  );
}
