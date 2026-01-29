import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface RevenueCardProps {
  currentMonth: number;
  lastMonth: number;
}

export const RevenueCard = ({ currentMonth, lastMonth }: RevenueCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(amount);
  };

  const calculateTrend = () => {
    if (lastMonth === 0) return { value: 0, isPositive: true };
    const change = ((currentMonth - lastMonth) / lastMonth) * 100;
    return {
      value: Math.round(change),
      isPositive: change >= 0,
    };
  };

  const trend = calculateTrend();

  return (
    <Card className="border-foreground/10 bg-white hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle>Ingresos del mes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(currentMonth)}
            </p>
            {trend.value !== 0 && (
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          <p className="text-xs text-foreground/50">
            Mes anterior: {formatCurrency(lastMonth)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
