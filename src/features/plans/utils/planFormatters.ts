import type { AdvertisingPlan, AdvertisingType, AdvertisingPosition } from '../types/plan';
import { 
  ADVERTISING_TYPE_LABELS, 
  ADVERTISING_POSITION_LABELS,
  ADVERTISING_POSITION_DESCRIPTIONS 
} from '../types/plan';

/**
 * Formatea el precio en BOB
 */
export function formatPrice(price: number): string {
  return `BOB ${price.toFixed(2)}`;
}

/**
 * Formatea la duracion en dias
 */
export function formatDays(days: number): string {
  return days === 1 ? '1 dia' : `${days} dias`;
}

/**
 * Obtiene una descripcion completa del plan de publicidad
 */
export function getAdvertisingPlanDescription(plan: AdvertisingPlan): string {
  const type = ADVERTISING_TYPE_LABELS[plan.advertisingType];
  const position = ADVERTISING_POSITION_LABELS[plan.advertisingPosition];
  const days = formatDays(plan.daysEnabled);
  const price = formatPrice(plan.price);

  return `${type} en ${position} - ${days} - ${price}`;
}

/**
 * Obtiene una descripcion corta del tipo de publicidad
 */
export function getAdvertisingTypeDescription(type: AdvertisingType): string {
  return ADVERTISING_TYPE_LABELS[type];
}

/**
 * Obtiene una descripcion corta del posicionamiento
 */
export function getAdvertisingPositionDescription(position: AdvertisingPosition): string {
  return ADVERTISING_POSITION_LABELS[position];
}

/**
 * Obtiene una descripcion larga del posicionamiento
 */
export function getAdvertisingPositionLongDescription(position: AdvertisingPosition): string {
  return ADVERTISING_POSITION_DESCRIPTIONS[position];
}

/**
 * Genera un resumen de features del plan de publicidad
 */
export function getAdvertisingPlanFeatures(plan: AdvertisingPlan): string[] {
  return [
    `Tipo: ${ADVERTISING_TYPE_LABELS[plan.advertisingType]}`,
    `Posicion: ${ADVERTISING_POSITION_LABELS[plan.advertisingPosition]}`,
    `Duracion: ${formatDays(plan.daysEnabled)}`,
    ADVERTISING_POSITION_DESCRIPTIONS[plan.advertisingPosition],
  ];
}
