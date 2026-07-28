import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
  barClassName?: string;
  showPercentage?: boolean;
}

export function Progress({
  value,
  className,
  barClassName,
  showPercentage = false,
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full flex flex-col gap-1">
      {showPercentage && (
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>İlerleme</span>
          <span>%{Math.round(clampedValue)}</span>
        </div>
      )}
      <div
        className={cn(
          "w-full h-2 rounded-full overflow-hidden bg-slate-200/80 dark:bg-slate-800/80",
          className
        )}
      >
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full",
            barClassName
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
