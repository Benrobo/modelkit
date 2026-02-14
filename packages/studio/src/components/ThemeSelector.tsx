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
            "px-3 py-1.5 border border-mk-border bg-mk-surface text-xs uppercase tracking-wide transition-colors",
            "hover:border-mk-primary hover:text-mk-primary",
            "flex items-center gap-2"
          )}
        >
          <span className="w-3 h-3 bg-mk-primary border border-mk-border" />
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
      <PopoverContent align="end" className="w-64 p-2">
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-mk-text-secondary font-bold border-b border-mk-border mb-2">
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
                  "w-full px-3 py-2 text-left text-sm font-mk-mono transition-colors cursor-pointer",
                  "hover:bg-mk-surface-hover",
                  isSelected
                    ? "bg-mk-primary/10 text-mk-primary border-l-2 border-mk-primary"
                    : "text-mk-text"
                )}
              >
                <div className="font-medium">{theme.label}</div>
                <div className="text-xs text-mk-text-secondary">
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
