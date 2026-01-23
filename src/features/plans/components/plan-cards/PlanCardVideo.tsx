import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import type { VideoPlan } from '../../types/plan';


function formatPrice(price: number): string {
  return `BOB ${price.toFixed(2)}`;
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

function PlanCardVideoDetails({ description, videoCount, videoDurationMinutes, price }: {
  description: string;
  videoCount: number;
  videoDurationMinutes: number;
  price: number;
}) {
  return (
    <>
      <p className="text-foreground/70 text-sm mb-4 line-clamp-2">{description}</p>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Cantidad de Videos:</span>
          <span className="font-medium text-foreground">{videoCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Duracion por Video:</span>
          <span className="font-medium text-foreground">{videoDurationMinutes} min</span>
        </div>
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
        videoCount={plan.videoCount}
        videoDurationMinutes={plan.videoDurationMinutes}
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
