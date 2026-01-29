import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface UserRolesCardProps {
  sellers: number;
  couriers: number;
  customers: number;
}

export const UserRolesCard = ({ sellers, couriers, customers }: UserRolesCardProps) => {
  return (
    <Card className="border-foreground/10 bg-white hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle>Roles de usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{sellers}</p>
            <p className="text-xs text-foreground/60">Vendedores</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{couriers}</p>
            <p className="text-xs text-foreground/60">Repartidores</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{customers}</p>
            <p className="text-xs text-foreground/60">Compradores</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
