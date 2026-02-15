import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../utils/cn";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 4, style, ...props }, ref) => {
  // Get computed CSS variables from the root .modelkit-studio element to pass to portal
  const [themeVars, setThemeVars] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    const root = document.querySelector(".modelkit-studio");
    if (root) {
      const computedStyle = getComputedStyle(root);
      const vars: React.CSSProperties = {};

      // Extract all --mk-* CSS variables
      for (let i = 0; i < computedStyle.length; i++) {
        const prop = computedStyle[i];
        if (prop.startsWith("--mk-")) {
          // @ts-ignore
          vars[prop as any] = computedStyle.getPropertyValue(prop);
        }
      }

      setThemeVars(vars);
    }
  }, []);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        style={{ ...themeVars, ...style }}
        className={cn(
          "mk:z-50 mk:w-[var(--radix-popover-trigger-width)] mk:min-w-56 mk:border mk:border-mk-border mk:bg-mk-surface mk:p-1 mk:text-mk-text mk:shadow-md mk:outline-none",
          "mk:data-[state=open]:animate-in mk:data-[state=closed]:animate-out mk:data-[state=closed]:fade-out-0 mk:data-[state=open]:fade-in-0",
          "mk:data-[state=closed]:zoom-out-95 mk:data-[state=open]:zoom-in-95",
          "mk:data-[side=bottom]:slide-in-from-top-2 mk:data-[side=top]:slide-in-from-bottom-2",
          "mk:origin-[var(--radix-popover-content-transform-origin)]",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
