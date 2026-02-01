import { CustomLocation, Rating } from '.';
import type { PlanType, AdvertisingType, AdvertisingPosition, VideoMode } from '@/features/plans/types/plan';

export interface SellerSummary {
  id: string;
  name: string;
  storeName?: string;
  avatar?: string;
  profileImage?: string;
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
  videoMode: VideoMode;
  // Modalidad video_count
  videoCount?: number;
  maxDurationPerVideoSeconds?: number;
  // Modalidad time_pool
  totalDurationSeconds?: number;
}

export interface AdvertisingPlanSummary extends BasePlanSummary {
  planType: 'advertising';
  advertisingType: AdvertisingType;
  advertisingPosition: AdvertisingPosition;
  daysEnabled: number;
}

export interface LivesPlanSummary extends BasePlanSummary {
  planType: 'lives';
  livesDurationMinutes: number;
}

export type PlanSummary = VideoPlanSummary | AdvertisingPlanSummary | LivesPlanSummary;
