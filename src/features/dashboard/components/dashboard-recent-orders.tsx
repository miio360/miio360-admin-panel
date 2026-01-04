import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ButtonGlobal } from "@/shared/components/button-global";
import { Badge } from "@/shared/components/ui/badge";

const recentOrders = [
  { product: "Botella de Agua", customer: "Peterson Jack", id: "#8641573", date: "27 Jun 2025", status: "Pendiente", statusColor: "bg-yellow-100 text-yellow-700" },
  { product: "iPhone 15 Pro", customer: "Michal Datta", id: "#2457841", date: "26 Jun 2025", status: "Cancelado", statusColor: "bg-red-100 text-red-700" },
  { product: "Audífonos", customer: "Jeslyn Rose", id: "#1026784", date: "20 Jun 2025", status: "Enviado", statusColor: "bg-green-100 text-green-700" },
];

export function DashboardRecentOrders() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Órdenes Recientes</CardTitle>
        <ButtonGlobal variant="link" className="text-primary text-sm hover:underline">Ver Todo</ButtonGlobal>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="text-left py-3 font-medium">Producto</th>
                <th className="text-left py-3 font-medium">Cliente</th>
                <th className="text-left py-3 font-medium">ID Orden</th>
                <th className="text-left py-3 font-medium">Fecha</th>
                <th className="text-left py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-200"></div>
                      <span className="text-sm">{order.product}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-primary">{order.customer}</td>
                  <td className="py-4 text-sm">{order.id}</td>
                  <td className="py-4 text-sm text-muted-foreground">{order.date}</td>
                  <td className="py-4">
                    <Badge className={`${order.statusColor} border-0`}>{order.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
