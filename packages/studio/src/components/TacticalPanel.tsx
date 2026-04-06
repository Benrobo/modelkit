import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export interface TacticalPanelProps {
  children: ReactNode;
  className?: string;
}

export function TacticalPanel({ children, className }: TacticalPanelProps) {
  return <div className={cn("mk:relative", className)}>{children}</div>;
}
