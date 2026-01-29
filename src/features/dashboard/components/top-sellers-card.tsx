import type { TopSeller } from '../types/dashboard';
import { Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';

interface TopSellersCardProps {
  sellers: TopSeller[];
}

export const TopSellersCard = ({ sellers }: TopSellersCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
    }).format(amount);
  };

  return (
    <Card className="border-foreground/10 bg-white hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-3">
        <Crown className="w-5 h-5 text-primary" />
        <CardTitle className="text-lg">Top Vendedores</CardTitle>
      </CardHeader>
      <CardContent>
        {sellers.length === 0 ? (
          <p className="text-sm text-foreground/50 text-center py-4">
            No hay datos disponibles
          </p>
        ) : (
          <div className="space-y-2">
            {sellers.map((seller, index) => (
              <div key={seller.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer">
                <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center rounded-full">
                  {index + 1}
                </Badge>
                
                <Avatar className="w-10 h-10">
                  <AvatarImage src={seller.profileImage} alt={seller.name} />
                  <AvatarFallback className="bg-foreground/5 text-foreground/40 font-semibold">
                    {seller.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {seller.storeName}
                  </p>
                  <p className="text-xs text-foreground/50 truncate">{seller.name}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    {formatCurrency(seller.totalSpent)}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {seller.activePlansCount} {seller.activePlansCount === 1 ? 'plan' : 'planes'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
