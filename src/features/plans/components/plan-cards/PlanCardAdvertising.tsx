import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ButtonGlobal } from '@/shared/components/button-global';
import { Edit, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import type { AdvertisingPlan } from '../../types/plan';
import { ADVERTISING_TYPE_LABELS, ADVERTISING_POSITION_LABELS } from '../../types/plan';

function formatPrice(price: number): string {
  return `BOB ${price.toFixed(2)}`;
}

interface PlanCardAdvertisingProps {
  plan: AdvertisingPlan;
  onEdit: () => void;
  onToggleActive: () => void;
  onDelete: () => void;
}

export function PlanCardAdvertising({ plan, onEdit, onToggleActive, onDelete }: PlanCardAdvertisingProps) {
  return (
    <Card className="p-4 bg-white border border-gray-200 shadow-sm h-full">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-foreground text-lg">{plan.title}</h3>
        <Badge variant={plan.isActive ? 'default' : 'secondary'}
          className={plan.isActive 
            ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-default' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-default'
          }>
          {plan.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>
      <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
        {plan.description}
      </p>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Tipo:</span>
          <span className="font-medium text-foreground">{ADVERTISING_TYPE_LABELS[plan.advertisingType]}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Posicionamiento:</span>
          <span className="font-medium text-foreground">{ADVERTISING_POSITION_LABELS[plan.advertisingPosition]}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Dias:</span>
          <span className="font-medium text-foreground">{plan.daysEnabled}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/60">Precio:</span>
          <span className="font-semibold text-foreground">{formatPrice(plan.price)}</span>
        </div>
      </div>
      <div className="flex justify-end gap-1 pt-3 border-t border-gray-100">
        <ButtonGlobal
          variant="ghost"
          size="icon"
          onClick={onToggleActive}
          title={plan.isActive ? 'Desactivar' : 'Activar'}
          className="hover:bg-gray-100"
        >
          {plan.isActive ? (
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
    </Card>
  );
}
