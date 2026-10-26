import * as React from "react";

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-stone-900">{title}</h1>
      {description && <p className="mt-2 text-stone-500 leading-relaxed">{description}</p>}
    </header>
  );
}
