import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "emerald" | "gold";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variants = {
      default:
        "bg-stone-900 text-stone-50 shadow hover:bg-stone-800 dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-200",
      destructive:
        "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-900 dark:text-stone-50 dark:hover:bg-red-800",
      outline:
        "border border-stone-200 bg-white shadow-sm hover:bg-stone-50 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-950 dark:hover:bg-stone-800 dark:hover:text-stone-50",
      secondary:
        "bg-stone-100 text-stone-900 shadow-sm hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-50 dark:hover:bg-stone-700",
      ghost:
        "hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-50",
      link: "text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400",
      emerald:
        "bg-emerald-700 text-white font-semibold shadow hover:bg-emerald-800 active:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500",
      gold:
        "bg-amber-500 text-amber-950 font-semibold shadow hover:bg-amber-400 active:bg-amber-600",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-11 rounded-xl px-6 text-base font-semibold",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
