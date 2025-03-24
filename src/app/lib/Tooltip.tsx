import { cn } from "lazy-cn";
import type { ComponentProps, ReactNode } from "react";

export function TooltipBase(
  { className, ...props }: ComponentProps<"div">
) {
  return (
    <div {...props} className={cn("bg-background p-2 px-3 border border-border rounded-md w-fit text-foreground-body text-xs shadow-lg", className)} />
  )
}

export function StaticTooltip(
  { className, children, tooltip, ...props }: ComponentProps<"div"> & {
    tooltip: ReactNode,
  }
) {
  return (
    <div className={cn("group relative", className)} {...props}>
      {children}
      <div className="absolute opacity-0 transition group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 w-fit pointer-events-none py-1 z-50">
        {tooltip}
      </div>
    </div>
  )
}