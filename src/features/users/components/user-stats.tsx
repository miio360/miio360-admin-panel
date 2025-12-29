import { CardGlobal } from '@/shared/components/ui/card-global';
import { User, UserRole } from '@/shared/types';
import { User as UserIcon, Users, ShieldCheck, Truck, Store } from 'lucide-react';

interface UserStatsProps {
  total: number;
  active: number;
  customers: number;
  sellers: number;
  couriers: number;
  admins: number;
}

export function UserStats({ total, active, customers, sellers, couriers, admins }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <CardGlobal
        title="Total Usuarios"
        value={total}
        subtitle={`Activos: ${active}`}
        icon={<Users className="w-8 h-8 text-white" />}
        gradientClass="from-primary/10 via-white to-primary/30"
        iconBgClass="from-primary to-yellow-400"
      />
      <CardGlobal
        title="Clientes"
        value={customers}
        subtitle="Rol: customer"
        icon={<UserIcon className="w-8 h-8 text-white" />}
        gradientClass="from-blue-50 via-white to-blue-100"
        iconBgClass="from-blue-500 to-blue-700"
      />
      <CardGlobal
        title="Vendedores"
        value={sellers}
        subtitle="Rol: seller"
        icon={<Store className="w-8 h-8 text-white" />}
        gradientClass="from-green-50 via-white to-green-100"
        iconBgClass="from-green-500 to-green-700"
      />
      <CardGlobal
        title="Repartidores"
        value={couriers}
        subtitle="Rol: courier"
        icon={<Truck className="w-8 h-8 text-white" />}
        gradientClass="from-orange-50 via-white to-orange-100"
        iconBgClass="from-orange-400 to-orange-600"
      />
      <CardGlobal
        title="Admins"
        value={admins}
        subtitle="Rol: admin"
        icon={<ShieldCheck className="w-8 h-8 text-white" />}
        gradientClass="from-gray-50 via-white to-gray-200"
        iconBgClass="from-gray-500 to-gray-700"
      />
    </div>
  );
}
