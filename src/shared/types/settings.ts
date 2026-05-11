import type { Timestamp } from 'firebase/firestore';
import type { BaseModel } from './base';

// ========== WHATSAPP CONFIG ==========
// Copiable directly to MIIO app (pure TS + Firestore path, no admin deps)

export interface WhatsAppConfig {
    /** E.164 without "+", e.g. "59171234567" */
    phoneNumber: string;
    /** ISO country code, e.g. "591" (Bolivia) */
    countryCode: string;
    /** Display name shown in the app, e.g. "Soporte MIIO" */
    displayName: string;
    /** Whether this contact is active and shown in the app */
    isActive: boolean;
}

export interface TechSupportSettings {
    whatsapp: WhatsAppConfig;
    updatedAt: Timestamp;
    updatedBy: string;
}

/**
 * Singleton document stored in Firestore: app_settings/general
 * The MIIO app reads `techSupport.whatsapp` to build the WhatsApp deep-link.
 */
export interface AppSettings extends BaseModel {
    techSupport: TechSupportSettings;
}

// ========== COMMISSION SETTINGS ==========
// Firestore path: app_settings/commission_price
// IMPORTANT: Firestore field names differ from TypeScript names due to legacy naming.
//   "app-service"     → appService   (flat Bs amount per order)
//   "seller_service"  → sellerService (% commission deducted from seller payout)
//   "courier_service" → courierService (% commission deducted from courier payout)

export interface CommissionPriceSettings {
    appService: number;
    sellerService: number;
    courierService: number;
    updatedAt?: Timestamp;
    updatedBy?: string;
}

/** Entry written to app_settings/commission_price/history/{auto-id} on every save. */
export interface CommissionHistoryEntry {
    id: string;
    appService: number;
    sellerService: number;
    courierService: number;
    changedAt: Timestamp;
    changedBy: string;
    changedByName: string;
    notes?: string;
}
