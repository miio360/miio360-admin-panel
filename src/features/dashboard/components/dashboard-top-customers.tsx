import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { MoreVertical } from "lucide-react";

const topCustomers = [
  { name: "Marks Howerson", orders: "25 Órdenes" },
  { name: "Marks Howerson", orders: "15 Órdenes" },
  { name: "Jhony Peters", orders: "23 Órdenes" },
];

export function DashboardTopCustomers() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Mejores Clientes de la Semana</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.map((customer, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{customer.name}</p>
                  <p className="text-xs text-muted-foreground">{customer.orders}</p>
                </div>
              </div>
              <Button variant="link" size="sm" className="text-primary">Ver</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
