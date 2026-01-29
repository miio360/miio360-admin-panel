import { Rocket, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

export const EmptyStateDashboard = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: 'Configura los métodos de pago',
      description: 'Sube los códigos QR para que los vendedores puedan pagar',
      action: 'Configurar',
      onClick: () => navigate('/payment-settings'),
    },
    {
      number: 2,
      title: 'Crea categorías y subcategorías',
      description: 'Define las categorías de productos que tendrá tu marketplace',
      action: 'Crear categorías',
      onClick: () => navigate('/categories/new'),
    },
    {
      number: 3,
      title: 'Invita a los primeros usuarios',
      description: 'Crea cuentas de vendedores, compradores o repartidores',
      action: 'Crear usuario',
      onClick: () => navigate('/users/new'),
    },
  ];

  return (
    <Card className="border-foreground/10 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Rocket className="w-6 h-6 text-primary" />
          Comienza a configurar MIIO360
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/60 mb-6">
          Tu plataforma está lista. Sigue estos pasos para comenzar:
        </p>
        
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-4 p-4 bg-white rounded-lg border border-foreground/10 hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-background flex items-center justify-center font-bold">
                {step.number}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {step.title}
                </h4>
                <p className="text-xs text-foreground/60 mb-3">
                  {step.description}
                </p>
                <Button
                  size="sm"
                  onClick={step.onClick}
                  className="gap-2"
                >
                  {step.action}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
