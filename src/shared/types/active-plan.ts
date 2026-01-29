import { Timestamp } from 'firebase/firestore';
import type { BaseModel, FileUploaded } from './base';
import type { PlanType, AdvertisingType } from '@/features/plans/types/plan';

// ========== ENUMS ==========

export type ActivePlanStatus =
  | 'pending_assignment'
  | 'scheduled'
  | 'active'
  | 'expired'
  | 'cancelled';

// ========== INTERFACES ==========

export interface ActivePlanSeller {
  id: string;
  name: string;
  profileImage: string;
  storeName: string;
}

export interface AssignedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
}

export interface ActivePlanBase extends BaseModel {
  receiptId: string;
  seller: ActivePlanSeller;
  planType: PlanType;
  planTitle: string;
  planPrice: number;
  status: ActivePlanStatus;
  approvedAt: Timestamp;
  approvedBy: string;
  startDate?: Timestamp;
  endDate?: Timestamp;
}

export interface ActiveAdvertisingPlan extends ActivePlanBase {
  planType: 'advertising';
  advertisingType: AdvertisingType;
  daysEnabled: number;
  daysUsed: number;
  bannerImage?: FileUploaded;
  assignedProduct?: AssignedProduct;
}

export interface ActiveVideoPlan extends ActivePlanBase {
  planType: 'video';
  videoCount: number;
  videoDurationMinutes: number;
  videosUsed: number;
}

export interface ActiveLivesPlan extends ActivePlanBase {
  planType: 'lives';
  livesDurationMinutes: number;
  livesUsed: number;
}

export type ActivePlan = ActiveAdvertisingPlan | ActiveVideoPlan | ActiveLivesPlan;

// ========== LABELS ==========

export const ACTIVE_PLAN_STATUS_LABELS: Record<ActivePlanStatus, string> = {
  pending_assignment: 'Pendiente de asignacion',
  scheduled: 'Programado',
  active: 'Activo',
  expired: 'Expirado',
  cancelled: 'Cancelado',
};

// ========== INPUT TYPES ==========

export interface CreateActivePlanInput {
  receiptId: string;
  seller: ActivePlanSeller;
  planType: PlanType;
  planTitle: string;
  planPrice: number;
  approvedBy: string;
  // Para planes de publicidad
  advertisingType?: AdvertisingType;
  daysEnabled?: number;
  bannerImage?: FileUploaded;
  // Para planes de video
  videoCount?: number;
  videoDurationMinutes?: number;
  // Para planes de lives
  livesDurationMinutes?: number;
}
