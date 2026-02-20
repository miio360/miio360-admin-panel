import { Timestamp } from 'firebase/firestore';
import { BaseModel, FileUploaded } from './base';
import { PlanSummary, SellerSummary } from './summaries';

export interface WalletBalance {
    balance: number;
    totalPurchased: number; // Total histórico comprado
    totalUsed: number; // Total consumido
    lastPurchase?: Timestamp;
    lastUsage?: Timestamp;
}

export interface Wallets {
    live: WalletBalance;
    video: WalletBalance;
}

export interface WalletTransaction extends BaseModel {
    type: 'purchase' | 'usage';
    category: 'live' | 'video';
    amount: number;
    price?: number;
    method?: string;
    seller: SellerSummary;
    plan: PlanSummary;
    paymentId?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    description: string;
    balanceBefore: number;
    balanceAfter: number;
    videoId?: string;
    liveId?: string;
    receipt?: FileUploaded;
}
