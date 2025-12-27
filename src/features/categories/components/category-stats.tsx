import { Card, CardContent } from "@/shared/components/ui/card";
import { Package, Tag, Layers } from "lucide-react";

interface CategoryStatsProps {
  total: number;
  active: number;
  subcategories: number;
}

export function CategoryStats({ total, active, subcategories }: CategoryStatsProps) {
  const inactive = total - active;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-orange-50 via-white to-primary/10 hover:scale-105 transform">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-orange-600 mb-1 uppercase tracking-wide font-bold">
                Total Categorías
              </p>
              <p className="text-4xl font-black text-foreground bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">{total}</p>
              <p className="text-xs text-orange-600/70 mt-2 font-medium">
                🟢 {active} activas · 🔴 {inactive} inactivas
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl">
              <Package className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-green-50 via-white to-green-100 hover:scale-105 transform">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-700 mb-1 uppercase tracking-wide font-bold">Categorías Activas</p>
              <p className="text-4xl font-black text-foreground bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{active}</p>
              <p className="text-xs text-green-600/70 mt-2 font-medium">
                {total > 0 ? Math.round((active / total) * 100) : 0}% del total
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-xl animate-pulse">
              <Tag className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 via-white to-blue-100 hover:scale-105 transform">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-700 mb-1 uppercase tracking-wide font-bold">
                Total Subcategorías
              </p>
              <p className="text-4xl font-black text-foreground bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{subcategories}</p>
              <p className="text-xs text-blue-600/70 mt-2 font-medium">
                {total > 0 ? (subcategories / total).toFixed(1) : 0} promedio por categoría
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-xl">
              <Layers className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
