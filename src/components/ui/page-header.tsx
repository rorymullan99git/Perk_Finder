import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

/** Shared tab header: one dark room, one accent, no repeated pitch. */
export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <section className={cn("rounded-3xl bg-stone-900 text-white p-6 md:p-8 shadow-xl", className)}>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 max-w-3xl text-sm md:text-base leading-relaxed text-stone-300">{description}</p>
      )}
      {children}
    </section>
  );
}
