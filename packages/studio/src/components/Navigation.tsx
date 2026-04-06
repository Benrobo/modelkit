import type { ReactElement } from "react";
import { cn } from "../utils/cn";
import { MenuIcon, ArrowLeftIcon } from "./Icons";

export interface NavigationProps {
  onBack?: () => void;
  showBack: boolean;
  title?: string;
  className?: string;
  actions?: ReactElement;
  onMenuToggle?: () => void;
}

export function Navigation({
  onBack,
  showBack,
  title = "ModelKit Studio",
  className,
  actions,
  onMenuToggle,
}: NavigationProps): ReactElement {
  return (
    <header
      className={cn(
        "mk:sticky mk:top-0 mk:z-50 mk:flex mk:items-center mk:justify-between mk:px-4 mk:h-12 mk:border-b mk:border-mk-border mk:bg-mk-background mk:shrink-0",
        className
      )}
    >
      <div className="mk:flex mk:items-center mk:gap-2">
        {/* Mobile menu toggle — only visible below md */}
        {onMenuToggle && (
          <button
            type="button"
            onClick={onMenuToggle}
            className="mk:md:hidden mk:w-8 mk:h-8 mk:flex mk:items-center mk:justify-center mk:rounded-md mk:text-mk-text-secondary mk:hover:text-mk-text mk:hover:bg-mk-surface mk:transition-colors"
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={16} />
          </button>
        )}

        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="mk:flex mk:items-center mk:gap-1.5 mk:text-mk-text-secondary mk:hover:text-mk-text mk:text-sm mk:transition-colors mk:pr-3 mk:border-r mk:border-mk-border"
          >
            <ArrowLeftIcon size={14} />
            Back
          </button>
        )}

        <div className="mk:flex mk:items-center mk:gap-2.5">
          {/* Logo mark — four squares, duotone-style */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="var(--mk-color-primary)" opacity="0.9" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="var(--mk-color-primary)" opacity="0.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="var(--mk-color-primary)" opacity="0.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="var(--mk-color-primary)" opacity="0.2" />
          </svg>
          <span className="mk:text-sm mk:font-semibold mk:text-mk-text mk:tracking-tight">
            {title}
          </span>
          <span className="mk:text-mk-border mk:hidden mk:sm:block mk:text-xs">/</span>
          <span className="mk:text-xs mk:text-mk-text-muted mk:hidden mk:sm:block">
            Model overrides
          </span>
        </div>
      </div>

      <div className="mk:flex mk:items-center mk:gap-2">{actions}</div>
    </header>
  );
}
