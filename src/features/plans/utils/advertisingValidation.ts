import type { AdvertisingType, AdvertisingPosition } from '../types/plan';

/**
 * Valida si una combinacion de tipo y posicionamiento de publicidad es valida
 * 
 * Reglas:
 * - carousel_top: acepta store_banner o product
 * - product_carousel: solo product
 * - mini_banner: acepta store_banner o product
 * - product_card: solo product
 */
export function isValidAdvertisingCombination(
  advertisingType: AdvertisingType,
  advertisingPosition: AdvertisingPosition
): boolean {
  const validCombinations: Record<AdvertisingPosition, AdvertisingType[]> = {
    carousel_top: ['store_banner', 'product'],
    product_carousel: ['product'],
    mini_banner: ['store_banner', 'product'],
    product_card: ['product'],
  };

  return validCombinations[advertisingPosition]?.includes(advertisingType) ?? false;
}

/**
 * Obtiene los tipos de publicidad validos para un posicionamiento dado
 */
export function getValidTypesForPosition(
  advertisingPosition: AdvertisingPosition
): AdvertisingType[] {
  const validTypes: Record<AdvertisingPosition, AdvertisingType[]> = {
    carousel_top: ['store_banner', 'product'],
    product_carousel: ['product'],
    mini_banner: ['store_banner', 'product'],
    product_card: ['product'],
  };

  return validTypes[advertisingPosition] ?? [];
}

/**
 * Obtiene los posicionamientos validos para un tipo de publicidad dado
 */
export function getValidPositionsForType(
  advertisingType: AdvertisingType
): AdvertisingPosition[] {
  if (advertisingType === 'store_banner') {
    return ['carousel_top', 'mini_banner'];
  }
  return ['carousel_top', 'product_carousel', 'mini_banner', 'product_card'];
}
