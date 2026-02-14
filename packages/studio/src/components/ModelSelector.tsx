import { useState, useEffect, useMemo, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useAvailableModels } from "../hooks/useAvailableModels";
import { getModelDisplayName } from "../utils/models";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export interface ModelSelectorProps {
  value: string;
  onChange: (modelId: string) => void;
  className?: string;
}

export function ModelSelector({
  value,
  onChange,
  className,
}: ModelSelectorProps): ReactElement {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { modelsByProvider, allModels, loading, error } = useAvailableModels();

  useEffect(() => {
    if (!open) setSearchQuery("");
  }, [open]);

  const valueInList = allModels.some((m) => m.id === value);
  const providers = Object.keys(modelsByProvider).sort();

  const query = searchQuery.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return { providers, modelsByProvider };
    const filteredByProvider: Record<string, typeof allModels> = {};
    for (const provider of providers) {
      const models = (modelsByProvider[provider] ?? []).filter((m) => {
        const name = (m.name || getModelDisplayName(m.id)).toLowerCase();
        const id = m.id.toLowerCase();
        return (
          id.includes(query) ||
          name.includes(query) ||
          provider.toLowerCase().includes(query)
        );
      });
      if (models.length > 0) filteredByProvider[provider] = models;
    }
    return {
      providers: Object.keys(filteredByProvider).sort(),
      modelsByProvider: filteredByProvider,
    };
  }, [query, providers, modelsByProvider]);

  const currentModel = allModels.find((m) => m.id === value);
  const displayLabel = value
    ? (currentModel?.name || getModelDisplayName(value)) +
      (currentModel?.context_length != null
        ? ` (${Math.round(currentModel.context_length / 1000)}k ctx)`
        : "")
    : "Select model";

  if (loading) {
    return (
      <div className={cn("space-y-1", className)}>
        <label className="text-sm font-medium text-mk-text-secondary block">
          Model
        </label>
        <div
          className={cn(
            "w-full border border-mk-border bg-mk-surface px-3 py-2 text-mk-text-secondary text-sm font-mk-mono",
          )}
        >
          Loading models from OpenRouter…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-1", className)}>
        <label className="text-sm font-medium text-mk-text-secondary block">
          Model
        </label>
        <div className="text-mk-color-error text-sm">
          Failed to load models: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-[10px] font-mk-mono font-bold text-mk-text-muted uppercase tracking-wider block">
        Model Engine
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "w-full flex items-center justify-between gap-2 border border-mk-border bg-mk-background/50 px-3 py-2.5 text-xs font-mk-mono text-mk-text",
              "hover:border-mk-primary/30 focus:outline-none focus:border-mk-primary/50 transition-all group",
            )}
          >
            <span className="truncate text-left group-hover:text-mk-primary transition-colors">
              {displayLabel}
            </span>
            <ChevronDownIcon className="shrink-0 text-mk-text-muted group-hover:text-mk-primary transition-colors" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-h-80 flex flex-col p-0">
          <div className="sticky top-0 z-10 border-b border-mk-border bg-mk-surface p-2">
            <div className="flex items-center gap-2 border border-mk-border bg-mk-background px-2 py-1.5">
              <SearchIcon className="shrink-0 text-mk-text-secondary" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models…"
                className={cn(
                  "min-w-0 flex-1 bg-transparent text-sm font-mk-mono text-mk-text",
                  "placeholder:text-mk-text-secondary focus:outline-none",
                )}
                aria-label="Search models"
              />
            </div>
          </div>
          <div className="min-h-0 overflow-y-auto">
            {!valueInList && value && (
              <button
                type="button"
                onClick={() => {
                  onChange(value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm font-mk-mono border-b border-mk-border",
                  "bg-mk-primary/10 text-mk-primary hover:bg-mk-primary/20",
                )}
              >
                {getModelDisplayName(value)} (current)
              </button>
            )}
            {filtered.providers.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm font-mk-mono text-mk-text-secondary">
                {query ? "No models match your search" : "No models available"}
              </div>
            ) : (
              filtered.providers.map((provider) => {
                const models = filtered.modelsByProvider[provider] ?? [];
                return (
                  <div key={provider}>
                    <div className="px-3 py-1.5 text-xs font-mk-mono font-medium text-mk-text-secondary border-b border-mk-border bg-mk-background">
                      {provider}
                    </div>
                    {models.map((model) => {
                      const isSelected = model.id === value;
                      const label =
                        (model.name || getModelDisplayName(model.id)) +
                        (model.context_length != null
                          ? ` (${Math.round(model.context_length / 1000)}k ctx)`
                          : "");
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            onChange(model.id);
                            setOpen(false);
                          }}
                          className={cn(
                            "w-full px-3 py-2 text-left text-sm font-mk-mono transition-colors",
                            isSelected
                              ? "bg-mk-primary/10 text-mk-primary"
                              : "text-mk-text hover:bg-mk-surface hover:border-mk-border",
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
