import { BaseModel } from '@/shared/types/base';

// ========== ENUMS ==========

export type PlanType = 'video' | 'advertising' | 'lives' | 'product_order';

export type AdvertisingType = 'store_banner' | 'product';

// ========== INTERFACES BASE ==========

export interface BasePlan extends BaseModel {
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  planType: PlanType;
}

// ========== PLAN VIDEO ==========

export interface VideoPlan extends BasePlan {
  planType: 'video';
  videoCount: number;
  videoDurationMinutes: number;
}

// ========== PLAN PUBLICIDAD ==========

export interface AdvertisingPlan extends BasePlan {
  planType: 'advertising';
  advertisingType: AdvertisingType;
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
  videoCount: number;
  videoDurationMinutes: number;
}

export interface AdvertisingPlanFormData {
  title: string;
  description: string;
  price: number;
  isActive: boolean;
  advertisingType: AdvertisingType;
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

export const ADVERTISING_TYPE_LABELS: Record<AdvertisingType, string> = {
  store_banner: 'Banner de Tienda',
  product: 'Publicidad de Producto',
};
