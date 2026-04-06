import { useState, useEffect, useMemo, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { useAvailableModels } from "../hooks/useAvailableModels";
import { getModelDisplayName } from "../utils/models";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { SearchIcon, ChevronDownIcon } from "./Icons";

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
    ? currentModel?.name || getModelDisplayName(value)
    : null;

  const contextLabel =
    currentModel?.context_length != null
      ? `${Math.round(currentModel.context_length / 1000)}k ctx`
      : null;

  if (loading) {
    return (
      <div className={cn("mk:space-y-1.5", className)}>
        <label className="mk:text-xs mk:font-medium mk:text-mk-text-muted mk:block">
          Model
        </label>
        <div className="mk:w-full mk:border mk:border-mk-border mk:rounded-md mk:bg-mk-surface mk:px-3 mk:py-2 mk:text-mk-text-muted mk:text-sm mk:font-mono">
          Loading models…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("mk:space-y-1.5", className)}>
        <label className="mk:text-xs mk:font-medium mk:text-mk-text-muted mk:block">
          Model
        </label>
        <div className="mk:text-xs mk:text-mk-color-error">
          Failed to load models
        </div>
      </div>
    );
  }

  return (
    <div className={cn("mk:space-y-1.5", className)}>
      <label className="mk:text-xs mk:font-medium mk:text-mk-text-muted mk:block">
        Model
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "mk:w-full mk:flex mk:items-center mk:justify-between mk:gap-2",
              "mk:border mk:border-mk-border mk:rounded-md mk:bg-mk-surface",
              "mk:px-3 mk:py-2 mk:text-sm mk:transition-colors",
              "mk:hover:border-mk-border-hover mk:focus:outline-none mk:focus:ring-1 mk:focus:ring-mk-primary/40",
              open && "mk:border-mk-border-hover mk:ring-1 mk:ring-mk-primary/40"
            )}
          >
            {displayLabel ? (
              <div className="mk:flex mk:items-center mk:gap-2 mk:min-w-0">
                <span className="mk:text-mk-text mk:font-mono mk:text-sm mk:truncate">
                  {displayLabel}
                </span>
                {contextLabel && (
                  <span className="mk:shrink-0 mk:text-[11px] mk:text-mk-text-muted mk:font-mono mk:bg-mk-background mk:border mk:border-mk-border mk:px-1.5 mk:py-0.5 mk:rounded">
                    {contextLabel}
                  </span>
                )}
              </div>
            ) : (
              <span className="mk:text-mk-text-muted mk:text-sm">
                Select a model
              </span>
            )}
            <ChevronDownIcon size={14} className="mk:shrink-0 mk:text-mk-text-muted" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="mk:max-h-72 mk:flex mk:flex-col mk:p-0 mk:rounded-md mk:border mk:border-mk-border mk:bg-mk-surface mk:shadow-lg"
        >
          {/* Search */}
          <div className="mk:p-2 mk:border-b mk:border-mk-border mk:shrink-0">
            <div className="mk:flex mk:items-center mk:gap-2 mk:bg-mk-background mk:border mk:border-mk-border mk:rounded-md mk:px-2.5 mk:py-1.5">
              <SearchIcon size={13} className="mk:shrink-0 mk:text-mk-text-muted" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models…"
                className="mk:flex-1 mk:min-w-0 mk:bg-transparent mk:text-sm mk:text-mk-text mk:placeholder:text-mk-text-muted mk:focus:outline-none mk:font-mono"
                aria-label="Search models"
              />
            </div>
          </div>

          {/* Model list */}
          <div className="mk:flex-1 mk:overflow-y-auto custom-scrollbar">
            {!valueInList && value && (
              <button
                type="button"
                onClick={() => {
                  onChange(value);
                  setOpen(false);
                }}
                className="mk:w-full mk:px-3 mk:py-2 mk:text-left mk:text-sm mk:font-mono mk:border-b mk:border-mk-border mk:bg-mk-primary/8 mk:text-mk-primary mk:hover:bg-mk-primary/15 mk:transition-colors"
              >
                {getModelDisplayName(value)}{" "}
                <span className="mk:text-mk-primary/60">(current)</span>
              </button>
            )}
            {filtered.providers.length === 0 ? (
              <div className="mk:px-3 mk:py-6 mk:text-center mk:text-sm mk:text-mk-text-muted">
                {query ? "No models found" : "No models available"}
              </div>
            ) : (
              filtered.providers.map((provider) => {
                const models = filtered.modelsByProvider[provider] ?? [];
                return (
                  <div key={provider}>
                    <div className="mk:px-3 mk:py-1.5 mk:text-[11px] mk:font-medium mk:text-mk-text-muted mk:uppercase mk:tracking-wider mk:bg-mk-background mk:border-b mk:border-mk-border mk:sticky mk:top-0">
                      {provider}
                    </div>
                    {models.map((model) => {
                      const isSelected = model.id === value;
                      const ctx =
                        model.context_length != null
                          ? `${Math.round(model.context_length / 1000)}k`
                          : null;
                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            onChange(model.id);
                            setOpen(false);
                          }}
                          className={cn(
                            "mk:w-full mk:px-3 mk:py-2 mk:text-left mk:text-sm mk:font-mono mk:transition-colors mk:flex mk:items-center mk:justify-between mk:gap-2",
                            isSelected
                              ? "mk:bg-mk-primary/10 mk:text-mk-primary"
                              : "mk:text-mk-text mk:hover:bg-mk-surface-hover"
                          )}
                        >
                          <span className="mk:truncate">
                            {model.name || getModelDisplayName(model.id)}
                          </span>
                          {ctx && (
                            <span className="mk:shrink-0 mk:text-[11px] mk:text-mk-text-muted">
                              {ctx}
                            </span>
                          )}
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
