import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface SubcategoriesCardProps {
  total: number;
  active: number;
}

export const SubcategoriesCard = ({ total, active }: SubcategoriesCardProps) => {
  const inactive = total - active;

  return (
    <Card className="border-foreground/10 bg-white hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg">Subcategorías</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-foreground/80">Total</span>
            <span className="text-xl font-bold text-foreground">{total}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-foreground/80">Activas</span>
            <span className="text-xl font-bold text-green-600">{active}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-foreground/80">Inactivas</span>
            <span className="text-xl font-bold text-foreground/40">{inactive}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
