import { Users, ShoppingBag, FileText, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: 'users' | 'categories' | 'receipts' | 'plans' | 'revenue';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const iconMap = {
  users: Users,
  categories: ShoppingBag,
  receipts: FileText,
  plans: Calendar,
  revenue: TrendingUp,
};

export const StatCard = ({ title, value, subtitle, icon, trend, onClick }: StatCardProps) => {
  const Icon = iconMap[icon];
  const isClickable = !!onClick;

  return (
    <Card
      className={cn(
        "border-foreground/10 bg-white hover:shadow transition-shadow",
        isClickable && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground/60">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
            {subtitle && (
              <p className="text-xs text-foreground/50 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1 mt-2">
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
              </div>
            )}
          </div>
          <div className="bg-primary/10 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
