import { Timestamp } from 'firebase/firestore';
import { BaseModel, FileUploaded } from './base';
import type { SellerSummary, PlanSummary } from './summaries';
import type { PlanType } from '@/features/plans/types/plan';

export type PaymentReceiptStatus = 'pending' | 'approved' | 'rejected';

export type RejectionReason = 
  | 'illegible'
  | 'incorrect_data'
  | 'duplicate'
  | 'amount_mismatch'
  | 'other';

export interface PaymentReceipt extends BaseModel {
  seller: SellerSummary;
  plan: PlanSummary;
  receiptImage: FileUploaded;
  bannerImage?: FileUploaded;
  status: PaymentReceiptStatus;
  rejectionReason?: RejectionReason;
  rejectionComment?: string;
  approvedBy?: string;
  approvedAt?: Timestamp;
  rejectedBy?: string;
  rejectedAt?: Timestamp;
  activePlanId?: string;
}

export interface PaymentSettings extends BaseModel {
  planType: PlanType;
  qrImage: FileUploaded;
  isActive: boolean;
}

export const PAYMENT_RECEIPT_STATUS_LABELS: Record<PaymentReceiptStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

export const REJECTION_REASON_LABELS: Record<RejectionReason, string> = {
  illegible: 'Comprobante ilegible',
  incorrect_data: 'Datos incorrectos',
  duplicate: 'Comprobante duplicado',
  amount_mismatch: 'Monto no coincide',
  other: 'Otro',
};
