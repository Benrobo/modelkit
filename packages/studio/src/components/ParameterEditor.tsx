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
    <div className={cn("mk:grid mk:grid-cols-2 mk:gap-mk-lg", className)}>
      {onTemperatureChange != null && (
        <div className="mk:space-y-1.5">
          <label className="mk:text-[10px] mk:font-mk-mono mk:font-bold mk:text-mk-text-muted mk:uppercase mk:tracking-wider mk:block">
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
              "mk:w-full mk:bg-mk-background/50 mk:border mk:border-mk-border mk:px-3 mk:py-2 mk:text-mk-text mk:text-sm mk:font-mk-mono",
              "focus:mk:outline-none focus:mk:border-mk-primary/50 focus:mk:ring-1 focus:mk:ring-mk-primary/20 mk:transition-all",
            )}
          />
        </div>
      )}
      {onMaxTokensChange != null && (
        <div className="mk:space-y-1.5">
          <label className="mk:text-[10px] mk:font-mk-mono mk:font-bold mk:text-mk-text-muted mk:uppercase mk:tracking-wider mk:block">
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
              "mk:w-full mk:bg-mk-background/50 mk:border mk:border-mk-border mk:px-3 mk:py-2 mk:text-mk-text mk:text-sm mk:font-mk-mono",
              "focus:mk:outline-none focus:mk:border-mk-primary/50 focus:mk:ring-1 focus:mk:ring-mk-primary/20 mk:transition-all",
            )}
          />
        </div>
      )}
      {onTopPChange != null && (
        <div className="mk:space-y-1.5">
          <label className="mk:text-[10px] mk:font-mk-mono mk:font-bold mk:text-mk-text-muted mk:uppercase mk:tracking-wider mk:block">
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
              "mk:w-full mk:bg-mk-background/50 mk:border mk:border-mk-border mk:px-3 mk:py-2 mk:text-mk-text mk:text-sm mk:font-mk-mono",
              "focus:mk:outline-none focus:mk:border-mk-primary/50 focus:mk:ring-1 focus:mk:ring-mk-primary/20 mk:transition-all",
            )}
          />
        </div>
      )}
      {onTopKChange != null && (
        <div className="mk:space-y-1.5">
          <label className="mk:text-[10px] mk:font-mk-mono mk:font-bold mk:text-mk-text-muted mk:uppercase mk:tracking-wider mk:block">
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
              "mk:w-full mk:bg-mk-background/50 mk:border mk:border-mk-border mk:px-3 mk:py-2 mk:text-mk-text mk:text-sm mk:font-mk-mono",
              "focus:mk:outline-none focus:mk:border-mk-primary/50 focus:mk:ring-1 focus:mk:ring-mk-primary/20 mk:transition-all",
            )}
          />
        </div>
      )}
    </div>
  );
}
