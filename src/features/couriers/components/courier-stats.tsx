import { CardStat } from '@/shared/components/card-global';
import { Truck, UserCheck, Clock } from 'lucide-react';

interface CourierStatsProps {
  total: number;
  active: number;
  available: number;
}

export function CourierStats({ total, active, available }: CourierStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <CardStat
        title="Total Repartidores"
        value={total}
        subtitle={`${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% activos`}
        icon={<Truck className="w-6 h-6 text-white" strokeWidth={2.5} />}
        gradientClass="from-blue-50/50 to-white"
        iconBgClass="from-blue-500 to-blue-600"
      />
      <CardStat
        title="Activos"
        value={active}
        subtitle="Con acceso al sistema"
        icon={<UserCheck className="w-6 h-6 text-white" strokeWidth={2.5} />}
        gradientClass="from-green-50/50 to-white"
        iconBgClass="from-green-500 to-green-600"
      />
      <CardStat
        title="Disponibles"
        value={available}
        subtitle="Listos para entregar"
        icon={<Clock className="w-6 h-6 text-white" strokeWidth={2.5} />}
        gradientClass="from-emerald-50/50 to-white"
        iconBgClass="from-emerald-500 to-emerald-600"
      />
    </div>
  );
}
