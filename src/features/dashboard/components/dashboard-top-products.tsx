import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { MoreVertical } from "lucide-react";

const topProducts = [
  { name: "Sticker Vento", id: "ID: 26d380", sales: "128 Ventas", color: "bg-blue-100" },
  { name: "Mochila Azul", id: "ID: 130338", sales: "601 Ventas", color: "bg-blue-200" },
  { name: "Botella de Agua", id: "ID: 8641573", sales: "1K+ Ventas", color: "bg-orange-100" },
];

export function DashboardTopProducts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Productos Más Vendidos</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${product.color} flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                </div>
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.id}</p>
                </div>
              </div>
              <p className="text-sm font-semibold">{product.sales}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
