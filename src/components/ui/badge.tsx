import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "brand";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default:
      "border-transparent bg-stone-900 text-stone-50 hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-900",
    secondary:
      "border-transparent bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100",
    destructive:
      "border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
    outline: "text-stone-700 border-stone-200 dark:text-stone-300 dark:border-stone-700",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 font-semibold",
    warning:
      "border-amber-200 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300 font-medium",
    brand:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
