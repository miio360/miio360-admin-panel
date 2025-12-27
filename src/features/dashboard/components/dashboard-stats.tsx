import { Card, CardContent } from "@/shared/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-1">Ingresos Ecommerce</p>
          <p className="text-3xl font-bold text-foreground mb-2">$245,450</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center text-green-600">
              <ArrowUp className="w-3 h-3 mr-1" />
              16.9%
            </span>
            <span className="text-muted-foreground">(+$21.5k)</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-1">Nuevos Clientes</p>
          <p className="text-3xl font-bold text-foreground mb-2">684</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center text-red-600">
              <ArrowDown className="w-3 h-3 mr-1" />
              58.5%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-1">Tasa de Recompra</p>
          <p className="text-3xl font-bold text-foreground mb-2">75.12 %</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center text-green-600">
              <ArrowUp className="w-3 h-3 mr-1" />
              25.5%
            </span>
            <span className="text-muted-foreground">(+20.1%)</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-1">Valor Promedio de Orden</p>
          <p className="text-3xl font-bold text-foreground mb-2">$2,412.23</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center text-green-600">
              <ArrowUp className="w-3 h-3 mr-1" />
              35.3%
            </span>
            <span className="text-muted-foreground">(+ $754)</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-pink-50 to-pink-100/50 border-pink-200">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-1">Tasa de Conversión</p>
          <p className="text-3xl font-bold text-foreground mb-2">32.65 %</p>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center text-red-600">
              <ArrowDown className="w-3 h-3 mr-1" />
              13.62%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
