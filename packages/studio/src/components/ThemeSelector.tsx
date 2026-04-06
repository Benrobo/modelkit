import { useState, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import type { ThemeMode } from "../ModelKitStudio";

const THEMES: Array<{ value: ThemeMode; label: string; dot: string }> = [
  { value: "dark", label: "Dark", dot: "#7c3aed" },
  { value: "light", label: "Light", dot: "#e4e4e7" },
  { value: "choco", label: "Choco", dot: "#92400e" },
  { value: "ocean", label: "Ocean", dot: "#0284c7" },
  { value: "sunset", label: "Sunset", dot: "#f97316" },
  { value: "forest", label: "Forest", dot: "#16a34a" },
  { value: "purple", label: "Purple", dot: "#9333ea" },
  { value: "crimson", label: "Crimson", dot: "#dc2626" },
  { value: "cyan", label: "Cyan", dot: "#06b6d4" },
  { value: "amber", label: "Amber", dot: "#f59e0b" },
];

export interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export function ThemeSelector({
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps): ReactElement {
  const [open, setOpen] = useState(false);
  const current = THEMES.find((t) => t.value === currentTheme);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "mk:flex mk:items-center mk:gap-2 mk:px-2.5 mk:py-1.5 mk:rounded-md mk:text-xs mk:text-mk-text-secondary",
            "mk:border mk:border-mk-border mk:bg-mk-surface",
            "mk:hover:text-mk-text mk:hover:border-mk-border-hover mk:transition-colors",
            "mk:focus-visible:outline-none mk:focus-visible:ring-1 mk:focus-visible:ring-mk-primary/40"
          )}
        >
          <span
            className="mk:w-2.5 mk:h-2.5 mk:rounded-sm mk:shrink-0"
            style={{ background: current?.dot ?? "var(--mk-color-primary)" }}
          />
          <span>{current?.label ?? "Theme"}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mk:text-mk-text-muted"
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="mk:w-44 mk:p-1.5 mk:rounded-md mk:border mk:border-mk-border mk:bg-mk-surface mk:shadow-lg"
      >
        <div className="mk:px-2 mk:py-1 mk:text-[11px] mk:font-medium mk:text-mk-text-muted mk:uppercase mk:tracking-wider mk:mb-1">
          Theme
        </div>
        {THEMES.map((theme) => {
          const isSelected = theme.value === currentTheme;
          return (
            <button
              key={theme.value}
              type="button"
              onClick={() => {
                onThemeChange(theme.value);
                setOpen(false);
              }}
              className={cn(
                "mk:w-full mk:flex mk:items-center mk:gap-2.5 mk:px-2 mk:py-1.5 mk:rounded-md mk:text-sm mk:transition-colors mk:cursor-pointer",
                isSelected
                  ? "mk:bg-mk-primary/10 mk:text-mk-text"
                  : "mk:text-mk-text-secondary mk:hover:bg-mk-surface-hover mk:hover:text-mk-text"
              )}
            >
              <span
                className="mk:w-2.5 mk:h-2.5 mk:rounded-sm mk:shrink-0"
                style={{ background: theme.dot }}
              />
              <span className="mk:flex-1 mk:text-left">{theme.label}</span>
              {isSelected && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mk:text-mk-primary mk:shrink-0"
                  aria-hidden
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
