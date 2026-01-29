import { ReactNode } from 'react';

import {
  Card,
  CardContent
} from '../components/ui/card';
import { cn } from '../lib/utils';

interface CardStatProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon: ReactNode;
  gradientClass: string;
  iconBgClass: string;
  className?: string;
}

export function CardStat({
  title,
  value,
  subtitle,
  icon,
  iconBgClass,
}: CardStatProps) {
  return (
    <Card className={
      'border border-gray-200 bg-white shadow-sm hover:shadow transition-shadow duration-150'
    }>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs mb-1 uppercase tracking-wide font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs mt-1 text-gray-500">{subtitle}</p>}
          </div>
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-sm', `bg-gradient-to-br ${iconBgClass}`)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
