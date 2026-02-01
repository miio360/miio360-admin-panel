import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import type { VideoPlan } from '../../types/plan';
import { VIDEO_MODE_LABELS } from '../../types/plan';


function formatPrice(price: number): string {
  return `BOB ${price.toFixed(2)}`;
}

/**
 * Formatea segundos a texto legible (ej: "1 min 30 seg", "2 min", "45 seg")
 */
function formatSecondsToReadable(seconds: number | undefined): string {
  if (!seconds || seconds <= 0) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} seg`;
  if (secs === 0) return `${mins} min`;
  return `${mins} min ${secs} seg`;
}

function PlanCardVideoHeader({ title, isActive }: { title: string; isActive: boolean }) {
  return (
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-semibold text-foreground text-lg">{title}</h3>
      <Badge
        variant={isActive ? 'default' : 'secondary'}
        className={isActive
          ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-default'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-default'}
      >
        {isActive ? 'Activo' : 'Inactivo'}
      </Badge>
    </div>
  );
}

interface PlanCardVideoDetailsProps {
  description: string;
  videoMode: 'video_count' | 'time_pool';
  videoCount?: number;
  maxDurationPerVideoSeconds?: number;
  totalDurationSeconds?: number;
  price: number;
}

function PlanCardVideoDetails({ 
  description, 
  videoMode, 
  videoCount, 
  maxDurationPerVideoSeconds, 
  totalDurationSeconds, 
  price 
}: PlanCardVideoDetailsProps) {
  return (
    <>
      <p className="text-foreground/70 text-sm mb-4 line-clamp-2">{description}</p>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Tipo de Plan:</span>
          <Badge 
            variant="outline"
            className={videoMode === 'video_count' 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : 'bg-purple-50 text-purple-700 border-purple-200'
            }
          >
            {VIDEO_MODE_LABELS[videoMode] ?? 'Por cantidad de videos'}
          </Badge>
        </div>
        {videoMode === 'video_count' ? (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Cantidad de Videos:</span>
              <span className="font-medium text-foreground">{videoCount ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Duracion maxima por video:</span>
              <span className="font-medium text-foreground">
                {formatSecondsToReadable(maxDurationPerVideoSeconds)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Tiempo total disponible:</span>
            <span className="font-medium text-foreground">
              {formatSecondsToReadable(totalDurationSeconds)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Precio:</span>
          <span className="font-semibold text-foreground">{formatPrice(price)}</span>
        </div>
      </div>
    </>
  );
}

function PlanCardVideoActions({ isActive, onToggleActive, onEdit, onDelete }: {
  isActive: boolean;
  onToggleActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex justify-end gap-1 pt-3 border-t border-gray-100">
      <ButtonGlobal
        variant="ghost"
        size="icon"
        onClick={onToggleActive}
        title={isActive ? 'Desactivar' : 'Activar'}
        className="hover:bg-gray-100"
      >
        {isActive ? (
          <ToggleRight className="w-4 h-4 text-green-600" />
        ) : (
          <ToggleLeft className="w-4 h-4 text-gray-400" />
        )}
      </ButtonGlobal>
      <ButtonGlobal
        variant="ghost"
        size="icon"
        onClick={onEdit}
        title="Editar"
        className="hover:bg-gray-100"
      >
        <Edit className="w-4 h-4" />
      </ButtonGlobal>
      <ButtonGlobal
        variant="ghost"
        size="icon"
        onClick={onDelete}
        title="Eliminar"
        className="hover:bg-gray-100"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </ButtonGlobal>
    </div>
  );
}

interface PlanCardVideoProps {
  plan: VideoPlan;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

export function PlanCardVideo({ plan, onEdit, onToggleActive, onDelete }: PlanCardVideoProps) {
  return (
    <Card className="p-4 bg-white border border-gray-200 shadow-sm h-full">
      <PlanCardVideoHeader title={plan.title} isActive={plan.isActive} />
      <PlanCardVideoDetails
        description={plan.description}
        videoMode={plan.videoMode ?? 'video_count'}
        videoCount={plan.videoCount}
        maxDurationPerVideoSeconds={plan.maxDurationPerVideoSeconds}
        totalDurationSeconds={plan.totalDurationSeconds}
        price={plan.price}
      />
      <PlanCardVideoActions
        isActive={plan.isActive}
        onToggleActive={onToggleActive}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Card>
  );
}
