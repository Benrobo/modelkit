import { useState, type ReactElement } from "react";
import { cn } from "../utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import type { ThemeMode } from "../ModelKitStudio";

const THEMES: Array<{ value: ThemeMode; label: string; description: string }> = [
  { value: "dark", label: "Dark", description: "Tactical dark with cyan accents" },
  { value: "light", label: "Light", description: "Clean light theme" },
  { value: "choco", label: "Choco", description: "Warm chocolate theme" },
  { value: "ocean", label: "Ocean", description: "Deep blue ocean" },
  { value: "sunset", label: "Sunset", description: "Orange sunset" },
  { value: "forest", label: "Forest", description: "Green forest" },
  { value: "purple", label: "Purple", description: "Purple violet" },
  { value: "crimson", label: "Crimson", description: "Red crimson" },
  { value: "cyan", label: "Cyan", description: "Bright cyan" },
  { value: "amber", label: "Amber", description: "Golden amber" },
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

  const currentThemeData = THEMES.find((t) => t.value === currentTheme);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "mk:px-3 mk:py-1.5 mk:border mk:border-mk-border mk:bg-mk-surface mk:text-xs mk:uppercase mk:tracking-wide mk:transition-colors",
            "mk:hover:border-mk-primary mk:hover:text-mk-primary",
            "mk:flex mk:items-center mk:gap-2"
          )}
        >
          <span className="mk:w-3 mk:h-3 mk:bg-mk-primary mk:border mk:border-mk-border" />
          <span>{currentThemeData?.label || "Theme"}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="mk:w-64 mk:p-2">
        <div className="mk:space-y-1">
          <div className="mk:px-2 mk:py-1.5 mk:text-[10px] mk:uppercase mk:tracking-wider mk:text-mk-text-secondary mk:font-bold mk:border-b mk:border-mk-border mk:mb-2">
            Select Theme
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
                  "mk:w-full mk:px-3 mk:py-2 mk:text-left mk:text-sm mk:font-mk-mono mk:transition-colors mk:cursor-pointer",
                  "mk:hover:bg-mk-surface-hover",
                  isSelected
                    ? "mk:bg-mk-primary/10 mk:text-mk-primary mk:border-l-2 mk:border-mk-primary"
                    : "mk:text-mk-text"
                )}
              >
                <div className="mk:font-medium">{theme.label}</div>
                <div className="mk:text-xs mk:text-mk-text-secondary">
                  {theme.description}
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
