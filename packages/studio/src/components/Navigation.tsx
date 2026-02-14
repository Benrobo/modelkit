import type { ReactElement } from "react";
import { cn } from "../utils/cn";

export interface NavigationProps {
  onBack?: () => void;
  showBack: boolean;
  title?: string;
  className?: string;
  actions?: ReactElement;
}

export function Navigation({
  onBack,
  showBack,
  title = "ModelKit Studio",
  className,
  actions,
}: NavigationProps): ReactElement {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 mk-glass flex items-center justify-between px-mk-lg py-mk-md mb-mk-xl border-b border-mk-border",
        className,
      )}
    >
      <div className="flex items-center gap-mk-xl">
        <div className="flex items-center gap-mk-md">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-mk-text-secondary hover:text-mk-primary text-xs uppercase tracking-wide transition-colors group border border-mk-border hover:border-mk-primary px-3 py-1"
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              <span>Back</span>
            </button>
          )}
          <div className="flex items-center gap-mk-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-mk-primary" />
              <h1 className="text-sm font-bold text-mk-primary tracking-wide uppercase">
                {title}
              </h1>
            </div>
            <div className="h-4 w-px bg-mk-border hidden sm:block" />
            <span className="text-[10px] text-mk-text-secondary hidden sm:block uppercase tracking-wider">
              Production Environment
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-mk-md">{actions}</div>
    </header>
  );
}
