import { BaseModel } from '@/shared/types/base';

// ========== ENUMS ==========

export type PlanType = 'video' | 'advertising' | 'lives' | 'product_order';

/**
 * Tipo de contenido publicitario
 * - store_banner: Banner promocional de toda la tienda
 * - product: Publicidad de un producto específico
 */
export type AdvertisingType = 'store_banner' | 'product';

/**
 * Posicionamiento de la publicidad en el home
 * - carousel_top: Carrusel inicial superior (acepta store_banner o product)
 * - product_carousel: Carrusel de productos publicitados (solo product)
 * - mini_banner: Banner mini entre productos (acepta store_banner o product)
 * - product_card: Card de publicidad en fila de productos (solo product)
 */
export type AdvertisingPosition = 
  | 'carousel_top' 
  | 'product_carousel' 
  | 'mini_banner' 
  | 'product_card';

/**
 * Modalidad del plan de video:
 * - video_count: Por cantidad de videos con duracion maxima por video
 * - time_pool: Por tiempo total (pool de segundos)
 */
export type VideoMode = 'video_count' | 'time_pool';

// ========== INTERFACES BASE ==========

export interface BasePlan extends BaseModel {
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  planType: PlanType;
}

// ========== PLAN VIDEO ==========

/**
 * Plan de Video
 * - videoMode: Define la modalidad del plan
 * - Para video_count: videoCount + maxDurationPerVideoSeconds (duracion maxima por video)
 * - Para time_pool: totalDurationSeconds (pool total de segundos)
 */
export interface VideoPlan extends BasePlan {
  planType: 'video';
  videoMode: VideoMode;
  // Modalidad video_count: cantidad de videos con duracion maxima por video
  videoCount?: number;
  maxDurationPerVideoSeconds?: number;
  // Modalidad time_pool: pool total de segundos
  totalDurationSeconds?: number;
}

// ========== PLAN PUBLICIDAD ==========

export interface AdvertisingPlan extends BasePlan {
  planType: 'advertising';
  advertisingType: AdvertisingType;
  advertisingPosition: AdvertisingPosition;
  daysEnabled: number;
}

// ========== PLAN LIVES ==========

export interface LivesPlan extends BasePlan {
  planType: 'lives';
  livesDurationMinutes: number;
}

// ========== UNION TYPE ==========

export type Plan = VideoPlan | AdvertisingPlan | LivesPlan;

// ========== FORM TYPES ==========

export interface VideoPlanFormData {
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  videoMode: VideoMode;
  // Modalidad video_count
  videoCount?: number;
  maxDurationPerVideoSeconds?: number;
  // Modalidad time_pool
  totalDurationSeconds?: number;
}

export interface AdvertisingPlanFormData {
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  advertisingType: AdvertisingType;
  advertisingPosition: AdvertisingPosition;
  daysEnabled: number;
}

export interface LivesPlanFormData {
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  livesDurationMinutes: number;
}

// ========== LABELS ==========

export const PLAN_TYPE_LABELS: Record<PlanType, string> = {
  video: 'Plan Video',
  advertising: 'Plan Publicidad',
  lives: 'Plan Lives',
  product_order: 'Pedidos de Productos',
};

export const VIDEO_MODE_LABELS: Record<VideoMode, string> = {
  video_count: 'Por cantidad de videos',
  time_pool: 'Por tiempo total',
};

export const ADVERTISING_TYPE_LABELS: Record<AdvertisingType, string> = {
  store_banner: 'Banner de Tienda',
  product: 'Publicidad de Producto',
};

export const ADVERTISING_POSITION_LABELS: Record<AdvertisingPosition, string> = {
  carousel_top: 'Carrusel Inicial',
  product_carousel: 'Carrusel de Productos',
  mini_banner: 'Banner Mini entre Productos',
  product_card: 'Card de Publicidad',
};

export const ADVERTISING_POSITION_DESCRIPTIONS: Record<AdvertisingPosition, string> = {
  carousel_top: 'Banner superior en carrusel (acepta banner de tienda o producto)',
  product_carousel: 'Carrusel de productos publicitados en cards',
  mini_banner: 'Banner estático entre filas de productos',
  product_card: 'Card publicitario al inicio de fila de productos',
};
