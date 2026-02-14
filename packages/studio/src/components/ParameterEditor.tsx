import type { ReactElement } from "react";
import { cn } from "../utils/cn";

export interface ParameterEditorProps {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  onTemperatureChange?: (v: number) => void;
  onMaxTokensChange?: (v: number) => void;
  onTopPChange?: (v: number) => void;
  onTopKChange?: (v: number) => void;
  className?: string;
}

export function ParameterEditor({
  temperature = 0.7,
  maxTokens = 4096,
  topP = 1,
  topK = 0,
  onTemperatureChange,
  onMaxTokensChange,
  onTopPChange,
  onTopKChange,
  className,
}: ParameterEditorProps): ReactElement {
  return (
    <div className={cn("grid grid-cols-2 gap-mk-lg", className)}>
      {onTemperatureChange != null && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-mk-mono font-bold text-mk-text-muted uppercase tracking-wider block">
            Temperature
          </label>
          <input
            type="number"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => onTemperatureChange(Number(e.target.value))}
            className={cn(
              "w-full bg-mk-background/50 border border-mk-border px-3 py-2 text-mk-text text-sm font-mk-mono",
              "focus:outline-none focus:border-mk-primary/50 focus:ring-1 focus:ring-mk-primary/20 transition-all",
            )}
          />
        </div>
      )}
      {onMaxTokensChange != null && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-mk-mono font-bold text-mk-text-muted uppercase tracking-wider block">
            Max Tokens
          </label>
          <input
            type="number"
            min={1}
            max={128000}
            step={1}
            value={maxTokens}
            onChange={(e) => onMaxTokensChange(Number(e.target.value))}
            className={cn(
              "w-full bg-mk-background/50 border border-mk-border px-3 py-2 text-mk-text text-sm font-mk-mono",
              "focus:outline-none focus:border-mk-primary/50 focus:ring-1 focus:ring-mk-primary/20 transition-all",
            )}
          />
        </div>
      )}
      {onTopPChange != null && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-mk-mono font-bold text-mk-text-muted uppercase tracking-wider block">
            Top P
          </label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={topP}
            onChange={(e) => onTopPChange(Number(e.target.value))}
            className={cn(
              "w-full bg-mk-background/50 border border-mk-border px-3 py-2 text-mk-text text-sm font-mk-mono",
              "focus:outline-none focus:border-mk-primary/50 focus:ring-1 focus:ring-mk-primary/20 transition-all",
            )}
          />
        </div>
      )}
      {onTopKChange != null && (
        <div className="space-y-1.5">
          <label className="text-[10px] font-mk-mono font-bold text-mk-text-muted uppercase tracking-wider block">
            Top K
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={topK}
            onChange={(e) => onTopKChange(Number(e.target.value))}
            className={cn(
              "w-full bg-mk-background/50 border border-mk-border px-3 py-2 text-mk-text text-sm font-mk-mono",
              "focus:outline-none focus:border-mk-primary/50 focus:ring-1 focus:ring-mk-primary/20 transition-all",
            )}
          />
        </div>
      )}
    </div>
  );
}
