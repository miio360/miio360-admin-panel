import { Card, CardContent } from './card';
import clsx from 'clsx';
import type { ReactNode } from 'react';

interface CardGlobalProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon: ReactNode;
  gradientClass: string; // Ej: 'from-orange-50 via-white to-primary/10'
  iconBgClass: string;   // Ej: 'from-orange-400 to-orange-600'
  className?: string;
}

export function CardGlobal({
  title,
  value,
  subtitle,
  icon,
  gradientClass,
  iconBgClass,
  className = '',
}: CardGlobalProps) {
  return (
    <Card className={clsx(
      'border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br hover:scale-105 transform',
      `bg-gradient-to-br ${gradientClass}`,
      className
    )}>
      <CardContent className="pt-6 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={clsx('text-xs mb-1 uppercase tracking-wide font-bold',
              gradientClass.includes('orange') ? 'text-orange-600' : gradientClass.includes('green') ? 'text-green-700' : 'text-blue-700')}>{title}</p>
            <p className={clsx('text-4xl font-black text-foreground bg-clip-text text-transparent',
              gradientClass.includes('orange') ? 'bg-gradient-to-r from-orange-600 to-orange-800' : gradientClass.includes('green') ? 'bg-gradient-to-r from-green-600 to-green-800' : 'bg-gradient-to-r from-blue-600 to-blue-800')}>{value}</p>
            {subtitle && <p className={clsx('text-xs mt-2 font-medium',
              gradientClass.includes('orange') ? 'text-orange-600/70' : gradientClass.includes('green') ? 'text-green-600/70' : 'text-blue-600/70')}>{subtitle}</p>}
          </div>
          <div className={clsx('w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl', `bg-gradient-to-br ${iconBgClass}`)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
