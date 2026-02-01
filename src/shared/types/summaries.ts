import { CustomLocation, Rating } from '.';
import type { PlanType, AdvertisingType } from '@/features/plans/types/plan';

export interface ClientSummary {
  id: string;
  name: string;
  phone?: string;
}

export interface SellerSummary {
  id: string;
  name: string;
  avatar?: string;
  rating?: Rating;
  location?: CustomLocation;
  phone?: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface BasePlanSummary {
  id: string;
  title: string;
  price: number;
  planType: PlanType;
}

export interface VideoPlanSummary extends BasePlanSummary {
  planType: 'video';
  videoCount: number;
  videoDurationMinutes: number;
}

export interface AdvertisingPlanSummary extends BasePlanSummary {
  planType: 'advertising';
  advertisingType: AdvertisingType;
  daysEnabled: number;
}

export interface LivesPlanSummary extends BasePlanSummary {
  planType: 'lives';
  livesDurationMinutes: number;
}

export type PlanSummary = VideoPlanSummary | AdvertisingPlanSummary | LivesPlanSummary;
