import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export interface TacticalPanelProps {
  children: ReactNode;
  className?: string;
}

export function TacticalPanel({ children, className }: TacticalPanelProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Top-left corner */}
      <div
        className="absolute w-3 h-3 pointer-events-none z-10"
        style={{
          top: "-1px",
          left: "-1px",
          borderTop: "3px solid var(--mk-color-primary)",
          borderLeft: "3px solid var(--mk-color-primary)",
        }}
      />

      {/* Top-right corner */}
      <div
        className="absolute w-3 h-3 pointer-events-none z-10"
        style={{
          top: "-1px",
          right: "-1px",
          borderTop: "3px solid var(--mk-color-primary)",
          borderRight: "3px solid var(--mk-color-primary)",
        }}
      />

      {/* Bottom-left corner */}
      <div
        className="absolute w-3 h-3 pointer-events-none z-10"
        style={{
          bottom: "-1px",
          left: "-1px",
          borderBottom: "3px solid var(--mk-color-primary)",
          borderLeft: "3px solid var(--mk-color-primary)",
        }}
      />

      {/* Bottom-right corner */}
      <div
        className="absolute w-3 h-3 pointer-events-none z-10"
        style={{
          bottom: "-1px",
          right: "-1px",
          borderBottom: "3px solid var(--mk-color-primary)",
          borderRight: "3px solid var(--mk-color-primary)",
        }}
      />

      {children}
    </div>
  );
}
