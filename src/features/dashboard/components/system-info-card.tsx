import { Database, Clock, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';

export const SystemInfoCard = () => {
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat('es-BO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);

  const formattedTime = new Intl.DateTimeFormat('es-BO', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);

  return (
    <Card className="border-foreground/10 bg-white hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Información del sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-foreground/60" />
              <span className="text-sm font-medium text-foreground/80">Base de datos</span>
            </div>
            <Badge variant="default" className="bg-green-500">
              Conectada
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-foreground/60" />
              <span className="text-sm font-medium text-foreground/80">Fecha y hora</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground capitalize">{formattedDate}</p>
            <p className="text-xs text-foreground/50">{formattedTime}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
