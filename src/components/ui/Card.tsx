import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
}

export function Card({
  className,
  glass = true,
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 overflow-hidden border transition-all duration-200",
        glass
          ? "glass-panel"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800",
        hoverable && "glass-panel-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
