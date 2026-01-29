import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface ReceiptStatusCardProps {
  approved: number;
  rejected: number;
  pending: number;
}

export const ReceiptStatusCard = ({ approved, rejected, pending }: ReceiptStatusCardProps) => {
  return (
    <Card className="border-foreground/10 bg-white hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-lg">Estado de comprobantes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-foreground/80">Aprobados</span>
            </div>
            <span className="text-xl font-bold text-green-600">{approved}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-foreground/80">Rechazados</span>
            </div>
            <span className="text-xl font-bold text-red-600">{rejected}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-foreground/80">Pendientes</span>
            </div>
            <span className="text-xl font-bold text-yellow-600">{pending}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
