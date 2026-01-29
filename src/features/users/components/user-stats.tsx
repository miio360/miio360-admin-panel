import { CardStat } from '@/shared/components/card-global';
import { Users, UserCheck, Shield, ShoppingBag } from 'lucide-react';

interface UserStatsProps {
  total: number;
  active: number;
  customers: number;
  sellers: number;
  couriers: number;
  admins: number;
}

export function UserStats({ total, active, customers, admins }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      <CardStat
        title="Total Usuarios"
        value={total}
        subtitle={`${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% activos`}
        icon={<Users className="w-6 h-6 text-white" strokeWidth={2.5} />}
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
        title="Admins"
        value={admins}
        subtitle={`${total > 0 ? ((admins / total) * 100).toFixed(0) : 0}% del total`}
        icon={<Shield className="w-6 h-6 text-white" strokeWidth={2.5} />}
        gradientClass="from-purple-50/50 to-white"
        iconBgClass="from-purple-500 to-purple-600"
      />
      <CardStat
        title="Clientes"
        value={customers}
        subtitle={`${total > 0 ? ((customers / total) * 100).toFixed(0) : 0}% del total`}
        icon={<ShoppingBag className="w-6 h-6 text-white" strokeWidth={2.5} />}
        gradientClass="from-orange-50/50 to-white"
        iconBgClass="from-orange-500 to-orange-600"
      />
    </div>
  );
}
