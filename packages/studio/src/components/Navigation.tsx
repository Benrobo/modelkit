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
        "sticky top-0 z-50 mk-glass flex items-center justify-between px-mk-lg py-mk-md mb-mk-xl border-b-2 border-mk-border",
        className,
      )}
    >
      {/* Tactical accent line */}
      <div className="absolute top-0 left-0 h-[2px] w-32 bg-linear-to-r from-mk-primary to-transparent opacity-80" />
      <div className="absolute bottom-0 right-0 h-[2px] w-32 bg-linear-to-l from-mk-primary to-transparent opacity-80" />

      <div className="flex items-center gap-mk-xl">
        <div className="flex items-center gap-mk-md">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-mk-text-secondary hover:text-mk-primary text-xs font-mk-mono uppercase tracking-wider transition-colors group border border-mk-border hover:border-mk-primary px-3 py-1"
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              <span>Back</span>
            </button>
          )}
          <div className="flex items-center gap-mk-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-mk-primary animate-pulse" />
              <h1 className="text-sm font-mk-mono font-bold text-mk-primary tracking-tight uppercase">
                {title}
              </h1>
            </div>
            <div className="h-4 w-px bg-mk-border hidden sm:block" />
            <span className="text-[10px] font-mk-mono text-mk-text-secondary hidden sm:block uppercase tracking-widest">
              Production Environment
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-mk-md">{actions}</div>
    </header>
  );
}
