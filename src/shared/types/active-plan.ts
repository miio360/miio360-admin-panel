import { Timestamp } from 'firebase/firestore';
import type { BaseModel, FileUploaded } from './base';
import type { PlanType, AdvertisingType, AdvertisingPosition, VideoMode } from '@/features/plans/types/plan';
import { ProductSummary, SellerSummary } from './summaries';

// ========== ENUMS ==========

export type ActivePlanStatus =
  | 'pending_assignment' // Aprobado, esperando asignación de producto (solo para advertising product)
  | 'scheduled' // Asignado pero aún no activo (fecha futura)
  | 'active' // Activo y visible
  | 'expired' // Días terminados
  | 'cancelled'; // Cancelado por admin

// ========== BASE ACTIVE PLAN ==========

export interface BaseActivePlan extends BaseModel {
  receiptId: string;
  seller: SellerSummary;
  planType: PlanType;
  planTitle: string;
  planPrice: number;
  status: ActivePlanStatus;
  approvedAt: Timestamp;
  approvedBy: string;
}

// ========== ADVERTISING ACTIVE PLAN ==========

export interface AdvertisingActivePlan extends BaseActivePlan {
  planType: 'advertising';
  advertisingType: AdvertisingType;
  advertisingPosition: AdvertisingPosition;
  daysEnabled: number;
  daysUsed: number;
  bannerImage: FileUploaded;
  startDate?: Timestamp;
  endDate?: Timestamp;
  assignedProduct?: ProductSummary;
}

// ========== VIDEO ACTIVE PLAN ==========

export interface VideoActivePlan extends BaseActivePlan {
  planType: 'video';
  videoMode: VideoMode;

  // Modalidad video_count: cantidad de videos con duración máxima por video
  videoCount?: number;
  maxDurationPerVideoSeconds?: number;
  videosUsed?: number;

  // Modalidad time_pool: pool total de segundos
  totalDurationSeconds?: number;
  totalSecondsUsed?: number;
}

// ========== LIVES ACTIVE PLAN ==========

export interface LivesActivePlan extends BaseActivePlan {
  planType: 'lives';
  livesDurationMinutes: number;
  livesUsed: number;
}

// ========== UNION TYPE ==========

export type ActivePlan = AdvertisingActivePlan | VideoActivePlan | LivesActivePlan;

// ========== LABELS ==========

export const ACTIVE_PLAN_STATUS_LABELS: Record<ActivePlanStatus, string> = {
  pending_assignment: 'Pendiente de asignacion',
  scheduled: 'Programado',
  active: 'Activo',
  expired: 'Expirado',
  cancelled: 'Cancelado',
};

// ========== INPUT TYPES ==========

interface BaseActivePlanInput {
  receiptId: string;
  seller: SellerSummary;
  planTitle: string;
  planPrice: number;
  approvedBy: string;
}

export interface CreateAdvertisingActivePlanInput extends BaseActivePlanInput {
  planType: 'advertising';
  advertisingType: AdvertisingType;
  advertisingPosition: AdvertisingPosition;
  daysEnabled: number;
  bannerImage: FileUploaded;
}

export interface CreateVideoActivePlanInput extends BaseActivePlanInput {
  planType: 'video';
  videoMode: VideoMode;
  videoCount?: number;
  maxDurationPerVideoSeconds?: number;
  totalDurationSeconds?: number;
}

export interface CreateLivesActivePlanInput extends BaseActivePlanInput {
  planType: 'lives';
  livesDurationMinutes: number;
}

export type CreateActivePlanInput =
  | CreateAdvertisingActivePlanInput
  | CreateVideoActivePlanInput
  | CreateLivesActivePlanInput;
