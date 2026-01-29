import { CardStat } from "@/shared/components/card-global";
import { FolderOpen, CheckCircle2, LayoutGrid } from "lucide-react";

interface CategoryStatsProps {
  total: number;
  active: number;
  subcategories: number;
}

export function CategoryStats({ total, active, subcategories }: CategoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <CardStat
        title="Total Categorías"
        value={total}
        subtitle={`${active} activas · ${total - active} inactivas`}
        icon={<FolderOpen className="w-6 h-6 text-white" strokeWidth={2.5} />}
        gradientClass="from-orange-50/50 to-white"
        iconBgClass="from-orange-400 to-orange-500"
      />
      <CardStat
        title="Activas"
        value={active}
        subtitle={`${total > 0 ? ((active / total) * 100).toFixed(0) : 0}% del total`}
        icon={<CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2.5} />}
        gradientClass="from-green-50/50 to-white"
        iconBgClass="from-green-500 to-green-600"
      />
      <CardStat
        title="Subcategorías"
        value={subcategories}
        subtitle="En todas las categorías"
        icon={<LayoutGrid className="w-6 h-6 text-white" strokeWidth={2.5} />}
        gradientClass="from-blue-50/50 to-white"
        iconBgClass="from-blue-500 to-blue-600"
      />
    </div>
  );
}
