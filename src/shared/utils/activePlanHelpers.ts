import type { ActivePlan, AdvertisingActivePlan, ActivePlanStatus } from '../types/active-plan';
import { ADVERTISING_POSITION_LABELS, ADVERTISING_TYPE_LABELS } from '@/features/plans/types/plan';
import { Timestamp } from 'firebase/firestore';

/**
 * Calcula el progreso de un plan de publicidad (porcentaje de dias usados)
 */
export function calculateAdvertisingProgress(plan: AdvertisingActivePlan): number {
  if (plan.daysEnabled === 0) return 0;
  return Math.min(100, Math.round((plan.daysUsed / plan.daysEnabled) * 100));
}

/**
 * Calcula los dias restantes de un plan de publicidad
 */
export function getRemainingDays(plan: AdvertisingActivePlan): number {
  return Math.max(0, plan.daysEnabled - plan.daysUsed);
}

/**
 * Verifica si un plan de publicidad esta proximo a expirar (menos de 3 dias)
 */
export function isNearExpiration(plan: AdvertisingActivePlan): boolean {
  const remaining = getRemainingDays(plan);
  return remaining > 0 && remaining <= 3;
}

/**
 * Verifica si un plan de publicidad ha expirado
 */
export function isExpired(plan: AdvertisingActivePlan): boolean {
  if (plan.status === 'expired') return true;
  if (!plan.endDate) return false;
  return plan.endDate.toMillis() <= Timestamp.now().toMillis();
}

/**
 * Obtiene una descripcion completa del plan de publicidad
 */
export function getAdvertisingPlanDescription(plan: AdvertisingActivePlan): string {
  const type = ADVERTISING_TYPE_LABELS[plan.advertisingType];
  const position = ADVERTISING_POSITION_LABELS[plan.advertisingPosition];
  return `${type} - ${position}`;
}

/**
 * Formatea la fecha de inicio/fin del plan
 */
export function formatPlanDate(timestamp: Timestamp | undefined): string {
  if (!timestamp) return 'No definida';
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/**
 * Obtiene el color del badge de estado
 */
export function getStatusColor(status: ActivePlanStatus): {
  bg: string;
  text: string;
} {
  const colors = {
    pending_assignment: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-700' },
    active: { bg: 'bg-green-100', text: 'text-green-700' },
    expired: { bg: 'bg-gray-100', text: 'text-gray-700' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  };
  return colors[status];
}

/**
 * Verifica si un plan puede ser activado
 */
export function canActivatePlan(plan: ActivePlan): boolean {
  if (plan.status === 'active' || plan.status === 'expired' || plan.status === 'cancelled') {
    return false;
  }
  
  if (plan.planType === 'advertising') {
    if (plan.advertisingType === 'product') {
      return !!plan.assignedProduct;
    }
    return true;
  }
  
  return false;
}

/**
 * Verifica si un plan puede ser cancelado
 */
export function canCancelPlan(plan: ActivePlan): boolean {
  return plan.status !== 'expired' && plan.status !== 'cancelled';
}

/**
 * Obtiene un mensaje de accion requerida para un plan
 */
export function getRequiredAction(plan: ActivePlan): string | null {
  if (plan.status === 'pending_assignment' && plan.planType === 'advertising') {
    if (plan.advertisingType === 'product') {
      return 'Asignar producto para activar';
    }
    return 'Activar plan de publicidad';
  }
  
  if (plan.status === 'scheduled') {
    return 'Plan programado, se activara automaticamente';
  }
  
  return null;
}

/**
 * Calcula el tiempo restante hasta la activacion programada
 */
export function getTimeUntilActivation(plan: ActivePlan): string | null {
  if (plan.status !== 'scheduled' || plan.planType !== 'advertising') {
    return null;
  }
  
  if (!plan.startDate) return null;
  
  const now = Timestamp.now().toMillis();
  const start = plan.startDate.toMillis();
  const diff = start - now;
  
  if (diff <= 0) return 'Listo para activar';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `En ${days} dia${days > 1 ? 's' : ''}`;
  }
  
  if (hours > 0) {
    return `En ${hours} hora${hours > 1 ? 's' : ''}`;
  }
  
  return 'Menos de 1 hora';
}
