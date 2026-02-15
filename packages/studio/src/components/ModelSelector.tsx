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
      <div className={cn("mk:space-y-1", className)}>
        <label className="mk:text-sm mk:font-medium mk:text-mk-text-secondary mk:block">
          Model
        </label>
        <div
          className={cn(
            "mk:w-full mk:border mk:border-mk-border mk:bg-mk-surface mk:px-3 mk:py-2 mk:text-mk-text-secondary mk:text-sm mk:font-mk-mono",
          )}
        >
          Loading models from OpenRouter…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("mk:space-y-1", className)}>
        <label className="mk:text-sm mk:font-medium mk:text-mk-text-secondary mk:block">
          Model
        </label>
        <div className="mk:text-mk-color-error mk:text-sm">
          Failed to load models: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mk:space-y-1.5", className)}>
      <label className="mk:text-[10px] mk:font-mk-mono mk:font-bold mk:text-mk-text-muted mk:uppercase mk:tracking-wider mk:block">
        Model Engine
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "mk:w-full mk:flex mk:items-center mk:justify-between mk:gap-2 mk:border mk:border-mk-border mk:bg-mk-background/50 mk:px-3 mk:py-2.5 mk:text-xs mk:font-mk-mono mk:text-mk-text",
              "mk:hover:border-mk-primary/30 mk:focus:outline-none mk:focus:border-mk-primary/50 mk:transition-all mk:group",
            )}
          >
            <span className="mk:truncate mk:text-left mk:group-hover:text-mk-primary mk:transition-colors">
              {displayLabel}
            </span>
            <ChevronDownIcon className="mk:shrink-0 mk:text-mk-text-muted mk:group-hover:text-mk-primary mk:transition-colors" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="mk:max-h-80 mk:flex mk:flex-col mk:p-0">
          <div className="mk:sticky mk:top-0 mk:z-10 mk:border-b mk:border-mk-border mk:bg-mk-surface mk:p-2">
            <div className="mk:flex mk:items-center mk:gap-2 mk:border mk:border-mk-border mk:bg-mk-background mk:px-2 mk:py-1.5">
              <SearchIcon className="mk:shrink-0 mk:text-mk-text-secondary" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models…"
                className={cn(
                  "mk:min-w-0 mk:flex-1 mk:bg-transparent mk:text-sm mk:font-mk-mono mk:text-mk-text",
                  "mk:placeholder:text-mk-text-secondary mk:focus:outline-none",
                )}
                aria-label="Search models"
              />
            </div>
          </div>
          <div className="mk:min-h-0 mk:overflow-y-auto">
            {!valueInList && value && (
              <button
                type="button"
                onClick={() => {
                  onChange(value);
                  setOpen(false);
                }}
                className={cn(
                  "mk:w-full mk:px-3 mk:py-2 mk:text-left mk:text-sm mk:font-mk-mono mk:border-b mk:border-mk-border",
                  "mk:bg-mk-primary/10 mk:text-mk-primary mk:hover:bg-mk-primary/20",
                )}
              >
                {getModelDisplayName(value)} (current)
              </button>
            )}
            {filtered.providers.length === 0 ? (
              <div className="mk:px-3 mk:py-4 mk:text-center mk:text-sm mk:font-mk-mono mk:text-mk-text-secondary">
                {query ? "No models match your search" : "No models available"}
              </div>
            ) : (
              filtered.providers.map((provider) => {
                const models = filtered.modelsByProvider[provider] ?? [];
                return (
                  <div key={provider}>
                    <div className="mk:px-3 mk:py-1.5 mk:text-xs mk:font-mk-mono mk:font-medium mk:text-mk-text-secondary mk:border-b mk:border-mk-border mk:bg-mk-background">
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
                            "mk:w-full mk:px-3 mk:py-2 mk:text-left mk:text-sm mk:font-mk-mono mk:transition-colors mk:cursor-pointer",
                            isSelected
                              ? "mk:bg-mk-primary/10 mk:text-mk-primary"
                              : "mk:text-mk-text mk:hover:bg-mk-surface-hover mk:hover:text-mk-primary",
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
