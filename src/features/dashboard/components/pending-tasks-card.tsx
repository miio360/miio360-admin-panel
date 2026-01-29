import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Clock, Calendar, AlertCircle } from 'lucide-react';

interface PendingTasksCardProps {
  pendingReceipts: number;
  pendingAssignmentPlans: number;
  pendingVerification: number;
  scheduledPlans: number;
  onReceiptsClick: () => void;
  onPlansClick: () => void;
  onUsersClick: () => void;
}

export const PendingTasksCard = ({
  pendingReceipts,
  pendingAssignmentPlans,
  pendingVerification,
  scheduledPlans,
  onReceiptsClick,
  onPlansClick,
  onUsersClick,
}: PendingTasksCardProps) => {
  return (
    <Card className="border-foreground/10 bg-white hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle>Tareas pendientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer"
            onClick={onReceiptsClick}
          >
            <div className="flex items-center gap-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-foreground/80">Comprobantes pendientes</span>
            </div>
            <Badge variant="default" className="text-base font-bold bg-yellow-500">
              {pendingReceipts}
            </Badge>
          </div>

          <div 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer"
            onClick={onPlansClick}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-foreground/80">Planes por asignar</span>
            </div>
            <Badge variant="secondary" className="text-base font-bold">
              {pendingAssignmentPlans}
            </Badge>
          </div>

          <div 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer"
            onClick={onUsersClick}
          >
            <div className="flex items-center gap-3">
              <div className="bg-yellow-50 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-foreground/80">Usuarios por verificar</span>
            </div>
            <Badge variant="default" className="text-base font-bold bg-yellow-500">
              {pendingVerification}
            </Badge>
          </div>

          <div 
            className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-foreground/80">Planes programados</span>
            </div>
            <Badge variant="default" className="text-base font-bold bg-green-500">
              {scheduledPlans}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
