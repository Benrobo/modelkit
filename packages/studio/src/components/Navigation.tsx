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
        "mk:sticky mk:top-0 mk:z-50 mk-glass mk:flex mk:items-center mk:justify-between mk:px-mk-lg mk:py-mk-md mk:mb-mk-xl mk:border-b mk:border-mk-border",
        className
      )}
    >
      <div className="mk:flex mk:items-center mk:gap-mk-xl">
        <div className="mk:flex mk:items-center mk:gap-mk-md">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="mk:flex mk:items-center mk:gap-2 mk:text-mk-text-secondary mk:hover:text-mk-primary mk:text-xs mk:uppercase mk:tracking-wide mk:transition-colors mk:group mk:border mk:border-mk-border mk:hover:border-mk-primary mk:px-3 mk:py-1"
            >
              <span className="mk:group-hover:-translate-x-1 mk:transition-transform">
                ←
              </span>
              <span>Back</span>
            </button>
          )}
          <div className="mk:flex mk:items-center mk:gap-mk-sm">
            <div className="mk:flex mk:items-center mk:gap-2">
              <div className="mk:w-1.5 mk:h-1.5 mk:bg-mk-primary" />
              <h1 className="mk:text-sm mk:font-bold mk:text-mk-primary mk:tracking-wide mk:uppercase">
                {title}
              </h1>
            </div>
            <div className="mk:h-4 mk:w-px mk:bg-mk-border mk:hidden mk:sm:block" />
            <span className="mk:text-[10px] mk:text-mk-text-secondary mk:hidden mk:sm:block mk:uppercase mk:tracking-wider">
              Production Environment
            </span>
          </div>
        </div>
      </div>
      <div className="mk:flex mk:items-center mk:gap-mk-md">{actions}</div>
    </header>
  );
}
