import { Card } from './ui/card';
import { Badge } from './ui/badge';
import type { AdvertisingActivePlan } from '../types/active-plan';
import { ACTIVE_PLAN_STATUS_LABELS } from '../types/active-plan';
import { 
  calculateAdvertisingProgress, 
  getRemainingDays, 
  isNearExpiration,
  getAdvertisingPlanDescription,
  formatPlanDate,
  getStatusColor,
  getRequiredAction,
  getTimeUntilActivation
} from '../utils/activePlanHelpers';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

interface AdvertisingActivePlanCardProps {
  plan: AdvertisingActivePlan;
  onActivate?: (plan: AdvertisingActivePlan) => void;
  onCancel?: (plan: AdvertisingActivePlan) => void;
  onAssignProduct?: (plan: AdvertisingActivePlan) => void;
}

export function AdvertisingActivePlanCard({
  plan,
  onActivate,
  onCancel,
  onAssignProduct,
}: AdvertisingActivePlanCardProps) {
  const progress = calculateAdvertisingProgress(plan);
  const remainingDays = getRemainingDays(plan);
  const nearExpiration = isNearExpiration(plan);
  const statusColors = getStatusColor(plan.status);
  const requiredAction = getRequiredAction(plan);
  const timeUntilActivation = getTimeUntilActivation(plan);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg mb-1">
            {plan.planTitle}
          </h3>
          <p className="text-sm text-foreground/70">
            {getAdvertisingPlanDescription(plan)}
          </p>
        </div>
        <Badge className={`${statusColors.bg} ${statusColors.text} hover:${statusColors.bg}`}>
          {ACTIVE_PLAN_STATUS_LABELS[plan.status]}
        </Badge>
      </div>

      {plan.bannerImage && (
        <div className="mb-3 rounded-md overflow-hidden">
          <img
            src={plan.bannerImage.url}
            alt="Banner"
            className="w-full h-32 object-cover"
          />
        </div>
      )}

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-foreground/60" />
          <span className="text-foreground/60">Precio:</span>
          <span className="font-medium text-foreground">
            BOB {plan.planPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-foreground/60" />
          <span className="text-foreground/60">Vendedor:</span>
          <span className="font-medium text-foreground">
            {plan.seller.storeName || plan.seller.name}
          </span>
        </div>

        {plan.startDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-foreground/60" />
            <span className="text-foreground/60">Inicio:</span>
            <span className="font-medium text-foreground">
              {formatPlanDate(plan.startDate)}
            </span>
          </div>
        )}

        {plan.endDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-foreground/60" />
            <span className="text-foreground/60">Fin:</span>
            <span className="font-medium text-foreground">
              {formatPlanDate(plan.endDate)}
            </span>
          </div>
        )}

        {plan.status === 'scheduled' && timeUntilActivation && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">
              {timeUntilActivation}
            </span>
          </div>
        )}
      </div>

      {plan.status === 'active' && (
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60">Progreso</span>
            <span className={`font-medium ${nearExpiration ? 'text-orange-600' : 'text-foreground'}`}>
              {plan.daysUsed} / {plan.daysEnabled} dias
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${nearExpiration ? 'bg-orange-500' : 'bg-primary'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {nearExpiration && (
            <p className="text-xs text-orange-600">
              Quedan solo {remainingDays} dias
            </p>
          )}
        </div>
      )}

      {plan.assignedProduct && (
        <div className="bg-gray-50 rounded-md p-3 mb-3">
          <p className="text-xs text-foreground/60 mb-1">Producto asignado:</p>
          <div className="flex gap-2 items-center">
            <img
              src={plan.assignedProduct.image}
              alt={plan.assignedProduct.name}
              className="w-10 h-10 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {plan.assignedProduct.name}
              </p>
              <p className="text-xs text-foreground/60">
                BOB {plan.assignedProduct.price.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {requiredAction && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3">
          <p className="text-xs text-yellow-800 font-medium">
            {requiredAction}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {plan.status === 'pending_assignment' && plan.advertisingType === 'product' && onAssignProduct && (
          <button
            onClick={() => onAssignProduct(plan)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Asignar Producto
          </button>
        )}

        {(plan.status === 'pending_assignment' || plan.status === 'scheduled') && onActivate && (
          <button
            onClick={() => onActivate(plan)}
            disabled={plan.advertisingType === 'product' && !plan.assignedProduct}
            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Activar Ahora
          </button>
        )}

        {plan.status !== 'expired' && plan.status !== 'cancelled' && onCancel && (
          <button
            onClick={() => onCancel(plan)}
            className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </Card>
  );
}
