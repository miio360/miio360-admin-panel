/**
 * Ejemplos de uso de los nuevos types de publicidad
 * 
 * Este archivo muestra como trabajar con los diferentes tipos
 * de planes de publicidad y sus validaciones.
 */

import type { 
  AdvertisingPlanFormData,
  AdvertisingType,
  AdvertisingPosition 
} from './plan';
import { 
  isValidAdvertisingCombination,
  getValidTypesForPosition,
  getValidPositionsForType 
} from '../utils/advertisingValidation';

// EJEMPLO 1: Crear un plan de banner de tienda en carrusel inicial
const planBannerCarousel: AdvertisingPlanFormData = {
  title: 'Banner Premium Carrusel',
  description: 'Tu tienda destacada en el carrusel principal',
  price: 150,
  isActive: true,
  advertisingType: 'store_banner',
  advertisingPosition: 'carousel_top',
  daysEnabled: 30,
};

// EJEMPLO 2: Crear un plan de producto en carrusel de productos
const planProductCarousel: AdvertisingPlanFormData = {
  title: 'Producto Destacado Carrusel',
  description: 'Tu producto en el carrusel de destacados',
  price: 80,
  isActive: true,
  advertisingType: 'product',
  advertisingPosition: 'product_carousel',
  daysEnabled: 15,
};

// EJEMPLO 3: Validar combinaciones
function validatePlanBeforeSave(data: AdvertisingPlanFormData): boolean {
  const isValid = isValidAdvertisingCombination(
    data.advertisingType,
    data.advertisingPosition
  );

  if (!isValid) {
    console.error('Combinacion invalida de tipo y posicionamiento');
    return false;
  }

  return true;
}

// EJEMPLO 4: Obtener opciones validas para un select dinamico
function getPositionOptions(selectedType: AdvertisingType): AdvertisingPosition[] {
  return getValidPositionsForType(selectedType);
}

function getTypeOptions(selectedPosition: AdvertisingPosition): AdvertisingType[] {
  return getValidTypesForPosition(selectedPosition);
}

// EJEMPLO 5: Manejar cambio de tipo en formulario
function handleTypeChange(
  newType: AdvertisingType,
  currentPosition: AdvertisingPosition,
  setPosition: (pos: AdvertisingPosition) => void
): void {
  const validPositions = getValidPositionsForType(newType);
  
  if (!validPositions.includes(currentPosition)) {
    setPosition(validPositions[0]);
  }
}

// EJEMPLO 6: Todos los planes posibles
const allValidPlans: Array<Pick<AdvertisingPlanFormData, 'advertisingType' | 'advertisingPosition'>> = [
  { advertisingType: 'store_banner', advertisingPosition: 'carousel_top' },
  { advertisingType: 'store_banner', advertisingPosition: 'mini_banner' },
  { advertisingType: 'product', advertisingPosition: 'carousel_top' },
  { advertisingType: 'product', advertisingPosition: 'product_carousel' },
  { advertisingType: 'product', advertisingPosition: 'mini_banner' },
  { advertisingType: 'product', advertisingPosition: 'product_card' },
];

export {
  planBannerCarousel,
  planProductCarousel,
  validatePlanBeforeSave,
  getPositionOptions,
  getTypeOptions,
  handleTypeChange,
  allValidPlans,
};
