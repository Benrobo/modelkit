import type { ReactElement } from "react";
import { cn } from "../utils/cn";

export interface ParameterEditorProps {
  temperature?: number;
  maxTokens?: number;
  onTemperatureChange?: (v: number) => void;
  onMaxTokensChange?: (v: number) => void;
  className?: string;
}

export function ParameterEditor({
  temperature = 0.7,
  maxTokens = 4096,
  onTemperatureChange,
  onMaxTokensChange,
  className,
}: ParameterEditorProps): ReactElement {
  return (
    <div className={cn("grid grid-cols-2 gap-mk-md", className)}>
      {onTemperatureChange != null && (
        <div>
          <label className="text-sm font-medium text-mk-text-secondary block mb-1">
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
              "w-full rounded-mk-md border border-mk-border bg-mk-surface px-3 py-2 text-mk-text text-sm",
              "focus:outline-none focus:ring-2 focus:ring-mk-primary"
            )}
          />
        </div>
      )}
      {onMaxTokensChange != null && (
        <div>
          <label className="text-sm font-medium text-mk-text-secondary block mb-1">
            Max Tokens
          </label>
          <input
            type="number"
            min={1}
            max={128000}
            step={256}
            value={maxTokens}
            onChange={(e) => onMaxTokensChange(Number(e.target.value))}
            className={cn(
              "w-full rounded-mk-md border border-mk-border bg-mk-surface px-3 py-2 text-mk-text text-sm",
              "focus:outline-none focus:ring-2 focus:ring-mk-primary"
            )}
          />
        </div>
      )}
    </div>
  );
}
