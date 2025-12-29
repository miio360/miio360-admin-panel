import { CardGlobal } from "@/shared/components/ui/card-global";
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
      <CardGlobal
        title="Total Categorías"
        value={total}
        subtitle={`🟢 ${active} activas · 🔴 ${inactive} inactivas`}
        icon={<Package className="w-8 h-8 text-white" />}
        gradientClass="from-orange-50 via-white to-primary/10"
        iconBgClass="from-orange-400 to-orange-600"
      />
      <CardGlobal
        title="Categorías Activas"
        value={active}
        subtitle={`${total > 0 ? Math.round((active / total) * 100) : 0}% del total`}
        icon={<Tag className="w-8 h-8 text-white" />}
        gradientClass="from-green-50 via-white to-green-100"
        iconBgClass="from-green-500 to-green-700"
        className="animate-pulse"
      />
      <CardGlobal
        title="Total Subcategorías"
        value={subcategories}
        subtitle={`${total > 0 ? (subcategories / total).toFixed(1) : 0} promedio por categoría`}
        icon={<Layers className="w-8 h-8 text-white" />}
        gradientClass="from-blue-50 via-white to-blue-100"
        iconBgClass="from-blue-500 to-blue-700"
      />
    </div>
  );
}
