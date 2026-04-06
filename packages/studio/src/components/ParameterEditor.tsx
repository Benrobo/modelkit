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

interface ParamFieldProps {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}

function ParamField({ label, hint, value, min, max, step, onChange }: ParamFieldProps) {
  return (
    <div className="mk:space-y-1">
      <div className="mk:flex mk:items-center mk:justify-between">
        <label className="mk:text-xs mk:font-medium mk:text-mk-text-secondary">
          {label}
        </label>
        <span className="mk:text-xs mk:text-mk-text-muted mk:font-mono">
          {hint}
        </span>
      </div>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "mk:w-full mk:bg-mk-surface mk:border mk:border-mk-border mk:rounded-md",
          "mk:px-3 mk:py-2 mk:text-sm mk:text-mk-text mk:font-mono",
          "mk:focus:outline-none mk:focus:ring-1 mk:focus:ring-mk-primary/40 mk:focus:border-mk-border-hover mk:transition-all"
        )}
      />
    </div>
  );
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
    <div className={cn("mk:grid mk:grid-cols-2 mk:gap-3", className)}>
      {onTemperatureChange != null && (
        <ParamField
          label="Temperature"
          hint="0–2"
          value={temperature}
          min={0}
          max={2}
          step={0.1}
          onChange={onTemperatureChange}
        />
      )}
      {onMaxTokensChange != null && (
        <ParamField
          label="Max tokens"
          hint="1–128k"
          value={maxTokens}
          min={1}
          max={128000}
          step={1}
          onChange={onMaxTokensChange}
        />
      )}
      {onTopPChange != null && (
        <ParamField
          label="Top P"
          hint="0–1"
          value={topP}
          min={0}
          max={1}
          step={0.05}
          onChange={onTopPChange}
        />
      )}
      {onTopKChange != null && (
        <ParamField
          label="Top K"
          hint="0–100"
          value={topK}
          min={0}
          max={100}
          step={1}
          onChange={onTopKChange}
        />
      )}
    </div>
  );
}
