import { ReactNode } from "react";

interface PageHeaderGlobalProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeaderGlobal({ title, description, action }: PageHeaderGlobalProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-foreground/60 mt-1 font-medium">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
