import type { ReactElement } from "react";

export interface TacticalToastProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export function TacticalToast({
  type,
  message,
}: TacticalToastProps): ReactElement {
  const colors = {
    success: {
      border: "var(--mk-color-success/50)",
      bg: "rgba(63, 185, 80, 0.1)",
      corner: "#3fb950",
    },
    error: {
      border: "var(--mk-color-error/50)",
      bg: "rgba(248, 81, 73, 0.1)",
      corner: "#f85149",
    },
    info: {
      border: "var(--mk-color-primary/50)",
      bg: "rgba(0, 245, 255, 0.05)",
      corner: "#00f5ff",
    },
    warning: {
      border: "var(--mk-color-warning/50)",
      bg: "rgba(210, 153, 34, 0.1)",
      corner: "#d29922",
    },
  };

  const color = colors[type];

  return (
    <div className="mk:relative mk:inline-block">
      {/* Main toast content */}
      <div
        className="mk:px-4 mk:py-3 mk:min-w-[300px] mk:relative"
        style={{
          background: color.bg,
          border: `1px solid ${color.border}`,
        }}
      >
        {/* Top-left corner */}
        <div
          className="mk:absolute mk:w-3 mk:h-3 mk:pointer-events-none"
          style={{
            top: "-1px",
            left: "-1px",
            borderTop: `3px solid ${color.corner}`,
            borderLeft: `3px solid ${color.corner}`,
          }}
        />

        {/* Top-right corner */}
        <div
          className="mk:absolute mk:w-3 mk:h-3 mk:pointer-events-none"
          style={{
            top: "-1px",
            right: "-1px",
            borderTop: `3px solid ${color.corner}`,
            borderRight: `3px solid ${color.corner}`,
          }}
        />

        {/* Bottom-left corner */}
        <div
          className="mk:absolute mk:w-3 mk:h-3 mk:pointer-events-none"
          style={{
            bottom: "-1px",
            left: "-1px",
            borderBottom: `3px solid ${color.corner}`,
            borderLeft: `3px solid ${color.corner}`,
          }}
        />

        {/* Bottom-right corner */}
        <div
          className="mk:absolute mk:w-3 mk:h-3 mk:pointer-events-none"
          style={{
            bottom: "-1px",
            right: "-1px",
            borderBottom: `3px solid ${color.corner}`,
            borderRight: `3px solid ${color.corner}`,
          }}
        />

        <div className="mk:text-mk-text mk:text-sm mk:uppercase mk:tracking-wide mk:font-medium">
          {message}
        </div>
      </div>
    </div>
  );
}
