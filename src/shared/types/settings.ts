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

// ========== SALES SETTINGS ==========
// Firestore path: app_settings/sales_settings

export interface SalesSettings {
    /** Whether sales are globally enabled in the app */
    sales_enabled: boolean;
    /** Scheduled date/time to automatically enable sales (only relevant when sales_enabled is false) */
    date_to_enable_sales: Timestamp | null;
}

/**
 * Singleton document stored in Firestore: app_settings/general
 * The MIIO app reads `techSupport.whatsapp` to build the WhatsApp deep-link.
 */
export interface AppSettings extends BaseModel {
    techSupport: TechSupportSettings;
    salesSettings?: SalesSettings;
}
