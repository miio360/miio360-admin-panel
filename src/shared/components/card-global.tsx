import * as React from "react"
import { cn } from "@/shared/lib/utils"
import type { ReactNode } from 'react';

const CardGlobal = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden",
      className
    )}
    {...props}
  />
))
CardGlobal.displayName = "CardGlobal"

const CardGlobalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 px-6 py-5 border-b border-gray-100 bg-gray-50/50", className)}
    {...props}
  />
))
CardGlobalHeader.displayName = "CardGlobalHeader"

const CardGlobalTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-bold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
CardGlobalTitle.displayName = "CardGlobalTitle"

const CardGlobalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-foreground/60 font-medium", className)}
    {...props}
  />
))
CardGlobalDescription.displayName = "CardGlobalDescription"

const CardGlobalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 py-5", className)} {...props} />
))
CardGlobalContent.displayName = "CardGlobalContent"

const CardGlobalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center px-6 py-4 border-t border-gray-100 bg-gray-50/30", className)}
    {...props}
  />
))
CardGlobalFooter.displayName = "CardGlobalFooter"

interface CardStatProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon: ReactNode;
  gradientClass: string;
  iconBgClass: string;
  className?: string;
}

export { CardGlobal, CardGlobalHeader, CardGlobalFooter, CardGlobalTitle, CardGlobalDescription, CardGlobalContent }

export function CardStat({
  title,
  value,
  subtitle,
  icon,
  gradientClass,
  iconBgClass,
  className = '',
}: CardStatProps) {
  return (
    <CardGlobal className={cn(
      'border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br',
      gradientClass,
      className
    )}>
      <CardGlobalContent className="pt-5 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn('text-xs mb-1.5 uppercase tracking-wide font-semibold text-foreground/70')}>{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && <p className="text-xs mt-2 font-medium text-foreground/60">{subtitle}</p>}
          </div>
          <div className={cn('w-14 h-14 rounded-xl flex items-center justify-center shadow-sm', `bg-gradient-to-br ${iconBgClass}`)}>
            {icon}
          </div>
        </div>
      </CardGlobalContent>
    </CardGlobal>
  );
}
