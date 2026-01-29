import { Plus, Users, ShoppingBag, FileText, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

export const QuickActionsCard = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Crear Usuario',
      icon: Users,
      onClick: () => navigate('/users/new'),
      variant: 'default' as const,
    },
    {
      label: 'Nueva Categoría',
      icon: ShoppingBag,
      onClick: () => navigate('/categories/new'),
      variant: 'default' as const,
    },
    {
      label: 'Ver Comprobantes',
      icon: FileText,
      onClick: () => navigate('/payment-receipts'),
      variant: 'outline' as const,
    },
    {
      label: 'Configurar QR',
      icon: Settings,
      onClick: () => navigate('/payment-settings'),
      variant: 'outline' as const,
    },
  ];

  return (
    <Card className="border-foreground/10 bg-white hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Acciones rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant}
                onClick={action.onClick}
                className="h-auto py-3 flex flex-col items-center gap-2"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
